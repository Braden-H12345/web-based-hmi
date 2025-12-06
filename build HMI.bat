echo off

echo Building HMI....
start "Build HMI" cmd /k "npm run build:hmi"

timeout /t 2 >nul

echo HMI Built...