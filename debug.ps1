<#
.SYNOPSIS
Launches the Portfolio locally using the debug docker-compose.local.yml.
#>

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " Starting Local Debug Environment...         " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Bring down existing containers and clear volumes to force a fresh DB for debug
docker-compose -f docker-compose.local.yml down -v

# Bring up cluster 
docker-compose -f docker-compose.local.yml up -d --build

Write-Host "=============================================" -ForegroundColor Green
Write-Host " Debug environment launched!" -ForegroundColor Green
Write-Host " View at: http://localhost:3000" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Green
