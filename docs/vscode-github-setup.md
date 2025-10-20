# 🎨 VS Code Setup for GitHub Project Management

This guide shows you how to use VS Code effectively for managing your GitHub project board with all the installed extensions and configurations.

## 🚀 Quick Start

1. **Open the workspace file**: `icoe-kafka-backlog.code-workspace`
2. **Install recommended extensions** when prompted
3. **Authenticate with GitHub** using the command palette: `Ctrl+Shift+P` → "GitHub: Sign In"

## 📱 Extension Features Overview

### 🔧 GitHub Pull Requests and Issues Extension

This is your main tool for project management within VS Code.

#### **Viewing Issues in VS Code**
- **Issues Panel**: Access via `View > Open View... > GitHub Issues`
- **Custom Queries**: Pre-configured queries in the workspace settings:
  - My Issues
  - Features  
  - Stories in Progress
  - Ready for Review
  - Blocked Items
  - Current Sprint
  - High Priority

#### **Working with Issues**
```
Ctrl+Shift+P → Commands:
- "GitHub Issues: Create Issue"
- "GitHub Issues: Create Issue From Selection" 
- "GitHub Issues: Create Issue From Clipboard"
- "GitHub Pull Requests: Create Pull Request"
```

#### **Issue Linking in Code**
- Type `#` followed by issue number to auto-link issues
- Hover over issue numbers to see details
- Click to open issues in browser or VS Code

### 🔍 GitLens Extension Features

Enhanced Git capabilities for better collaboration:

- **Blame Annotations**: See who changed what and when
- **Code Lens**: Author and recent change information above functions
- **File History**: Right-click any file → "Open File History"
- **Line History**: See changes to specific lines over time

### 🌐 GitHub Repositories Extension

Browse repositories without cloning:

- `Ctrl+Shift+P` → "GitHub Repositories: Open Repository"
- Explore code, issues, and PRs remotely
- Great for referencing other projects

## 🎯 Project Board Viewing in VS Code

While VS Code doesn't have a native project board view, here are the best ways to manage your Kanban board:

### Method 1: Issues Panel with Custom Queries (Recommended)
1. Open the **GitHub Issues** panel (`View > Open View... > GitHub Issues`)
2. Use the pre-configured queries to mimic board columns:
   - **New**: Query shows newly created issues
   - **Backlog**: Issues labeled "backlog"
   - **In Progress**: Issues labeled "in progress"
   - **Review**: Issues labeled "in review"
   - **Done**: Recently closed issues

### Method 2: GitHub Projects in Browser
- Use the VS Code task: `Ctrl+Shift+P` → "Tasks: Run Task" → "View Project Board"
- This opens your GitHub project board in the browser
- Keep it in a split window alongside VS Code

### Method 3: Terminal Dashboard
Create a live dashboard in the integrated terminal:

```bash
# Run this in terminal for a kanban-style view
watch -n 30 '
echo "🆕 NEW ($(gh issue list --label "new" --json number | jq length)):"
gh issue list --label "new" --limit 5

echo -e "\n🧠 BACKLOG ($(gh issue list --label "backlog" --json number | jq length)):"
gh issue list --label "backlog" --limit 5

echo -e "\n🚧 IN PROGRESS ($(gh issue list --label "in progress" --json number | jq length)):"
gh issue list --label "in progress" --limit 5

echo -e "\n🔁 IN REVIEW ($(gh issue list --label "in review" --json number | jq length)):"
gh issue list --label "in review" --limit 5
'
```

## 🛠️ Daily Workflow

### 1. **Morning Standup**
Run the pre-configured task:
- `Ctrl+Shift+P` → "Tasks: Run Task" → "Daily Standup Report"

### 2. **Creating Issues**
- `Ctrl+Shift+P` → "Tasks: Run Task" → "Create Feature Issue" or "Create Story Issue"
- Or use terminal: `gh issue create --template feature-request.yml --web`

### 3. **Moving Issues Through Workflow**
Use terminal commands or GitHub web interface:
```bash
# Move issue to "Ready"
gh issue edit 123 --add-label "ready" --remove-label "backlog"

# Start working on issue
gh issue edit 123 --add-label "in progress" --remove-label "ready" --assignee @me

# Send for review
gh issue edit 123 --add-label "in review" --remove-label "in progress"

# Complete issue
gh issue close 123 --comment "Completed"
```

### 4. **Checking Project Status**
- Use the GitHub Issues panel with custom queries
- Run terminal commands for specific views
- Check the project board in browser

## ⌨️ Essential Keyboard Shortcuts

### VS Code GitHub Integration
- `Ctrl+Shift+G G`: Open GitHub panel
- `Ctrl+Shift+P`: Command palette (access all GitHub commands)
- `Ctrl+Shift+\``: Open terminal
- `Ctrl+\``: Show/hide terminal

### Custom Shortcuts (Add to keybindings.json)
```json
[
  {
    "key": "ctrl+alt+i",
    "command": "githubIssues.createIssue"
  },
  {
    "key": "ctrl+alt+p", 
    "command": "githubPullRequests.createPullRequest"
  },
  {
    "key": "ctrl+alt+b",
    "command": "workbench.action.tasks.runTask",
    "args": "View Project Board"
  }
]
```

## 🎨 Customizing Your Workspace

### Adding More Issue Queries
Edit the workspace settings to add custom queries:

```json
"githubIssues.queries": [
  {
    "label": "My Sprint Items",
    "query": "is:open assignee:@me milestone:\"Sprint 25w10.01\""
  },
  {
    "label": "Urgent Bugs",
    "query": "is:open label:bug label:\"📍 Now\""
  },
  {
    "label": "Unassigned Stories",
    "query": "is:open label:story no:assignee"
  }
]
```

### Creating Custom Tasks
Add to the workspace `tasks.json`:

```json
{
  "label": "Sprint Planning",
  "type": "shell",
  "command": "gh issue list --milestone 'Sprint 25w10.01' && echo '' && echo 'Create new sprint items:' && gh issue create --template story-task.yml --web",
  "group": "build"
}
```

## 📊 Productivity Tips

### 1. **Multi-Panel Setup**
- Split editor into multiple panels
- Keep Issues panel open on one side
- Use integrated terminal for quick commands
- Have browser with project board in another monitor/window

### 2. **Issue Templates Shortcuts**
Create shell aliases for quick issue creation:
```bash
alias newfeature='gh issue create --template feature-request.yml --web'
alias newstory='gh issue create --template story-task.yml --web'
alias newbug='gh issue create --template bug-report.yml --web'
```

### 3. **Auto-linking in Commits**
When making commits, reference issues to automatically link them:
```bash
git commit -m "Fix authentication bug

Fixes #123
Related to #124"
```

### 4. **Branch Naming Convention**
Use issue numbers in branch names for automatic linking:
```bash
git checkout -b feature/123-user-authentication
git checkout -b bug/456-memory-leak-fix
```

## 🔧 Troubleshooting

### GitHub Extension Not Working
1. **Re-authenticate**: `Ctrl+Shift+P` → "GitHub: Sign In"
2. **Check token scope**: Ensure your GitHub token has repo and project permissions
3. **Reload window**: `Ctrl+Shift+P` → "Developer: Reload Window"

### Issues Panel Empty
1. **Check repository context**: `gh repo set-default kafkaNchai/icoe-kafka-backlog`
2. **Verify queries**: Ensure your issue queries are valid
3. **Check network**: Ensure you can access GitHub

### Performance Issues
1. **Limit query results**: Add `--limit 50` to issue queries
2. **Disable auto-refresh**: Adjust extension settings
3. **Close unused panels**: Keep only necessary views open

## 🌟 Advanced Features

### GitHub Copilot Integration
- Use Copilot for writing better issue descriptions
- Generate commit messages: `Ctrl+Shift+P` → "GitHub Copilot: Generate Commit Message"
- Code suggestions while working on issues

### Integration with External Tools
- **Slack**: Use GitHub app to get notifications
- **Calendar**: Set milestone due dates to sync with calendar apps
- **Time tracking**: Use commit messages to track time spent on issues

This setup gives you a powerful project management environment right within VS Code!