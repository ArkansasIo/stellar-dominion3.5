// Client-side Update Handler
// Manages automatic updates and version checking

interface UpdateInfo {
  available: boolean;
  version?: string;
  manifest?: UpdateManifest;
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

interface UpdateProgress {
  stage: 'checking' | 'downloading' | 'installing' | 'complete' | 'error';
  progress: number;
  message: string;
  error?: string;
}

export class UpdateClient {
  private static instance: UpdateClient;
  private currentVersion: string;
  private checkInterval: number = 3600000; // 1 hour
  private intervalId?: number;
  private listeners: Set<(progress: UpdateProgress) => void>;

  private constructor() {
    this.currentVersion = this.loadVersion();
    this.listeners = new Set();
  }

  static getInstance(): UpdateClient {
    if (!UpdateClient.instance) {
      UpdateClient.instance = new UpdateClient();
    }
    return UpdateClient.instance;
  }

  // Load current version from package.json or localStorage
  private loadVersion(): string {
    try {
      // Try to get from localStorage first (for installed apps)
      const stored = localStorage.getItem('app_version');
      if (stored) return stored;

      // Fallback to hardcoded version
      return '1.0.0';
    } catch (error) {
      console.error('Failed to load version:', error);
      return '1.0.0';
    }
  }

  // Get current version
  getVersion(): string {
    return this.currentVersion;
  }

  // Set version
  setVersion(version: string): void {
    this.currentVersion = version;
    try {
      localStorage.setItem('app_version', version);
    } catch (error) {
      console.error('Failed to save version:', error);
    }
  }

  // Add progress listener
  onProgress(callback: (progress: UpdateProgress) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify listeners
  private notify(progress: UpdateProgress): void {
    this.listeners.forEach(listener => listener(progress));
  }

  // Check for updates
  async checkForUpdates(silent: boolean = false): Promise<UpdateInfo> {
    try {
      if (!silent) {
        this.notify({
          stage: 'checking',
          progress: 0,
          message: 'Checking for updates...'
        });
      }

      const platform = this.detectPlatform();
      const response = await fetch(
        `/api/updates/check?version=${this.currentVersion}&platform=${platform}`
      );

      if (!response.ok) {
        throw new Error('Failed to check for updates');
      }

      const updateInfo: UpdateInfo = await response.json();

      if (!silent && updateInfo.available) {
        this.notify({
          stage: 'checking',
          progress: 100,
          message: `Update available: ${updateInfo.version}`
        });
      }

      return updateInfo;
    } catch (error) {
      console.error('Update check failed:', error);
      if (!silent) {
        this.notify({
          stage: 'error',
          progress: 0,
          message: 'Failed to check for updates',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      return { available: false };
    }
  }

  // Download and install update
  async installUpdate(updateInfo: UpdateInfo): Promise<boolean> {
    if (!updateInfo.available || !updateInfo.manifest) {
      return false;
    }

    try {
      this.notify({
        stage: 'downloading',
        progress: 0,
        message: 'Downloading update...'
      });

      const manifest = updateInfo.manifest;
      const totalFiles = manifest.files.length;
      let downloadedFiles = 0;

      // Download each file
      for (const file of manifest.files) {
        await this.downloadFile(manifest.version, file);
        downloadedFiles++;
        
        this.notify({
          stage: 'downloading',
          progress: (downloadedFiles / totalFiles) * 100,
          message: `Downloading: ${file.path}`
        });
      }

      // Install update
      this.notify({
        stage: 'installing',
        progress: 0,
        message: 'Installing update...'
      });

      await this.applyUpdate(manifest);

      // Update version
      this.setVersion(manifest.version);

      this.notify({
        stage: 'complete',
        progress: 100,
        message: 'Update installed successfully'
      });

      // Show changelog
      this.showChangelog(manifest);

      return true;
    } catch (error) {
      console.error('Update installation failed:', error);
      this.notify({
        stage: 'error',
        progress: 0,
        message: 'Failed to install update',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  // Download single file
  private async downloadFile(version: string, file: UpdateFile): Promise<void> {
    const response = await fetch(`/api/updates/download/${version}/${file.path}`);
    
    if (!response.ok) {
      throw new Error(`Failed to download ${file.path}`);
    }

    const blob = await response.blob();
    
    // Store in cache or IndexedDB for later installation
    await this.cacheFile(file.path, blob);
  }

  // Cache file for installation
  private async cacheFile(path: string, blob: Blob): Promise<void> {
    try {
      const cache = await caches.open('updates-cache');
      const response = new Response(blob);
      await cache.put(`/update/${path}`, response);
    } catch (error) {
      console.error('Failed to cache file:', error);
      throw error;
    }
  }

  // Apply update (reload required)
  private async applyUpdate(manifest: UpdateManifest): Promise<void> {
    // For web apps, we need to reload to get new files
    // For desktop apps, files are already downloaded and cached
    
    // Clear old cache
    const cacheNames = await caches.keys();
    for (const name of cacheNames) {
      if (name !== 'updates-cache') {
        await caches.delete(name);
      }
    }

    // Store update info
    localStorage.setItem('pending_update', JSON.stringify(manifest));
  }

  // Show changelog
  private showChangelog(manifest: UpdateManifest): void {
    const changelog = manifest.changelog.join('\n• ');
    console.log(`
╔════════════════════════════════════════╗
║  Update ${manifest.version} Installed  ║
╚════════════════════════════════════════╝

What's New:
• ${changelog}

Released: ${new Date(manifest.releaseDate).toLocaleDateString()}
    `);
  }

  // Detect platform
  private detectPlatform(): string {
    const ua = navigator.userAgent.toLowerCase();
    
    if (ua.includes('electron')) return 'desktop';
    if (ua.includes('win')) return 'windows';
    if (ua.includes('mac')) return 'macos';
    if (ua.includes('linux')) return 'linux';
    if (ua.includes('android')) return 'android';
    if (ua.includes('iphone') || ua.includes('ipad')) return 'ios';
    
    return 'web';
  }

  // Start automatic update checking
  startAutoCheck(interval: number = this.checkInterval): void {
    this.stopAutoCheck();
    
    // Check immediately
    this.checkForUpdates(true);
    
    // Then check periodically
    this.intervalId = window.setInterval(() => {
      this.checkForUpdates(true).then(updateInfo => {
        if (updateInfo.available && updateInfo.manifest?.critical) {
          // Auto-install critical updates
          this.installUpdate(updateInfo);
        }
      });
    }, interval);
  }

  // Stop automatic update checking
  stopAutoCheck(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  // Check if reload is needed
  needsReload(): boolean {
    return localStorage.getItem('pending_update') !== null;
  }

  // Complete update (after reload)
  completeUpdate(): void {
    const pending = localStorage.getItem('pending_update');
    if (pending) {
      const manifest: UpdateManifest = JSON.parse(pending);
      this.showChangelog(manifest);
      localStorage.removeItem('pending_update');
    }
  }

  // Get server version
  async getServerVersion(): Promise<string | null> {
    try {
      const response = await fetch('/api/updates/version');
      if (response.ok) {
        const data = await response.json();
        return data.version;
      }
    } catch (error) {
      console.error('Failed to get server version:', error);
    }
    return null;
  }
}

// Export singleton instance
export const updateClient = UpdateClient.getInstance();

// Auto-start update checking when module loads
if (typeof window !== 'undefined') {
  updateClient.startAutoCheck();
  
  // Complete any pending updates
  window.addEventListener('load', () => {
    updateClient.completeUpdate();
  });
}

// Made with Bob
