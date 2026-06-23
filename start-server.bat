@echo off
cd /d "C:\Users\Shadow\stellar-dominion3.5\universe-empire-dominion3"
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stellar_dominion
set PORT=5000
set NODE_ENV=development
npx tsx server/index.ts
