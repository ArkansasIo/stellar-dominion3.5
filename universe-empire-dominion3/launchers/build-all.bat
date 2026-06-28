@echo off
echo ========================================================
echo  Universe Empire Dominion - Build All Launchers
echo ========================================================
echo.

:: Check for MSVC
where cl >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MSVC compiler not found.
    echo.
    echo Please install one of:
    echo   1. Visual Studio 2022 Build Tools
    echo   2. Visual Studio 2022 Community
    echo   3. Windows SDK
    echo.
    echo Or run this from a Visual Studio Developer Command Prompt.
    echo.
    pause
    exit /b 1
)

set ROOT=%~dp0
set COMPILE_FLAGS=/EHsc /O2 /W3

echo [1/4] Building Game Client Launcher...
cd /d "%ROOT%game-client"
cl %COMPILE_FLAGS% /Fe:output\GameClientLauncher.exe game_client_launcher.cpp /link user32.lib shell32.lib shlwapi.lib wininet.lib gdi32.lib /SUBSYSTEM:WINDOWS >nul 2>&1
if %errorlevel% equ 0 (echo   OK - output\GameClientLauncher.exe) else (echo   FAILED)

echo [2/4] Building Server Backend Launcher...
cd /d "%ROOT%server-backend"
cl %COMPILE_FLAGS% /Fe:output\ServerBackendLauncher.exe server_backend_launcher.cpp /link user32.lib shell32.lib shlwapi.lib /SUBSYSTEM:CONSOLE >nul 2>&1
if %errorlevel% equ 0 (echo   OK - output\ServerBackendLauncher.exe) else (echo   FAILED)

echo [3/4] Building Server Console Launcher...
cd /d "%ROOT%server-console"
cl %COMPILE_FLAGS% /Fe:output\ServerConsole.exe server_console_launcher.cpp /link user32.lib shell32.lib shlwapi.lib wininet.lib /SUBSYSTEM:CONSOLE >nul 2>&1
if %errorlevel% equ 0 (echo   OK - output\ServerConsole.exe) else (echo   FAILED)

echo [4/4] Building Combined Launcher...
cd /d "%ROOT%combined-launcher"
cl %COMPILE_FLAGS% /Fe:output\UniverseEmpireDominion.exe combined_launcher.cpp /link user32.lib shell32.lib shlwapi.lib wininet.lib gdi32.lib /SUBSYSTEM:WINDOWS >nul 2>&1
if %errorlevel% equ 0 (echo   OK - output\UniverseEmpireDominion.exe) else (echo   FAILED)

cd /d "%ROOT%"
echo.
echo ========================================================
echo  Build Complete! EXE files are in each launcher's output/
echo ========================================================
echo.
echo  launchers\game-client\output\GameClientLauncher.exe
echo  launchers\server-backend\output\ServerBackendLauncher.exe
echo  launchers\server-console\output\ServerConsole.exe
echo  launchers\combined-launcher\output\UniverseEmpireDominion.exe
echo.
pause
