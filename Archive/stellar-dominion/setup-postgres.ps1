# PostgreSQL Setup Script
Write-Host "" 
Write-Host "=== PostgreSQL Setup Script ===" -ForegroundColor Cyan
Write-Host ""

# Find PostgreSQL
$pgVersions = @("18", "16", "15")
$pgPath = $null

foreach ($version in $pgVersions) {
    $testPath = "C:\Program Files\PostgreSQL\$version\bin"
    if (Test-Path "$testPath\psql.exe") {
        $pgPath = $testPath
        Write-Host "[OK] Found PostgreSQL $version" -ForegroundColor Green
        break
    }
}

if (-not $pgPath) {
    Write-Host "[ERROR] PostgreSQL not found" -ForegroundColor Red
    exit 1
}

# Try passwords
Write-Host ""
Write-Host "Testing connection..." -ForegroundColor Yellow
$passwords = @("", "postgres", "admin", "root", "password", "12345")
$connected = $false

foreach ($candidatePassword in $passwords) {
    $label = if ($candidatePassword -eq "") { "no password" } else { "password: $candidatePassword" }
    Write-Host "  Trying $label..." -NoNewline
    
    if ($candidatePassword -eq "") {
        & "$pgPath\psql.exe" -U postgres -c "SELECT 1;" 2>&1 | Out-Null
    } else {
        $env:PGPASSWORD = $candidatePassword
        & "$pgPath\psql.exe" -U postgres -c "SELECT 1;" 2>&1 | Out-Null
    }
    
    if ($LASTEXITCODE -eq 0) {
        $script:foundPassword = $candidatePassword
        Write-Host " SUCCESS" -ForegroundColor Green
        $connected = $true
        break
    } else {
        Write-Host " failed" -ForegroundColor Gray
    }
}

if (-not $connected) {
    Write-Host ""
    Write-Host "[ERROR] Could not connect to PostgreSQL" -ForegroundColor Red
    Write-Host ""
    Write-Host "What is your PostgreSQL postgres user password?"
    $customPwd = Read-Host "Password"
    $script:foundPassword = $customPwd
    
    $env:PGPASSWORD = $customPwd
    & "$pgPath\psql.exe" -U postgres -c "SELECT 1;" 2>&1 | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Password incorrect" -ForegroundColor Red
        exit 1
    }
}

# Create database
Write-Host ""
Write-Host "Creating database..." -ForegroundColor Yellow
$env:PGPASSWORD = $script:foundPassword

$dbCheck = & "$pgPath\psql.exe" -U postgres -lqt 2>&1 | Select-String -Pattern "stellar_dominion"

if ($dbCheck) {
    Write-Host "[OK] Database already exists" -ForegroundColor Green
} else {
    $createResult = & "$pgPath\psql.exe" -U postgres -c "CREATE DATABASE stellar_dominion;" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Database created" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Failed to create database" -ForegroundColor Red
        Write-Host $createResult
        exit 1
    }
}

# Save to .env
Write-Host ""
Write-Host "Saving configuration..." -ForegroundColor Yellow
$connectionString = "DATABASE_URL=postgresql://postgres:$($script:foundPassword)@localhost:5432/stellar_dominion"
$envPath = Join-Path $PSScriptRoot ".env"
Set-Content -Path $envPath -Value $connectionString
Write-Host "[OK] Created .env file" -ForegroundColor Green

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. npm run db:push   (initialize schema)"
Write-Host "  2. npm run admin     (set admin password)"
Write-Host "  3. npm run dev       (start server)"
Write-Host ""
