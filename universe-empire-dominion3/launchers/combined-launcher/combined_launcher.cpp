// Combined Launcher - Starts server and opens game client
// Compiles with: cl /EHsc /Fe:output\UniverseEmpireDominion.exe combined_launcher.cpp /link user32.lib shell32.lib shlwapi.lib wininet.lib

#include <windows.h>
#include <shellapi.h>
#include <shlwapi.h>
#include <wininet.h>
#include <string>
#include <iostream>

#pragma comment(lib, "user32.lib")
#pragma comment(lib, "shell32.lib")
#pragma comment(lib, "shlwapi.lib")
#pragma comment(lib, "wininet.lib")

const int SERVER_PORT = 5001;
const int WINDOW_WIDTH = 1920;
const int WINDOW_HEIGHT = 1080;

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

bool WaitForServer(const std::string& url, int maxSeconds) {
    for (int i = 0; i < maxSeconds * 2; i++) {
        HINTERNET hInternet = InternetOpenA("CombinedLauncher", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
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
    }
    return false;
}

LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch (msg) {
    case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        RECT rect;
        GetClientRect(hwnd, &rect);

        HBRUSH bg = CreateSolidBrush(RGB(8, 8, 12));
        FillRect(hdc, &rect, bg);
        DeleteObject(bg);

        SetBkMode(hdc, TRANSPARENT);
        SetTextColor(hdc, RGB(100, 180, 255));
        HFONT hFont = CreateFontA(56, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE,
            DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS,
            CLEARTYPE_QUALITY, DEFAULT_PITCH | FF_DONTCARE, "Segoe UI");
        SelectObject(hdc, hFont);
        DrawTextA(hdc, "UNIVERSE EMPIRE DOMINION", -1, &rect, DT_CENTER | DT_VCENTER | DT_SINGLELINE);

        SetTextColor(hdc, RGB(80, 80, 100));
        HFONT hSmall = CreateFontA(20, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE,
            DEFAULT_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS,
            CLEARTYPE_QUALITY, DEFAULT_PITCH | FF_DONTCARE, "Segoe UI");
        SelectObject(hdc, hSmall);
        RECT tRect = rect;
        tRect.top += 70;
        DrawTextA(hdc, "Starting server and launching game client...", -1, &tRect, DT_CENTER | DT_VCENTER | DT_SINGLELINE);

        // Loading dots animation
        RECT dRect = rect;
        dRect.top += 110;
        SetTextColor(hdc, RGB(100, 180, 255));
        DrawTextA(hdc, "Please wait", -1, &dRect, DT_CENTER | DT_VCENTER | DT_SINGLELINE);

        DeleteObject(hFont);
        DeleteObject(hSmall);
        EndPaint(hwnd, &ps);
        return 0;
    }
    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, msg, wParam, lParam);
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    AllocConsole();
    FILE* fDummy;
    freopen_s(&fDummy, "CONOUT$", "w", stdout);
    freopen_s(&fDummy, "CONOUT$", "w", stderr);
    SetConsoleTitleA("Universe Empire Dominion - Launcher");

    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);

    printf("  ========================================================\n");
    printf("  |   UNIVERSE EMPIRE DOMINION - Combined Launcher        |\n");
    printf("  |   Version 1.6.0                                       |\n");
    printf("  ========================================================\n\n");

    std::string gameRoot = GetGameRoot();
    printf("  Root: %s\n\n", gameRoot.c_str());

    std::string nodePath = gameRoot + "\\node_modules\\.bin\\node.exe";
    if (!PathFileExistsA(nodePath.c_str())) nodePath = "node";

    std::string serverPath = gameRoot + "\\dist\\index.cjs";
    if (!PathFileExistsA(serverPath.c_str())) {
        SetConsoleTextAttribute(hConsole, FOREGROUND_RED | FOREGROUND_INTENSITY);
        printf("  FATAL: Server entry not found at %s\n", serverPath.c_str());
        printf("  Run 'npm run build' first.\n");
        system("pause");
        return 1;
    }

    // Show splash window
    WNDCLASSEXA wc = { sizeof(wc) };
    wc.lpfnWndProc = WndProc;
    wc.hInstance = hInstance;
    wc.lpszClassName = "UESplash";
    wc.hbrBackground = (HBRUSH)GetStockObject(BLACK_BRUSH);
    RegisterClassExA(&wc);

    HWND splashHwnd = CreateWindowExA(0, "UESplash", "Universe Empire Dominion",
        WS_OVERLAPPED | WS_CAPTION, CW_USEDEFAULT, CW_USEDEFAULT,
        WINDOW_WIDTH, WINDOW_HEIGHT, NULL, NULL, hInstance, NULL);
    ShowWindow(splashHwnd, nCmdShow);
    UpdateWindow(splashHwnd);

    // Start server
    printf("  [1/3] Starting server...\n");
    SetEnvironmentVariableA("PORT", std::to_string(SERVER_PORT).c_str());
    SetEnvironmentVariableA("NODE_ENV", "production");

    STARTUPINFOA si = { sizeof(si) };
    PROCESS_INFORMATION pi = { 0 };
    si.dwFlags = STARTF_USESHOWWINDOW;
    si.wShowWindow = SW_HIDE;

    std::string serverCmd = "\"" + nodePath + "\" \"" + serverPath + "\"";
    BOOL started = CreateProcessA(NULL, const_cast<char*>(serverCmd.c_str()),
        NULL, NULL, FALSE, CREATE_NO_WINDOW, NULL, gameRoot.c_str(), &si, &pi);

    if (!started) {
        printf("  ERROR: Failed to start server\n");
        DestroyWindow(splashHwnd);
        return 1;
    }

    printf("  Server started (PID: %lu)\n", pi.dwProcessId);

    // Wait for server
    printf("  [2/3] Waiting for server...\n");
    std::string serverUrl = "http://localhost:" + std::to_string(SERVER_PORT);
    if (!WaitForServer(serverUrl, 60)) {
        printf("  ERROR: Server timeout\n");
        TerminateProcess(pi.hProcess, 1);
        CloseHandle(pi.hProcess);
        DestroyWindow(splashHwnd);
        return 1;
    }

    printf("  Server ready!\n");

    // Open game client
    printf("  [3/3] Launching game client...\n");
    std::string openCmd = "start \"\" \"" + serverUrl + "\"";
    system(openCmd.c_str());

    printf("\n  Game launched! Server running at %s\n", serverUrl.c_str());
    printf("  Console: http://localhost:%d\n\n", SERVER_PORT);

    // Keep launcher alive - process server output
    char buffer[4096];
    DWORD bytesRead = 0;
    HANDLE hStdout = GetStdHandle(STD_OUTPUT_HANDLE);

    // Message loop to keep window alive
    MSG msg;
    DWORD waitResult;
    while (true) {
        waitResult = MsgWaitForMultipleObjects(1, &pi.hProcess, FALSE, 100, QS_ALLINPUT);
        if (waitResult == WAIT_OBJECT_0) break;

        while (PeekMessage(&msg, NULL, 0, 0, PM_REMOVE)) {
            TranslateMessage(&msg);
            DispatchMessage(&msg);
            if (msg.message == WM_QUIT) goto cleanup;
        }
    }

cleanup:
    printf("\n  Shutting down server...\n");
    TerminateProcess(pi.hProcess, 0);
    CloseHandle(pi.hProcess);
    CloseHandle(pi.hThread);

    printf("  Goodbye!\n");
    system("pause");
    return 0;
}
