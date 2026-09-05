# MediVault AI Launcher
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Starting MediVault AI Healthcare Information Server    " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$NodeCmd = "C:\Users\Dell\AppData\Roaming\Antigravity\bin\agy-node.cmd"
$ServerScript = Join-Path $PSScriptRoot "backend\server.js"

Start-Process -FilePath $NodeCmd -ArgumentList $ServerScript -WindowStyle Normal
Start-Sleep -Seconds 2
Start-Process "http://localhost:3100"
Write-Host "MediVault AI is running at http://localhost:3100" -ForegroundColor Green
