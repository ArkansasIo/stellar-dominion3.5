# Replit Workflows Configuration

To add the backend console workflows to your project, manually add this section to your `.replit` file in the `[workflows]` section:

## Edit `.replit` File

Replace the entire `[workflows]` section with this configuration:

```ini
[workflows]
runButton = "Project"

[[workflows.workflow]]
name = "Project"
mode = "parallel"
author = "Stephen"

[[workflows.workflow.tasks]]
task = "workflow.run"
args = "Start application"

[[workflows.workflow]]
name = "Start application"
author = "Stephen"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "npm run dev"
waitForPort = 5000

[[workflows.workflow]]
name = "backend-console"
author = "Stephen"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "tsx server/console/index.ts"

[[workflows.workflow]]
name = "db-monitor"
author = "Stephen"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "tsx server/console/database-monitor.ts"

[[workflows.workflow]]
name = "auth-monitor"
author = "Stephen"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "tsx server/console/auth-monitor.ts"

[[workflows.workflow]]
name = "performance-monitor"
author = "Stephen"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "tsx server/console/performance-monitor.ts"

[[workflows.workflow]]
name = "log-export"
author = "Stephen"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "tsx server/console/log-export.ts"
```

## Steps:

1. Click on the `.replit` file in your project root
2. Find the `[workflows]` section
3. Replace it with the configuration above
4. Save the file

## Result:

After saving, you'll have 6 workflows available:

1. **Start application** - Main game server (npm run dev)
2. **backend-console** - Interactive CLI menu for server management
3. **db-monitor** - Database connection monitoring
4. **auth-monitor** - Authentication & session tracking
5. **performance-monitor** - API performance & system health
6. **log-export** - Export logs and analytics

All workflows can run simultaneously in separate panels.
