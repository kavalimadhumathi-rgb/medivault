@echo off
title MediVault AI - Clinical Healthcare Information Platform
echo ==========================================================
echo    Starting MediVault AI Healthcare Information Server    
echo ==========================================================
set NODE_CMD=C:\Users\Dell\AppData\Roaming\Antigravity\bin\agy-node.cmd
set SERVER_SCRIPT=%~dp0backend\server.js

start "" "%NODE_CMD%" "%SERVER_SCRIPT%"
timeout /t 2 /nobreak >nul
start http://localhost:3100
echo MediVault AI is active at http://localhost:3100
