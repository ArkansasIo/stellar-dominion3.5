@echo off
echo ============================================
echo  Building Server Backend Launcher
echo ============================================
where cl >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MSVC compiler not found. Run from Developer Command Prompt.
    pause
    exit /b 1
)
echo Compiling...
cl /EHsc /Fe:output\ServerBackendLauncher.exe server_backend_launcher.cpp /link user32.lib shell32.lib shlwapi.lib /SUBSYSTEM:CONSOLE
if %errorlevel% equ 0 (
    echo BUILD SUCCESSFUL! Output: output\ServerBackendLauncher.exe
) else (
    echo BUILD FAILED!
)
pause
