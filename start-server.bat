@echo off
echo Starting Universe Empire Dominion Server...
echo.

cd /d "%~dp0"

echo Checking Node.js...
node --version
echo.

echo Starting server with tsx...
tsx server/index.ts
