@echo off

echo Running npm dev script in new window...
start "Web HMI Server" cmd /k "npm run dev"

timeout /t 4 >nul

echo Starting simulated PLC in new window...
start "PLC Server" cmd /k "node ./src/app/backend/modbus/test-plc-server.js"

timeout /t 2 >nul

echo Starting Express backend server in new window...
start "Backend Server" cmd /k "node ./src/app/backend/server/express-server.js"

timeout /t 2 >nul

echo Opening frontend in default browser...
start "" http://localhost:3000

echo All systems launching...