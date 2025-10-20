# 🛠️ VS Code Terminal Commands for GitHub Project Management

This guide provides comprehensive terminal commands for managing your GitHub project board directly from VS Code.

## 📋 Prerequisites

First, install and configure the GitHub CLI:

```bash
# Install GitHub CLI (if not already installed)
brew install gh

# Authenticate with GitHub
gh auth login

# Set your repository context
gh repo set-default kafkaNchai/icoe-kafka-backlog
```

## 🎯 Project Board Management

### View Project Information
```bash
# List all projects in your organization/user
gh project list --owner kafkaNchai

# View project details
gh project view 1 --owner kafkaNchai

# View project in different formats
gh project view 1 --owner kafkaNchai --format json
gh project view 1 --owner kafkaNchai --web
```

### Managing Project Items
```bash
# Add current repository's issues to project
gh project item-add 1 --owner kafkaNchai --url https://github.com/kafkaNchai/icoe-kafka-backlog

# Add specific issue to project
gh project item-add 1 --owner kafkaNchai --url https://github.com/kafkaNchai/icoe-kafka-backlog/issues/123

# List items in project
gh project item-list 1 --owner kafkaNchai --limit 50
```

## 📝 Issue Management

### Creating Issues
```bash
# Create a new feature using template
gh issue create --template feature-request.yml --title "[FEATURE] Real-time Dashboard" --assignee @me

# Create a story/task
gh issue create --template story-task.yml --title "[STORY] User authentication component"

# Create an OKR
gh issue create --template okr-request.yml --title "[OKR] Q1 Platform Reliability"

# Create a bug report
gh issue create --template bug-report.yml --title "[BUG] Message processing timeout"

# Create issue with labels and assignment
gh issue create --title "Setup monitoring" --body "Description here" --label "story,ready" --assignee username
```

### Viewing and Managing Issues
```bash
# List all issues
gh issue list

# List issues with specific labels
gh issue list --label "feature"
gh issue list --label "story,in progress"

# List issues by status
gh issue list --state open
gh issue list --state closed

# View specific issue
gh issue view 123
gh issue view 123 --web

# Filter issues by assignee
gh issue list --assignee @me
gh issue list --assignee username

# Filter by milestone
gh issue list --milestone "Sprint 25w10.01"
```

### Updating Issues
```bash
# Add labels to issue
gh issue edit 123 --add-label "ready,high-priority"

# Remove labels from issue
gh issue edit 123 --remove-label "new"

# Assign issue
gh issue edit 123 --add-assignee @me
gh issue edit 123 --add-assignee username1,username2

# Set milestone
gh issue edit 123 --milestone "Sprint 25w10.01"

# Close issue
gh issue close 123
gh issue close 123 --comment "Completed in PR #456"

# Reopen issue
gh issue reopen 123
```

## 🏷️ Label Management

### Creating and Managing Labels
```bash
# List all labels
gh label list

# Create new labels for your workflow
gh label create "🆕 New" --color "e1e4e8" --description "Newly created items"
gh label create "🧠 Backlog" --color "d1ecf1" --description "Items in backlog"
gh label create "🔍 In Discovery" --color "fff5b4" --description "Under exploration"
gh label create "✅ Ready" --color "c8e6c9" --description "Ready for development"
gh label create "🚧 In Progress" --color "ffecb3" --description "Currently being worked on"
gh label create "🔁 In Review" --color "e1bee7" --description "Under review"
gh label create "✅ Done" --color "c8e6c9" --description "Completed work"
gh label create "⏸️ Blocked/Paused" --color "ffcdd2" --description "Work is blocked"

# Create priority labels
gh label create "📍 Now" --color "d73a4a" --description "Current sprint priority"
gh label create "🔜 Near Term" --color "fbca04" --description "Next quarter"
gh label create "🕒 Later" --color "0075ca" --description "This year"
gh label create "🌱 Future" --color "cfd3d7" --description "Future consideration"

# Create quarter labels
gh label create "QC_25w10" --color "006b75" --description "Quarter March-May 2025"
gh label create "QC_25w22" --color "0e8a16" --description "Quarter June-August 2025"
gh label create "QC_25w37" --color "1d76db" --description "Quarter Sep-Nov 2025"
gh label create "QC_25w49" --color "5319e7" --description "Quarter Dec 2025-Feb 2026"

# Update existing label
gh label edit "bug" --color "d73a4a" --description "Something isn't working"

# Delete label
gh label delete "old-label"
```

## 🎯 Milestone Management

### Creating and Managing Milestones
```bash
# List milestones
gh api repos/:owner/:repo/milestones

# Create milestone for sprint
gh api repos/:owner/:repo/milestones \
  --method POST \
  --field title="Sprint 25w10.01" \
  --field description="March 10-23, 2025 Sprint" \
  --field due_on="2025-03-23T23:59:59Z"

# Create quarterly milestone
gh api repos/:owner/:repo/milestones \
  --method POST \
  --field title="Q1 2025 Goals" \
  --field description="First quarter objectives and key results" \
  --field due_on="2025-03-31T23:59:59Z"

# Close milestone
gh api repos/:owner/:repo/milestones/1 \
  --method PATCH \
  --field state="closed"
```

## 🔍 Advanced Filtering and Search

### Search Issues with Advanced Queries
```bash
# Search by multiple criteria
gh issue list --search "is:open label:feature author:username"

# Search for issues in specific state
gh issue list --search "is:open label:\"in progress\" assignee:@me"

# Search by creation date
gh issue list --search "is:open created:>2024-10-01"

# Search for issues with no assignee
gh issue list --search "is:open no:assignee"

# Search for issues in milestone
gh issue list --search "is:open milestone:\"Sprint 25w10.01\""

# Complex search combining multiple criteria
gh issue list --search "is:open label:story assignee:@me milestone:\"Q1 2025\""
```

### Bulk Operations
```bash
# Bulk close issues with specific label
gh issue list --label "wontfix" --json number --jq '.[].number' | \
  xargs -I {} gh issue close {}

# Bulk add label to issues
gh issue list --search "is:open author:username" --json number --jq '.[].number' | \
  xargs -I {} gh issue edit {} --add-label "review-needed"

# Bulk assign issues to milestone
gh issue list --label "ready" --json number --jq '.[].number' | \
  xargs -I {} gh issue edit {} --milestone "Sprint 25w10.01"
```

## 📊 Reporting and Analytics

### Generate Reports
```bash
# Count issues by label
gh issue list --label "feature" --json number | jq 'length'

# Get sprint progress
gh issue list --milestone "Sprint 25w10.01" --json state,title,number | \
  jq 'group_by(.state) | map({state: .[0].state, count: length})'

# List overdue issues (in milestones past due date)
gh api repos/:owner/:repo/milestones | \
  jq '.[] | select(.due_on < now and .state == "open") | .title'

# Get velocity metrics
gh issue list --search "is:closed closed:>2024-10-01" --json closedAt,labels | \
  jq 'group_by(.closedAt | split("T")[0]) | map({date: .[0].closedAt | split("T")[0], count: length})'
```

### Export Data
```bash
# Export all issues to JSON
gh issue list --limit 1000 --json number,title,state,labels,assignees,milestone > issues.json

# Export project data
gh project item-list 1 --owner kafkaNchai --format json > project-items.json

# Create CSV report of issues
gh issue list --json number,title,state,labels,assignees,createdAt | \
  jq -r '["Number","Title","State","Labels","Assignees","Created"], 
         (.[] | [.number, .title, .state, (.labels | map(.name) | join(";")), 
         (.assignees | map(.login) | join(";")), .createdAt]) | @csv'
```

## 🚀 Workflow Automation

### Quick Setup Commands
```bash
# Setup project for new sprint
function setup_sprint() {
  local sprint_name=$1
  local due_date=$2
  
  echo "Setting up sprint: $sprint_name"
  
  # Create milestone
  gh api repos/:owner/:repo/milestones \
    --method POST \
    --field title="$sprint_name" \
    --field due_on="$due_date"
  
  # Create sprint planning issue
  gh issue create \
    --title "[$sprint_name] Sprint Planning" \
    --body "Sprint planning for $sprint_name" \
    --label "planning,sprint" \
    --milestone "$sprint_name"
}

# Usage: setup_sprint "Sprint 25w10.01" "2025-03-23T23:59:59Z"

# Daily standup report
function daily_standup() {
  echo "📊 Daily Standup Report - $(date)"
  echo "======================================"
  
  echo "🚧 In Progress:"
  gh issue list --label "in progress" --json number,title,assignees | \
    jq -r '.[] | "  #\(.number) - \(.title) (@\(.assignees[0].login // "unassigned"))"'
  
  echo ""
  echo "🔁 In Review:"
  gh issue list --label "in review" --json number,title,assignees | \
    jq -r '.[] | "  #\(.number) - \(.title) (@\(.assignees[0].login // "unassigned"))"'
  
  echo ""
  echo "✅ Recently Completed:"
  gh issue list --search "is:closed closed:>$(date -d '1 day ago' '+%Y-%m-%d')" \
    --json number,title,closedAt | \
    jq -r '.[] | "  #\(.number) - \(.title) (closed: \(.closedAt | split("T")[0]))"'
}

# Sprint velocity calculation
function sprint_velocity() {
  local milestone=$1
  echo "📈 Sprint Velocity for: $milestone"
  echo "=================================="
  
  local total=$(gh issue list --milestone "$milestone" --json number | jq 'length')
  local completed=$(gh issue list --milestone "$milestone" --state closed --json number | jq 'length')
  local in_progress=$(gh issue list --milestone "$milestone" --label "in progress" --json number | jq 'length')
  
  echo "Total Stories: $total"
  echo "Completed: $completed"
  echo "In Progress: $in_progress"
  echo "Completion Rate: $(echo "scale=2; $completed / $total * 100" | bc)%"
}
```

## 💡 Tips and Best Practices

### Aliases for Common Commands
Add these to your shell profile (`.zshrc`, `.bashrc`):

```bash
# Issue management aliases
alias ghi='gh issue'
alias ghil='gh issue list'
alias ghic='gh issue create'
alias ghiv='gh issue view'

# Project management aliases
alias ghp='gh project'
alias ghpv='gh project view 1 --owner kafkaNchai'
alias ghpl='gh project item-list 1 --owner kafkaNchai'

# Quick filters
alias mytasks='gh issue list --assignee @me --state open'
alias sprint='gh issue list --milestone'
alias backlog='gh issue list --label backlog'

# Quick actions
alias ready='gh issue edit $1 --add-label ready --remove-label "new,backlog"'
alias start='gh issue edit $1 --add-label "in progress" --remove-label ready --assignee @me'
alias review='gh issue edit $1 --add-label "in review" --remove-label "in progress"'
alias done='gh issue close $1 --comment "Completed"'
```

### Keyboard Shortcuts in VS Code Terminal
- `Ctrl + R`: Search command history
- `Ctrl + L`: Clear terminal
- `Ctrl + C`: Cancel current command
- `Tab`: Auto-complete commands and filenames
- `!!`: Repeat last command
- `!gh`: Repeat last command starting with "gh"

### Pro Tips
1. **Use GitHub CLI auto-completion**: 
   ```bash
   gh completion -s zsh > _gh
   ```

2. **Create custom issue templates with pre-filled data**:
   ```bash
   gh issue create --template feature-request.yml --web
   ```

3. **Use JSON output for scripting**:
   ```bash
   gh issue list --json number,title,labels | jq '.[] | select(.labels[].name == "urgent")'
   ```

4. **Set up watches for important queries**:
   ```bash
   watch -n 300 'gh issue list --label "critical" --state open'
   ```

This command reference should give you powerful tools to manage your GitHub project board directly from VS Code terminal!