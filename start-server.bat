@echo off
echo Starting Stellar Dominion Server...
echo.

cd /d "%~dp0"

echo Checking Node.js...
node --version
echo.

echo Starting development server...
cd universe-empire-dominion3
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stellar_dominion
set PORT=5000
set NODE_ENV=development
npm run dev
