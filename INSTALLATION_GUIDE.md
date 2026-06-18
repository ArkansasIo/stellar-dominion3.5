# Universe Empire Dominion - Installation & Deployment Guide

Complete guide for installing and deploying Universe Empire Dominion on any platform.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Quick Start](#quick-start)
3. [Platform-Specific Installation](#platform-specific-installation)
4. [Server Management](#server-management)
5. [Configuration](#configuration)
6. [Troubleshooting](#troubleshooting)
7. [Production Deployment](#production-deployment)

---

## System Requirements

### Minimum Requirements
- **CPU**: 2 cores, 2.0 GHz
- **RAM**: 2 GB
- **Storage**: 5 GB free space
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 20.04+, Raspberry Pi OS

### Recommended Requirements
- **CPU**: 4 cores, 3.0 GHz
- **RAM**: 4 GB
- **Storage**: 10 GB free space (SSD recommended)
- **Network**: 10 Mbps upload/download

### Software Requirements
- **Node.js**: 18.x or higher
- **PostgreSQL**: 14.x or higher
- **npm**: 8.x or higher (comes with Node.js)

---

## Quick Start

### Automated Installation

#### Windows
```powershell
# Run PowerShell as Administrator
cd path\to\Universe-Empire-Dominion
.\install.ps1
```

#### Linux / macOS / Raspberry Pi
```bash
# Make script executable
chmod +x install.sh

# Run installation
./install.sh
```

### Manual Installation

1. **Install Node.js**
   - Download from https://nodejs.org
   - Install version 18.x or higher

2. **Install PostgreSQL**
   - Download from https://www.postgresql.org
   - Install version 14.x or higher

3. **Clone/Download Project**
   ```bash
   git clone https://github.com/yourusername/Universe-Empire-Dominion.git
   cd Universe-Empire-Dominion
   ```

4. **Install Dependencies**
   ```bash
   cd Universe-Empire-Dominion
   npm install
   ```

5. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database credentials
   ```

6. **Setup Database**
   ```bash
   npm run db:push
   ```

7. **Start Server**
   ```bash
   npm run dev
   ```

8. **Access Game**
   - Open browser: http://localhost:3000

---

## Platform-Specific Installation

### Windows 10/11

#### Prerequisites
- Windows 10 version 1903+ or Windows 11
- PowerShell 5.1 or higher
- Administrator access (for system service)

#### Installation Steps

1. **Download Installer**
   - Download `install.ps1` from the repository

2. **Run PowerShell as Administrator**
   - Right-click PowerShell
   - Select "Run as Administrator"

3. **Execute Installation Script**
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force
   .\install.ps1
   ```

4. **Installation Process**
   - Installs Chocolatey (package manager)
   - Installs Node.js 18.x
   - Installs PostgreSQL 14.x
   - Creates database
   - Installs dependencies
   - Runs migrations
   - Creates Windows service
   - Creates management scripts

5. **Start Server**
   ```powershell
   # Development mode
   .\start-server.bat
   
   # Or as Windows Service
   Start-Service UniverseEmpireDominion
   ```

#### Windows Service Management

```powershell
# Start service
Start-Service UniverseEmpireDominion

# Stop service
Stop-Service UniverseEmpireDominion

# Restart service
Restart-Service UniverseEmpireDominion

# Check status
Get-Service UniverseEmpireDominion

# View logs
Get-Content Universe-Empire-Dominion\logs\service-output.log -Tail 50
```

#### Using Management Script

```powershell
# Start server
.\manage-server.ps1 -Action start

# Stop server
.\manage-server.ps1 -Action stop

# Restart server
.\manage-server.ps1 -Action restart

# Check status
.\manage-server.ps1 -Action status
```

---

### Linux (Ubuntu/Debian)

#### Prerequisites
- Ubuntu 20.04+ or Debian 11+
- sudo access
- Internet connection

#### Installation Steps

1. **Download Installer**
   ```bash
   wget https://raw.githubusercontent.com/yourusername/Universe-Empire-Dominion/main/install.sh
   chmod +x install.sh
   ```

2. **Run Installation**
   ```bash
   ./install.sh
   ```

3. **Installation Process**
   - Detects OS and version
   - Installs Node.js from NodeSource
   - Installs PostgreSQL from apt
   - Creates database and user
   - Installs dependencies
   - Runs migrations
   - Creates systemd service
   - Creates management scripts

4. **Start Server**
   ```bash
   # Development mode
   ./start-server.sh
   
   # Or as systemd service
   sudo systemctl start universe-empire
   ```

#### Systemd Service Management

```bash
# Start service
sudo systemctl start universe-empire

# Stop service
sudo systemctl stop universe-empire

# Restart service
sudo systemctl restart universe-empire

# Enable on boot
sudo systemctl enable universe-empire

# Check status
sudo systemctl status universe-empire

# View logs
sudo journalctl -u universe-empire -f
```

---

### macOS

#### Prerequisites
- macOS 10.15 (Catalina) or higher
- Homebrew package manager
- Terminal access

#### Installation Steps

1. **Install Homebrew** (if not installed)
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Download and Run Installer**
   ```bash
   curl -O https://raw.githubusercontent.com/yourusername/Universe-Empire-Dominion/main/install.sh
   chmod +x install.sh
   ./install.sh
   ```

3. **Installation Process**
   - Installs Node.js via Homebrew
   - Installs PostgreSQL via Homebrew
   - Creates database
   - Installs dependencies
   - Runs migrations
   - Creates launchd service
   - Creates management scripts

4. **Start Server**
   ```bash
   # Development mode
   ./start-server.sh
   
   # Or as launchd service
   launchctl start com.universe-empire.server
   ```

#### Launchd Service Management

```bash
# Start service
launchctl start com.universe-empire.server

# Stop service
launchctl stop com.universe-empire.server

# Check status
launchctl list | grep universe-empire

# View logs
tail -f ~/Library/Logs/universe-empire.log
```

---

### Raspberry Pi

#### Prerequisites
- Raspberry Pi 3B+ or higher
- Raspberry Pi OS (32-bit or 64-bit)
- 2GB RAM minimum (4GB recommended)
- MicroSD card (16GB minimum, 32GB recommended)
- Internet connection

#### Installation Steps

1. **Update System**
   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```

2. **Download and Run Installer**
   ```bash
   wget https://raw.githubusercontent.com/yourusername/Universe-Empire-Dominion/main/install.sh
   chmod +x install.sh
   ./install.sh
   ```

3. **Installation Process**
   - Detects Raspberry Pi hardware
   - Installs ARM-compatible Node.js
   - Installs PostgreSQL
   - Optimizes for ARM architecture
   - Creates systemd service
   - Creates management scripts

4. **Performance Optimization**
   ```bash
   # Increase swap space (recommended for Pi 3/4 with 2GB RAM)
   sudo dphys-swapfile swapoff
   sudo nano /etc/dphys-swapfile
   # Set CONF_SWAPSIZE=2048
   sudo dphys-swapfile setup
   sudo dphys-swapfile swapon
   ```

5. **Start Server**
   ```bash
   sudo systemctl start universe-empire
   ```

#### Raspberry Pi Specific Notes

- **Performance**: Expect slower performance on Pi 3. Pi 4 with 4GB+ RAM recommended.
- **Storage**: Use SSD via USB 3.0 for better performance (Pi 4 only).
- **Cooling**: Ensure adequate cooling for sustained operation.
- **Power**: Use official power supply (5V 3A for Pi 4).

---

## Server Management

### Development Mode

```bash
# Start development server
npm run dev

# Server runs on http://localhost:3000
# Hot reload enabled
# Debug logging enabled
```

### Production Mode

```bash
# Build for production
npm run build

# Start production server
npm start

# Or use PM2 process manager
npm install -g pm2
pm2 start npm --name "universe-empire" -- start
pm2 save
pm2 startup
```

### Management Scripts

#### Windows
```powershell
# Start
.\start-server.bat

# Stop
.\stop-server.bat

# Status
.\status-server.bat

# Advanced management
.\manage-server.ps1 -Action [start|stop|restart|status]
```

#### Linux/macOS/Raspberry Pi
```bash
# Start
./start-server.sh

# Stop
./stop-server.sh

# Status
./status-server.sh
```

### Admin Panel

Access the admin panel at: http://localhost:3000/admin

**Default Admin Credentials:**
- Username: `admin`
- Password: (set during installation)

**Admin Features:**
- Server statistics and monitoring
- System health checks
- User management
- Database maintenance
- Backup and restore
- Log viewing
- Maintenance mode toggle

---

## Configuration

### Environment Variables

Edit `.env.local` file:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/universe_empire

# Server
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# Security
SESSION_SECRET=your-secret-key-here
JWT_SECRET=your-jwt-secret-here

# Game Settings
TURN_DURATION=3600
MAX_PLAYERS=10000
MAINTENANCE_MODE=false

# Email (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password

# External Services (optional)
REDIS_URL=redis://localhost:6379
SENTRY_DSN=your-sentry-dsn
```

### Database Configuration

```bash
# PostgreSQL connection
DATABASE_URL=postgresql://username:password@host:port/database

# Example for local development
DATABASE_URL=postgresql://gamemaster:password@localhost:5432/universe_empire

# Example for production
DATABASE_URL=postgresql://user:pass@db.example.com:5432/production_db
```

### Port Configuration

Default port is 3000. To change:

1. Edit `.env.local`:
   ```env
   PORT=8080
   ```

2. Update firewall rules:
   ```bash
   # Linux
   sudo ufw allow 8080/tcp
   
   # Windows
   netsh advfirewall firewall add rule name="Universe Empire" dir=in action=allow protocol=TCP localport=8080
   ```

---

## Troubleshooting

### Common Issues

#### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:3000 | xargs kill -9
```

#### Database Connection Failed

**Error**: `Connection refused` or `ECONNREFUSED`

**Solution**:
1. Check PostgreSQL is running:
   ```bash
   # Windows
   Get-Service postgresql*
   
   # Linux
   sudo systemctl status postgresql
   
   # macOS
   brew services list
   ```

2. Verify database credentials in `.env.local`

3. Test connection:
   ```bash
   psql -U username -d database_name
   ```

#### Node.js Version Mismatch

**Error**: `Unsupported engine`

**Solution**:
```bash
# Check current version
node -v

# Install correct version
# Windows (with Chocolatey)
choco install nodejs --version=18.0.0

# Linux/macOS (with nvm)
nvm install 18
nvm use 18
```

#### Permission Denied

**Error**: `EACCES: permission denied`

**Solution**:
```bash
# Linux/macOS
sudo chown -R $USER:$USER .
chmod +x *.sh

# Windows (Run as Administrator)
icacls . /grant Users:F /T
```

#### Out of Memory

**Error**: `JavaScript heap out of memory`

**Solution**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Or in package.json scripts
"start": "node --max-old-space-size=4096 server/index.js"
```

### Log Files

**Windows**:
- Service logs: `Universe-Empire-Dominion\logs\service-output.log`
- Error logs: `Universe-Empire-Dominion\logs\service-error.log`

**Linux**:
- System logs: `/var/log/universe-empire/`
- Systemd logs: `journalctl -u universe-empire`

**macOS**:
- Launchd logs: `~/Library/Logs/universe-empire.log`

### Getting Help

1. Check documentation: `Universe-Empire-Dominion/docs/`
2. View logs for error messages
3. Search issues: https://github.com/yourusername/Universe-Empire-Dominion/issues
4. Create new issue with:
   - OS and version
   - Node.js version
   - Error message
   - Steps to reproduce

---

## Production Deployment

### Security Checklist

- [ ] Change default admin password
- [ ] Set strong SESSION_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set NODE_ENV=production
- [ ] Disable debug logging
- [ ] Set up monitoring

### Recommended Stack

**Web Server**: Nginx or Apache as reverse proxy
**Process Manager**: PM2 or systemd
**Database**: PostgreSQL with replication
**Caching**: Redis
**Monitoring**: Prometheus + Grafana
**Logging**: ELK Stack or Loki

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### SSL/HTTPS Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Database Backup

```bash
# Manual backup
pg_dump universe_empire > backup-$(date +%Y%m%d).sql

# Automated daily backup (cron)
0 2 * * * pg_dump universe_empire > /backups/universe-$(date +\%Y\%m\%d).sql
```

### Monitoring

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "universe-empire" -- start

# Enable monitoring
pm2 install pm2-server-monit

# View dashboard
pm2 monit
```

---

## Updates and Maintenance

### Updating the Game

```bash
# Stop server
./stop-server.sh  # or Stop-Service UniverseEmpireDominion

# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Run migrations
npm run db:push

# Restart server
./start-server.sh  # or Start-Service UniverseEmpireDominion
```

### Database Maintenance

```bash
# Vacuum database
psql -U username -d universe_empire -c "VACUUM ANALYZE;"

# Check database size
psql -U username -d universe_empire -c "SELECT pg_size_pretty(pg_database_size('universe_empire'));"

# Backup before maintenance
pg_dump universe_empire > pre-maintenance-backup.sql
```

---

## Support

For additional help:
- Documentation: `/docs`
- GitHub Issues: https://github.com/yourusername/Universe-Empire-Dominion/issues
- Discord: https://discord.gg/universe-empire
- Email: support@universe-empire.com

---

**Last Updated**: 2024
**Version**: 1.0.0