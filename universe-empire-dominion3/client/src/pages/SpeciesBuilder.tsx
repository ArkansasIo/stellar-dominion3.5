import GameLayout from "@/components/layout/GameLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  SPECIES_TRAITS,
  SPECIES_ETHICS,
  AUTHORITY_TYPES,
  SPECIES_ORIGINS,
  SPECIES_ARCHETYPES,
  STARTING_TRAIT_POINTS,
  MAX_TRAITS,
  calculateTraitPointCost,
  validateTraits,
  getCompatibleAuthorities,
  getCompatibleOrigins,
  getGovernmentsForAuthority,
  type EthicsId,
  type AuthorityId,
  type Ethics,
  type SpeciesTrait,
} from "@shared/config/speciesConfig";
import { Dna, Users, Scale, Crown, Globe, Star, Check, X, ChevronRight, ChevronLeft, AlertTriangle } from "lucide-react";
import { useState } from "react";

const STEPS = [
  { id: 0, label: "Appearance", icon: Dna },
  { id: 1, label: "Traits", icon: Users },
  { id: 2, label: "Ethics", icon: Scale },
  { id: 3, label: "Authority", icon: Crown },
  { id: 4, label: "Origin", icon: Globe },
  { id: 5, label: "Review", icon: Star },
] as const;

const PORTRAITS = ["👽", "🧬", "🤖", "👾", "🦎", "🐙", "🦂", "🐜", "🐛", "🦠", "🌿", "🍄"];
const BODY_TYPES = ["Humanoid", "Reptilian", "Avian", "Mammalian", "Insectoid", "Plantoid", "Machine"] as const;
const SIZES = ["Tiny", "Small", "Medium", "Large", "Gigantic"] as const;
const COLOR_SWATCHES = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e", "#14b8a6", "#6366f1", "#a855f7"];
const TRAIT_CATEGORIES = ["Physical", "Mental", "Social", "Biological", "Economic", "Combat", "Special"] as const;
type TraitCategoryFilter = typeof TRAIT_CATEGORIES[number];

const TRAIT_CATEGORY_MAP: Record<TraitCategoryFilter, readonly string[]> = {
  Physical: ["strong", "weak", "resilient", "fragile", "giant", "diminutive"],
  Mental: ["intelligent", "unintelligent", "natural_engineers", "natural_physicists", "natural_sociologists", "psionic", "cybernetic", "synthetic"],
  Social: ["charismatic", "repulsive", "diplomatic", "solitary", "beautiful", "repugnant"],
  Biological: ["rapid_breeders", "slow_breeders", "long_lived", "short_lived", "fertile", "sterile", "enduring", "adaptable", "rigid", "aquatic", "cave_dweller", "voidborn"],
  Economic: ["thrifty", "extravagant", "industrious", "idle", "nomadic", "sedentary", "tradition", "flexible"],
  Combat: ["aggressive", "defensive", "hive_mind", "machine_intelligence"],
  Special: ["psionic", "cybernetic", "synthetic", "hive_mind", "machine_intelligence"],
};

const LABELS: Record<string, string> = {
  military: "Military", research: "Research", economy: "Economy", diplomacy: "Diplomacy",
  happiness: "Happiness", unity: "Unity", influence: "Influence", alloys: "Alloys",
  minerals: "Minerals", energy: "Energy", food: "Food", housing: "Housing",
  tradeValue: "Trade", navalCapacity: "Naval Cap", armyDamage: "Army Dmg",
  armyHealth: "Army HP", shield: "Shield", hull: "Hull", armor: "Armor",
  fireRate: "Fire Rate", popGrowthSpeed: "Pop Growth", buildSpeed: "Build Speed",
  habitability: "Habitability", crime: "Crime", crimeReduction: "Crime-",
  stabilityBonus: "Stability", leaderLifespan: "Lifespan", leaderExperienceGain: "Leader XP",
  engineering: "Engineering", physics: "Physics", society: "Society",
};

const fmtFx = (e: Record<string, number | undefined>) =>
  Object.entries(e).filter(([, v]) => v !== undefined && v !== 0).map(([k, v]) => `${LABELS[k] || k} ${v! > 0 ? "+" : ""}${v}`).slice(0, 4);

interface SpeciesState {
  name: string; homeworld: string; portrait: string; bodyType: string;
  color: string; size: string; traits: string[]; ethics: EthicsId[];
  authority: AuthorityId | null; origin: string;
}

const INIT: SpeciesState = {
  name: "", homeworld: "", portrait: "👽", bodyType: "Humanoid",
  color: "#3b82f6", size: "Medium", traits: [], ethics: [],
  authority: null, origin: "",
};

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1 py-4">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const done = i < current;
        const active = i === current;
        return (
          <div key={step.id} className="flex items-center">
            <div className={cn(
              "flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all text-xs font-bold",
              done && "bg-green-600 border-green-600 text-white",
              active && "bg-blue-600 border-blue-600 text-white ring-2 ring-blue-400",
              !done && !active && "bg-slate-800 border-slate-600 text-slate-400"
            )}>
              {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
            </div>
            {i < STEPS.length - 1 && <div className={cn("w-8 h-0.5 mx-1", i < current ? "bg-green-600" : "bg-slate-700")} />}
          </div>
        );
      })}
    </div>
  );
}

function AppearanceStep({ state, update }: { state: SpeciesState; update: (s: Partial<SpeciesState>) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Species Name</label>
          <Input value={state.name} onChange={(e) => update({ name: e.target.value })} placeholder="Enter species name" className="bg-slate-800 border-slate-600 text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Homeworld Name</label>
          <Input value={state.homeworld} onChange={(e) => update({ homeworld: e.target.value })} placeholder="Enter homeworld name" className="bg-slate-800 border-slate-600 text-white" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Species Portrait</label>
        <div className="grid grid-cols-6 gap-2">
          {PORTRAITS.map((p) => (
            <button key={p} onClick={() => update({ portrait: p })}
              className={cn("text-3xl p-2 rounded-lg border-2 transition-all hover:scale-110",
                state.portrait === p ? "border-blue-500 bg-blue-500/20" : "border-slate-600 bg-slate-800 hover:border-slate-400"
              )}>{p}</button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Body Type</label>
        <div className="flex flex-wrap gap-2">
          {BODY_TYPES.map((bt) => (
            <Button key={bt} variant={state.bodyType === bt ? "default" : "outline"} onClick={() => update({ bodyType: bt })}
              className={cn("border-slate-600", state.bodyType === bt ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700")}>
              {bt}
            </Button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Color</label>
        <div className="flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((c) => (
            <button key={c} onClick={() => update({ color: c })}
              className={cn("w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                state.color === c ? "border-white ring-2 ring-white/50" : "border-transparent"
              )} style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Size</label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <Button key={s} variant={state.size === s ? "default" : "outline"} onClick={() => update({ size: s })}
              className={cn("border-slate-600", state.size === s ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700")}>
              {s}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TraitsStep({ state, update }: { state: SpeciesState; update: (s: Partial<SpeciesState>) => void }) {
  const [catFilter, setCatFilter] = useState<TraitCategoryFilter | "All">("All");
  const pointsUsed = calculateTraitPointCost(state.traits);
  const pointsLeft = STARTING_TRAIT_POINTS - pointsUsed;
  const validation = validateTraits(state.traits);
  const selectedIds = new Set(state.traits);
  const compatIds = new Set<string>();
  SPECIES_TRAITS.forEach((t) => {
    if (state.traits.length === 0 || !state.traits.some((st) => t.incompatibleWith.includes(st))) compatIds.add(t.id);
  });
  const filtered = SPECIES_TRAITS.filter((t) => catFilter === "All" || TRAIT_CATEGORY_MAP[catFilter]?.includes(t.id));
  const toggle = (id: string) => {
    if (selectedIds.has(id)) { update({ traits: state.traits.filter((x) => x !== id) }); }
    else if (state.traits.length < MAX_TRAITS) {
      const trait = SPECIES_TRAITS.find((t) => t.id === id);
      if (trait && pointsLeft >= trait.cost) update({ traits: [...state.traits, id] });
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-slate-300">Trait Budget</span>
          <div className="flex items-center gap-2 mt-1">
            <Progress value={(pointsUsed / STARTING_TRAIT_POINTS) * 100} className="w-40 h-2" />
            <span className={cn("text-sm font-bold", pointsLeft >= 0 ? "text-green-400" : "text-red-400")}>{pointsLeft} / {STARTING_TRAIT_POINTS}</span>
          </div>
        </div>
        <Badge variant="outline" className="border-slate-600 text-slate-300">{state.traits.length} / {MAX_TRAITS} traits</Badge>
      </div>
      {validation.errors.length > 0 && (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg">
          {validation.errors.map((err, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-red-300"><AlertTriangle className="w-4 h-4" />{err}</div>
          ))}
        </div>
      )}
      {state.traits.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Selected Traits</span>
          <div className="flex flex-wrap gap-2">
            {state.traits.map((tid) => {
              const trait = SPECIES_TRAITS.find((t) => t.id === tid);
              if (!trait) return null;
              return (
                <Badge key={tid} onClick={() => toggle(tid)} className={cn("cursor-pointer hover:opacity-80",
                  trait.category === "positive" ? "bg-green-700" : trait.category === "negative" ? "bg-red-700" : "bg-slate-600"
                )}>{trait.name} ({trait.cost > 0 ? "+" : ""}{trait.cost}) <X className="w-3 h-3 ml-1" /></Badge>
              );
            })}
          </div>
        </div>
      )}
      <Separator className="bg-slate-700" />
      <div className="flex flex-wrap gap-1.5">
        <Button variant={catFilter === "All" ? "default" : "outline"} size="sm" onClick={() => setCatFilter("All")}
          className={cn("border-slate-600", catFilter === "All" ? "bg-blue-600" : "bg-slate-800 text-slate-300")}>All</Button>
        {TRAIT_CATEGORIES.map((cat) => (
          <Button key={cat} variant={catFilter === cat ? "default" : "outline"} size="sm" onClick={() => setCatFilter(cat)}
            className={cn("border-slate-600", catFilter === cat ? "bg-blue-600" : "bg-slate-800 text-slate-300")}>{cat}</Button>
        ))}
      </div>
      <ScrollArea className="h-72">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-4">
          {filtered.map((trait) => {
            const sel = selectedIds.has(trait.id);
            const canAdd = state.traits.length < MAX_TRAITS && pointsLeft >= trait.cost;
            return (
              <button key={trait.id} onClick={() => toggle(trait.id)} disabled={!canAdd && !sel}
                className={cn("p-3 rounded-lg border text-left transition-all",
                  sel ? (trait.category === "positive" ? "border-green-500 bg-green-900/30" : trait.category === "negative" ? "border-red-500 bg-red-900/30" : "border-blue-500 bg-blue-900/30")
                    : (compatIds.has(trait.id) && canAdd) ? "border-slate-600 bg-slate-800 hover:border-slate-500" : "border-slate-700 bg-slate-900 opacity-50"
                )}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{trait.name}</span>
                  <Badge variant="outline" className={cn("text-xs", trait.cost > 0 ? "border-green-600 text-green-400" : trait.cost < 0 ? "border-red-600 text-red-400" : "border-slate-600 text-slate-400")}>
                    {trait.cost > 0 ? "+" : ""}{trait.cost}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-1">{trait.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {fmtFx(trait.effects as Record<string, number>).map((e, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">{e}</span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

function EthicsStep({ state, update }: { state: SpeciesState; update: (s: Partial<SpeciesState>) => void }) {
  const toggle = (id: EthicsId) => {
    if (state.ethics.includes(id)) update({ ethics: state.ethics.filter((e) => e !== id) });
    else if (state.ethics.length < 3) update({ ethics: [...state.ethics, id] });
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-300">Select 1-3 Ethics</span>
        <Badge variant="outline" className="border-slate-600 text-slate-300">{state.ethics.length} / 3</Badge>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-2 border-dashed border-slate-700" />
        </div>
        <div className="relative grid grid-cols-3 sm:grid-cols-4 gap-3 py-4">
          {SPECIES_ETHICS.map((ethic) => {
            const sel = state.ethics.includes(ethic.id);
            return (
              <button key={ethic.id} onClick={() => toggle(ethic.id)}
                className={cn("p-3 rounded-lg border-2 transition-all text-center",
                  sel ? "border-blue-500 bg-blue-900/40" : "border-slate-600 bg-slate-800 hover:border-slate-500"
                )}>
                <div className="text-2xl mb-1">{ethic.icon}</div>
                <div className="text-xs font-semibold text-white">{ethic.name}</div>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{ethic.description}</p>
                {sel && (
                  <div className="mt-2 space-y-0.5">
                    {Object.entries(ethic.bonuses).filter(([, v]) => v && v > 0).slice(0, 2).map(([k, v]) => (
                      <div key={k} className="text-[10px] text-green-400">+{v} {LABELS[k] || k}</div>
                    ))}
                    {Object.entries(ethic.penalties).filter(([, v]) => v && v > 0).slice(0, 1).map(([k, v]) => (
                      <div key={k} className="text-[10px] text-red-400">-{v} {LABELS[k] || k}</div>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AuthorityStep({ state, update }: { state: SpeciesState; update: (s: Partial<SpeciesState>) => void }) {
  const compatIds = new Set((state.ethics.length > 0 ? getCompatibleAuthorities(state.ethics) : AUTHORITY_TYPES).map((a) => a.id));
  return (
    <div className="space-y-4">
      <span className="text-sm font-semibold text-slate-300">Select Authority Type</span>
      <ScrollArea className="h-[420px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-4">
          {AUTHORITY_TYPES.map((auth) => {
            const sel = state.authority === auth.id;
            const avail = compatIds.has(auth.id);
            return (
              <button key={auth.id} onClick={() => update({ authority: auth.id })} disabled={!avail}
                className={cn("p-4 rounded-lg border-2 text-left transition-all",
                  sel ? "border-purple-500 bg-purple-900/30" : avail ? "border-slate-600 bg-slate-800 hover:border-slate-500" : "border-slate-700 bg-slate-900 opacity-40"
                )}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-white">{auth.name}</span>
                  {!avail && <Badge variant="outline" className="border-slate-600 text-[10px] text-slate-500">Locked</Badge>}
                </div>
                <p className="text-xs text-slate-400 mb-2">{auth.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {Object.entries(auth.bonuses).filter(([, v]) => v && v > 0).slice(0, 3).map(([k, v]) => (
                    <span key={k} className="text-[10px] px-1.5 py-0.5 bg-green-900/40 text-green-400 rounded">+{v} {LABELS[k] || k}</span>
                  ))}
                  {Object.entries(auth.penalties).filter(([, v]) => v && v > 0).slice(0, 2).map(([k, v]) => (
                    <span key={k} className="text-[10px] px-1.5 py-0.5 bg-red-900/40 text-red-400 rounded">-{v} {LABELS[k] || k}</span>
                  ))}
                </div>
                <div className="space-y-0.5">
                  {auth.specialMechanics.map((m, i) => (
                    <div key={i} className="text-[10px] text-slate-500"><span className="text-purple-400">*</span> {m}</div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

function OriginStep({ state, update }: { state: SpeciesState; update: (s: Partial<SpeciesState>) => void }) {
  const compatIds = new Set(
    (state.authority && state.ethics.length > 0 ? getCompatibleOrigins(state.ethics, state.authority) : SPECIES_ORIGINS).map((o) => o.id)
  );
  return (
    <div className="space-y-4">
      <span className="text-sm font-semibold text-slate-300">Select Origin</span>
      <ScrollArea className="h-[420px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-4">
          {SPECIES_ORIGINS.map((origin) => {
            const sel = state.origin === origin.id;
            const avail = compatIds.has(origin.id);
            return (
              <button key={origin.id} onClick={() => update({ origin: origin.id })} disabled={!avail}
                className={cn("p-4 rounded-lg border-2 text-left transition-all",
                  sel ? "border-amber-500 bg-amber-900/30" : avail ? "border-slate-600 bg-slate-800 hover:border-slate-500" : "border-slate-700 bg-slate-900 opacity-40"
                )}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-white">{origin.name}</span>
                  {!avail && <Badge variant="outline" className="border-slate-600 text-[10px] text-slate-500">Locked</Badge>}
                </div>
                <p className="text-xs text-slate-400 mb-2">{origin.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {Object.entries(origin.bonuses).filter(([, v]) => v && v > 0).slice(0, 3).map(([k, v]) => (
                    <span key={k} className="text-[10px] px-1.5 py-0.5 bg-green-900/40 text-green-400 rounded">+{v} {LABELS[k] || k}</span>
                  ))}
                </div>
                <div className="text-[10px] text-amber-400 italic">{origin.startEffect}</div>
                <div className="space-y-0.5 mt-2">
                  {origin.specialMechanics.map((m, i) => (
                    <div key={i} className="text-[10px] text-slate-500"><span className="text-amber-400">*</span> {m}</div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

function ReviewStep({ state }: { state: SpeciesState }) {
  const sTraits = state.traits.map((id) => SPECIES_TRAITS.find((t) => t.id === id)).filter(Boolean) as SpeciesTrait[];
  const sEthics = state.ethics.map((id) => SPECIES_ETHICS.find((e) => e.id === id)).filter(Boolean) as Ethics[];
  const sAuth = state.authority ? AUTHORITY_TYPES.find((a) => a.id === state.authority) : null;
  const sOrigin = state.origin ? SPECIES_ORIGINS.find((o) => o.id === state.origin) : null;
  const govts = state.authority ? getGovernmentsForAuthority(state.authority) : [];
  const totals: Record<string, number> = {};
  const addB = (o: Record<string, number | undefined>) => { Object.entries(o).forEach(([k, v]) => { if (v) totals[k] = (totals[k] || 0) + v; }); };
  sTraits.forEach((t) => addB(t.effects as Record<string, number>));
  sEthics.forEach((e) => addB(e.bonuses as Record<string, number>));
  if (sAuth) addB(sAuth.bonuses as Record<string, number>);
  if (sOrigin) addB(sOrigin.bonuses as Record<string, number>);
  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between"><span className="text-slate-400">{label}</span><span className="text-white">{value}</span></div>
  );
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-300 uppercase tracking-wider">Identity</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <Row label="Species" value={<span className="font-semibold">{state.name || "Unnamed"}</span>} />
            <Row label="Homeworld" value={state.homeworld || "Unknown"} />
            <Row label="Portrait" value={<span className="text-xl">{state.portrait}</span>} />
            <Row label="Body" value={state.bodyType} />
            <Row label="Color" value={<div className="w-5 h-5 rounded-full border" style={{ backgroundColor: state.color }} />} />
            <Row label="Size" value={state.size} />
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-300 uppercase tracking-wider">Government</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <Row label="Ethics" value={sEthics.map((e) => e.name).join(", ") || "None"} />
            <Row label="Authority" value={sAuth?.name || "None"} />
            <Row label="Origin" value={sOrigin?.name || "None"} />
            <Row label="Gov Type" value={govts.length > 0 ? govts[0].name : "N/A"} />
          </CardContent>
        </Card>
      </div>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-300 uppercase tracking-wider">Selected Traits ({sTraits.length})</CardTitle></CardHeader>
        <CardContent>
          {sTraits.length === 0 ? <p className="text-sm text-slate-500">No traits selected</p> : (
            <div className="flex flex-wrap gap-2">
              {sTraits.map((t) => (
                <Badge key={t.id} className={cn(t.category === "positive" ? "bg-green-700" : t.category === "negative" ? "bg-red-700" : "bg-slate-600")}>{t.name}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-300 uppercase tracking-wider">Combined Bonuses</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(totals).filter(([, v]) => v !== 0).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 12).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between p-2 bg-slate-900 rounded">
                <span className="text-xs text-slate-400">{LABELS[k] || k}</span>
                <span className={cn("text-xs font-bold", v > 0 ? "text-green-400" : "text-red-400")}>{v > 0 ? "+" : ""}{v}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SpeciesBuilder() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<SpeciesState>(INIT);
  const [showPresets, setShowPresets] = useState(false);
  const update = (p: Partial<SpeciesState>) => setState((prev) => ({ ...prev, ...p }));
  const canNext = () => {
    if (step === 0) return state.name.length > 0;
    if (step === 1) return validateTraits(state.traits).valid;
    if (step === 2) return state.ethics.length > 0;
    if (step === 3) return state.authority !== null;
    if (step === 4) return state.origin.length > 0;
    return true;
  };
  const applyPreset = (a: typeof SPECIES_ARCHETYPES[number]) => {
    setState({ name: a.name, homeworld: a.homeworldName, portrait: a.portrait, bodyType: "Humanoid", color: "#3b82f6", size: "Medium", traits: [...a.traits], ethics: [...a.defaultEthics], authority: a.defaultAuthority, origin: "lost_colony" });
    setShowPresets(false); setStep(0);
  };
  const StepComp = [AppearanceStep, TraitsStep, EthicsStep, AuthorityStep, OriginStep, ReviewStep][step];
  return (
    <GameLayout title="Species Builder" subtitle="Create a new species for the galaxy">
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2"><Dna className="w-5 h-5 text-blue-400" />Species Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <StepIndicator current={step} />
            <Separator className="bg-slate-700 my-4" />
            <div className="min-h-[400px]">
              <StepComp state={state} update={update} />
            </div>
            <Separator className="bg-slate-700 my-4" />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowPresets(!showPresets)} className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700">
                  <Star className="w-4 h-4 mr-1" />Use Preset
                </Button>
                <Button variant="outline" onClick={() => setState(INIT)} className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700">Reset</Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
                  className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700">
                  <ChevronLeft className="w-4 h-4 mr-1" />Back
                </Button>
                {step < 5 ? (
                  <Button onClick={() => setStep((s) => Math.min(5, s + 1))} disabled={!canNext()} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Next<ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button className="bg-green-600 hover:bg-green-700 text-white"><Check className="w-4 h-4 mr-1" />Create Species</Button>
                )}
              </div>
            </div>
            {showPresets && (
              <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-white">Preset Species Templates</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowPresets(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {SPECIES_ARCHETYPES.map((arch) => (
                    <button key={arch.id} onClick={() => applyPreset(arch)}
                      className="p-3 rounded-lg border border-slate-600 bg-slate-900 hover:border-blue-500 text-left transition-all">
                      <div className="text-sm font-bold text-white">{arch.name}</div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{arch.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {arch.defaultEthics.map((e) => (
                          <Badge key={e} className="bg-blue-900/50 text-[9px] text-blue-300">{e}</Badge>
                        ))}
                        <Badge className="bg-purple-900/50 text-[9px] text-purple-300">{arch.defaultAuthority}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
