import { Router, Request, Response } from 'express';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { randomUUID } from 'crypto';

export interface FeedEntry {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  link: string;
  publishedAt: Date;
  updatedAt: Date;
  category: 'news' | 'update' | 'event' | 'maintenance' | 'announcement';
}

interface StoredEntry {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  link: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
}

export class FeedService {
  private static instance: FeedService;
  private feedFile: string;
  private entries: FeedEntry[] = [];

  private constructor() {
    this.feedFile = join(resolve(process.cwd()), 'data', 'feed.json');
    this.ensureDataDirectory();
  }

  static getInstance(): FeedService {
    if (!FeedService.instance) {
      FeedService.instance = new FeedService();
    }
    return FeedService.instance;
  }

  private ensureDataDirectory(): void {
    const dir = join(resolve(process.cwd()), 'data');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  private async persist(): Promise<void> {
    const data = this.entries.map(e => ({
      ...e,
      publishedAt: e.publishedAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    }));
    writeFileSync(this.feedFile, JSON.stringify(data, null, 2), 'utf-8');
  }

  private async load(): Promise<void> {
    this.entries = [];
    if (!existsSync(this.feedFile)) return;

    try {
      const content = readFileSync(this.feedFile, 'utf-8');
      const parsed = JSON.parse(content) as StoredEntry[];
      this.entries = parsed.map(e => ({
        ...e,
        publishedAt: new Date(e.publishedAt),
        updatedAt: new Date(e.updatedAt),
        category: e.category as FeedEntry['category'],
      }));
    } catch {
      this.entries = [];
    }
  }

  async createEntry(entry: Omit<FeedEntry, 'id' | 'publishedAt' | 'updatedAt'>): Promise<FeedEntry> {
    await this.load();

    const newEntry: FeedEntry = {
      ...entry,
      id: randomUUID(),
      publishedAt: new Date(),
      updatedAt: new Date(),
    };

    this.entries.unshift(newEntry);
    await this.persist();
    return newEntry;
  }

  async getEntry(id: string): Promise<FeedEntry | null> {
    await this.load();
    return this.entries.find(e => e.id === id) || null;
  }

  async updateEntry(id: string, updates: Partial<FeedEntry>): Promise<void> {
    await this.load();
    const index = this.entries.findIndex(e => e.id === id);
    if (index === -1) throw new Error(`Feed entry ${id} not found`);

    this.entries[index] = {
      ...this.entries[index],
      ...updates,
      id,
      updatedAt: new Date(),
    };

    await this.persist();
  }

  async deleteEntry(id: string): Promise<void> {
    await this.load();
    const index = this.entries.findIndex(e => e.id === id);
    if (index === -1) throw new Error(`Feed entry ${id} not found`);

    this.entries.splice(index, 1);
    await this.persist();
  }

  async getEntries(limit?: number, offset?: number, category?: string): Promise<FeedEntry[]> {
    await this.load();

    let filtered = this.entries;
    if (category) {
      filtered = filtered.filter(e => e.category === category);
    }

    const start = offset || 0;
    const end = limit ? start + limit : undefined;
    return filtered.slice(start, end);
  }

  async getRecentEntries(count: number = 10): Promise<FeedEntry[]> {
    return this.getEntries(count, 0);
  }

  generateRSS(entries: FeedEntry[], baseUrl: string): string {
    const items = entries.map(e => `
    <item>
      <guid isPermaLink="false">${this.escapeXml(e.id)}</guid>
      <title>${this.escapeXml(e.title)}</title>
      <link>${this.escapeXml(e.link || `${baseUrl}/feed/${e.id}`)}</link>
      <description>${this.escapeXml(e.description)}</description>
      <author>${this.escapeXml(e.author)}</author>
      <category>${this.escapeXml(e.category)}</category>
      <pubDate>${e.publishedAt.toUTCString()}</pubDate>
    </item>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Universe Empire Dominion News</title>
    <link>${this.escapeXml(baseUrl)}</link>
    <description>Latest news and updates from the universe</description>
    <language>en</language>
    ${items}
  </channel>
</rss>`;
  }

  generateAtom(entries: FeedEntry[], baseUrl: string): string {
    const feedUrl = `${baseUrl}/feed/atom`;
    const updated = entries.length > 0 ? entries[0].updatedAt.toISOString() : new Date().toISOString();

    const items = entries.map(e => `
  <entry>
    <id>${this.escapeXml(e.id)}</id>
    <title>${this.escapeXml(e.title)}</title>
    <link href="${this.escapeXml(e.link || `${baseUrl}/feed/${e.id}`)}" rel="alternate"/>
    <updated>${e.updatedAt.toISOString()}</updated>
    <published>${e.publishedAt.toISOString()}</published>
    <author>
      <name>${this.escapeXml(e.author)}</name>
    </author>
    <category term="${this.escapeXml(e.category)}"/>
    <summary>${this.escapeXml(e.description)}</summary>
    <content type="html">${this.escapeXml(e.content || e.description)}</content>
  </entry>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Universe Empire Dominion News</title>
  <link href="${this.escapeXml(feedUrl)}" rel="self"/>
  <link href="${this.escapeXml(baseUrl)}" rel="alternate"/>
  <id>${this.escapeXml(feedUrl)}</id>
  <updated>${updated}</updated>
  <author>
    <name>Universe Empire Dominion</name>
  </author>
  ${items}
</feed>`;
  }

  generateJSON(entries: FeedEntry[], baseUrl: string): string {
    const items = entries.map(e => ({
      id: e.id,
      url: e.link || `${baseUrl}/feed/${e.id}`,
      title: e.title,
      content_text: e.description,
      content_html: e.content || e.description,
      summary: e.description,
      image: '',
      date_published: e.publishedAt.toISOString(),
      date_modified: e.updatedAt.toISOString(),
      author: { name: e.author },
      tags: [e.category],
    }));

    const feed = {
      version: 'https://jsonfeed.org/version/1',
      title: 'Universe Empire Dominion News',
      home_page_url: baseUrl,
      feed_url: `${baseUrl}/feed/json`,
      description: 'Latest news and updates from the universe',
      language: 'en',
      items,
    };

    return JSON.stringify(feed, null, 2);
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

export function createFeedRouter(baseUrl: string): Router {
  const router = Router();
  const feedService = FeedService.getInstance();

  router.get('/feed/rss', async (_req: Request, res: Response) => {
    try {
      const entries = await feedService.getEntries(50, 0);
      const rss = feedService.generateRSS(entries, baseUrl);
      res.set('Content-Type', 'application/rss+xml; charset=utf-8');
      res.send(rss);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to generate RSS feed' });
    }
  });

  router.get('/feed/atom', async (_req: Request, res: Response) => {
    try {
      const entries = await feedService.getEntries(50, 0);
      const atom = feedService.generateAtom(entries, baseUrl);
      res.set('Content-Type', 'application/atom+xml; charset=utf-8');
      res.send(atom);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to generate Atom feed' });
    }
  });

  router.get('/feed/json', async (_req: Request, res: Response) => {
    try {
      const entries = await feedService.getEntries(50, 0);
      const json = feedService.generateJSON(entries, baseUrl);
      res.set('Content-Type', 'application/feed+json; charset=utf-8');
      res.send(json);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to generate JSON feed' });
    }
  });

  router.get('/api/feed', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : undefined;
      const category = req.query.category as string | undefined;
      const entries = await feedService.getEntries(limit, offset, category);
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch feed entries' });
    }
  });

  router.post('/api/feed', async (req: Request, res: Response) => {
    try {
      const { title, description, content, author, link, category } = req.body;
      if (!title || !description || !author || !category) {
        return res.status(400).json({ message: 'Missing required fields: title, description, author, category' });
      }

      const entry = await feedService.createEntry({
        title,
        description,
        content: content || description,
        author,
        link: link || '',
        category,
      });

      res.status(201).json(entry);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to create feed entry' });
    }
  });

  router.put('/api/feed/:id', async (req: Request, res: Response) => {
    try {
      await feedService.updateEntry(req.params.id, req.body);
      res.json({ success: true });
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Failed to update feed entry' });
    }
  });

  router.delete('/api/feed/:id', async (req: Request, res: Response) => {
    try {
      await feedService.deleteEntry(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Failed to delete feed entry' });
    }
  });

  return router;
}

export default FeedService;
