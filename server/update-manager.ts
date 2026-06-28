// Server-side Update Manager
// Handles version control, patch distribution, and automatic updates

import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);

interface Version {
  major: number;
  minor: number;
  patch: number;
  build?: string;
}

interface UpdateManifest {
  version: string;
  releaseDate: string;
  changelog: string[];
  files: UpdateFile[];
  checksum: string;
  critical: boolean;
  minVersion?: string;
}

interface UpdateFile {
  path: string;
  hash: string;
  size: number;
  type: 'add' | 'modify' | 'delete';
}

interface ClientVersion {
  userId: string;
  version: string;
  lastUpdate: Date;
  platform: string;
}

export class UpdateManager {
  private static instance: UpdateManager;
  private currentVersion: Version;
  private updatePath: string;
  private manifestPath: string;
  private clientVersions: Map<string, ClientVersion>;

  private constructor() {
    this.currentVersion = this.loadVersion();
    this.updatePath = path.join(__dirname, '..', 'updates');
    this.manifestPath = path.join(this.updatePath, 'manifest.json');
    this.clientVersions = new Map();
    this.ensureUpdateDirectory();
  }

  static getInstance(): UpdateManager {
    if (!UpdateManager.instance) {
      UpdateManager.instance = new UpdateManager();
    }
    return UpdateManager.instance;
  }

  // Load current version from package.json
  private loadVersion(): Version {
    try {
      const packagePath = path.join(__dirname, '..', 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      const [major, minor, patch] = packageJson.version.split('.').map(Number);
      return { major, minor, patch, build: packageJson.build };
    } catch (error) {
      console.error('Failed to load version:', error);
      return { major: 1, minor: 0, patch: 0 };
    }
  }

  // Ensure update directory exists
  private ensureUpdateDirectory(): void {
    if (!fs.existsSync(this.updatePath)) {
      fs.mkdirSync(this.updatePath, { recursive: true });
    }
  }

  // Get current version string
  getVersionString(): string {
    const { major, minor, patch, build } = this.currentVersion;
    return build ? `${major}.${minor}.${patch}+${build}` : `${major}.${minor}.${patch}`;
  }

  // Compare versions
  compareVersions(v1: string, v2: string): number {
    const parse = (v: string) => v.split('.').map(Number);
    const [major1, minor1, patch1] = parse(v1);
    const [major2, minor2, patch2] = parse(v2);

    if (major1 !== major2) return major1 - major2;
    if (minor1 !== minor2) return minor1 - minor2;
    return patch1 - patch2;
  }

  // Check if update is available
  async checkForUpdates(clientVersion: string): Promise<{
    available: boolean;
    version?: string;
    manifest?: UpdateManifest;
  }> {
    const serverVersion = this.getVersionString();
    
    if (this.compareVersions(serverVersion, clientVersion) > 0) {
      const manifest = await this.loadManifest();
      return {
        available: true,
        version: serverVersion,
        manifest: manifest ?? undefined
      };
    }

    return { available: false };
  }

  // Load update manifest
  private async loadManifest(): Promise<UpdateManifest | null> {
    try {
      if (fs.existsSync(this.manifestPath)) {
        const data = fs.readFileSync(this.manifestPath, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load manifest:', error);
    }
    return null;
  }

  // Create update manifest
  async createManifest(changelog: string[], critical: boolean = false): Promise<UpdateManifest> {
    const version = this.getVersionString();
    const files = await this.scanChangedFiles();
    
    const manifest: UpdateManifest = {
      version,
      releaseDate: new Date().toISOString(),
      changelog,
      files,
      checksum: this.generateChecksum(files),
      critical
    };

    // Save manifest
    fs.writeFileSync(this.manifestPath, JSON.stringify(manifest, null, 2));
    
    return manifest;
  }

  // Scan for changed files
  private async scanChangedFiles(): Promise<UpdateFile[]> {
    const files: UpdateFile[] = [];
    const clientDir = path.join(__dirname, '..', 'client', 'dist');
    
    if (fs.existsSync(clientDir)) {
      const scanDir = (dir: string, baseDir: string = '') => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relativePath = path.join(baseDir, entry.name);
          
          if (entry.isDirectory()) {
            scanDir(fullPath, relativePath);
          } else {
            const stats = fs.statSync(fullPath);
            const hash = this.hashFile(fullPath);
            
            files.push({
              path: relativePath.replace(/\\/g, '/'),
              hash,
              size: stats.size,
              type: 'modify'
            });
          }
        }
      };
      
      scanDir(clientDir);
    }
    
    return files;
  }

  // Generate file hash
  private hashFile(filepath: string): string {
    const content = fs.readFileSync(filepath);
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  // Generate manifest checksum
  private generateChecksum(files: UpdateFile[]): string {
    const data = files.map(f => `${f.path}:${f.hash}`).join('|');
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Create patch package
  async createPatch(version: string, changelog: string[]): Promise<string> {
    const manifest = await this.createManifest(changelog);
    const patchDir = path.join(this.updatePath, version);
    
    if (!fs.existsSync(patchDir)) {
      fs.mkdirSync(patchDir, { recursive: true });
    }

    // Copy changed files to patch directory
    const clientDir = path.join(__dirname, '..', 'client', 'dist');
    
    for (const file of manifest.files) {
      const sourcePath = path.join(clientDir, file.path);
      const destPath = path.join(patchDir, file.path);
      const destDir = path.dirname(destPath);
      
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
      }
    }

    // Copy manifest to patch directory
    fs.copyFileSync(this.manifestPath, path.join(patchDir, 'manifest.json'));

    return patchDir;
  }

  // Apply patch (for server-side updates)
  async applyPatch(patchPath: string): Promise<boolean> {
    try {
      const manifestPath = path.join(patchPath, 'manifest.json');
      const manifest: UpdateManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      
      const clientDir = path.join(__dirname, '..', 'client', 'dist');
      
      for (const file of manifest.files) {
        const sourcePath = path.join(patchPath, file.path);
        const destPath = path.join(clientDir, file.path);
        
        if (file.type === 'delete') {
          if (fs.existsSync(destPath)) {
            fs.unlinkSync(destPath);
          }
        } else if (fs.existsSync(sourcePath)) {
          const destDir = path.dirname(destPath);
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }
          fs.copyFileSync(sourcePath, destPath);
        }
      }

      // Update version
      this.currentVersion = this.parseVersion(manifest.version);
      
      return true;
    } catch (error) {
      console.error('Failed to apply patch:', error);
      return false;
    }
  }

  // Parse version string
  private parseVersion(versionStr: string): Version {
    const [version, build] = versionStr.split('+');
    const [major, minor, patch] = version.split('.').map(Number);
    return { major, minor, patch, build };
  }

  // Track client version
  trackClientVersion(userId: string, version: string, platform: string): void {
    this.clientVersions.set(userId, {
      userId,
      version,
      lastUpdate: new Date(),
      platform
    });
  }

  // Get client statistics
  getClientStats(): {
    total: number;
    byVersion: Record<string, number>;
    byPlatform: Record<string, number>;
  } {
    const stats = {
      total: this.clientVersions.size,
      byVersion: {} as Record<string, number>,
      byPlatform: {} as Record<string, number>
    };

    for (const client of this.clientVersions.values()) {
      stats.byVersion[client.version] = (stats.byVersion[client.version] || 0) + 1;
      stats.byPlatform[client.platform] = (stats.byPlatform[client.platform] || 0) + 1;
    }

    return stats;
  }

  // Build client (for development)
  async buildClient(): Promise<boolean> {
    try {
      console.log('Building client...');
      const { stdout, stderr } = await execAsync('npm run build:client', {
        cwd: path.join(__dirname, '..')
      });
      
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      
      return true;
    } catch (error) {
      console.error('Client build failed:', error);
      return false;
    }
  }

  // API Routes
  setupRoutes(app: any): void {
    // Check for updates
    app.get('/api/updates/check', async (req: Request, res: Response) => {
      try {
        const clientVersion = req.query.version as string || '0.0.0';
        const platform = req.query.platform as string || 'unknown';
        
        if (req.user && (req.user as any).id) {
          this.trackClientVersion((req.user as any).id, clientVersion, platform);
        }

        const update = await this.checkForUpdates(clientVersion);
        res.json(update);
      } catch (error) {
        res.status(500).json({ error: 'Failed to check for updates' });
      }
    });

    // Get current version
    app.get('/api/updates/version', (req: Request, res: Response) => {
      res.json({
        version: this.getVersionString(),
        ...this.currentVersion
      });
    });

    // Download update manifest
    app.get('/api/updates/manifest', async (req: Request, res: Response) => {
      try {
        const manifest = await this.loadManifest();
        if (manifest) {
          res.json(manifest);
        } else {
          res.status(404).json({ error: 'No manifest available' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to load manifest' });
      }
    });

    // Download update file
    app.get('/api/updates/download/:version/:file(*)', (req: Request, res: Response) => {
      try {
        const { version, file } = req.params;
        const filePath = path.join(this.updatePath, version, file);
        
        if (fs.existsSync(filePath)) {
          res.sendFile(filePath);
        } else {
          res.status(404).json({ error: 'File not found' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to download file' });
      }
    });

    // Create new patch (admin only)
    app.post('/api/updates/create-patch', async (req: Request, res: Response) => {
      try {
        // Check admin permission
        if (!req.user || !(req.user as any).isAdmin) {
          return res.status(403).json({ error: 'Admin access required' });
        }

        const { version, changelog, critical } = req.body;
        
        // Build client first
        const buildSuccess = await this.buildClient();
        if (!buildSuccess) {
          return res.status(500).json({ error: 'Client build failed' });
        }

        // Create patch
        const patchPath = await this.createPatch(version, changelog);
        
        res.json({
          success: true,
          version,
          patchPath,
          message: 'Patch created successfully'
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to create patch' });
      }
    });

    // Get client statistics (admin only)
    app.get('/api/updates/stats', (req: Request, res: Response) => {
      try {
        if (!req.user || !(req.user as any).isAdmin) {
          return res.status(403).json({ error: 'Admin access required' });
        }

        const stats = this.getClientStats();
        res.json(stats);
      } catch (error) {
        res.status(500).json({ error: 'Failed to get statistics' });
      }
    });
  }
}

// Export singleton instance
export const updateManager = UpdateManager.getInstance();

// Made with Bob
