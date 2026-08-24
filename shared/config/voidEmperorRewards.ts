export type DropPool = "guaranteed" | "bonus" | "legendary" | "mythic";

export interface VoidDropEntry {
  id: string;
  item: string;
  pool: DropPool;
  weight: number;
  chance: string;
  quantity: string;
  detail: string;
}

export interface LegendaryRecipe {
  id: string;
  name: string;
  slot: string;
  description: string;
  materials: Array<{ item: string; quantity: number }>;
  credits: number;
  craftSeconds: number;
  unlock: string;
  effect: string;
}

export const VOID_EMPEROR_DROP_DISTRIBUTION = {
  rollRules: [
    "Every successful clear grants the guaranteed pool.",
    "Every successful clear rolls one bonus pool reward using the normalized weights below.",
    "A second bonus roll is awarded when the raid interrupts at least two Unmake Rays.",
    "The legendary and mythic pools are independent bonus rolls and can upgrade the bonus result.",
  ],
  pools: [
    { id: "guaranteed", name: "Guaranteed Clear Bundle", rolls: 1, totalWeight: 100, entries: [
      { id: "sigil", item: "Void Emperor Sigil", weight: 100, chance: "100%", quantity: "1", detail: "Arc token for Void-class progression." },
      { id: "shards", item: "Singularity Shard", weight: 100, chance: "100%", quantity: "5–8", detail: "Null-field and gravity weapon material." },
      { id: "credits", item: "Credits", weight: 100, chance: "100%", quantity: "18,000–32,000", detail: "Contribution-scaled currency reward." },
      { id: "reputation", item: "Arc Reputation", weight: 100, chance: "100%", quantity: "900–1,400", detail: "Advances the Void arc event track." },
    ] as VoidDropEntry[] },
    { id: "bonus", name: "Bonus Material Pool", rolls: 1, totalWeight: 100, entries: [
      { id: "void-alloy", item: "Void Alloy", weight: 38, chance: "38%", quantity: "120–240", detail: "Endgame hull and defense fabrication." },
      { id: "black-crown-blueprint", item: "Black Crown Blueprint", weight: 22, chance: "22%", quantity: "1", detail: "Gravity-lane control module blueprint." },
      { id: "horizon-lance", item: "Event-Horizon Lance", weight: 15, chance: "15%", quantity: "1", detail: "Capital weapon that can pierce shield layers." },
      { id: "noctivar-mantle", item: "Noctivar's Mantle", weight: 12, chance: "12%", quantity: "1", detail: "Reduces suppression duration by 35%." },
      { id: "crown-fragment", item: "Crown Fragment", weight: 8, chance: "8%", quantity: "1–2", detail: "Legendary recipe catalyst." },
      { id: "null-essence", item: "Null Essence", weight: 5, chance: "5%", quantity: "2–4", detail: "Mythic recipe catalyst." },
    ] as VoidDropEntry[] },
    { id: "legendary", name: "Legendary Upgrade Pool", rolls: 1, totalWeight: 100, entries: [
      { id: "mantle-ascendant", item: "Ascendant Noctivar's Mantle", weight: 45, chance: "45%", quantity: "1", detail: "Upgrades the raid mantle with Reality Denial resistance." },
      { id: "lance-umbra", item: "Umbra Event-Horizon Lance", weight: 35, chance: "35%", quantity: "1", detail: "Upgrades the lance with a second shield-piercing charge." },
      { id: "crown-core", item: "Black Crown Core", weight: 20, chance: "20%", quantity: "1", detail: "Core component for the Void Emperor set." },
    ] as VoidDropEntry[] },
    { id: "mythic", name: "Mythic Relic Pool", rolls: 1, totalWeight: 100, entries: [
      { id: "crown-of-unmade", item: "Crown of the Unmade", weight: 60, chance: "60% of mythic roll / 3% overall", quantity: "1", detail: "Reduces Unmake Ray damage and grants +12% raid damage." },
      { id: "throne-fragment", item: "Throne Outside Reality", weight: 40, chance: "40% of mythic roll / 2% overall", quantity: "1", detail: "Mythic relic that grants one emergency phase rewind per week." },
    ] as VoidDropEntry[] },
  ],
} as const;

export const VOID_EMPEROR_LEGENDARY_RECIPES: LegendaryRecipe[] = [
  { id: "recipe-void-lance", name: "Event-Horizon Lance: Umbra", slot: "Capital weapon", description: "A lance that folds a shield layer into its own event horizon.", materials: [{ item: "Event-Horizon Lance", quantity: 1 }, { item: "Void Alloy", quantity: 180 }, { item: "Crown Fragment", quantity: 3 }, { item: "Singularity Shard", quantity: 12 }], credits: 80000, craftSeconds: 21600, unlock: "Void Arc Rank: Eclipse", effect: "+18% capital damage; first shield layer ignored once per phase." },
  { id: "recipe-noctivar-mantle", name: "Noctivar's Mantle: Sovereign", slot: "Commander armor", description: "The emperor's mantle, tuned to absorb suppression pulses.", materials: [{ item: "Noctivar's Mantle", quantity: 1 }, { item: "Void Alloy", quantity: 120 }, { item: "Null Essence", quantity: 4 }, { item: "Arc Reputation", quantity: 500 }], credits: 65000, craftSeconds: 18000, unlock: "Void Arc Rank: Sovereign", effect: "-50% suppression duration; marked-role healing penalty reduced by 20%." },
  { id: "recipe-black-crown", name: "Black Crown Control Array", slot: "Fleet module", description: "A control array that stabilizes a fleet inside rotating gravity lanes.", materials: [{ item: "Black Crown Blueprint", quantity: 1 }, { item: "Black Crown Core", quantity: 1 }, { item: "Void Alloy", quantity: 240 }, { item: "Singularity Shard", quantity: 20 }], credits: 100000, craftSeconds: 28800, unlock: "Void Arc Rank: Throne", effect: "Gravity-lane crossing damage -60%; horizon node damage +15%." },
  { id: "recipe-unmade-crown", name: "Crown of the Unmade", slot: "Mythic relic", description: "A forbidden crown forged from the remains of a defeated singularity.", materials: [{ item: "Crown of the Unmade", quantity: 1 }, { item: "Throne Outside Reality", quantity: 1 }, { item: "Null Essence", quantity: 12 }, { item: "Crown Fragment", quantity: 8 }], credits: 250000, craftSeconds: 86400, unlock: "Defeat Noctivar on hard enrage without a wipe", effect: "Unmake Ray damage -35%; +12% raid damage; once per raid, prevent a subsystem disable." },
  { id: "recipe-throne-reality", name: "Throne Outside Reality", slot: "Mythic relic", description: "A relic that lets one commander step outside the timeline of a failed phase.", materials: [{ item: "Throne Outside Reality", quantity: 1 }, { item: "Black Crown Core", quantity: 2 }, { item: "Null Essence", quantity: 16 }, { item: "Arc Reputation", quantity: 2000 }], credits: 350000, craftSeconds: 129600, unlock: "Complete all four Void Emperor phases with zero unresolved horizons", effect: "Once per week, rewind one failed arc-boss phase for the entire raid." },
];

export function getVoidEmperorPool(poolId: string) {
  return VOID_EMPEROR_DROP_DISTRIBUTION.pools.find((pool) => pool.id === poolId);
}
