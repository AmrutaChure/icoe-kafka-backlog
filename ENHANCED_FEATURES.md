# 🚀 Enhanced GitHub Project Board Features

## 📋 What's New

Your GitHub project board now includes powerful automation and custom features:

### ✨ **Automated Label Inheritance**
- When you create sub-issues under a Feature (issues labeled 'feature'), they automatically:
  - Inherit labels from the parent feature
  - Get marked as 'Story' 
  - Inherit assignees, milestones, and other properties
  - Get assigned a default status if none exists

### 🤖 **Smart Issue Automation**
- **Auto-labeling**: New issues get '🆕 New' status automatically
- **Feature prioritization**: Features automatically get priority labels
- **Quarter assignment**: Features are assigned to current quarter
- **Story detection**: Sub-issues of features are automatically labeled as 'Story'
- **Milestone management**: Issues are auto-assigned to appropriate milestones

### 📝 **Professional Issue Templates**
- **Feature Request**: Complete template with priority, quarter, acceptance criteria
- **Story/Task**: User story template with effort estimation
- **OKR Template**: Quarterly objectives with key results tracking
- **Bug Report**: Comprehensive bug reporting with severity levels

### 🎯 **Advanced Project Management**
- **Epic tracking**: Automatic progress tracking for large initiatives
- **Sprint management**: Automated sprint milestone creation and assignment
- **Dependency tracking**: Automatic detection and tracking of issue dependencies
- **Progress reporting**: Real-time progress updates for epics and features

## 🛠️ Getting Started

### 1. First-time Setup
```bash
# Install GitHub CLI if not already installed
brew install gh

# Authenticate with GitHub
gh auth login

# Set repository context
gh repo set-default kafkaNchai/icoe-kafka-backlog
```

### 2. Open in VS Code
Open the workspace file: `icoe-kafka-backlog.code-workspace`

### 3. Install Extensions
VS Code will prompt you to install recommended extensions:
- GitHub Pull Requests and Issues
- GitLens
- GitHub Theme
- GitHub Repositories

## 🎨 VS Code Project Management

### **Viewing Your Kanban Board**
While VS Code doesn't have a native project board view, you can:

1. **Use Issues Panel**: `View > Open View... > GitHub Issues`
   - Pre-configured queries mimic board columns
   - Filter by status labels (New, Backlog, In Progress, etc.)

2. **Terminal Dashboard**: Run live Kanban view in terminal
3. **Quick Tasks**: Use `Ctrl+Shift+P` → "Tasks: Run Task"
   - Daily Standup Report
   - Create Feature Issue
   - Create Story Issue  
   - View Project Board (opens in browser)

### **Essential Commands**
```bash
# Create issues from templates
gh issue create --template feature-request.yml --web
gh issue create --template story-task.yml --web

# Move issues through workflow
gh issue edit 123 --add-label "ready" --remove-label "backlog"
gh issue edit 123 --add-label "in progress" --assignee @me

# Generate reports
gh issue list --assignee @me  # My tasks
gh issue list --milestone "Sprint 25w10.01"  # Sprint view
```

## 🔄 Workflow Examples

### **Creating a Feature with Sub-stories**

1. **Create Feature**:
   ```bash
   gh issue create --template feature-request.yml \
     --title "[FEATURE] Real-time Dashboard" \
     --assignee @me
   ```

2. **Create Sub-stories** (reference the feature issue):
   ```bash
   gh issue create --template story-task.yml \
     --title "[STORY] Dashboard authentication component" \
     --body "Related to feature: #123"
   ```

3. **Automation triggers**:
   - Sub-story automatically gets 'Story' label
   - Inherits labels from Feature #123
   - Gets assigned to same milestone
   - Inherits assignees if none specified

### **Sprint Planning Workflow**

1. **Create Sprint Milestone**:
   ```bash
   gh api repos/:owner/:repo/milestones \
     --method POST \
     --field title="Sprint 25w10.01" \
     --field due_on="2025-03-23T23:59:59Z"
   ```

2. **Add Stories to Sprint**:
   ```bash
   gh issue edit 123 --milestone "Sprint 25w10.01"
   gh issue edit 124 --milestone "Sprint 25w10.01"
   ```

3. **Track Progress**:
   ```bash
   gh issue list --milestone "Sprint 25w10.01"
   ```

## 🏷️ Label System

### **Status Labels** (Workflow States)
- 🆕 `New` - Just created
- 🧠 `Backlog` - Ideas, not yet refined  
- 🔍 `In Discovery` - Under exploration
- ✅ `Ready` - Groomed and ready
- 🚧 `In Progress` - Being worked on
- 🔁 `In Review` - Under review
- ✅ `Done` - Completed
- ⏸️ `Blocked/Paused` - Blocked work

### **Priority Labels** (Roadmap)
- 📍 `Now` - Current sprint
- 🔜 `Near Term` - Next quarter  
- 🕒 `Later` - This year
- 🌱 `Future` - Nice to have
- ❓ `No Roadmap Priority` - Needs evaluation

### **Type Labels**
- `feature` - New features
- `Story` - User stories (auto-assigned to sub-issues)
- `epic` - Large initiatives
- `bug` - Bug reports
- `OKR` - Objectives and key results

### **Quarter Labels** (Auto-assigned)
- `QC_25w10` - Q1 2025 (March-May)
- `QC_25w22` - Q2 2025 (June-August)  
- `QC_25w37` - Q3 2025 (September-November)
- `QC_25w49` - Q4 2025 (December-February)

## 📊 Analytics and Reporting

### **Daily Standup**
```bash
# Use the VS Code task or run directly:
echo "📊 Daily Standup - $(date)"
gh issue list --label "in progress"
gh issue list --label "in review"
gh issue list --search "is:closed closed:>$(date -d '1 day ago' '+%Y-%m-%d')"
```

### **Sprint Velocity**
```bash
function sprint_velocity() {
  local milestone=$1
  local total=$(gh issue list --milestone "$milestone" --json number | jq 'length')
  local completed=$(gh issue list --milestone "$milestone" --state closed --json number | jq 'length')
  echo "Sprint: $milestone"
  echo "Completion Rate: $(echo "scale=2; $completed / $total * 100" | bc)%"
}

sprint_velocity "Sprint 25w10.01"
```

### **Export Data**
```bash
# Export all issues to JSON
gh issue list --limit 1000 --json number,title,state,labels,assignees,milestone > issues.json

# Create CSV report
gh issue list --json number,title,state,labels,assignees,createdAt | \
  jq -r '["Number","Title","State","Labels","Assignees","Created"], 
         (.[] | [.number, .title, .state, (.labels | map(.name) | join(";")), 
         (.assignees | map(.login) | join(";")), .createdAt]) | @csv'
```

## 🔧 Customization

### **Adding Custom Queries in VS Code**
Edit workspace settings to add more issue filters:

```json
"githubIssues.queries": [
  {
    "label": "My Current Sprint",
    "query": "is:open assignee:@me milestone:\"Sprint 25w10.01\""
  },
  {
    "label": "Urgent Items",
    "query": "is:open label:\"📍 Now\""
  }
]
```

### **Creating Custom Labels**
```bash
gh label create "team:backend" --color "0075ca" --description "Backend team work"
gh label create "priority:high" --color "d73a4a" --description "High priority item"
```

## 📚 Documentation

- **[VS Code Terminal Commands](docs/vscode-terminal-commands.md)**: Comprehensive CLI reference
- **[VS Code GitHub Setup](docs/vscode-github-setup.md)**: Complete VS Code configuration guide
- **[GitHub Actions Workflows](.github/workflows/)**: Automation documentation

## 🚀 Advanced Features

### **Epic Progress Tracking**
When you label an issue as 'epic', it automatically gets a progress tracking comment that updates as related features are completed.

### **Dependency Management**
Issues automatically detect dependencies mentioned in descriptions:
- "Depends on: #123"
- "Blocked by: #456"

### **Smart Milestone Assignment**
Issues labeled with iteration labels (e.g., "25w10.01") automatically get assigned to corresponding sprint milestones.

## 💡 Tips for Success

1. **Use Templates**: Always use issue templates for consistency
2. **Reference Issues**: Link related issues using #number format
3. **Update Status**: Move issues through workflow states regularly
4. **Daily Reviews**: Use the Daily Standup task for team updates
5. **Sprint Planning**: Use milestones for time-boxed work
6. **Label Consistently**: Use the predefined label system

This enhanced setup transforms your GitHub repository into a powerful project management platform with automation, smart workflows, and comprehensive reporting capabilities!