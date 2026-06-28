#!/bin/bash
echo "Starting Universe Empire Dominion Server..."
echo ""
echo "Server will be available at: http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

# Detect platform
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if grep -q "Raspberry Pi" /proc/cpuinfo 2>/dev/null; then
        ./UniverseEmpireDominion-raspberry-pi
    else
        ./UniverseEmpireDominion-linux
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    ./UniverseEmpireDominion-macos
else
    echo "Unsupported platform: $OSTYPE"
    exit 1
fi
