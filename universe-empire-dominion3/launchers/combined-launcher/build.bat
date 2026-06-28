@echo off
echo ============================================
echo  Building Combined Launcher
echo ============================================
where cl >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MSVC compiler not found. Run from Developer Command Prompt.
    pause
    exit /b 1
)
echo Compiling...
cl /EHsc /Fe:output\UniverseEmpireDominion.exe combined_launcher.cpp /link user32.lib shell32.lib shlwapi.lib wininet.lib gdi32.lib /SUBSYSTEM:WINDOWS
if %errorlevel% equ 0 (
    echo BUILD SUCCESSFUL! Output: output\UniverseEmpireDominion.exe
) else (
    echo BUILD FAILED!
)
pause
