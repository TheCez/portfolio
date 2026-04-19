<#
.SYNOPSIS
Launches the Portfolio application environment, checks/seeds the internal database, and schedules a nightly backup.
#>

$ErrorActionPreference = "Stop"
$WorkingDir = (Get-Item -Path ".\" -Verbose).FullName

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " Starting Portfolio Environment & Database..." -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Start Postgres Docker Container
docker-compose up -d
Write-Host "Waiting for database to accept connections..."
Start-Sleep -Seconds 5

# 2. Push Schema & Seed DB
Write-Host "Syncing schema to Postgres DB..." -ForegroundColor Yellow
npx prisma db push

Write-Host "Checking and Seeding database..." -ForegroundColor Yellow
# Run the TS-Node seed script
npx ts-node --compiler-options="{\`"module\`":\`"CommonJS\`"}" prisma/seed.ts

# 3. Create Backup Script
$BackupScriptPath = Join-Path $WorkingDir "backup_db.ps1"
$BackupDir = Join-Path $WorkingDir "db_backups"

if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
}

$BackupScriptContent = @"
`$ErrorActionPreference = "Stop"
`$DateStr = Get-Date -Format "yyyyMMdd_HHmmss"
`$BackupFile = "$BackupDir\portfolio_db_`$DateStr.sql"
Write-Host "Starting backup to `$BackupFile"
docker exec -t portfolio_db pg_dump -U portfolio_user portfolio_db > "`$BackupFile"
Write-Host "Backup completed successfully."
"@

Set-Content -Path $BackupScriptPath -Value $BackupScriptContent
Write-Host "Backup script created at : $BackupScriptPath" -ForegroundColor Green

# 4. Schedule Nightly Backup via Windows Task Scheduler
$TaskName = "PortfolioNightlyBackup"
$TaskExists = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue

if (-not $TaskExists) {
    Write-Host "Registering Nightly Backup in Windows Task Scheduler..." -ForegroundColor Yellow
    $Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$BackupScriptPath`""
    $Trigger = New-ScheduledTaskTrigger -Daily -At "3:00 AM"
    $Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
    
    Register-ScheduledTask -Action $Action -Trigger $Trigger -TaskName $TaskName -Description "Nightly database backup of portfolio postgres" -Settings $Settings | Out-Null
    Write-Host "Scheduled task '$TaskName' registered to run daily at 3:00 AM." -ForegroundColor Green
} else {
    Write-Host "Scheduled backup task '$TaskName' already exists." -ForegroundColor Cyan
}

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " Environment is ready!" -ForegroundColor Green
Write-Host " You can now run 'npm run dev' to start." -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
