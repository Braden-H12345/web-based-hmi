@echo off

echo Running npm dev script in new window...
start "Web HMI Server" cmd /k "npm run dev:all"

timeout /t 2 >nul

echo Opening frontend in default browser...
start "" http://localhost:3000/home

echo All systems launching...