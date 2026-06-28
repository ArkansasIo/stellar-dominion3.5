// Server Console Launcher - Full server window with health monitoring
// Compiles with: cl /EHsc /Fe:output\ServerConsole.exe server_console_launcher.cpp /link user32.lib shell32.lib shlwapi.lib wininet.lib

#include <windows.h>
#include <shellapi.h>
#include <shlwapi.h>
#include <wininet.h>
#include <string>
#include <iostream>
#include <fstream>

#pragma comment(lib, "user32.lib")
#pragma comment(lib, "shell32.lib")
#pragma comment(lib, "shlwapi.lib")
#pragma comment(lib, "wininet.lib")

const int SERVER_PORT = 5001;
const int HEALTH_CHECK_INTERVAL_MS = 30000;

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

bool CheckHealth(const std::string& url) {
    HINTERNET hInternet = InternetOpenA("ServerConsole", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
    if (!hInternet) return false;

    HINTERNET hUrl = InternetOpenUrlA(hInternet, url.c_str(), NULL, 0,
        INTERNET_FLAG_RELOAD | INTERNET_FLAG_NO_CACHE_WRITE, 0);
    if (!hUrl) {
        InternetCloseHandle(hInternet);
        return false;
    }

    char buffer[256];
    DWORD bytesRead = 0;
    BOOL result = InternetReadFile(hUrl, buffer, sizeof(buffer) - 1, &bytesRead);
    buffer[bytesRead] = '\0';

    InternetCloseHandle(hUrl);
    InternetCloseHandle(hInternet);

    return result && bytesRead > 0 && strstr(buffer, "healthy") != NULL;
}

void PrintBanner() {
    printf("\n");
    printf("  ========================================================\n");
    printf("  |   UNIVERSE EMPIRE DOMINION - Server Console           |\n");
    printf("  |   Version 1.6.0 | Health Monitor Active               |\n");
    printf("  ========================================================\n");
    printf("\n");
}

void PrintSection(const char* title) {
    printf("\n  --- %s ---\n", title);
}

int main(int argc, char* argv[]) {
    AllocConsole();
    FILE* fDummy;
    freopen_s(&fDummy, "CONOUT$", "w", stdout);
    freopen_s(&fDummy, "CONOUT$", "w", stderr);
    freopen_s(&fDummy, "CONIN$", "r", stdin);
    SetConsoleTitleA("Universe Empire Dominion - Server Console");

    // Set console colors
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    SetConsoleTextAttribute(hConsole, FOREGROUND_BLUE | FOREGROUND_GREEN | FOREGROUND_INTENSITY);

    PrintBanner();

    std::string gameRoot = GetGameRoot();
    printf("  Root: %s\n", gameRoot.c_str());

    std::string nodePath = gameRoot + "\\node_modules\\.bin\\node.exe";
    if (!PathFileExistsA(nodePath.c_str())) nodePath = "node";

    std::string serverPath = gameRoot + "\\dist\\index.cjs";
    if (!PathFileExistsA(serverPath.c_str())) {
        SetConsoleTextAttribute(hConsole, FOREGROUND_RED | FOREGROUND_INTENSITY);
        printf("\n  FATAL: Server entry not found!\n");
        printf("  Expected: %s\n", serverPath.c_str());
        printf("  Run 'npm run build' first.\n");
        system("pause");
        return 1;
    }

    PrintSection("Configuration");
    printf("  Node:      %s\n", nodePath.c_str());
    printf("  Server:    %s\n", serverPath.c_str());
    printf("  Port:      %d\n", SERVER_PORT);
    printf("  URL:       http://localhost:%d\n", SERVER_PORT);

    SetEnvironmentVariableA("PORT", std::to_string(SERVER_PORT).c_str());
    SetEnvironmentVariableA("NODE_ENV", "production");

    PrintSection("Startup");
    printf("  Launching server process...\n");

    STARTUPINFOA si = { sizeof(si) };
    PROCESS_INFORMATION pi = { 0 };
    si.dwFlags = STARTF_USESHOWWINDOW;
    si.wShowWindow = SW_HIDE;

    std::string serverCmd = "\"" + nodePath + "\" \"" + serverPath + "\"";
    BOOL started = CreateProcessA(NULL, const_cast<char*>(serverCmd.c_str()),
        NULL, NULL, FALSE, CREATE_NO_WINDOW, NULL, gameRoot.c_str(), &si, &pi);

    if (!started) {
        SetConsoleTextAttribute(hConsole, FOREGROUND_RED | FOREGROUND_INTENSITY);
        printf("  FAILED to start server (error %lu)\n", GetLastError());
        system("pause");
        return 1;
    }

    SetConsoleTextAttribute(hConsole, FOREGROUND_GREEN | FOREGROUND_INTENSITY);
    printf("  Server started (PID: %lu)\n", pi.dwProcessId);
    SetConsoleTextAttribute(hConsole, FOREGROUND_RED | FOREGROUND_GREEN | FOREGROUND_BLUE);

    // Health monitoring loop
    PrintSection("Health Monitor");
    std::string healthUrl = "http://localhost:" + std::to_string(SERVER_PORT) + "/api/status/health";
    int checkCount = 0;
    int failCount = 0;

    while (WaitForSingleObject(pi.hProcess, HEALTH_CHECK_INTERVAL_MS) == WAIT_TIMEOUT) {
        checkCount++;
        bool healthy = CheckHealth(healthUrl);

        SYSTEMTIME st;
        GetLocalTime(&st);
        char timeStr[32];
        sprintf_s(timeStr, "%02d:%02d:%02d", st.wHour, st.wMinute, st.wSecond);

        if (healthy) {
            failCount = 0;
            SetConsoleTextAttribute(hConsole, FOREGROUND_GREEN | FOREGROUND_INTENSITY);
            printf("  [%s] Health: OK (check #%d)\n", timeStr, checkCount);
        } else {
            failCount++;
            SetConsoleTextAttribute(hConsole, FOREGROUND_RED | FOREGROUND_INTENSITY);
            printf("  [%s] Health: FAIL (consecutive: %d)\n", timeStr, failCount);

            if (failCount >= 5) {
                printf("  Server appears unhealthy. Attempting restart...\n");
                TerminateProcess(pi.hProcess, 1);
                CloseHandle(pi.hProcess);
                CloseHandle(pi.hThread);

                Sleep(2000);
                started = CreateProcessA(NULL, const_cast<char*>(serverCmd.c_str()),
                    NULL, NULL, FALSE, CREATE_NO_WINDOW, NULL, gameRoot.c_str(), &si, &pi);
                if (started) {
                    SetConsoleTextAttribute(hConsole, FOREGROUND_GREEN);
                    printf("  Server restarted (PID: %lu)\n", pi.dwProcessId);
                    failCount = 0;
                }
            }
        }
        SetConsoleTextAttribute(hConsole, FOREGROUND_RED | FOREGROUND_GREEN | FOREGROUND_BLUE);
    }

    DWORD exitCode;
    GetExitCodeProcess(pi.hProcess, &exitCode);
    CloseHandle(pi.hProcess);
    CloseHandle(pi.hThread);

    PrintSection("Shutdown");
    printf("  Server exited (code: %lu)\n", exitCode);
    printf("  Total health checks: %d\n", checkCount);
    system("pause");
    return 0;
}
