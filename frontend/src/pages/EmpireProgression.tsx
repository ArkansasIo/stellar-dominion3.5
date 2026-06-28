import { useState } from "react";
import GameLayout from "@/components/layout/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { KARDASHEV_SCALE, KardashevLevel, KardashevTier, calculateProgressToNext } from "@/lib/kardashevScale";
import {
  KARDASHEV_TIERS_EXTENDED,
  KARDASHEV_CATEGORIES,
  KARDASHEV_SUB_CATEGORIES,
  calculateExtendedProgress,
  TOTAL_TIERS,
  TOTAL_LEVELS,
  TOTAL_CATEGORIES,
  TOTAL_SUB_CATEGORIES,
  type KardashevTierExtended,
  type KardashevCategory,
} from "@/lib/kardashevExtended";
import { getKardashevLevel, getMilestoneLevels, type KardashevLevelData } from "@/lib/kardashevLevels";
import { useGame } from "@/lib/gameContext";
import {
  Crown, Zap, Factory, FlaskConical, Rocket, Shield,
  Lock, Unlock, TrendingUp, Star, Globe2, Layers, Grid3x3,
  ChevronDown, ChevronRight, BookOpen, Target, Award, Infinity,
} from "lucide-react";

const CATEGORY_COLORS: Record<KardashevCategory, { bg: string; border: string; text: string; badge: string }> = {
  "Planetary": { bg: "bg-green-50", border: "border-green-400", text: "text-green-800", badge: "bg-green-100 text-green-800 border-green-300" },
  "Stellar": { bg: "bg-yellow-50", border: "border-yellow-400", text: "text-yellow-800", badge: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  "Galactic": { bg: "bg-blue-50", border: "border-blue-400", text: "text-blue-800", badge: "bg-blue-100 text-blue-800 border-blue-300" },
  "Universal": { bg: "bg-purple-50", border: "border-purple-400", text: "text-purple-800", badge: "bg-purple-100 text-purple-800 border-purple-300" },
  "Transcendent": { bg: "bg-amber-50", border: "border-amber-500", text: "text-amber-900", badge: "bg-amber-100 text-amber-900 border-amber-400" },
};

const tierColors: Record<number, { bg: string; border: string; text: string }> = {
  1: { bg: "bg-slate-50", border: "border-slate-300", text: "text-slate-700" },
  2: { bg: "bg-slate-100", border: "border-slate-400", text: "text-slate-800" },
  3: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700" },
  4: { bg: "bg-blue-100", border: "border-blue-400", text: "text-blue-800" },
  5: { bg: "bg-green-50", border: "border-green-300", text: "text-green-700" },
  6: { bg: "bg-green-100", border: "border-green-400", text: "text-green-800" },
  7: { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-700" },
  8: { bg: "bg-purple-100", border: "border-purple-400", text: "text-purple-800" },
  9: { bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-700" },
  10: { bg: "bg-amber-100", border: "border-amber-400", text: "text-amber-800" },
  11: { bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-700" },
  12: { bg: "bg-orange-100", border: "border-orange-400", text: "text-orange-800" },
  13: { bg: "bg-red-50", border: "border-red-300", text: "text-red-700" },
  14: { bg: "bg-red-100", border: "border-red-400", text: "text-red-800" },
  15: { bg: "bg-pink-50", border: "border-pink-300", text: "text-pink-700" },
  16: { bg: "bg-pink-100", border: "border-pink-400", text: "text-pink-800" },
  17: { bg: "bg-indigo-50", border: "border-indigo-300", text: "text-indigo-700" },
  18: { bg: "bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100", border: "border-amber-500", text: "text-amber-900" },
};

function formatLargeNumber(num: number): string {
  if (num >= 1e15) return `${(num / 1e15).toFixed(1)}Q`;
  if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toString();
}

// ── Legacy card (original 18-level scale) ─────────────────────────────────
function KardashevCard({ tier, currentLevel, resources }: { tier: KardashevTier; currentLevel: number; resources: { metal: number; crystal: number; deuterium: number } }) {
  const isUnlocked = currentLevel >= tier.level;
  const isCurrent = currentLevel === tier.level;
  const isNext = currentLevel + 1 === tier.level;
  const colors = tierColors[tier.level] || tierColors[1];
  const progress = isNext ? calculateProgressToNext(currentLevel as KardashevLevel, resources.metal, resources.crystal, resources.deuterium) : 0;

  return (
    <Card className={`border-2 transition-all ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""} ${isUnlocked ? colors.border : "border-slate-200 opacity-60"} ${colors.bg}`} data-testid={`card-kardashev-${tier.level}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isUnlocked ? <Unlock className="w-5 h-5 text-green-600" /> : <Lock className="w-5 h-5 text-slate-400" />}
            <Badge className={`${colors.text} ${colors.bg} border ${colors.border}`}>Level {tier.level}</Badge>
          </div>
          {isCurrent && <Badge className="bg-primary text-white">Current</Badge>}
          {isNext && <Badge className="bg-blue-500 text-white">Next</Badge>}
        </div>
        <CardTitle className={`text-lg ${colors.text}`}>{tier.name}</CardTitle>
        <p className="text-xs text-slate-600">{tier.description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {isNext && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs"><span>Progress to Next Level</span><span className="font-bold">{progress}%</span></div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        {tier.level > 1 && (
          <div className="p-2 bg-white/50 rounded border border-slate-200">
            <p className="text-xs font-bold text-slate-600 mb-1">REQUIREMENTS</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div><span className="text-slate-500">Metal:</span><span className="font-mono ml-1">{formatLargeNumber(tier.requirementsMetal)}</span></div>
              <div><span className="text-blue-500">Crystal:</span><span className="font-mono ml-1">{formatLargeNumber(tier.requirementsCrystal)}</span></div>
              <div><span className="text-green-500">Deuterium:</span><span className="font-mono ml-1">{formatLargeNumber(tier.requirementsDeuterium)}</span></div>
            </div>
            <div className="mt-1 text-xs">
              <span className="text-purple-500">Research Points:</span>
              <span className="font-mono ml-1">{formatLargeNumber(tier.requiredResearchPoints)}</span>
            </div>
          </div>
        )}
        <div className="p-2 bg-green-50/80 rounded border border-green-200">
          <p className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> BONUSES</p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="flex items-center gap-1"><Factory className="w-3 h-3 text-slate-600" /><span>Production: +{tier.bonuses.resourceProduction}%</span></div>
            <div className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-600" /><span>Energy: +{tier.bonuses.energyProduction}%</span></div>
            <div className="flex items-center gap-1"><FlaskConical className="w-3 h-3 text-purple-600" /><span>Research: +{tier.bonuses.researchSpeed}%</span></div>
            <div className="flex items-center gap-1"><Rocket className="w-3 h-3 text-red-600" /><span>Fleet: +{tier.bonuses.fleetPower}%</span></div>
            <div className="flex items-center gap-1"><Shield className="w-3 h-3 text-green-600" /><span>Defense: +{tier.bonuses.defensePower}%</span></div>
          </div>
        </div>
        <div className="p-2 bg-purple-50/80 rounded border border-purple-200">
          <p className="text-xs font-bold text-purple-700 mb-1">EFFECTS</p>
          <div className="flex flex-wrap gap-1">
            {tier.effects.map((effect, idx) => (<Badge key={idx} variant="outline" className="text-xs bg-white">{effect}</Badge>))}
          </div>
        </div>
        {tier.unlocks.length > 0 && (
          <div className="p-2 bg-amber-50/80 rounded border border-amber-200">
            <p className="text-xs font-bold text-amber-700 mb-1 flex items-center gap-1"><Star className="w-3 h-3" /> UNLOCKS</p>
            <div className="flex flex-wrap gap-1">
              {tier.unlocks.map((unlock, idx) => (<Badge key={idx} className="text-xs bg-amber-100 text-amber-800 border-amber-300">{unlock}</Badge>))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Extended tier card (99-tier scale) ────────────────────────────────────
function ExtendedTierCard({ tier, currentTier, resources }: { tier: KardashevTierExtended; currentTier: number; resources: { metal: number; crystal: number; deuterium: number } }) {
  const [expanded, setExpanded] = useState(false);
  const isUnlocked = currentTier >= tier.tier;
  const isCurrent = currentTier === tier.tier;
  const isNext = currentTier + 1 === tier.tier;
  const catColors = CATEGORY_COLORS[tier.category];
  const progress = isNext ? calculateExtendedProgress(currentTier, resources.metal, resources.crystal, resources.deuterium) : 0;

  return (
    <Card className={`border-2 transition-all ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""} ${isUnlocked ? catColors.border : "border-slate-200 opacity-50"} ${catColors.bg}`} data-testid={`card-extended-tier-${tier.tier}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {isUnlocked ? <Unlock className="w-4 h-4 text-green-600" /> : <Lock className="w-4 h-4 text-slate-400" />}
            <Badge variant="outline" className={`text-xs ${catColors.badge}`}>Tier {tier.tier}</Badge>
            <Badge variant="outline" className="text-xs bg-slate-100">{tier.class}-{tier.subClass}</Badge>
            <Badge variant="outline" className="text-xs bg-white">{tier.type}</Badge>
          </div>
          <div className="flex items-center gap-1">
            {isCurrent && <Badge className="bg-primary text-white text-xs">Current</Badge>}
            {isNext && <Badge className="bg-blue-500 text-white text-xs">Next</Badge>}
          </div>
        </div>
        <CardTitle className={`text-base ${catColors.text}`}>{tier.name}</CardTitle>
        <p className="text-xs text-slate-500 italic">{tier.title}</p>
        <p className="text-xs text-slate-600 mt-1">{tier.description}</p>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Rank & Type row */}
        <div className="flex flex-wrap gap-1 text-xs">
          <Badge variant="outline" className="bg-white"><Award className="w-3 h-3 mr-1 inline" />{tier.rank}</Badge>
          <Badge variant="outline" className="bg-white">{tier.subCategory}</Badge>
          <Badge variant="outline" className="bg-white">{tier.subType}</Badge>
        </div>

        {/* Progress bar for next tier */}
        {isNext && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs"><span>Progress to Tier {tier.tier}</span><span className="font-bold">{progress}%</span></div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        {/* Level range */}
        <div className="p-2 bg-white/60 rounded border border-slate-200 text-xs">
          <span className="font-semibold text-slate-600">Levels: </span>
          <span className="font-mono">{tier.levelRange[0]}–{tier.levelRange[1]}</span>
          <span className="text-slate-400 ml-2">({tier.levelRange[1] - tier.levelRange[0] + 1} levels)</span>
        </div>

        {/* Requirements */}
        {tier.tier > 1 && (
          <div className="p-2 bg-white/50 rounded border border-slate-200 text-xs">
            <p className="font-bold text-slate-600 mb-1">REQUIREMENTS</p>
            <div className="grid grid-cols-2 gap-1">
              <span>⛏ Metal: <span className="font-mono">{formatLargeNumber(tier.requirementsMetal)}</span></span>
              <span>💎 Crystal: <span className="font-mono">{formatLargeNumber(tier.requirementsCrystal)}</span></span>
              <span>⚗ Deuterium: <span className="font-mono">{formatLargeNumber(tier.requirementsDeuterium)}</span></span>
              <span>🔬 Research: <span className="font-mono">{formatLargeNumber(tier.requiredResearchPoints)}</span></span>
            </div>
          </div>
        )}

        {/* Core bonuses */}
        <div className="p-2 bg-green-50/80 rounded border border-green-200 text-xs">
          <p className="font-bold text-green-700 mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> BONUSES</p>
          <div className="grid grid-cols-2 gap-1">
            <span><Factory className="w-3 h-3 inline mr-1 text-slate-500" />Production: +{tier.bonuses.resourceProduction}%</span>
            <span><Zap className="w-3 h-3 inline mr-1 text-yellow-500" />Energy: +{tier.bonuses.energyProduction}%</span>
            <span><FlaskConical className="w-3 h-3 inline mr-1 text-purple-500" />Research: +{tier.bonuses.researchSpeed}%</span>
            <span><Rocket className="w-3 h-3 inline mr-1 text-red-500" />Fleet: +{tier.bonuses.fleetPower}%</span>
            <span><Shield className="w-3 h-3 inline mr-1 text-green-600" />Defense: +{tier.bonuses.defensePower}%</span>
            <span>🌍 Planets: {tier.bonuses.maxPlanets.toLocaleString()}</span>
          </div>
        </div>

        {/* Expandable: stats, attributes, subjects */}
        <button
          className="w-full text-xs text-slate-500 flex items-center justify-center gap-1 py-1 hover:text-slate-700"
          onClick={() => setExpanded(v => !v)}
        >
          {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          {expanded ? "Hide Details" : "Show Stats, Attributes & Subjects"}
        </button>

        {expanded && (
          <div className="space-y-2">
            {/* Sub-description */}
            <div className="p-2 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600 italic">
              {tier.subDescription}
            </div>
            {/* Details */}
            <div className="p-2 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700">
              <p className="font-bold mb-1">DETAILS</p>
              {tier.details}
            </div>

            {/* Primary Stats */}
            <div className="p-2 bg-blue-50/80 rounded border border-blue-200 text-xs">
              <p className="font-bold text-blue-700 mb-1">PRIMARY STATS</p>
              <div className="grid grid-cols-2 gap-1">
                <span>⚡ Power: {tier.stats.primary.power}</span>
                <span>⚙ Efficiency: {tier.stats.primary.efficiency}%</span>
                <span>🛡 Stability: {tier.stats.primary.stability}%</span>
                <span>📈 Expansion: {tier.stats.primary.expansion}%</span>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="p-2 bg-indigo-50/80 rounded border border-indigo-200 text-xs">
              <p className="font-bold text-indigo-700 mb-1">SECONDARY STATS</p>
              <div className="grid grid-cols-2 gap-1">
                <span>⚔ Military: {tier.stats.secondary.militaryStrength}</span>
                <span>🤝 Diplomacy: {tier.stats.secondary.diplomaticInfluence}</span>
                <span>🔬 Science: {tier.stats.secondary.scientificOutput}</span>
                <span>💰 Economy: {tier.stats.secondary.economicGrowth}</span>
                <span>🎭 Culture: {tier.stats.secondary.culturalSpread}</span>
                <span>✨ Spirit: {tier.stats.secondary.spiritualAscension}</span>
              </div>
            </div>

            {/* Primary Attributes */}
            <div className="p-2 bg-purple-50/80 rounded border border-purple-200 text-xs">
              <p className="font-bold text-purple-700 mb-1">PRIMARY ATTRIBUTES</p>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(tier.attributes.primary).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-1">
                    <span className="capitalize">{k}:</span>
                    <div className="flex-1 bg-purple-100 rounded-full h-1.5 ml-1">
                      <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${v}%` }} />
                    </div>
                    <span className="font-mono text-purple-700 ml-1">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Attributes */}
            <div className="p-2 bg-pink-50/80 rounded border border-pink-200 text-xs">
              <p className="font-bold text-pink-700 mb-1">SECONDARY ATTRIBUTES</p>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(tier.attributes.secondary).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-1">
                    <span className="capitalize">{k}:</span>
                    <div className="flex-1 bg-pink-100 rounded-full h-1.5 ml-1">
                      <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: `${v}%` }} />
                    </div>
                    <span className="font-mono text-pink-700 ml-1">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subjects */}
            <div className="p-2 bg-amber-50/80 rounded border border-amber-200 text-xs">
              <p className="font-bold text-amber-700 mb-2">SUBJECTS</p>
              <div className="space-y-2">
                {tier.subjects.map((subject, idx) => (
                  <div key={idx} className="p-1.5 bg-white rounded border border-amber-100">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-amber-800">{subject.name}</span>
                      <Badge variant="outline" className="text-xs">{subject.attribute}</Badge>
                    </div>
                    <p className="text-slate-600">{subject.description}</p>
                    <p className="text-slate-500 mt-0.5 italic">{subject.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Effects & Unlocks */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-purple-50/80 rounded border border-purple-200 text-xs">
                <p className="font-bold text-purple-700 mb-1">EFFECTS</p>
                <div className="space-y-0.5">
                  {tier.effects.map((e, i) => <div key={i} className="text-purple-600">• {e}</div>)}
                </div>
              </div>
              <div className="p-2 bg-amber-50/80 rounded border border-amber-200 text-xs">
                <p className="font-bold text-amber-700 mb-1 flex items-center gap-1"><Star className="w-3 h-3" /> UNLOCKS</p>
                <div className="space-y-0.5">
                  {tier.unlocks.map((u, i) => <div key={i} className="text-amber-700">• {u}</div>)}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Level row for the levels table ────────────────────────────────────────
function LevelRow({ levelData }: { levelData: KardashevLevelData }) {
  return (
    <div className={`flex items-center gap-2 p-2 rounded text-xs ${levelData.isPrestigeTier ? "bg-amber-50 border border-amber-200" : "bg-white border border-slate-100"}`} data-testid={`level-row-${levelData.level}`}>
      <span className="font-mono font-bold w-8 text-right text-slate-600">{levelData.level}</span>
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-slate-700 truncate block">{levelData.name}</span>
        <span className="text-slate-400 truncate block">{levelData.rank} · {levelData.subCategory}</span>
      </div>
      <div className="flex items-center gap-1">
        <Badge variant="outline" className="text-xs">T{levelData.tier}</Badge>
        {levelData.milestoneReward && <Star className="w-3 h-3 text-amber-500" title={levelData.milestoneReward} />}
        {levelData.isPrestigeTier && <Award className="w-3 h-3 text-amber-600" title="Prestige Tier" />}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
type ViewMode = "overview" | "tiers" | "levels" | "classic";

export default function EmpireProgression() {
  const { resources } = useGame();
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [selectedCategory, setSelectedCategory] = useState<KardashevCategory | "all">("all");
  const [levelPage, setLevelPage] = useState(1);
  const [showMilestonesOnly, setShowMilestonesOnly] = useState(false);

  // Legacy system uses level 1 by default
  const currentLegacyLevel = 1;
  const currentExtendedTier = 1;

  const kardashevTiers = Object.values(KARDASHEV_SCALE);
  const allExtendedTiers = Object.values(KARDASHEV_TIERS_EXTENDED);
  const filteredTiers = selectedCategory === "all"
    ? allExtendedTiers
    : allExtendedTiers.filter(t => t.category === selectedCategory);

  const LEVELS_PER_PAGE = 50;
  const milestones = getMilestoneLevels();
  const levelsToShow = showMilestonesOnly
    ? milestones
    : getKardashevLevelRange((levelPage - 1) * LEVELS_PER_PAGE + 1, levelPage * LEVELS_PER_PAGE);
  const totalLevelPages = Math.ceil(TOTAL_LEVELS / LEVELS_PER_PAGE);

  const currentLevelData = getKardashevLevel(1);
  const currentExtTierData = KARDASHEV_TIERS_EXTENDED[currentExtendedTier];

  return (
    <GameLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3" data-testid="text-kardashev-title">
            <Crown className="w-10 h-10 text-amber-500" />
            Kardashev Scale
          </h1>
          <p className="text-slate-600 mt-2">Empire progression from planetary settler to supreme omnipotent</p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <Layers className="w-5 h-5 text-blue-500" />, label: "Total Tiers", value: TOTAL_TIERS, sub: "1 – 99" },
            { icon: <Grid3x3 className="w-5 h-5 text-green-500" />, label: "Sub-Categories", value: TOTAL_SUB_CATEGORIES, sub: `${TOTAL_CATEGORIES} categories` },
            { icon: <TrendingUp className="w-5 h-5 text-purple-500" />, label: "Total Levels", value: TOTAL_LEVELS, sub: "1 – 999" },
            { icon: <Infinity className="w-5 h-5 text-amber-500" />, label: "Max Bonus", value: "8000%", sub: "Fleet & Defense" },
          ].map(({ icon, label, value, sub }) => (
            <Card key={label} className="bg-white border-slate-200">
              <CardContent className="p-4 flex items-center gap-3">
                {icon}
                <div>
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-xl font-bold text-slate-800">{value}</p>
                  <p className="text-xs text-slate-400">{sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current status */}
        <Card className="bg-gradient-to-r from-primary/10 to-purple-100 border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm text-slate-600">Current Empire Status</p>
                <h2 className="text-2xl font-bold text-primary">{currentExtTierData.name}</h2>
                <p className="text-sm text-slate-600">{currentExtTierData.description}</p>
                <div className="flex gap-2 mt-2 flex-wrap text-xs">
                  <Badge variant="outline">{currentExtTierData.category}</Badge>
                  <Badge variant="outline">{currentExtTierData.subCategory}</Badge>
                  <Badge variant="outline">{currentExtTierData.class}-{currentExtTierData.subClass}</Badge>
                  <Badge variant="outline">{currentExtTierData.type} · {currentExtTierData.subType}</Badge>
                  <Badge variant="outline"><Award className="w-3 h-3 mr-1 inline" />{currentExtTierData.rank}</Badge>
                  <Badge variant="outline" className="italic">{currentExtTierData.title}</Badge>
                </div>
              </div>
              <div className="text-right shrink-0">
                <Badge className="text-xl px-4 py-2 bg-primary text-white">Tier {currentExtendedTier} / 99</Badge>
                <p className="text-xs text-slate-500 mt-2">Level {currentLevelData.level} / 999</p>
                <p className="text-xs text-slate-400">{99 - currentExtendedTier} tiers remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View mode switcher */}
        <div className="flex gap-2 flex-wrap">
          {([
            ["overview", <Globe2 className="w-4 h-4" />, "Categories Overview"],
            ["tiers", <Layers className="w-4 h-4" />, "All 99 Tiers"],
            ["levels", <TrendingUp className="w-4 h-4" />, "1–999 Levels"],
            ["classic", <BookOpen className="w-4 h-4" />, "Classic Scale"],
          ] as [ViewMode, React.ReactNode, string][]).map(([mode, icon, label]) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${viewMode === mode ? "bg-primary text-white border-primary" : "bg-white text-slate-700 border-slate-300 hover:border-primary hover:text-primary"}`}
            >
              {icon}{label}
            </button>
          ))}
        </div>

        {/* ── Categories Overview ─────────────────────────────────── */}
        {viewMode === "overview" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">5 Categories · 32 Sub-Categories</h2>
            {(Object.values(KARDASHEV_CATEGORIES)).map(cat => {
              const cc = CATEGORY_COLORS[cat.name];
              const subCats = Object.values(KARDASHEV_SUB_CATEGORIES).filter(s => s.category === cat.name);
              return (
                <Card key={cat.name} className={`border-2 ${cc.border} ${cc.bg}`} data-testid={`category-card-${cat.name}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className={`text-xl ${cc.text}`}>{cat.name}</CardTitle>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Tiers {cat.tierRange[0]}–{cat.tierRange[1]}</span>
                        <Badge variant="outline" className={cc.badge}>{subCats.length} sub-categories</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700">{cat.description}</p>
                    <p className="text-xs text-slate-500 italic">{cat.subDescription}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {subCats.map(sc => (
                        <div key={sc.name} className="p-2 bg-white/70 rounded border border-white text-xs">
                          <p className="font-semibold text-slate-700">{sc.name}</p>
                          <p className="text-slate-400 mt-0.5">Tiers {sc.tierRange[0]}–{sc.tierRange[1]}</p>
                          <p className="text-slate-500 mt-1 line-clamp-2">{sc.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* ── All 99 Tiers ────────────────────────────────────────── */}
        {viewMode === "tiers" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-slate-600">Filter by Category:</span>
              {(["all", ...Object.keys(KARDASHEV_CATEGORIES)] as Array<KardashevCategory | "all">).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${selectedCategory === cat ? "bg-primary text-white border-primary" : "bg-white text-slate-600 border-slate-300 hover:border-primary"}`}
                >
                  {cat === "all" ? "All Tiers" : cat}
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-500">{filteredTiers.length} tiers shown</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTiers.map(tier => (
                <ExtendedTierCard key={tier.tier} tier={tier} currentTier={currentExtendedTier} resources={resources} />
              ))}
            </div>
          </div>
        )}

        {/* ── 1–999 Levels ────────────────────────────────────────── */}
        {viewMode === "levels" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xl font-bold text-slate-800">Level Progression System (1–999)</h2>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMilestonesOnly}
                    onChange={e => setShowMilestonesOnly(e.target.checked)}
                    className="rounded"
                  />
                  Milestones only
                </label>
              </div>
            </div>

            {/* Milestones overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {getMilestoneLevels().slice(0, 8).map(ml => (
                <Card key={ml.level} className={`border ${ml.milestoneReward ? "border-amber-300 bg-amber-50" : "border-slate-200"}`} data-testid={`milestone-level-${ml.level}`}>
                  <CardContent className="p-3 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="font-mono">Lv {ml.level}</Badge>
                      {ml.milestoneReward && <Star className="w-3 h-3 text-amber-500" />}
                    </div>
                    <p className="font-semibold text-slate-700 truncate">{ml.tierName}</p>
                    <p className="text-slate-400 truncate">{ml.rank}</p>
                    {ml.milestoneReward && <p className="text-amber-600 mt-1 line-clamp-2">{ml.milestoneReward}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Level list */}
            {!showMilestonesOnly && (
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => setLevelPage(1)} disabled={levelPage === 1} className="px-3 py-1 text-xs border rounded disabled:opacity-40">First</button>
                <button onClick={() => setLevelPage(p => Math.max(1, p - 1))} disabled={levelPage === 1} className="px-3 py-1 text-xs border rounded disabled:opacity-40">Prev</button>
                <span className="text-sm text-slate-600">Page {levelPage} / {totalLevelPages}</span>
                <button onClick={() => setLevelPage(p => Math.min(totalLevelPages, p + 1))} disabled={levelPage === totalLevelPages} className="px-3 py-1 text-xs border rounded disabled:opacity-40">Next</button>
                <button onClick={() => setLevelPage(totalLevelPages)} disabled={levelPage === totalLevelPages} className="px-3 py-1 text-xs border rounded disabled:opacity-40">Last</button>
              </div>
            )}
            <div className="space-y-1">
              {levelsToShow.map(ld => <LevelRow key={ld.level} levelData={ld} />)}
            </div>
          </div>
        )}

        {/* ── Classic 18-Level Scale ───────────────────────────────── */}
        {viewMode === "classic" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Classic Kardashev Scale (18 Levels)</h2>
              <p className="text-sm text-slate-500 mt-1">The original 18-level scale from Planetary Settler to Supreme Omnipotent.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kardashevTiers.map(tier => (
                <KardashevCard key={tier.level} tier={tier} currentLevel={currentLegacyLevel} resources={resources} />
              ))}
            </div>

            <Card className="bg-slate-50 border-slate-200">
              <CardHeader><CardTitle>About the Kardashev Scale</CardTitle></CardHeader>
              <CardContent className="text-sm text-slate-700 space-y-2">
                <p>The Kardashev Scale measures a civilization's technological advancement based on its energy utilization.</p>
                <p><strong>Levels 1-3:</strong> Planetary to System control — mastering the local environment.</p>
                <p><strong>Levels 4-7:</strong> Sector to Galactic control — expanding across star systems.</p>
                <p><strong>Levels 8-12:</strong> Multi-Galactic to Cosmic — controlling galaxies and universal forces.</p>
                <p><strong>Levels 13-18:</strong> Transcendence — becoming a god-like entity with control over reality.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* About section (always visible) */}
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader><CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> System Summary</CardTitle></CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold mb-1">Tier System (1–99)</p>
                <p>99 tiers across 5 categories and 32 sub-categories, each with a unique class (Alpha–Omega), sub-class (I–VI), type (Settler–Transcendent), sub-type, rank, and title.</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Level System (1–999)</p>
                <p>999 individual levels — each tier contains 10 or 11 levels. Levels provide granular XP-based progression with bonus multipliers, milestone rewards, and prestige tiers.</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Stats & Attributes</p>
                <p>Each tier has 4 primary stats (power, efficiency, stability, expansion), 6 secondary stats, 5 primary attributes, and 5 secondary attributes scaling from tier 1 to 99.</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Subjects</p>
                <p>Every tier features named subjects — specific domains of mastery with descriptions and detailed explanations covering the technologies, strategies, and phenomena of that tier.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}

function getKardashevLevelRange(start: number, end: number): KardashevLevelData[] {
  const result: KardashevLevelData[] = [];
  for (let l = Math.max(1, start); l <= Math.min(999, end); l++) {
    result.push(getKardashevLevel(l));
  }
  return result;
}
