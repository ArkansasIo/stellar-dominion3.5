// Server Backend Launcher - Runs server API in a console window
// Compiles with: cl /EHsc /Fe:output\ServerBackendLauncher.exe server_backend_launcher.cpp /link user32.lib shell32.lib shlwapi.lib

#include <windows.h>
#include <shellapi.h>
#include <shlwapi.h>
#include <string>
#include <iostream>
#include <fstream>
#include <signal.h>

#pragma comment(lib, "user32.lib")
#pragma comment(lib, "shell32.lib")
#pragma comment(lib, "shlwapi.lib")

const int SERVER_PORT = 5001;

std::string GetExecutableDir() {
    char buffer[MAX_PATH];
    GetModuleFileNameA(NULL, buffer, MAX_PATH);
    std::string path(buffer);
    size_t pos = path.find_last_of("\\/");
    return (pos != std::string::npos) ? path.substr(0, pos) : ".";
}

std::string GetGameRoot() {
    char buffer[MAX_PATH];
    GetModuleFileNameA(NULL, buffer, MAX_PATH);
    std::string path(buffer);
    size_t pos = path.find_last_of("\\/");
    std::string dir = (pos != std::string::npos) ? path.substr(0, pos) : ".";
    for (int i = 0; i < 3; i++) {
        pos = dir.find_last_of("\\/");
        if (pos != std::string::npos) dir = dir.substr(0, pos);
    }
    return dir;
}

void PrintBanner() {
    printf("\n");
    printf("  ========================================================\n");
    printf("  |     UNIVERSE EMPIRE DOMINION - Server Backend         |\n");
    printf("  |     Version 1.6.0                                    |\n");
    printf("  |     Express + PostgreSQL + TypeScript                |\n");
    printf("  ========================================================\n");
    printf("\n");
}

void PrintStatus(const char* component, const char* status) {
    printf("  [ok] %-20s %s\n", component, status);
}

void PrintWarning(const char* component, const char* status) {
    printf("  [!!] %-20s %s\n", component, status);
}

int main(int argc, char* argv[]) {
    AllocConsole();
    FILE* fDummy;
    freopen_s(&fDummy, "CONOUT$", "w", stdout);
    freopen_s(&fDummy, "CONOUT$", "w", stderr);
    freopen_s(&fDummy, "CONIN$", "r", stdin);
    SetConsoleTitleA("Universe Empire Dominion - Server Console");

    PrintBanner();

    std::string gameRoot = GetGameRoot();
    printf("  Game Root: %s\n\n", gameRoot.c_str());

    // Find node executable
    std::string nodePath = gameRoot + "\\node_modules\\.bin\\node.exe";
    if (!PathFileExistsA(nodePath.c_str())) {
        nodePath = "node";
    }

    // Find server entry
    std::string serverPath = gameRoot + "\\dist\\index.cjs";
    if (!PathFileExistsA(serverPath.c_str())) {
        printf("  ERROR: Server entry not found at %s\n", serverPath.c_str());
        printf("  Please build the project first: npm run build\n");
        system("pause");
        return 1;
    }

    // Find .env file
    std::string envPath = gameRoot + "\\.env";
    if (!PathFileExistsA(envPath.c_str())) {
        PrintWarning("Config", ".env file not found - using defaults");
    } else {
        PrintStatus("Config", ".env loaded");
    }

    PrintStatus("Node.js", nodePath.c_str());
    PrintStatus("Server", serverPath.c_str());
    PrintStatus("Port", std::to_string(SERVER_PORT).c_str());
    printf("\n");

    // Set environment variables
    SetEnvironmentVariableA("PORT", std::to_string(SERVER_PORT).c_str());
    SetEnvironmentVariableA("NODE_ENV", "production");

    // Start server process
    printf("  Starting server...\n\n");

    STARTUPINFOA si = { sizeof(si) };
    PROCESS_INFORMATION pi = { 0 };
    si.dwFlags = STARTF_USESHOWWINDOW | STARTF_USESTDHANDLES;
    si.wShowWindow = SW_SHOW;
    si.hStdOutput = GetStdHandle(STD_OUTPUT_HANDLE);
    si.hStdError = GetStdHandle(STD_ERROR_HANDLE);
    si.hStdInput = GetStdHandle(STD_INPUT_HANDLE);

    std::string serverCmd = "\"" + nodePath + "\" \"" + serverPath + "\"";
    BOOL started = CreateProcessA(
        NULL,
        const_cast<char*>(serverCmd.c_str()),
        NULL, NULL, TRUE,
        0,
        NULL,
        gameRoot.c_str(),
        &si, &pi
    );

    if (!started) {
        printf("  ERROR: Failed to start server process (error %lu)\n", GetLastError());
        system("pause");
        return 1;
    }

    printf("  Server started (PID: %lu)\n", pi.dwProcessId);
    printf("  Listening on http://localhost:%d\n\n", SERVER_PORT);
    printf("  Press Ctrl+C or close this window to stop the server.\n\n");

    // Wait for server process to exit
    WaitForSingleObject(pi.hProcess, INFINITE);

    DWORD exitCode;
    GetExitCodeProcess(pi.hProcess, &exitCode);

    CloseHandle(pi.hProcess);
    CloseHandle(pi.hThread);

    printf("\n  Server stopped (exit code: %lu)\n", exitCode);
    system("pause");
    return 0;
}
