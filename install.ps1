# Universe Empire Dominion - Windows Installation Script
# PowerShell installation for Windows 10/11

param(
    [switch]$SkipNodeCheck,
    [switch]$SkipPostgresCheck,
    [switch]$AutoYes
)

# Configuration
$AppName = "Universe Empire Dominion"
$AppDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$NodeVersion = "18"
$PostgresVersion = "14"

# Color output functions
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if running as Administrator
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Check and install Chocolatey
function Install-Chocolatey {
    if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
        Write-Info "Installing Chocolatey package manager..."
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        Write-Success "Chocolatey installed successfully"
    } else {
        Write-Success "Chocolatey is already installed"
    }
}

# Install Node.js
function Install-NodeJS {
    Write-Info "Checking Node.js installation..."
    
    if (!$SkipNodeCheck -and (Get-Command node -ErrorAction SilentlyContinue)) {
        $nodeVersionCurrent = (node -v).TrimStart('v').Split('.')[0]
        if ([int]$nodeVersionCurrent -ge [int]$NodeVersion) {
            Write-Success "Node.js $(node -v) is already installed"
            return
        }
    }
    
    Write-Info "Installing Node.js $NodeVersion..."
    
    if (Test-Administrator) {
        choco install nodejs --version=$NodeVersion -y
    } else {
        Write-Warning "Administrator privileges required to install Node.js"
        Write-Info "Please run this script as Administrator or install Node.js manually from https://nodejs.org"
        
        if (!$AutoYes) {
            $response = Read-Host "Continue without Node.js installation? (y/N)"
            if ($response -ne 'y' -and $response -ne 'Y') {
                exit 1
            }
        }
    }
    
    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    Write-Success "Node.js installation complete"
}

# Install PostgreSQL
function Install-PostgreSQL {
    Write-Info "Checking PostgreSQL installation..."
    
    if (!$SkipPostgresCheck -and (Get-Command psql -ErrorAction SilentlyContinue)) {
        Write-Success "PostgreSQL is already installed"
        return
    }
    
    Write-Info "Installing PostgreSQL..."
    
    if (Test-Administrator) {
        choco install postgresql$PostgresVersion -y --params '/Password:postgres'
        
        # Start PostgreSQL service
        Start-Service -Name "postgresql-x64-$PostgresVersion" -ErrorAction SilentlyContinue
        Set-Service -Name "postgresql-x64-$PostgresVersion" -StartupType Automatic -ErrorAction SilentlyContinue
    } else {
        Write-Warning "Administrator privileges required to install PostgreSQL"
        Write-Info "Please run this script as Administrator or install PostgreSQL manually"
        
        if (!$AutoYes) {
            $response = Read-Host "Continue without PostgreSQL installation? (y/N)"
            if ($response -ne 'y' -and $response -ne 'Y') {
                exit 1
            }
        }
    }
    
    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    Write-Success "PostgreSQL installation complete"
}

# Setup database
function Setup-Database {
    Write-Info "Setting up database..."
    
    $envFile = Join-Path $AppDir "Universe-Empire-Dominion\.env.local"
    
    # Generate random password
    $dbPassword = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    $sessionSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    
    $dbName = "universe_empire"
    $dbUser = "gamemaster"
    
    # Create .env.local file
    if (!(Test-Path $envFile)) {
        Write-Info "Creating .env.local configuration..."
        
        $envContent = @"
DATABASE_URL=postgresql://$dbUser:$dbPassword@localhost:5432/$dbName
NODE_ENV=development
PORT=3000
SESSION_SECRET=$sessionSecret
"@
        
        Set-Content -Path $envFile -Value $envContent
        Write-Success "Configuration file created"
    }
    
    # Create database
    try {
        $env:PGPASSWORD = "postgres"
        
        # Check if database exists
        $dbExists = & psql -U postgres -lqt | Select-String -Pattern $dbName
        
        if (!$dbExists) {
            Write-Info "Creating database: $dbName"
            & psql -U postgres -c "CREATE DATABASE $dbName;"
            & psql -U postgres -c "CREATE USER $dbUser WITH PASSWORD '$dbPassword';"
            & psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $dbName TO $dbUser;"
            Write-Success "Database created successfully"
        } else {
            Write-Success "Database already exists"
        }
    } catch {
        Write-Warning "Could not create database automatically. You may need to create it manually."
        Write-Info "Database name: $dbName"
        Write-Info "Database user: $dbUser"
    }
}

# Install dependencies
function Install-Dependencies {
    Write-Info "Installing Node.js dependencies..."
    
    Push-Location (Join-Path $AppDir "Universe-Empire-Dominion")
    
    if (Test-Path "package-lock.json") {
        npm ci
    } else {
        npm install
    }
    
    Pop-Location
    
    Write-Success "Dependencies installed successfully"
}

# Run database migrations
function Run-Migrations {
    Write-Info "Running database migrations..."
    
    Push-Location (Join-Path $AppDir "Universe-Empire-Dominion")
    
    try {
        npm run db:push
        Write-Success "Migrations complete"
    } catch {
        Write-Warning "Migration may have failed. Check database connection."
    }
    
    Pop-Location
}

# Create Windows service
function Create-WindowsService {
    if (Test-Administrator) {
        Write-Info "Creating Windows service..."
        
        $serviceName = "UniverseEmpireDominion"
        $serviceDisplayName = "Universe Empire Dominion Game Server"
        $serviceDescription = "Universe Empire Dominion MMORPG Game Server"
        $nodePath = (Get-Command node).Source
        $serverPath = Join-Path $AppDir "Universe-Empire-Dominion\server\index.js"
        $workingDir = Join-Path $AppDir "Universe-Empire-Dominion"
        
        # Check if service exists
        $service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
        
        if ($service) {
            Write-Warning "Service already exists. Removing old service..."
            Stop-Service -Name $serviceName -Force -ErrorAction SilentlyContinue
            & sc.exe delete $serviceName
            Start-Sleep -Seconds 2
        }
        
        # Create service using NSSM (Non-Sucking Service Manager)
        if (!(Get-Command nssm -ErrorAction SilentlyContinue)) {
            Write-Info "Installing NSSM (service manager)..."
            choco install nssm -y
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        }
        
        & nssm install $serviceName $nodePath $serverPath
        & nssm set $serviceName AppDirectory $workingDir
        & nssm set $serviceName DisplayName $serviceDisplayName
        & nssm set $serviceName Description $serviceDescription
        & nssm set $serviceName Start SERVICE_AUTO_START
        & nssm set $serviceName AppStdout (Join-Path $workingDir "logs\service-output.log")
        & nssm set $serviceName AppStderr (Join-Path $workingDir "logs\service-error.log")
        
        Write-Success "Windows service created"
        Write-Info "Start with: Start-Service $serviceName"
        Write-Info "Stop with: Stop-Service $serviceName"
        Write-Info "Status: Get-Service $serviceName"
    } else {
        Write-Warning "Administrator privileges required to create Windows service"
    }
}

# Create management scripts
function Create-ManagementScripts {
    Write-Info "Creating management scripts..."
    
    # Start script
    $startScript = @'
@echo off
cd /d "%~dp0Universe-Empire-Dominion"
npm run dev
'@
    Set-Content -Path (Join-Path $AppDir "start-server.bat") -Value $startScript
    
    # Stop script
    $stopScript = @'
@echo off
taskkill /F /IM node.exe /FI "WINDOWTITLE eq Universe*"
echo Server stopped
pause
'@
    Set-Content -Path (Join-Path $AppDir "stop-server.bat") -Value $stopScript
    
    # Status script
    $statusScript = @'
@echo off
tasklist /FI "IMAGENAME eq node.exe" /FI "WINDOWTITLE eq Universe*"
if %ERRORLEVEL% EQU 0 (
    echo Server is running
) else (
    echo Server is not running
)
pause
'@
    Set-Content -Path (Join-Path $AppDir "status-server.bat") -Value $statusScript
    
    # PowerShell management script
    $psScript = @'
# Universe Empire Dominion - Server Management
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('start','stop','restart','status')]
    [string]$Action
)

$serviceName = "UniverseEmpireDominion"

switch ($Action) {
    'start' {
        if (Get-Service $serviceName -ErrorAction SilentlyContinue) {
            Start-Service $serviceName
            Write-Host "Service started" -ForegroundColor Green
        } else {
            Write-Host "Starting development server..." -ForegroundColor Yellow
            Set-Location "$PSScriptRoot\Universe-Empire-Dominion"
            npm run dev
        }
    }
    'stop' {
        if (Get-Service $serviceName -ErrorAction SilentlyContinue) {
            Stop-Service $serviceName
            Write-Host "Service stopped" -ForegroundColor Green
        } else {
            Get-Process node -ErrorAction SilentlyContinue | Where-Object {$_.MainWindowTitle -like "*Universe*"} | Stop-Process -Force
            Write-Host "Server stopped" -ForegroundColor Green
        }
    }
    'restart' {
        & $PSCommandPath -Action stop
        Start-Sleep -Seconds 2
        & $PSCommandPath -Action start
    }
    'status' {
        if (Get-Service $serviceName -ErrorAction SilentlyContinue) {
            Get-Service $serviceName | Format-Table -AutoSize
        } else {
            $processes = Get-Process node -ErrorAction SilentlyContinue | Where-Object {$_.MainWindowTitle -like "*Universe*"}
            if ($processes) {
                Write-Host "Server is running (development mode)" -ForegroundColor Green
                $processes | Format-Table Id,ProcessName,CPU,WorkingSet -AutoSize
            } else {
                Write-Host "Server is not running" -ForegroundColor Yellow
            }
        }
    }
}
'@
    Set-Content -Path (Join-Path $AppDir "manage-server.ps1") -Value $psScript
    
    Write-Success "Management scripts created"
}

# Create desktop shortcut
function Create-DesktopShortcut {
    Write-Info "Creating desktop shortcut..."
    
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Universe Empire Dominion.lnk")
    $Shortcut.TargetPath = "http://localhost:3000"
    $Shortcut.IconLocation = "shell32.dll,13"
    $Shortcut.Description = "Universe Empire Dominion Game"
    $Shortcut.Save()
    
    Write-Success "Desktop shortcut created"
}

# Print completion message
function Show-CompletionMessage {
    Write-Success "Installation complete!"
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "  $AppName" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Quick Start:" -ForegroundColor Yellow
    Write-Host "  1. Start server: .\start-server.bat"
    Write-Host "  2. Open browser: http://localhost:3000"
    Write-Host "  3. Stop server: .\stop-server.bat"
    Write-Host ""
    Write-Host "Management:" -ForegroundColor Yellow
    Write-Host "  - PowerShell: .\manage-server.ps1 -Action [start|stop|restart|status]"
    Write-Host "  - Check status: .\status-server.bat"
    
    if (Test-Administrator) {
        Write-Host "  - Windows Service: Start-Service UniverseEmpireDominion"
    }
    
    Write-Host ""
    Write-Host "Configuration:" -ForegroundColor Yellow
    Write-Host "  - Edit: Universe-Empire-Dominion\.env.local"
    Write-Host "  - Logs: Universe-Empire-Dominion\logs\"
    Write-Host ""
    Write-Host "Documentation:" -ForegroundColor Yellow
    Write-Host "  - README: Universe-Empire-Dominion\README.md"
    Write-Host "  - API Docs: Universe-Empire-Dominion\docs\"
    Write-Host ""
    Write-Info "Happy gaming!"
}

# Main installation flow
function Main {
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "  $AppName - Installation" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    
    if (!(Test-Administrator)) {
        Write-Warning "Not running as Administrator. Some features may be limited."
        Write-Info "For full installation, run PowerShell as Administrator"
        Write-Host ""
    }
    
    Write-Info "Starting installation..."
    
    try {
        Install-Chocolatey
        Install-NodeJS
        Install-PostgreSQL
        Setup-Database
        Install-Dependencies
        Run-Migrations
        Create-ManagementScripts
        Create-WindowsService
        Create-DesktopShortcut
        
        Show-CompletionMessage
    } catch {
        Write-Error "Installation failed: $_"
        Write-Info "Please check the error message and try again"
        exit 1
    }
}

# Run main installation
Main

# Made with Bob
