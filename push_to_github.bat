@echo off
setlocal
echo ===================================================
echo MediVault AI - Push to GitHub
echo Target: https://github.com/kavalimadhumathi-rgb/medivault.git
echo ===================================================
set "PATH=C:\Users\Dell\.gemini\antigravity\scratch\mingit\cmd;%PATH%"
set GIT="C:\Users\Dell\.gemini\antigravity\scratch\mingit\cmd\git.exe"

echo If your repository requires authentication, enter your GitHub Personal Access Token (PAT).
set /p TOKEN="Enter GitHub Token (or press Enter for standard browser sign-in): "

if "%TOKEN%"=="" (
    %GIT% push -u origin main
) else (
    %GIT% push -u https://%TOKEN%@github.com/kavalimadhumathi-rgb/medivault.git main
)

pause
