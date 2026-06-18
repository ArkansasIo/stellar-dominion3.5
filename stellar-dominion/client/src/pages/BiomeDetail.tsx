import { useMemo } from "react";
import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeft, BookOpen, Compass, Crown, Shield, Sparkles, Star } from "lucide-react";

import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type BiomeEnvironmentType = 'planet' | 'moon' | 'colony' | 'space-station' | 'starbase' | 'moon-base';
type BiomeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

type StarfleetBiomeEntry = {
  id: string;
  code: string;
  letter: string;
  name: string;
  environmentType: BiomeEnvironmentType;
  biomeType: string;
  biomeSubType: string;
  class: string;
  subClass: string;
  size: 'micro' | 'small' | 'medium' | 'large' | 'massive' | 'mega';
  rank: number;
  title: string;
  rarity: BiomeRarity;
  colonyCapacity: number;
  description: string;
  hazards: string[];
  strategicUses: string[];
};

type SingleBiomeResponse = { biome: StarfleetBiomeEntry };
type CatalogResponse = { biomes: StarfleetBiomeEntry[] };

function rarityClass(rarity: BiomeRarity) {
  switch (rarity) {
    case 'legendary': return 'bg-amber-100 text-amber-900 border-amber-300';
    case 'epic': return 'bg-purple-100 text-purple-900 border-purple-300';
    case 'rare': return 'bg-blue-100 text-blue-900 border-blue-300';
    case 'uncommon': return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    default: return 'bg-slate-100 text-slate-900 border-slate-300';
  }
}

export default function BiomeDetail() {
  const [, params] = useRoute('/biome/:id');
  const biomeId = params?.id || '';

  const biomeQuery = useQuery<SingleBiomeResponse>({
    queryKey: ['biome-detail', biomeId],
    queryFn: async () => {
      const response = await fetch(`/api/biomes/catalog/${biomeId}`, { credentials: 'include' });
      if (!response.ok) throw new Error('Biome not found');
      return response.json();
    },
    enabled: Boolean(biomeId),
  });

  const catalogQuery = useQuery<CatalogResponse>({ queryKey: ['/api/biomes/catalog'] });

  const biome = biomeQuery.data?.biome;

  const relatedBiomes = useMemo(() => {
    if (!biome) return [] as StarfleetBiomeEntry[];
    return (catalogQuery.data?.biomes || [])
      .filter((entry) => entry.id !== biome.id)
      .filter((entry) =>
        entry.environmentType === biome.environmentType ||
        entry.rarity === biome.rarity ||
        entry.class === biome.class,
      )
      .sort((left, right) => Math.abs(left.rank - biome.rank) - Math.abs(right.rank - biome.rank))
      .slice(0, 6);
  }, [catalogQuery.data?.biomes, biome]);

  const strategicRecommendations = useMemo(() => {
    if (!biome) return [] as string[];
    return [
      `Deploy ${biome.class}-${biome.subClass} command teams for maximum alignment.`,
      `Scale infrastructure to ${biome.size} profile and target capacity ${biome.colonyCapacity}.`,
      `Prioritize mitigation against ${biome.hazards[0]} before major expansion.`,
      `Use biome title tier (${biome.title}) as doctrine benchmark for nearby systems.`,
    ];
  }, [biome]);

  const hazardCount = biome?.hazards?.length || 0;
  const strategicUseCount = biome?.strategicUses?.length || 0;
  const relatedCount = relatedBiomes.length;

  if (!biome) {
    return (
      <GameLayout>
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="w-14 h-14 mx-auto text-slate-300 mb-3" />
            <h2 className="text-xl font-bold text-slate-900">Biome not found</h2>
            <p className="text-slate-600 mt-1">The requested biome entry does not exist.</p>
            <Link href="/biome-codex"><Button className="mt-4">Return to Biome Codex</Button></Link>
          </CardContent>
        </Card>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="space-y-6" data-testid="biome-detail-page">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/biome-codex">
              <Button variant="outline" size="sm"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Codex</Button>
            </Link>
            <div>
              <h1 className="text-3xl font-orbitron font-bold text-slate-900">{biome.name}</h1>
              <p className="text-slate-600 font-mono">{biome.code} • Rank {biome.rank} • Letter {biome.letter}</p>
            </div>
          </div>
          <Badge className={rarityClass(biome.rarity)}>{biome.rarity}</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Environment</div><div className="text-lg font-bold">{biome.environmentType}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Type</div><div className="text-lg font-bold">{biome.biomeType}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Sub-Type</div><div className="text-lg font-bold">{biome.biomeSubType}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Class</div><div className="text-lg font-bold">{biome.class}/{biome.subClass}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Size/Capacity</div><div className="text-lg font-bold">{biome.size} / {biome.colonyCapacity}</div></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Hazard Nodes</div><div className="text-2xl font-bold text-rose-700">{hazardCount}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Strategic Uses</div><div className="text-2xl font-bold text-emerald-700">{strategicUseCount}</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-xs uppercase text-slate-500">Related Biomes</div><div className="text-2xl font-bold text-indigo-700">{relatedCount}</div></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="xl:col-span-2">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Compass className="w-4 h-4" /> Biome Overview</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700">{biome.description}</p>

              <div>
                <div className="text-xs uppercase text-slate-500 mb-2 flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> Hazard Profile</div>
                <div className="flex flex-wrap gap-2">
                  {biome.hazards.map((hazard) => <Badge key={hazard} variant="outline">{hazard}</Badge>)}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase text-slate-500 mb-2 flex items-center gap-2"><Shield className="w-3 h-3" /> Strategic Uses</div>
                <div className="flex flex-wrap gap-2">
                  {biome.strategicUses.map((useCase) => <Badge key={useCase} className="bg-slate-100 text-slate-800">{useCase}</Badge>)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Crown className="w-4 h-4" /> Doctrine</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>Title Tier: <span className="font-semibold">{biome.title}</span></div>
              <div>Operational Rank: <span className="font-semibold">{biome.rank}</span></div>
              <div>Recommended Capacity: <span className="font-semibold">{biome.colonyCapacity}</span></div>
              <div className="pt-2 space-y-2">
                {strategicRecommendations.map((line) => (
                  <div key={line} className="text-slate-700 bg-slate-50 border border-slate-200 rounded p-2">{line}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="w-4 h-4" /> Related Biomes</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {relatedBiomes.map((entry) => (
              <Link key={entry.id} href={`/biome/${entry.id}`}>
                <div className="cursor-pointer border border-slate-200 rounded p-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-slate-900 truncate">{entry.name}</div>
                    <Badge className={rarityClass(entry.rarity)}>{entry.rarity}</Badge>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{entry.code} • {entry.environmentType}</div>
                  <div className="text-xs text-slate-600 mt-2 flex items-center gap-1"><Star className="w-3 h-3" /> Rank {entry.rank} • {entry.title}</div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Deployment Checklist</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
            <div className="rounded border border-slate-200 bg-slate-50 p-3">Evaluate hazard stack before expanding workforce presence.</div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3">Align colony specialization with biome strategic uses.</div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3">Use related biomes for comparative doctrine planning in adjacent sectors.</div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
