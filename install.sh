#!/bin/bash
# Universe Empire Dominion - Cross-Platform Installation Script
# Supports: Linux, macOS, Raspberry Pi

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="Universe Empire Dominion"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NODE_VERSION="18"
POSTGRES_VERSION="14"

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            OS=$ID
            OS_VERSION=$VERSION_ID
        fi
        
        # Check if Raspberry Pi
        if grep -q "Raspberry Pi" /proc/cpuinfo 2>/dev/null; then
            IS_RASPBERRY_PI=true
            log_info "Detected Raspberry Pi"
        else
            IS_RASPBERRY_PI=false
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        OS_VERSION=$(sw_vers -productVersion)
    else
        log_error "Unsupported operating system: $OSTYPE"
        exit 1
    fi
    
    log_info "Detected OS: $OS $OS_VERSION"
}

# Check if running as root
check_root() {
    if [ "$EUID" -eq 0 ]; then
        log_warning "Running as root. This is not recommended for development."
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Install Node.js
install_nodejs() {
    log_info "Checking Node.js installation..."
    
    if command -v node &> /dev/null; then
        NODE_CURRENT=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_CURRENT" -ge "$NODE_VERSION" ]; then
            log_success "Node.js $(node -v) is already installed"
            return
        fi
    fi
    
    log_info "Installing Node.js $NODE_VERSION..."
    
    if [[ "$OS" == "ubuntu" ]] || [[ "$OS" == "debian" ]] || [[ "$IS_RASPBERRY_PI" == true ]]; then
        curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [[ "$OS" == "macos" ]]; then
        if ! command -v brew &> /dev/null; then
            log_error "Homebrew is required for macOS. Install from https://brew.sh"
            exit 1
        fi
        brew install node@${NODE_VERSION}
    else
        log_error "Automatic Node.js installation not supported for $OS"
        log_info "Please install Node.js $NODE_VERSION manually from https://nodejs.org"
        exit 1
    fi
    
    log_success "Node.js installed successfully"
}

# Install PostgreSQL
install_postgresql() {
    log_info "Checking PostgreSQL installation..."
    
    if command -v psql &> /dev/null; then
        log_success "PostgreSQL is already installed"
        return
    fi
    
    log_info "Installing PostgreSQL..."
    
    if [[ "$OS" == "ubuntu" ]] || [[ "$OS" == "debian" ]] || [[ "$IS_RASPBERRY_PI" == true ]]; then
        sudo apt-get update
        sudo apt-get install -y postgresql postgresql-contrib
        sudo systemctl start postgresql
        sudo systemctl enable postgresql
    elif [[ "$OS" == "macos" ]]; then
        brew install postgresql@${POSTGRES_VERSION}
        brew services start postgresql@${POSTGRES_VERSION}
    else
        log_error "Automatic PostgreSQL installation not supported for $OS"
        log_info "Please install PostgreSQL manually"
        exit 1
    fi
    
    log_success "PostgreSQL installed successfully"
}

# Setup database
setup_database() {
    log_info "Setting up database..."
    
    # Read database configuration
    if [ -f "$APP_DIR/.env.local" ]; then
        source "$APP_DIR/.env.local"
    else
        log_warning ".env.local not found. Creating from template..."
        if [ -f "$APP_DIR/.env.example" ]; then
            cp "$APP_DIR/.env.example" "$APP_DIR/.env.local"
        fi
    fi
    
    # Create database user and database
    DB_NAME="${DATABASE_NAME:-universe_empire}"
    DB_USER="${DATABASE_USER:-gamemaster}"
    DB_PASS="${DATABASE_PASSWORD:-$(openssl rand -base64 32)}"
    
    log_info "Creating database: $DB_NAME"
    
    if [[ "$OS" == "macos" ]]; then
        createdb "$DB_NAME" 2>/dev/null || log_warning "Database may already exist"
    else
        sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || log_warning "Database may already exist"
        sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" 2>/dev/null || log_warning "User may already exist"
        sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null
    fi
    
    # Update .env.local with database credentials
    if [ ! -f "$APP_DIR/.env.local" ]; then
        cat > "$APP_DIR/.env.local" << EOF
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME
NODE_ENV=development
PORT=3000
SESSION_SECRET=$(openssl rand -base64 32)
EOF
    fi
    
    log_success "Database setup complete"
}

# Install dependencies
install_dependencies() {
    log_info "Installing Node.js dependencies..."
    
    cd "$APP_DIR/Universe-Empire-Dominion"
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    log_success "Dependencies installed successfully"
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."
    
    cd "$APP_DIR/Universe-Empire-Dominion"
    npm run db:push || log_warning "Migration may have failed"
    
    log_success "Migrations complete"
}

# Create systemd service (Linux only)
create_systemd_service() {
    if [[ "$OS" != "macos" ]] && command -v systemctl &> /dev/null; then
        log_info "Creating systemd service..."
        
        sudo tee /etc/systemd/system/universe-empire.service > /dev/null << EOF
[Unit]
Description=Universe Empire Dominion Game Server
After=network.target postgresql.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$APP_DIR/Universe-Empire-Dominion
Environment=NODE_ENV=production
ExecStart=$(which node) $APP_DIR/Universe-Empire-Dominion/server/index.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
        
        sudo systemctl daemon-reload
        sudo systemctl enable universe-empire.service
        
        log_success "Systemd service created"
        log_info "Start with: sudo systemctl start universe-empire"
        log_info "Stop with: sudo systemctl stop universe-empire"
        log_info "Status: sudo systemctl status universe-empire"
    fi
}

# Create launchd service (macOS only)
create_launchd_service() {
    if [[ "$OS" == "macos" ]]; then
        log_info "Creating launchd service..."
        
        PLIST_PATH="$HOME/Library/LaunchAgents/com.universe-empire.server.plist"
        
        cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.universe-empire.server</string>
    <key>ProgramArguments</key>
    <array>
        <string>$(which node)</string>
        <string>$APP_DIR/Universe-Empire-Dominion/server/index.js</string>
    </array>
    <key>WorkingDirectory</key>
    <string>$APP_DIR/Universe-Empire-Dominion</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$HOME/Library/Logs/universe-empire.log</string>
    <key>StandardErrorPath</key>
    <string>$HOME/Library/Logs/universe-empire-error.log</string>
</dict>
</plist>
EOF
        
        launchctl load "$PLIST_PATH" 2>/dev/null || log_warning "Service may already be loaded"
        
        log_success "Launchd service created"
        log_info "Start with: launchctl start com.universe-empire.server"
        log_info "Stop with: launchctl stop com.universe-empire.server"
    fi
}

# Create management scripts
create_management_scripts() {
    log_info "Creating management scripts..."
    
    # Start script
    cat > "$APP_DIR/start-server.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/Universe-Empire-Dominion"
npm run dev
EOF
    chmod +x "$APP_DIR/start-server.sh"
    
    # Stop script
    cat > "$APP_DIR/stop-server.sh" << 'EOF'
#!/bin/bash
pkill -f "node.*server/index"
echo "Server stopped"
EOF
    chmod +x "$APP_DIR/stop-server.sh"
    
    # Status script
    cat > "$APP_DIR/status-server.sh" << 'EOF'
#!/bin/bash
if pgrep -f "node.*server/index" > /dev/null; then
    echo "Server is running"
    pgrep -f "node.*server/index" | xargs ps -p
else
    echo "Server is not running"
fi
EOF
    chmod +x "$APP_DIR/status-server.sh"
    
    log_success "Management scripts created"
}

# Print completion message
print_completion() {
    log_success "Installation complete!"
    echo ""
    echo "=========================================="
    echo "  $APP_NAME"
    echo "=========================================="
    echo ""
    echo "Quick Start:"
    echo "  1. Start server: ./start-server.sh"
    echo "  2. Open browser: http://localhost:3000"
    echo "  3. Stop server: ./stop-server.sh"
    echo ""
    echo "Management:"
    echo "  - Check status: ./status-server.sh"
    if [[ "$OS" != "macos" ]] && command -v systemctl &> /dev/null; then
        echo "  - System service: sudo systemctl start universe-empire"
    elif [[ "$OS" == "macos" ]]; then
        echo "  - System service: launchctl start com.universe-empire.server"
    fi
    echo ""
    echo "Configuration:"
    echo "  - Edit: Universe-Empire-Dominion/.env.local"
    echo "  - Database: $DB_NAME"
    echo ""
    echo "Documentation:"
    echo "  - README: Universe-Empire-Dominion/README.md"
    echo "  - API Docs: Universe-Empire-Dominion/docs/"
    echo ""
    log_info "Happy gaming!"
}

# Main installation flow
main() {
    echo "=========================================="
    echo "  $APP_NAME - Installation"
    echo "=========================================="
    echo ""
    
    detect_os
    check_root
    
    log_info "Starting installation..."
    
    install_nodejs
    install_postgresql
    setup_database
    install_dependencies
    run_migrations
    create_management_scripts
    create_systemd_service
    create_launchd_service
    
    print_completion
}

# Run main installation
main "$@"

# Made with Bob
