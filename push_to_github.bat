@echo off
setlocal
echo ===================================================
echo MediVault AI - Push to GitHub
echo Target: https://github.com/kavalimadhumathi-rgb/medical.git
echo ===================================================
set GIT="C:\Users\Dell\.gemini\antigravity\scratch\mingit\cmd\git.exe"

echo If your repository requires authentication, enter your GitHub Personal Access Token (PAT).
set /p TOKEN="Enter GitHub Token (or press Enter for standard prompt): "

if "%TOKEN%"=="" (
    %GIT% push -u origin main
) else (
    %GIT% push -u https://%TOKEN%@github.com/kavalimadhumathi-rgb/medical.git main
)

pause
