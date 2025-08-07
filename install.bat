@echo off
setlocal enabledelayedexpansion

:: Function to prompt and install
:prompt_install
set package=%~1
echo.
set /p doInstall="Do you want to install %package%? (Y/N): "
if /i "!doInstall!"=="Y" (
    echo Installing %package%...
    call npm install %package%
) else (
    echo Skipping %package%.
)
goto :eof

:: === PACKAGE INSTALLS ===
call :prompt_install "react" react@latest react-dom@latest next@latest
call :prompt_install "modbus-serial" modbus-serial
call :prompt_install "express" express
call :prompt_install "react-dnd" react-dnd
call :prompt_install "react-dnd-html5" react-dnd-html5-backend

echo.
echo All done!
pause