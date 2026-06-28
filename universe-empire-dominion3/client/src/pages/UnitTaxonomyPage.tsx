import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Layers, BarChart3, Grid3X3 } from "lucide-react";

type CategoriesResponse = { success: boolean; total: number; categories: any[] };
type SubCategoriesResponse = { success: boolean; total: number; subCategories: any[] };
type TiersResponse = { success: boolean; total: number; minTier: number; maxTier: number; tiers: any[] };
type LevelsResponse = { success: boolean; maxLevel: number; totalBands: number; bands: any[] };
type EntriesResponse = { success: boolean; total: number; entries: any[] };

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Request failed");
  return res.json() as Promise<T>;
}

export default function UnitTaxonomyPage() {
  const { data: categories } = useQuery<CategoriesResponse>({
    queryKey: ["ut-categories"],
    queryFn: () => fetchJson("/api/unit-taxonomy/categories"),
  });

  const { data: subCategories } = useQuery<SubCategoriesResponse>({
    queryKey: ["ut-subcategories"],
    queryFn: () => fetchJson("/api/unit-taxonomy/subcategories"),
  });

  const { data: tiers } = useQuery<TiersResponse>({
    queryKey: ["ut-tiers"],
    queryFn: () => fetchJson("/api/unit-taxonomy/tiers"),
  });

  const { data: levels } = useQuery<LevelsResponse>({
    queryKey: ["ut-levels"],
    queryFn: () => fetchJson("/api/unit-taxonomy/levels"),
  });

  const { data: entries } = useQuery<EntriesResponse>({
    queryKey: ["ut-entries"],
    queryFn: () => fetchJson("/api/unit-taxonomy/entries"),
  });

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-indigo-400" /> Unit Taxonomy
          </h1>
          <p className="text-slate-400 mt-1">Browse unit categories, tiers, and classification system</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Layers className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{categories?.total || 0}</p>
              <p className="text-xs text-slate-400">Categories</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Grid3X3 className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{subCategories?.total || 0}</p>
              <p className="text-xs text-slate-400">Sub-Categories</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{tiers?.total || 0}</p>
              <p className="text-xs text-slate-400">Tier Classes</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-6 h-6 text-amber-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{entries?.total || 0}</p>
              <p className="text-xs text-slate-400">Entries</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="bg-slate-900 border border-slate-700">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="subcategories">Sub-Categories</TabsTrigger>
            <TabsTrigger value="entries">Entries</TabsTrigger>
            <TabsTrigger value="levels">Level Bands</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories?.categories?.map((cat: any) => (
                <Card key={cat.id} className="bg-slate-900/80 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-bold">{cat.name || cat.id}</span>
                      <Badge variant="outline" className="capitalize">{cat.domain}</Badge>
                    </div>
                    <p className="text-xs text-slate-400">{cat.description}</p>
                    {cat.subCategoryIds && (
                      <div className="mt-2 text-[10px] text-slate-500">{cat.subCategoryIds.length} sub-categories</div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subcategories" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {subCategories?.subCategories?.map((sub: any) => (
                <Card key={sub.id} className="bg-slate-900/80 border-slate-700">
                  <CardContent className="p-4">
                    <div className="text-white font-bold">{sub.name || sub.id}</div>
                    <p className="text-xs text-slate-400">{sub.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="entries" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {entries?.entries?.map((entry: any) => (
                <Card key={entry.id} className="bg-slate-900/80 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-bold">{entry.name || entry.id}</span>
                      <Badge variant="secondary">{entry.tierRange || "T1-99"}</Badge>
                    </div>
                    <p className="text-xs text-slate-400">{entry.description}</p>
                    <div className="flex gap-2 mt-2">
                      {entry.domains?.map((d: string) => (
                        <Badge key={d} variant="outline" className="text-[10px] capitalize">{d}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="levels" className="mt-4">
            <Card className="bg-slate-900/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Level Band Definitions (1-{levels?.maxLevel || 999})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {levels?.bands?.map((band: any, i: number) => (
                    <div key={i} className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                      <div className="text-white font-bold text-sm">{band.name || band.label}</div>
                      <div className="text-xs text-slate-400">Lv. {band.min || band.start} - {band.max || band.end}</div>
                      <div className="text-[10px] text-cyan-400 mt-1">x{band.multiplier || band.statMultiplier || 1} stats</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
