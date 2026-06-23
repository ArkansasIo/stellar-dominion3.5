/**
 * UnitTaxonomy Page
 * ============================================================================
 * Unit classification and job taxonomy system
 * API: /api/unit-taxonomy/*
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const API_BASE = '/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      credentials: 'include',
    });
    return res.json();
  } catch { return null; }
}

interface JobCategory {
  id: string;
  name: string;
  description: string;
  domain: string;
  icon: string;
}

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  unlocksAtLevel: number;
}

interface UnitTier {
  tier: number;
  name: string;
  powerMultiplier: number;
  defenseMultiplier: number;
}

interface LevelBand {
  band: string;
  minLevel: number;
  maxLevel: number;
  statMultiplier: number;
}

export default function UnitTaxonomy() {
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [tiers, setTiers] = useState<UnitTier[]>([]);
  const [levels, setLevels] = useState<LevelBand[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [metaRes, categoriesRes, subsRes, tiersRes, levelsRes] = await Promise.all([
      fetchApi<any>('/api/unit-taxonomy/meta'),
      fetchApi<any>('/api/unit-taxonomy/categories'),
      fetchApi<any>('/api/unit-taxonomy/subcategories'),
      fetchApi<any>('/api/unit-taxonomy/tiers'),
      fetchApi<any>('/api/unit-taxonomy/levels'),
    ]);
    
    if (metaRes?.success) setMeta(metaRes.meta);
    if (categoriesRes?.success) setCategories(categoriesRes.categories);
    if (subsRes?.success) setSubCategories(subsRes.subCategories);
    if (tiersRes?.success) setTiers(tiersRes.tiers);
    if (levelsRes?.success) setLevels(levelsRes.bands);
    setLoading(false);
  }

  const filteredSubCategories = selectedCategory === 'all'
    ? subCategories
    : subCategories.filter((s) => s.categoryId === selectedCategory);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-32 bg-gray-700 rounded"></div>
            <div className="h-32 bg-gray-700 rounded"></div>
            <div className="h-32 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-blue-400">Unit Taxonomy</h1>
        <p className="text-gray-400">Unit classification and job system</p>
      </div>

      {/* Meta Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta?.categoryCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Sub-Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta?.subCategoryCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Tier Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta?.minTier}-{meta?.maxTier}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Level Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1-{meta?.maxLevel || 999}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="subcategories">Sub-Categories</TabsTrigger>
          <TabsTrigger value="tiers">Tiers</TabsTrigger>
          <TabsTrigger value="levels">Levels</TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Job Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="border rounded-lg p-4 hover:bg-gray-800 cursor-pointer"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    <div className="font-medium">{cat.name}</div>
                    <div className="text-sm text-gray-400">{cat.description}</div>
                    <Badge variant="outline" className="mt-2">
                      {cat.domain}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sub-Categories Tab */}
        <TabsContent value="subcategories">
          <Card>
            <CardHeader>
              <CardTitle>Job Sub-Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredSubCategories.map((sub) => (
                  <div
                    key={sub.id}
                    className="border rounded-lg p-3 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{sub.name}</div>
                      <div className="text-sm text-gray-400">
                        {sub.description}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Unlocks: Level {sub.unlocksAtLevel}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tiers Tab */}
        <TabsContent value="tiers">
          <Card>
            <CardHeader>
              <CardTitle>Tier Classes (1-99)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {tiers.slice(0, 20).map((tier) => (
                  <div
                    key={tier.tier}
                    className="border rounded p-2 text-center"
                  >
                    <div className="font-medium">Tier {tier.tier}</div>
                    <div className="text-xs text-gray-400">
                      {tier.name}
                    </div>
                    <div className="text-xs text-green-400">
                      +{tier.powerMultiplier}x
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Levels Tab */}
        <TabsContent value="levels">
          <Card>
            <CardHeader>
              <CardTitle>Level Bands (1-999)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {levels.map((band, index) => (
                  <div
                    key={index}
                    className="border rounded p-2 flex justify-between"
                  >
                    <span className="font-medium">{band.band}</span>
                    <span className="text-gray-400">
                      Levels {band.minLevel}-{band.maxLevel}
                    </span>
                    <span className="text-green-400">
                      x{band.statMultiplier} multiplier
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
