@echo off
echo Restarting Universe Empire Dominion Server...
echo.
echo Stopping existing processes...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul
echo.
echo Starting server...
cd Universe-Empire-Dominion
start "Universe Empire Dominion Server" cmd /k "npm run dev"
echo.
echo Server restarted! Check the new window.
pause

@REM Made with Bob
