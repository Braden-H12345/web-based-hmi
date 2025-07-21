@echo off
REM ──────────────────────────────────────────────────
REM  HMI Page Generator Launcher
REM ──────────────────────────────────────────────────

REM Move into this script’s directory (so paths resolve correctly)
cd /d "%~dp0"

REM Optional: if you have an npm script called "generate", uncomment next line
REM npm run generate

REM Otherwise, call Node directly:
node generate-page.js

REM Pause so you can see any output or errors
echo.
pause