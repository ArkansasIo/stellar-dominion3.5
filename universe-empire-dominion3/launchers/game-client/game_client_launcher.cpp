// Game Client Launcher - Opens full game window
// Compiles with: cl /EHsc /Fe:output\GameClientLauncher.exe game_client_launcher.cpp /link user32.lib shell32.lib shlwapi.lib

#include <windows.h>
#include <shellapi.h>
#include <shlwapi.h>
#include <wininet.h>
#include <string>
#include <iostream>
#include <fstream>
#include <chrono>
#include <thread>

#pragma comment(lib, "user32.lib")
#pragma comment(lib, "shell32.lib")
#pragma comment(lib, "shlwapi.lib")
#pragma comment(lib, "wininet.lib")

const int WINDOW_WIDTH = 1920;
const int WINDOW_HEIGHT = 1080;
const int SERVER_PORT = 5001;
const int MAX_WAIT_SECONDS = 60;

std::string GetExecutableDir() {
    char buffer[MAX_PATH];
    GetModuleFileNameA(NULL, buffer, MAX_PATH);
    std::string path(buffer);
    size_t pos = path.find_last_of("\\/");
    return (pos != std::string::npos) ? path.substr(0, pos) : ".";
}

std::string GetGameRoot() {
    std::string exeDir = GetExecutableDir();
    // Navigate up from launchers/game-client/output to project root
    char buffer[MAX_PATH];
    GetModuleFileNameA(NULL, buffer, MAX_PATH);
    std::string path(buffer);
    size_t pos = path.find_last_of("\\/");
    std::string dir = (pos != std::string::npos) ? path.substr(0, pos) : ".";
    // Go up 3 levels: output -> game-client -> launchers -> project root
    for (int i = 0; i < 3; i++) {
        pos = dir.find_last_of("\\/");
        if (pos != std::string::npos) dir = dir.substr(0, pos);
    }
    return dir;
}

bool WaitForServer(const std::string& url, int maxSeconds) {
    for (int i = 0; i < maxSeconds * 2; i++) {
        HINTERNET hInternet = InternetOpenA("GameClientLauncher", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
        if (hInternet) {
            HINTERNET hUrl = InternetOpenUrlA(hInternet, url.c_str(), NULL, 0, INTERNET_FLAG_RELOAD, 0);
            if (hUrl) {
                InternetCloseHandle(hUrl);
                InternetCloseHandle(hInternet);
                return true;
            }
            InternetCloseHandle(hInternet);
        }
        Sleep(500);
        if (i % 4 == 0) {
            printf("\r  Waiting for server... %d/%ds", i / 2 + 1, maxSeconds);
            fflush(stdout);
        }
    }
    return false;
}

void ShowSplashScreen(HWND hwnd) {
    HDC hdc = GetDC(hwnd);
    RECT rect;
    GetClientRect(hwnd, &rect);

    // Dark background
    HBRUSH bgBrush = CreateSolidBrush(RGB(10, 10, 15));
    FillRect(hdc, &rect, bgBrush);
    DeleteObject(bgBrush);

    // Title text
    SetBkMode(hdc, TRANSPARENT);
    SetTextColor(hdc, RGB(100, 180, 255));
    HFONT hFont = CreateFontA(48, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE,
        DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS,
        CLEARTYPE_QUALITY, DEFAULT_PITCH | FF_DONTCARE, "Segoe UI");
    SelectObject(hdc, hFont);
    DrawTextA(hdc, "UNIVERSE EMPIRE DOMINION", -1, &rect,
        DT_CENTER | DT_VCENTER | DT_SINGLELINE);

    // Version text
    SetTextColor(hdc, RGB(100, 100, 120));
    HFONT hFontSmall = CreateFontA(18, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE,
        DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS,
        CLEARTYPE_QUALITY, DEFAULT_PITCH | FF_DONTCARE, "Segoe UI");
    SelectObject(hdc, hFontSmall);
    RECT textRect = rect;
    textRect.top += 60;
    DrawTextA(hdc, "v1.6.0 - Loading...", -1, &textRect,
        DT_CENTER | DT_VCENTER | DT_SINGLELINE);

    // Loading bar
    int barWidth = 300;
    int barHeight = 4;
    int barX = (rect.right - barWidth) / 2;
    int barY = (rect.bottom + 80);
    RECT barBg = { barX, barY, barX + barWidth, barY + barHeight };
    HBRUSH barBgBrush = CreateSolidBrush(RGB(30, 30, 40));
    FillRect(hdc, &barBg, barBgBrush);
    DeleteObject(barBgBrush);

    RECT barFill = { barX, barY, barX + (barWidth * 70 / 100), barY + barHeight };
    HBRUSH barFillBrush = CreateSolidBrush(RGB(100, 180, 255));
    FillRect(hdc, &barFill, barFillBrush);
    DeleteObject(barFillBrush);

    DeleteObject(hFont);
    DeleteObject(hFontSmall);
    ReleaseDC(hwnd, hdc);
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    // Allocate console for logging
    AllocConsole();
    FILE* fDummy;
    freopen_s(&fDummy, "CONOUT$", "w", stdout);
    freopen_s(&fDummy, "CONOUT$", "w", stderr);
    SetConsoleTitleA("Universe Empire Dominion - Game Client");
    printf("=== Universe Empire Dominion - Game Client Launcher ===\n");
    printf("Version: 1.6.0\n\n");

    std::string gameRoot = GetGameRoot();
    printf("Game root: %s\n", gameRoot.c_str());

    // Find node.exe
    std::string nodePath = gameRoot + "\\node_modules\\.bin\\node.exe";
    if (!PathFileExistsA(nodePath.c_str())) {
        // Try system node
        nodePath = "node";
    }
    printf("Node path: %s\n", nodePath.c_str());

    // Find server entry
    std::string serverPath = gameRoot + "\\dist\\index.cjs";
    printf("Server path: %s\n", serverPath.c_str());

    // Start the server process
    printf("\nStarting game server...\n");
    STARTUPINFOA si = { sizeof(si) };
    PROCESS_INFORMATION pi = { 0 };
    si.dwFlags = STARTF_USESHOWWINDOW;
    si.wShowWindow = SW_HIDE;

    std::string serverCmd = "\"" + nodePath + "\" \"" + serverPath + "\"";
    BOOL serverStarted = CreateProcessA(
        NULL,
        const_cast<char*>(serverCmd.c_str()),
        NULL, NULL, FALSE,
        CREATE_NO_WINDOW,
        NULL,
        gameRoot.c_str(),
        &si, &pi
    );

    if (!serverStarted) {
        printf("ERROR: Failed to start server process\n");
        MessageBoxA(NULL, "Failed to start the game server.", "Game Client Error", MB_OK | MB_ICONERROR);
        return 1;
    }

    printf("Server process started (PID: %lu)\n", pi.dwProcessId);

    // Create splash window
    WNDCLASSEXA wc = { sizeof(wc) };
    wc.lpfnWndProc = DefWindowProcA;
    wc.hInstance = hInstance;
    wc.lpszClassName = "GameClientSplash";
    wc.hbrBackground = (HBRUSH)GetStockObject(BLACK_BRUSH);
    RegisterClassExA(&wc);

    HWND splashHwnd = CreateWindowExA(
        0, "GameClientSplash", "Universe Empire Dominion",
        WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU,
        CW_USEDEFAULT, CW_USEDEFAULT, WINDOW_WIDTH, WINDOW_HEIGHT,
        NULL, NULL, hInstance, NULL
    );
    ShowWindow(splashHwnd, nCmdShow);
    ShowSplashScreen(splashHwnd);

    // Wait for server
    std::string serverUrl = "http://localhost:" + std::to_string(SERVER_PORT);
    printf("\nWaiting for server at %s...\n", serverUrl.c_str());

    if (!WaitForServer(serverUrl, MAX_WAIT_SECONDS)) {
        printf("\nERROR: Server did not start within %d seconds\n", MAX_WAIT_SECONDS);
        MessageBoxA(NULL, "Server failed to start. Check logs.", "Game Client Error", MB_OK | MB_ICONERROR);
        TerminateProcess(pi.hProcess, 1);
        CloseHandle(pi.hProcess);
        CloseHandle(pi.hThread);
        DestroyWindow(splashHwnd);
        return 1;
    }

    printf("\nServer ready! Opening game window...\n");
    Sleep(500);

    // Create main game window
    DestroyWindow(splashHwnd);

    wc.lpszClassName = "GameClientMain";
    RegisterClassExA(&wc);

    HWND mainHwnd = CreateWindowExA(
        0, "GameClientMain", "Universe Empire Dominion",
        WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, WINDOW_WIDTH, WINDOW_HEIGHT,
        NULL, NULL, hInstance, NULL
    );

    ShowWindow(mainHwnd, SW_MAXIMIZE);
    UpdateWindow(mainHwnd);

    // Use Edge WebView2 or fall back to default browser via ShellExecute
    // For a game client, we open the URL in the default browser
    std::string openCmd = "start \"\" \"" + serverUrl + "\"";
    system(openCmd.c_str());

    printf("Game client launched successfully!\n");
    printf("Server running at %s\n", serverUrl.c_str());
    printf("Close this window or press Ctrl+C to stop the server.\n\n");

    // Message loop - keep alive until user closes
    MSG msg;
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    // Cleanup
    printf("\nShutting down...\n");
    TerminateProcess(pi.hProcess, 0);
    CloseHandle(pi.hProcess);
    CloseHandle(pi.hThread);

    printf("Server stopped. Goodbye!\n");
    return 0;
}
