<#
.SYNOPSIS
Launches the Portfolio locally using the debug docker-compose.local.yml.
Use -Reset flag to wipe the database volume (for testing fresh seeding).
#>
param(
  [switch]$Reset
)

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " Starting Local Debug Environment...         " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

if ($Reset) {
  Write-Host "Reset flag detected. Wiping database volume..." -ForegroundColor Yellow
  docker-compose -f docker-compose.local.yml down -v
} else {
  # Normal restart — keep the database volume so user data is preserved
  docker-compose -f docker-compose.local.yml down
}

# Bring up cluster 
docker-compose -f docker-compose.local.yml up -d --build

Write-Host "=============================================" -ForegroundColor Green
Write-Host " Debug environment launched!" -ForegroundColor Green
Write-Host " View at: http://localhost:3000" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Green
