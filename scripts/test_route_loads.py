from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

BASE_URL = "http://localhost:5001"
APP_FILE = Path(__file__).resolve().parents[1] / "client/src/App.tsx"

DYNAMIC_VALUES = {
    ":id": "1",
    ":subsystemId": "1",
    ":section": "overview",
    ":galaxy": "1",
    ":system": "102",
    ":planet": "1",
}


def concrete_path(path: str) -> str:
    for token, value in DYNAMIC_VALUES.items():
        path = path.replace(token, value)
    return path


def main() -> int:
    source = APP_FILE.read_text(encoding="utf-8")
    declared = re.findall(r'<Route\s+path="([^"]+)"', source)
    routes: list[str] = []
    for route in declared:
        route = concrete_path(route)
        if route not in routes:
            routes.append(route)

    failures: list[tuple[str, str]] = []
    results: list[tuple[str, str, str]] = []
    for route in routes:
        url = BASE_URL + route
        request = Request(url, headers={"User-Agent": "Stellar-Dominion-route-smoke/1.0"})
        try:
            with urlopen(request, timeout=10) as response:
                body = response.read(8192).decode("utf-8", errors="ignore")
                status = str(response.status)
                shell_ok = "<html" in body.lower() or "id=\"root\"" in body.lower()
                result = "PASS" if response.status < 400 and shell_ok else "WARN"
                if result != "PASS":
                    failures.append((route, f"HTTP {status}; app shell marker missing"))
                results.append((result, status, route))
        except HTTPError as error:
            failures.append((route, f"HTTP {error.code}"))
            results.append(("FAIL", str(error.code), route))
        except (URLError, TimeoutError, OSError) as error:
            failures.append((route, str(error.reason if isinstance(error, URLError) else error)))
            results.append(("FAIL", "ERR", route))

    print(f"Route count: {len(routes)}")
    for result, status, route in results:
        print(f"{result:4} {status:3} {route}")
    print(f"Passed: {len(routes) - len(failures)}")
    print(f"Failed or warned: {len(failures)}")
    if failures:
        print("Failures:")
        for route, reason in failures:
            print(f"- {route}: {reason}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

