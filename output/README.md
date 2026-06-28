# Universe Empire Dominion - Executable Distribution

## 📦 Package Contents

This folder contains standalone executables for Universe Empire Dominion:

### Server Backend (`server/`)
- **UniverseEmpireDominion-windows.exe** - Server executable for Windows
- Handles all game logic, database operations, and API endpoints
- Must be running for the game to work

### Client Frontend (`client/`)
- **UniverseEmpireDominion-Client-windows.exe** - Client launcher for Windows
- Opens the game in your default web browser
- Connects to the server automatically

## 🚀 Quick Start Guide

### Step 1: Start the Server
1. Navigate to the `server/` folder
2. Double-click `UniverseEmpireDominion-windows.exe`
3. Wait for the message: "Server running on http://localhost:3000"
4. Keep this window open while playing

### Step 2: Launch the Client
1. Navigate to the `client/` folder
2. Double-click `UniverseEmpireDominion-Client-windows.exe`
3. The game will open in your default web browser
4. You can close the client launcher window after the browser opens

### Alternative: Manual Browser Access
If the client launcher doesn't work, you can manually open your browser and go to:
```
http://localhost:3000
```

## ⚙️ System Requirements

### Minimum Requirements
- **OS**: Windows 10 or later
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB free space
- **Database**: PostgreSQL 14+ (must be installed separately)
- **Browser**: Chrome, Firefox, Edge, or Safari (latest version)

### Required Software
1. **PostgreSQL 14+**
   - Download: https://www.postgresql.org/download/
   - Create a database named: `universe_empire`

2. **Web Browser**
   - Any modern browser (Chrome recommended)

## 🔧 Configuration

### Database Setup
1. Install PostgreSQL
2. Create database:
   ```sql
   CREATE DATABASE universe_empire;
   ```
3. Create `.env.local` file in the server folder:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/universe_empire
   PORT=3000
   NODE_ENV=production
   SESSION_SECRET=your-secret-key-here
   ```

### Environment Variables
Create a `.env.local` file next to the server executable with:

```env
# Database Connection
DATABASE_URL=postgresql://postgres:password@localhost:5432/universe_empire

# Server Configuration
PORT=3000
NODE_ENV=production

# Security
SESSION_SECRET=change-this-to-a-random-secret-key

# Optional: Enable debug logging
DEBUG=false
```

## 🎮 Game Features

The application includes:
- **Full Web Interface** - Modern, responsive UI
- **Real-time Updates** - WebSocket support for live game updates
- **Database Management** - PostgreSQL backend with full CRUD operations
- **Admin Panel** - Database administration interface (similar to phpMyAdmin)
- **API Endpoints** - RESTful API for all game operations
- **Session Management** - Secure user authentication and sessions

### Admin Interface
Access the admin panel at: `http://localhost:3000/admin`
- Database viewer and editor
- User management
- Game configuration
- Server diagnostics

## 📝 Usage Instructions

### Starting the Game
1. **First Time Setup**:
   - Install PostgreSQL
   - Create database
   - Configure `.env.local`
   - Run server executable
   - Run client launcher

2. **Regular Use**:
   - Start server executable
   - Launch client or open browser to http://localhost:3000
   - Play!

### Stopping the Game
1. Close the browser tab
2. Close the server window (or press Ctrl+C)

## 🔍 Troubleshooting

### Server Won't Start
- **Check PostgreSQL**: Ensure PostgreSQL service is running
- **Check Port**: Make sure port 3000 is not in use
- **Check Database**: Verify database exists and credentials are correct
- **Check Logs**: Look at server console output for error messages

### Client Can't Connect
- **Server Running**: Ensure server executable is running
- **Firewall**: Check if Windows Firewall is blocking port 3000
- **Browser**: Try a different browser
- **Manual Access**: Open http://localhost:3000 directly in browser

### Database Errors
- **Connection Failed**: Check DATABASE_URL in .env.local
- **Permission Denied**: Verify PostgreSQL user has correct permissions
- **Database Not Found**: Create the database using PostgreSQL tools

### Performance Issues
- **Close Other Apps**: Free up system resources
- **Check RAM**: Ensure you have enough available memory
- **Database Size**: Large databases may slow down queries
- **Browser Cache**: Clear browser cache and cookies

## 📚 Additional Resources

### Documentation
- Full documentation available in the `docs/` folder
- API documentation: `docs/API_COMPLETE_GUIDE.md`
- Developer guide: `docs/DEVELOPER_GUIDE.md`

### Support
- Check the README.md in the main project folder
- Review troubleshooting guides in docs/
- Check server console for error messages

## 🔐 Security Notes

1. **Change Default Secrets**: Always change SESSION_SECRET in production
2. **Database Security**: Use strong PostgreSQL passwords
3. **Firewall**: Only expose port 3000 if needed for network play
4. **Updates**: Keep PostgreSQL and your OS updated

## 📊 File Structure

```
output/
├── README.md (this file)
├── server/
│   ├── UniverseEmpireDominion-windows.exe (Server Backend)
│   ├── start-windows.bat (Quick launcher)
│   ├── README.txt (Server-specific instructions)
│   └── package-info.json (Build information)
└── client/
    └── UniverseEmpireDominion-Client-windows.exe (Client Launcher)
```

## 🎯 Features Overview

### Server Backend
- RESTful API endpoints
- WebSocket support for real-time updates
- PostgreSQL database integration
- Session management and authentication
- Admin panel with database viewer
- Game logic and calculations
- Resource management
- Combat system
- Research and technology trees
- Alliance and social features

### Client Interface
- Modern, responsive web UI
- Real-time game updates
- Interactive galaxy map
- Planet management
- Fleet operations
- Research lab
- Market and trading
- Alliance management
- Admin tools (for administrators)

## 🌟 Getting Started Tips

1. **Create an Account**: First time users need to register
2. **Tutorial**: Follow the in-game tutorial for basics
3. **Admin Access**: Use admin panel to manage game settings
4. **Backup**: Regularly backup your PostgreSQL database
5. **Updates**: Check for new versions periodically

## 📞 Need Help?

If you encounter issues:
1. Check this README
2. Review server console output
3. Check PostgreSQL logs
4. Verify .env.local configuration
5. Try restarting both server and client

---

**Version**: 1.0.0  
**Build Date**: 2026-06-15  
**Platform**: Windows x64  
**Node Version**: 18.x

Enjoy playing Universe Empire Dominion! 🚀🌌