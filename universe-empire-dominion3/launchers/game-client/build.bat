@echo off
echo ============================================
echo  Building Game Client Launcher
echo ============================================

:: Check for MSVC
where cl >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: MSVC compiler not found.
    echo Please install Visual Studio Build Tools or run from Developer Command Prompt.
    echo.
    echo Alternative: Install g++ via MSYS2 or MinGW and edit this script.
    pause
    exit /b 1
)

:: Build
echo Compiling...
cl /EHsc /Fe:output\GameClientLauncher.exe game_client_launcher.cpp /link user32.lib shell32.lib shlwapi.lib wininet.lib gdi32.lib /SUBSYSTEM:WINDOWS

if %errorlevel% equ 0 (
    echo.
    echo BUILD SUCCESSFUL!
    echo Output: output\GameClientLauncher.exe
    echo.
    echo To use: Copy output\GameClientLauncher.exe to the project root
) else (
    echo.
    echo BUILD FAILED!
)

pause
