import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Building2, Layers, Award, Hash } from "lucide-react";

type GovBuildingsResponse = {
  success: boolean;
  totalCategories: number;
  totalSubCategories: number;
  categories: any[];
  classes: string[];
  types: string[];
};
type SubCategoriesResponse = { success: boolean; total: number; subCategories: any[] };
type RanksResponse = { success: boolean; total: number; ranks: any[] };

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Request failed");
  return res.json() as Promise<T>;
}

export default function GovernmentBuildingsPage() {
  const { data: buildingsData, isLoading } = useQuery<GovBuildingsResponse>({
    queryKey: ["gov-buildings"],
    queryFn: () => fetchJson("/api/government-buildings"),
  });

  const { data: subCategories } = useQuery<SubCategoriesResponse>({
    queryKey: ["gov-sub-categories"],
    queryFn: () => fetchJson("/api/government-buildings/sub-categories"),
  });

  const { data: ranksData } = useQuery<RanksResponse>({
    queryKey: ["gov-ranks"],
    queryFn: () => fetchJson("/api/government-buildings/ranks"),
  });

  if (isLoading) return <GameLayout><div className="flex items-center justify-center h-64 text-slate-400">Loading...</div></GameLayout>;

  return (
    <GameLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Building2 className="w-8 h-8 text-teal-400" /> Government Buildings
          </h1>
          <p className="text-slate-400 mt-1">Government building structures, categories, and rank system</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Layers className="w-6 h-6 text-teal-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{buildingsData?.totalCategories || 0}</p>
              <p className="text-xs text-slate-400">Categories</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Hash className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{buildingsData?.totalSubCategories || 0}</p>
              <p className="text-xs text-slate-400">Sub-Categories</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Award className="w-6 h-6 text-amber-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{ranksData?.total || 0}</p>
              <p className="text-xs text-slate-400">Ranks</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-700">
            <CardContent className="p-4 text-center">
              <Building2 className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{buildingsData?.classes?.length || 0}</p>
              <p className="text-xs text-slate-400">Building Classes</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="bg-slate-900 border border-slate-700">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="sub-categories">Sub-Categories</TabsTrigger>
            <TabsTrigger value="ranks">Ranks</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {buildingsData?.categories?.map((cat: any) => (
                <Card key={cat.id} className="bg-slate-900/80 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-bold">{cat.name || cat.id}</span>
                      <Badge variant="outline" className="text-[10px]">{cat.subCategoryIds?.length || 0} sub</Badge>
                    </div>
                    <p className="text-xs text-slate-400">{cat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sub-categories" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {subCategories?.subCategories?.map((sub: any) => (
                <Card key={sub.id} className="bg-slate-900/80 border-slate-700">
                  <CardContent className="p-4">
                    <div className="text-white font-bold">{sub.name || sub.id}</div>
                    <p className="text-xs text-slate-400">{sub.description}</p>
                    <div className="flex gap-2 mt-2">
                      {sub.class && <Badge variant="secondary" className="text-[10px]">{sub.class}</Badge>}
                      {sub.type && <Badge variant="outline" className="text-[10px]">{sub.type}</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ranks" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {ranksData?.ranks?.map((rank: any, i: number) => (
                <Card key={rank.id || i} className="bg-slate-900/80 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{rank.icon || "🏆"}</span>
                      <span className="text-white font-bold">{rank.name || rank.label || `Rank ${i + 1}`}</span>
                    </div>
                    <p className="text-xs text-slate-400">{rank.description}</p>
                    {rank.levelRequired && <div className="text-[10px] text-cyan-400 mt-1">Req. Level {rank.levelRequired}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GameLayout>
  );
}
