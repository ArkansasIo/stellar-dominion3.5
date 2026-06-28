import { existsSync, readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';
import { join, relative, resolve } from 'path';

export interface FileIntegrityInfo {
  path: string;
  checksum: string;
  size: number;
  modifiedAt: Date;
  status: 'ok' | 'modified' | 'missing' | 'new';
}

export class IntegrityService {
  private static instance: IntegrityService;
  private checksumFile: string;
  private storedChecksums: Map<string, string> = new Map();

  private defaultDirectories = ['server', 'shared', 'client/src'];
  private projectRoot: string;

  private constructor() {
    this.projectRoot = resolve(process.cwd());
    this.checksumFile = join(this.projectRoot, 'data', 'checksums.json');
    this.ensureDataDirectory();
  }

  static getInstance(): IntegrityService {
    if (!IntegrityService.instance) {
      IntegrityService.instance = new IntegrityService();
    }
    return IntegrityService.instance;
  }

  private ensureDataDirectory(): void {
    const dir = join(this.projectRoot, 'data');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  scanDirectory(dir?: string, baseDir?: string): FileIntegrityInfo[] {
    const scanPath = dir ? resolve(this.projectRoot, dir) : this.projectRoot;
    const base = baseDir ? resolve(this.projectRoot, baseDir) : this.projectRoot;
    const results: FileIntegrityInfo[] = [];

    if (!existsSync(scanPath)) return results;

    const entries = readdirSync(scanPath);
    for (const entry of entries) {
      const fullPath = join(scanPath, entry);
      const relPath = relative(base, fullPath).replace(/\\/g, '/');

      try {
        const stats = statSync(fullPath);
        if (stats.isDirectory()) {
          if (entry === 'node_modules' || entry.startsWith('.')) continue;
          results.push(...this.scanDirectory(fullPath, base));
        } else if (stats.isFile()) {
          const checksum = this.checksum(fullPath);
          results.push({
            path: relPath,
            checksum,
            size: stats.size,
            modifiedAt: stats.mtime,
            status: 'ok',
          });
        }
      } catch {
        continue;
      }
    }

    return results;
  }

  async generateChecksums(): Promise<FileIntegrityInfo[]> {
    const results: FileIntegrityInfo[] = [];
    for (const dir of this.defaultDirectories) {
      const dirPath = join(this.projectRoot, dir);
      if (existsSync(dirPath)) {
        results.push(...this.scanDirectory(dirPath, this.projectRoot));
      }
    }
    return results;
  }

  async saveSnapshot(): Promise<void> {
    const files = await this.generateChecksums();
    const snapshot: Record<string, { checksum: string; size: number; modifiedAt: string }> = {};

    for (const file of files) {
      snapshot[file.path] = {
        checksum: file.checksum,
        size: file.size,
        modifiedAt: file.modifiedAt.toISOString(),
      };
    }

    const dir = join(this.projectRoot, 'data');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(this.checksumFile, JSON.stringify(snapshot, null, 2), 'utf-8');
    this.storedChecksums.clear();
    for (const [path, data] of Object.entries(snapshot)) {
      this.storedChecksums.set(path, data.checksum);
    }
  }

  async loadSnapshot(): Promise<void> {
    this.storedChecksums.clear();
    if (!existsSync(this.checksumFile)) return;

    try {
      const content = readFileSync(this.checksumFile, 'utf-8');
      const snapshot = JSON.parse(content) as Record<string, { checksum: string }>;
      for (const [path, data] of Object.entries(snapshot)) {
        this.storedChecksums.set(path, data.checksum);
      }
    } catch {
      this.storedChecksums.clear();
    }
  }

  async verify(): Promise<{ ok: FileIntegrityInfo[]; modified: FileIntegrityInfo[]; missing: FileIntegrityInfo[]; new: FileIntegrityInfo[] }> {
    await this.loadSnapshot();
    const currentFiles = await this.generateChecksums();
    const currentPaths = new Map(currentFiles.map(f => [f.path, f]));

    const ok: FileIntegrityInfo[] = [];
    const modified: FileIntegrityInfo[] = [];
    const missing: FileIntegrityInfo[] = [];
    const newFiles: FileIntegrityInfo[] = [];

    for (const [storedPath, storedChecksum] of Array.from(this.storedChecksums.entries())) {
      const current = currentPaths.get(storedPath);
      if (!current) {
        const fullPath = join(this.projectRoot, storedPath);
        let size = 0;
        let modifiedAt = new Date(0);
        try {
          if (existsSync(fullPath)) {
            const stats = statSync(fullPath);
            size = stats.size;
            modifiedAt = stats.mtime;
          }
        } catch {
          // file is gone
        }
        missing.push({
          path: storedPath,
          checksum: storedChecksum,
          size,
          modifiedAt,
          status: 'missing',
        });
      } else if (current.checksum !== storedChecksum) {
        modified.push({ ...current, status: 'modified' });
      } else {
        ok.push(current);
      }
    }

    for (const current of currentFiles) {
      if (!Array.from(this.storedChecksums.keys()).includes(current.path)) {
        newFiles.push({ ...current, status: 'new' });
      }
    }

    return { ok, modified, missing, new: newFiles };
  }

  checksum(filePath: string): string {
    const content = readFileSync(filePath);
    return createHash('sha256').update(content).digest('hex');
  }

  async getReport(): Promise<{ passed: number; failed: number; total: number; issues: FileIntegrityInfo[] }> {
    const result = await this.verify();
    const issues = [...result.modified, ...result.missing, ...result.new];
    const passed = result.ok.length;
    const failed = issues.length;
    const total = passed + failed;

    return { passed, failed, total, issues };
  }
}

export default IntegrityService;
