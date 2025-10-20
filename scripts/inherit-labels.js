const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');

function exitWith(msg) {
  console.error(msg);
  process.exit(1);
}

(async () => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) exitWith('GITHUB_TOKEN is required (set via secrets.GITHUB_TOKEN)');

  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath || !fs.existsSync(eventPath)) exitWith('GITHUB_EVENT_PATH missing or event file not found');

  const eventName = process.env.GITHUB_EVENT_NAME;
  if (!eventName) exitWith('GITHUB_EVENT_NAME is required');

  const repoFull = process.env.GITHUB_REPOSITORY;
  if (!repoFull) exitWith('GITHUB_REPOSITORY is required');

  const [owner, repo] = repoFull.split('/');
  const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));

  const octokit = new Octokit({ auth: token });

  const labelRegex = (() => {
    const raw = process.env.LABELS_REGEX || '^(.+)$';
    try {
      return new RegExp(raw);
    } catch (e) {
      console.warn('Invalid LABELS_REGEX, falling back to copy all labels. Error:', e.message);
      return /^(.+)$/;
    }
  })();

  // helper to get label names from a labels array
  function labelNames(labels) {
    return (labels || []).map(l => (typeof l === 'string' ? l : l.name)).filter(Boolean);
  }

  // parse issue references from a text body (handles #123, full URL, owner/repo#123)
  function parseIssueNumbersFromBody(body) {
    const set = new Set();

    if (!body) return set;

    const urlRegex = /https?:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/issues\/(\d+)/g;
    let m;
    while ((m = urlRegex.exec(body))) set.add(Number(m[1]));

    const repoRefRegex = /([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)#(\d+)/g;
    while ((m = repoRefRegex.exec(body))) {
      const repoRef = m[1];
      const num = Number(m[2]);
      // only include references that point to the same repository
      if (repoRef.toLowerCase() === `${owner}/${repo}`.toLowerCase()) set.add(num);
    }

    const shortRefRegex = /(^|\s)#(\d+)\b/g;
    while ((m = shortRefRegex.exec(body))) set.add(Number(m[2]));

    return set;
  }

  // copy labels from parentIssueNumber to subIssueNumber
  async function copyLabelsFromParentToSub(parentIssueNumber, subIssueNumber) {
    try {
      const parent = await octokit.rest.issues.get({ owner, repo, issue_number: parentIssueNumber });
      const parentAllLabels = labelNames(parent.data.labels || []);
      // Only propagate if parent has the 'feature' label
      if (!parentAllLabels.map(l => l.toLowerCase()).includes('feature')) {
        console.log(`Parent #${parentIssueNumber} does not have label 'feature'. Skipping propagation to #${subIssueNumber}.`);
        return;
      }

      // Filter labels by LABELS_REGEX
      const parentLabels = parentAllLabels.filter(l => labelRegex.test(l));

      if (!parentLabels.length) {
        console.log(`Parent #${parentIssueNumber} has no labels matching ${labelRegex}. Skipping.`);
        return;
      }

      const sub = await octokit.rest.issues.get({ owner, repo, issue_number: subIssueNumber });
      const subLabels = labelNames(sub.data.labels);

      const merged = Array.from(new Set([...subLabels, ...parentLabels]));

      // only update if something changed
      const unchanged = merged.length === subLabels.length && merged.every(v => subLabels.includes(v));
      if (unchanged) {
        console.log(`Sub-issue #${subIssueNumber} already has labels from parent #${parentIssueNumber}.`);
        return;
      }

      await octokit.rest.issues.update({
        owner,
        repo,
        issue_number: subIssueNumber,
        labels: merged
      });

      console.log(`Copied labels [${parentLabels.join(', ')}] from #${parentIssueNumber} to #${subIssueNumber}.`);
    } catch (err) {
      console.error(`Failed to copy labels from #${parentIssueNumber} to #${subIssueNumber}:`, err.message);
    }
  }

  // ENTRY logic based on event type
  if (eventName === 'issues') {
    const action = event.action;
    const issue = event.issue;
    if (!issue) exitWith('No issue object in event payload');

    const issueNumber = issue.number;

    if (action === 'opened') {
      // When a new issue opens, look at its timeline for cross-references -> those are parent issues
      try {
        const timelineResp = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/timeline', {
          owner,
          repo,
          issue_number: issueNumber,
          headers: { accept: 'application/vnd.github.mockingbird-preview+json' }
        });

        const timeline = timelineResp.data || [];
        const parentNumbers = new Set();

        for (const ev of timeline) {
          // look for cross-referenced events where the source is another issue that referenced this one
          if (ev.event === 'cross-referenced' && ev.source && ev.source.type === 'issue' && ev.source.issue && ev.source.issue.number) {
            // only include if it's from the same repository
            if (ev.source.issue.repository && ev.source.issue.repository.full_name) {
              if (ev.source.issue.repository.full_name.toLowerCase() === `${owner}/${repo}`.toLowerCase()) {
                parentNumbers.add(Number(ev.source.issue.number));
              }
            } else {
              // if repository info isn't available (older timeline), optimistically add parent number
              parentNumbers.add(Number(ev.source.issue.number));
            }
          }
        }

        if (!parentNumbers.size) {
          console.log(`No parent issues found referencing #${issueNumber} in the timeline.`);
        } else {
          for (const p of parentNumbers) {
            await copyLabelsFromParentToSub(p, issueNumber);
          }
        }
      } catch (err) {
        console.error('Error fetching timeline for cross-references:', err.message);
      }
    } else if (['labeled', 'unlabeled', 'edited'].includes(action)) {
      // If an issue's labels changed or it was edited, treat it as a potential main issue and propagate to referenced issues in its body
      const body = issue.body || '';
      // Only proceed if this issue itself has the 'feature' label
      const currentLabels = labelNames(issue.labels || []).map(l => l.toLowerCase());
      if (!currentLabels.includes('feature')) {
        console.log(`Issue #${issueNumber} is not labeled 'feature'. Skipping propagation.`);
        return;
      }

      const refs = parseIssueNumbersFromBody(body);
      if (!refs.size) {
        console.log(`Issue #${issueNumber} does not reference any sub-issues in its body. Nothing to do.`);
      } else {
        console.log(`Issue #${issueNumber} references issue numbers: ${Array.from(refs).join(', ')}`);
        for (const subNum of refs) {
          if (subNum === issueNumber) continue;
          await copyLabelsFromParentToSub(issueNumber, subNum);
        }
      }
    } else {
      console.log(`Event action "${action}" not handled by this script.`);
    }
  } else {
    console.log(`Event ${eventName} is not handled by this script. Only 'issues' events are watched.`);
  }
})();
