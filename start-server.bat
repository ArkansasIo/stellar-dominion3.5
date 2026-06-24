@echo off
cd /d "%~dp0universe-empire-dominion3"
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stellar_dominion
set PORT=5000
set NODE_ENV=development
npm run dev
