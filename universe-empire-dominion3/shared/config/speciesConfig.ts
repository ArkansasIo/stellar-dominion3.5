export type TraitCategory = 'positive' | 'negative' | 'neutral';

export type EthicsId =
  | 'militarist'
  | 'pacifist'
  | 'xenophobe'
  | 'xenophile'
  | 'authoritarian'
  | 'egalitarian'
  | 'spiritualist'
  | 'materialist'
  | 'gestalt_hive'
  | 'gestalt_machine'
  | 'corporate'
  | 'individualist'
  | 'hive_mind'
  | 'machine_intelligence';

export type AuthorityId =
  | 'democracy'
  | 'oligarchy'
  | 'dictatorship'
  | 'imperial'
  | 'hive_mind'
  | 'machine_intelligence'
  | 'corporate_dynasty'
  | 'shared_burden'
  | 'corporate'
  | 'authoritarian';

export type SpeciesArchetypeId =
  | 'human_democracy'
  | 'klingon_empire'
  | 'borg_collective'
  | 'romulan_star_empire'
  | 'vulcan_science'
  | 'cardassian_union'
  | 'ferengi_commerce'
  | 'andorian_federation'
  | 'tellarite_republic'
  | 'xindi_council';

export interface TraitEffects {
  readonly military?: number;
  readonly research?: number;
  readonly economy?: number;
  readonly diplomacy?: number;
  readonly growth?: number;
  readonly habitability?: number;
  readonly happiness?: number;
  readonly leadership?: number;
  readonly popGrowthSpeed?: number;
  readonly buildSpeed?: number;
  readonly shipCost?: number;
  readonly edictDuration?: number;
  readonly crime?: number;
  readonly amenity?: number;
  readonly housing?: number;
  readonly unity?: number;
  readonly society?: number;
  readonly engineering?: number;
  readonly physics?: number;
  readonly navalCapacity?: number;
  readonly armyDamage?: number;
  readonly armyHealth?: number;
  readonly shield?: number;
  readonly hull?: number;
  readonly armor?: number;
  readonly fireRate?: number;
  readonly miningYield?: number;
  readonly farmingYield?: number;
  readonly energyYield?: number;
  readonly tradeValue?: number;
  readonly influence?: number;
  readonly adminCap?: number;
  readonly popResourceOutput?: number;
  readonly popResourceUpkeep?: number;
  readonly planetDamage?: number;
  readonly sublightSpeed?: number;
  readonly ftlSpeed?: number;
  readonly sensorRange?: number;
  readonly leaderLifespan?: number;
  readonly leaderCost?: number;
  readonly leaderExperienceGain?: number;
  readonly espionage?: number;
  readonly intel?: number;
  readonly crimeReduction?: number;
  readonly stabilityBonus?: number;
  readonly planetaryDefense?: number;
  readonly megastructureSpeed?: number;
  readonly terraformingCost?: number;
  readonly migrationSpeed?: number;
  readonly resettlementCost?: number;
  readonly popHappiness?: number;
  readonly popGrowth?: number;
  readonly popDecline?: number;
  readonly warExhaustion?: number;
  readonly claimCost?: number;
  readonly federationWeight?: number;
  readonly subjectLoyalty?: number;
  readonly diploWeight?: number;
  readonly branchOfficeValue?: number;
  readonly espionagePower?: number;
  readonly cybernetic?: number;
  readonly psionic?: number;
  readonly biological?: number;
  [key: string]: number | undefined;
}

export interface SpeciesTrait {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: TraitCategory;
  readonly effects: TraitEffects;
  readonly cost: number;
  readonly incompatibleWith: readonly string[];
}

export interface EthicsBonuses {
  readonly military?: number;
  readonly research?: number;
  readonly economy?: number;
  readonly diplomacy?: number;
  readonly unity?: number;
  readonly happiness?: number;
  readonly influence?: number;
  readonly society?: number;
  readonly physics?: number;
  readonly engineering?: number;
  readonly energy?: number;
  readonly minerals?: number;
  readonly food?: number;
  readonly consumerGoods?: number;
  readonly alloys?: number;
  readonly navalCapacity?: number;
  readonly adminCap?: number;
  readonly stabilityBonus?: number;
  readonly crimeReduction?: number;
  readonly popGrowthSpeed?: number;
  readonly tradeValue?: number;
  readonly armyDamage?: number;
  readonly shield?: number;
  readonly hull?: number;
  readonly armor?: number;
  readonly fireRate?: number;
  readonly sublightSpeed?: number;
  readonly ftlSpeed?: number;
  readonly sensorRange?: number;
  readonly espionage?: number;
  readonly unityCostReduction?: number;
  readonly edictDuration?: number;
  readonly warExhaustion?: number;
  readonly claimCost?: number;
  readonly federationWeight?: number;
  readonly subjectLoyalty?: number;
  readonly diploWeight?: number;
  readonly branchOfficeValue?: number;
  readonly popAmenity?: number;
  readonly popConsumerGoods?: number;
  readonly megastructureCost?: number;
  readonly terraformingSpeed?: number;
  readonly resettlementCost?: number;
  readonly migrationSpeed?: number;
  readonly leaderLifespan?: number;
  readonly leaderCost?: number;
  readonly leaderExperienceGain?: number;
  readonly psionic?: number;
  readonly buildSpeed?: number;
  readonly housing?: number;
  readonly habitability?: number;
  readonly cybernetic?: number;
  readonly miningYield?: number;
  readonly farmingYield?: number;
  readonly diplomaticWeight?: number;
  readonly megastructureSpeed?: number;
  [key: string]: number | undefined;
}

export interface EthicsPenalties {
  readonly military?: number;
  readonly research?: number;
  readonly economy?: number;
  readonly diplomacy?: number;
  readonly unity?: number;
  readonly happiness?: number;
  readonly influence?: number;
  readonly society?: number;
  readonly physics?: number;
  readonly engineering?: number;
  readonly energy?: number;
  readonly minerals?: number;
  readonly food?: number;
  readonly consumerGoods?: number;
  readonly alloys?: number;
  readonly navalCapacity?: number;
  readonly adminCap?: number;
  readonly stabilityBonus?: number;
  readonly crime?: number;
  readonly popGrowthSpeed?: number;
  readonly tradeValue?: number;
  readonly armyDamage?: number;
  readonly shield?: number;
  readonly hull?: number;
  readonly armor?: number;
  readonly fireRate?: number;
  readonly sublightSpeed?: number;
  readonly ftlSpeed?: number;
  readonly sensorRange?: number;
  readonly espionage?: number;
  readonly unityCostReduction?: number;
  readonly edictDuration?: number;
  readonly warExhaustion?: number;
  readonly claimCost?: number;
  readonly federationWeight?: number;
  readonly subjectLoyalty?: number;
  readonly diploWeight?: number;
  readonly branchOfficeValue?: number;
  readonly popAmenity?: number;
  readonly popConsumerGoods?: number;
  readonly megastructureCost?: number;
  readonly terraformingSpeed?: number;
  readonly resettlementCost?: number;
  readonly migrationSpeed?: number;
  readonly leaderLifespan?: number;
  readonly leaderCost?: number;
  readonly leaderExperienceGain?: number;
  [key: string]: number | undefined;
}

export interface Ethics {
  readonly id: EthicsId;
  readonly name: string;
  readonly description: string;
  readonly attractions: readonly EthicsId[];
  readonly opposites: readonly EthicsId[];
  readonly bonuses: EthicsBonuses;
  readonly penalties: EthicsPenalties;
  readonly icon: string;
}

export interface AuthorityBonuses {
  readonly military?: number;
  readonly research?: number;
  readonly economy?: number;
  readonly diplomacy?: number;
  readonly unity?: number;
  readonly happiness?: number;
  readonly influence?: number;
  readonly society?: number;
  readonly physics?: number;
  readonly engineering?: number;
  readonly energy?: number;
  readonly minerals?: number;
  readonly food?: number;
  readonly consumerGoods?: number;
  readonly alloys?: number;
  readonly navalCapacity?: number;
  readonly adminCap?: number;
  readonly stabilityBonus?: number;
  readonly crimeReduction?: number;
  readonly popGrowthSpeed?: number;
  readonly tradeValue?: number;
  readonly armyDamage?: number;
  readonly shield?: number;
  readonly hull?: number;
  readonly armor?: number;
  readonly fireRate?: number;
  readonly sublightSpeed?: number;
  readonly ftlSpeed?: number;
  readonly sensorRange?: number;
  readonly espionage?: number;
  readonly unityCostReduction?: number;
  readonly edictDuration?: number;
  readonly warExhaustion?: number;
  readonly claimCost?: number;
  readonly federationWeight?: number;
  readonly subjectLoyalty?: number;
  readonly diploWeight?: number;
  readonly branchOfficeValue?: number;
  readonly popAmenity?: number;
  readonly popConsumerGoods?: number;
  readonly megastructureCost?: number;
  readonly terraformingSpeed?: number;
  readonly resettlementCost?: number;
  readonly migrationSpeed?: number;
  readonly leaderLifespan?: number;
  readonly leaderCost?: number;
  readonly leaderExperienceGain?: number;
  readonly buildSpeed?: number;
  readonly housing?: number;
  readonly habitability?: number;
  readonly cybernetic?: number;
  readonly psionic?: number;
  readonly miningYield?: number;
  readonly farmingYield?: number;
  readonly diplomaticWeight?: number;
  readonly megastructureSpeed?: number;
  [key: string]: number | undefined;
}

export interface AuthorityPenalties {
  readonly military?: number;
  readonly research?: number;
  readonly economy?: number;
  readonly diplomacy?: number;
  readonly unity?: number;
  readonly happiness?: number;
  readonly influence?: number;
  readonly society?: number;
  readonly physics?: number;
  readonly engineering?: number;
  readonly energy?: number;
  readonly minerals?: number;
  readonly food?: number;
  readonly consumerGoods?: number;
  readonly alloys?: number;
  readonly navalCapacity?: number;
  readonly adminCap?: number;
  readonly stabilityBonus?: number;
  readonly crime?: number;
  readonly popGrowthSpeed?: number;
  readonly tradeValue?: number;
  readonly armyDamage?: number;
  readonly shield?: number;
  readonly hull?: number;
  readonly armor?: number;
  readonly fireRate?: number;
  readonly sublightSpeed?: number;
  readonly ftlSpeed?: number;
  readonly sensorRange?: number;
  readonly espionage?: number;
  readonly unityCostReduction?: number;
  readonly edictDuration?: number;
  readonly warExhaustion?: number;
  readonly claimCost?: number;
  readonly federationWeight?: number;
  readonly subjectLoyalty?: number;
  readonly diploWeight?: number;
  readonly branchOfficeValue?: number;
  readonly popAmenity?: number;
  readonly popConsumerGoods?: number;
  readonly megastructureCost?: number;
  readonly terraformingSpeed?: number;
  readonly resettlementCost?: number;
  readonly migrationSpeed?: number;
  readonly leaderLifespan?: number;
  readonly leaderCost?: number;
  readonly leaderExperienceGain?: number;
}

export interface AuthorityType {
  readonly id: AuthorityId;
  readonly name: string;
  readonly description: string;
  readonly ethicsRestriction: readonly EthicsId[];
  readonly bonuses: AuthorityBonuses;
  readonly penalties: AuthorityPenalties;
  readonly specialMechanics: readonly string[];
}

export interface OriginRequirements {
  readonly ethics?: readonly EthicsId[];
  readonly authority?: readonly AuthorityId[];
  readonly traits?: readonly string[];
  readonly minTechLevel?: number;
  [key: string]: any;
}

export interface OriginBonuses {
  readonly military?: number;
  readonly research?: number;
  readonly economy?: number;
  readonly diplomacy?: number;
  readonly unity?: number;
  readonly happiness?: number;
  readonly influence?: number;
  readonly society?: number;
  readonly physics?: number;
  readonly engineering?: number;
  readonly energy?: number;
  readonly minerals?: number;
  readonly food?: number;
  readonly consumerGoods?: number;
  readonly alloys?: number;
  readonly navalCapacity?: number;
  readonly adminCap?: number;
  readonly stabilityBonus?: number;
  readonly crimeReduction?: number;
  readonly popGrowthSpeed?: number;
  readonly tradeValue?: number;
  readonly armyDamage?: number;
  readonly shield?: number;
  readonly hull?: number;
  readonly armor?: number;
  readonly fireRate?: number;
  readonly sublightSpeed?: number;
  readonly ftlSpeed?: number;
  readonly sensorRange?: number;
  readonly espionage?: number;
  readonly unityCostReduction?: number;
  readonly edictDuration?: number;
  readonly warExhaustion?: number;
  readonly claimCost?: number;
  readonly federationWeight?: number;
  readonly subjectLoyalty?: number;
  readonly diploWeight?: number;
  readonly branchOfficeValue?: number;
  readonly popAmenity?: number;
  readonly popConsumerGoods?: number;
  readonly megastructureCost?: number;
  readonly terraformingSpeed?: number;
  readonly resettlementCost?: number;
  readonly migrationSpeed?: number;
  readonly leaderLifespan?: number;
  readonly leaderCost?: number;
  readonly leaderExperienceGain?: number;
  [key: string]: number | undefined;
}

export interface Origin {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly requirements: OriginRequirements;
  readonly bonuses: OriginBonuses;
  readonly specialMechanics: readonly string[];
  readonly startEffect: string;
}

export interface GovernmentBonuses {
  readonly military?: number;
  readonly research?: number;
  readonly economy?: number;
  readonly diplomacy?: number;
  readonly unity?: number;
  readonly happiness?: number;
  readonly influence?: number;
  readonly society?: number;
  readonly physics?: number;
  readonly engineering?: number;
  readonly energy?: number;
  readonly minerals?: number;
  readonly food?: number;
  readonly consumerGoods?: number;
  readonly alloys?: number;
  readonly navalCapacity?: number;
  readonly adminCap?: number;
  readonly stabilityBonus?: number;
  readonly crimeReduction?: number;
  readonly popGrowthSpeed?: number;
  readonly tradeValue?: number;
  readonly armyDamage?: number;
  readonly shield?: number;
  readonly hull?: number;
  readonly armor?: number;
  readonly fireRate?: number;
  readonly sublightSpeed?: number;
  readonly ftlSpeed?: number;
  readonly sensorRange?: number;
  readonly espionage?: number;
  readonly unityCostReduction?: number;
  readonly edictDuration?: number;
  readonly warExhaustion?: number;
  readonly claimCost?: number;
  readonly federationWeight?: number;
  readonly subjectLoyalty?: number;
  readonly diploWeight?: number;
  readonly branchOfficeValue?: number;
  readonly popAmenity?: number;
  readonly popConsumerGoods?: number;
  readonly megastructureCost?: number;
  readonly terraformingSpeed?: number;
  readonly resettlementCost?: number;
  readonly migrationSpeed?: number;
  readonly leaderLifespan?: number;
  readonly leaderCost?: number;
  readonly leaderExperienceGain?: number;
  [key: string]: number | undefined;
}

export interface GovernmentEdicts {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly duration: number;
  readonly cost: number;
  readonly effects: GovernmentBonuses;
}

export interface GovernmentType {
  readonly id: string;
  readonly name: string;
  readonly authorityRequired: readonly AuthorityId[];
  readonly bonuses: GovernmentBonuses;
  readonly edicts: readonly GovernmentEdicts[];
}

export interface SpeciesArchetype {
  readonly id: SpeciesArchetypeId;
  readonly name: string;
  readonly description: string;
  readonly defaultEthics: readonly EthicsId[];
  readonly defaultAuthority: AuthorityId;
  readonly traits: readonly string[];
  readonly portrait: string;
  readonly homeworldName: string;
  readonly shipPrefix: string;
  readonly planetPrefix: string;
}

export interface NamePool {
  readonly firstNames: readonly string[];
  readonly lastNames: readonly string[];
  readonly shipPrefixes: readonly string[];
  readonly planetPrefixes: readonly string[];
}

export const SPECIES_TRAITS: readonly SpeciesTrait[] = [
  {
    id: 'strong',
    name: 'Strong',
    description: 'Physically powerful species with enhanced muscle mass.',
    category: 'positive',
    effects: { armyDamage: 15, miningYield: 10, housing: 1 },
    cost: 2,
    incompatibleWith: ['weak', 'diminutive'],
  },
  {
    id: 'weak',
    name: 'Weak',
    description: 'Physically frail species requiring support structures.',
    category: 'negative',
    effects: { armyDamage: -15, miningYield: -10 },
    cost: -1,
    incompatibleWith: ['strong', 'resilient'],
  },
  {
    id: 'resilient',
    name: 'Resilient',
    description: 'Hardy species capable of enduring harsh conditions.',
    category: 'positive',
    effects: { armyHealth: 25, habitability: 5, happiness: 3 },
    cost: 2,
    incompatibleWith: ['fragile', 'weak'],
  },
  {
    id: 'fragile',
    name: 'Fragile',
    description: 'Delicate species vulnerable to physical stress.',
    category: 'negative',
    effects: { armyHealth: -25, habitability: -5, happiness: -3 },
    cost: -1,
    incompatibleWith: ['resilient', 'strong'],
  },
  {
    id: 'giant',
    name: 'Giant',
    description: 'Large-bodied species with significant physical presence.',
    category: 'neutral',
    effects: { housing: -1, armyDamage: 20, popGrowthSpeed: -10, shield: 10 },
    cost: 0,
    incompatibleWith: ['diminutive'],
  },
  {
    id: 'diminutive',
    name: 'Diminutive',
    description: 'Small species with reduced resource requirements.',
    category: 'neutral',
    effects: { housing: 1, armyDamage: -10, popGrowthSpeed: 10, popResourceUpkeep: -10 },
    cost: 0,
    incompatibleWith: ['giant', 'strong'],
  },
  {
    id: 'intelligent',
    name: 'Intelligent',
    description: 'Highly cognitive species with exceptional mental faculties.',
    category: 'positive',
    effects: { research: 10, society: 10, physics: 10, engineering: 10, leaderExperienceGain: 10 },
    cost: 3,
    incompatibleWith: ['unintelligent'],
  },
  {
    id: 'unintelligent',
    name: 'Unintelligent',
    description: 'Species with limited cognitive capabilities.',
    category: 'negative',
    effects: { research: -10, society: -10, physics: -10, engineering: -10 },
    cost: -2,
    incompatibleWith: ['intelligent'],
  },
  {
    id: 'natural_engineers',
    name: 'Natural Engineers',
    description: 'Innate understanding of technology and construction.',
    category: 'positive',
    effects: { engineering: 15, buildSpeed: 10 },
    cost: 2,
    incompatibleWith: ['natural_physicists', 'natural_sociologists'],
  },
  {
    id: 'natural_physicists',
    name: 'Natural Physicists',
    description: 'Instinctive grasp of fundamental physical forces.',
    category: 'positive',
    effects: { physics: 15, shield: 10 },
    cost: 2,
    incompatibleWith: ['natural_engineers', 'natural_sociologists'],
  },
  {
    id: 'natural_sociologists',
    name: 'Natural Sociologists',
    description: 'Deep understanding of social structures and organisms.',
    category: 'positive',
    effects: { society: 15, diplomacy: 10, unity: 10 },
    cost: 2,
    incompatibleWith: ['natural_engineers', 'natural_physicists'],
  },
  {
    id: 'charismatic',
    name: 'Charismatic',
    description: 'Naturally persuasive and socially adept species.',
    category: 'positive',
    effects: { diplomacy: 15, happiness: 5, unity: 5, tradeValue: 10 },
    cost: 2,
    incompatibleWith: ['repulsive'],
  },
  {
    id: 'repulsive',
    name: 'Repulsive',
    description: 'Species that struggle with interpersonal connections.',
    category: 'negative',
    effects: { diplomacy: -15, happiness: -5, unity: -5, tradeValue: -10 },
    cost: -2,
    incompatibleWith: ['charismatic'],
  },
  {
    id: 'diplomatic',
    name: 'Diplomatic',
    description: 'Naturally inclined toward negotiation and cooperation.',
    category: 'positive',
    effects: { diplomacy: 10, federationWeight: 10, diploWeight: 5 },
    cost: 2,
    incompatibleWith: ['solitary'],
  },
  {
    id: 'solitary',
    name: 'Solitary',
    description: 'Prefers isolation and self-reliance over cooperation.',
    category: 'neutral',
    effects: { unity: 10, happiness: 5, federationWeight: -20, adminCap: 5 },
    cost: 0,
    incompatibleWith: ['diplomatic', 'charismatic'],
  },
  {
    id: 'rapid_breeders',
    name: 'Rapid Breeders',
    description: 'Species with accelerated reproductive cycles.',
    category: 'positive',
    effects: { popGrowthSpeed: 20, popGrowth: 10 },
    cost: 2,
    incompatibleWith: ['slow_breeders', 'sterile'],
  },
  {
    id: 'slow_breeders',
    name: 'Slow Breeders',
    description: 'Species with extended gestation periods.',
    category: 'negative',
    effects: { popGrowthSpeed: -20, popGrowth: -10 },
    cost: -1,
    incompatibleWith: ['rapid_breeders', 'fertile'],
  },
  {
    id: 'long_lived',
    name: 'Long-Lived',
    description: 'Species with significantly extended lifespans.',
    category: 'positive',
    effects: { leaderLifespan: 50, leaderExperienceGain: 15, happiness: 3 },
    cost: 3,
    incompatibleWith: ['short_lived'],
  },
  {
    id: 'short_lived',
    name: 'Short-Lived',
    description: 'Species with compressed lifespans and rapid aging.',
    category: 'negative',
    effects: { leaderLifespan: -30, leaderExperienceGain: -10, leaderCost: -20 },
    cost: -1,
    incompatibleWith: ['long_lived'],
  },
  {
    id: 'fertile',
    name: 'Fertile',
    description: 'Highly reproductive species with large family sizes.',
    category: 'positive',
    effects: { popGrowthSpeed: 15, popGrowth: 15, food: 5 },
    cost: 2,
    incompatibleWith: ['sterile', 'slow_breeders'],
  },
  {
    id: 'sterile',
    name: 'Sterile',
    description: 'Cannot reproduce naturally, requires cloning or mechanical means.',
    category: 'negative',
    effects: { popGrowthSpeed: -40, research: 5, unity: 5 },
    cost: -2,
    incompatibleWith: ['fertile', 'rapid_breeders'],
  },
  {
    id: 'thrifty',
    name: 'Thrifty',
    description: 'Naturally efficient with resource management.',
    category: 'positive',
    effects: { tradeValue: 20, energy: 10, minerals: 10 },
    cost: 2,
    incompatibleWith: ['extravagant'],
  },
  {
    id: 'extravagant',
    name: 'Extravagant',
    description: 'Species that consumes resources at accelerated rates.',
    category: 'negative',
    effects: { tradeValue: -15, consumerGoods: -15, happiness: 5 },
    cost: -1,
    incompatibleWith: ['thrifty', 'industrious'],
  },
  {
    id: 'industrious',
    name: 'Industrious',
    description: 'Hardworking species with exceptional production output.',
    category: 'positive',
    effects: { minerals: 10, alloys: 10, consumerGoods: 10, buildSpeed: 5 },
    cost: 2,
    incompatibleWith: ['idle'],
  },
  {
    id: 'idle',
    name: 'Idle',
    description: 'Species prone to懒散 and reduced productivity.',
    category: 'negative',
    effects: { minerals: -10, alloys: -10, consumerGoods: -10, happiness: 3 },
    cost: -1,
    incompatibleWith: ['industrious', 'thrifty'],
  },
  {
    id: 'aggressive',
    name: 'Aggressive',
    description: 'Naturally combative species with strong military instincts.',
    category: 'positive',
    effects: { military: 15, armyDamage: 15, fireRate: 5 },
    cost: 2,
    incompatibleWith: ['defensive'],
  },
  {
    id: 'defensive',
    name: 'Defensive',
    description: 'Species skilled in fortification and protection.',
    category: 'positive',
    effects: { planetaryDefense: 20, shield: 10, armor: 10 },
    cost: 2,
    incompatibleWith: ['aggressive'],
  },
  {
    id: 'adaptable',
    name: 'Adaptable',
    description: 'Highly adaptable species that thrives in varied conditions.',
    category: 'positive',
    effects: { habitability: 10, migrationSpeed: 15, resettlementCost: -15 },
    cost: 2,
    incompatibleWith: ['rigid'],
  },
  {
    id: 'rigid',
    name: 'Rigid',
    description: 'Species resistant to change and new environments.',
    category: 'negative',
    effects: { habitability: -10, migrationSpeed: -15, unity: 5 },
    cost: -1,
    incompatibleWith: ['adaptable'],
  },
  {
    id: 'psionic',
    name: 'Psionic',
    description: 'Species with latent psychic potential and mental abilities.',
    category: 'positive',
    effects: { psionic: 20, diplomacy: 10, espionage: 10, leaderExperienceGain: 10 },
    cost: 4,
    incompatibleWith: ['cybernetic', 'synthetic'],
  },
  {
    id: 'cybernetic',
    name: 'Cybernetic',
    description: 'Species enhanced with cybernetic augmentations.',
    category: 'positive',
    effects: { cybernetic: 20, research: 10, military: 5, leaderLifespan: 20 },
    cost: 4,
    incompatibleWith: ['psionic'],
  },
  {
    id: 'synthetic',
    name: 'Synthetic',
    description: 'Fully artificial consciousness inhabiting mechanical bodies.',
    category: 'neutral',
    effects: { cybernetic: 30, research: 15, popGrowthSpeed: 20, happiness: 10 },
    cost: 5,
    incompatibleWith: ['psionic', 'cybernetic'],
  },
  {
    id: 'hive_mind',
    name: 'Hive Mind',
    description: 'Collective consciousness shared among all individuals.',
    category: 'neutral',
    effects: { unity: 30, happiness: 20, diplomacy: -30, crimeReduction: 20 },
    cost: 5,
    incompatibleWith: ['machine_intelligence'],
  },
  {
    id: 'machine_intelligence',
    name: 'Machine Intelligence',
    description: 'Artificial superintelligence controlling all machines.',
    category: 'neutral',
    effects: { research: 20, unity: 20, diplomacy: -30, crimeReduction: 30 },
    cost: 5,
    incompatibleWith: ['hive_mind'],
  },
  {
    id: 'enduring',
    name: 'Enduring',
    description: 'Species with naturally extended healthspan.',
    category: 'positive',
    effects: { leaderLifespan: 25, leaderExperienceGain: 5 },
    cost: 1,
    incompatibleWith: [],
  },
  {
    id: 'ingenious',
    name: 'Ingenious',
    description: 'Naturally inventive and creative species.',
    category: 'positive',
    effects: { engineering: 10, physics: 5, buildSpeed: 5 },
    cost: 2,
    incompatibleWith: [],
  },
  {
    id: 'tradition',
    name: 'Traditional',
    description: 'Species deeply connected to their cultural heritage.',
    category: 'positive',
    effects: { unity: 15, society: 10, happiness: 3 },
    cost: 2,
    incompatibleWith: ['flexible'],
  },
  {
    id: 'flexible',
    name: 'Flexible',
    description: 'Highly adaptable culture that embraces change.',
    category: 'positive',
    effects: { research: 5, migrationSpeed: 10, habitability: 5 },
    cost: 2,
    incompatibleWith: ['tradition', 'rigid'],
  },
  {
    id: 'deviants',
    name: 'Deviants',
    description: 'Prone to rebellious behavior and social unrest.',
    category: 'negative',
    effects: { crime: 10, stabilityBonus: -5 },
    cost: -1,
    incompatibleWith: [],
  },
  {
    id: 'unruly',
    name: 'Unruly',
    description: 'Difficult to govern with strong individualistic tendencies.',
    category: 'negative',
    effects: { adminCap: -10, unity: -5, crime: 5 },
    cost: -1,
    incompatibleWith: [],
  },
  {
    id: ' sedentary',
    name: 'Sedentary',
    description: 'Unwilling to relocate, resistant to migration.',
    category: 'negative',
    effects: { migrationSpeed: -25, resettlementCost: 25 },
    cost: -1,
    incompatibleWith: ['nomadic'],
  },
  {
    id: 'nomadic',
    name: 'Nomadic',
    description: 'Natural wanderers who easily relocate.',
    category: 'positive',
    effects: { migrationSpeed: 25, resettlementCost: -25 },
    cost: 1,
    incompatibleWith: ['sedentary'],
  },
  {
    id: 'repugnant',
    name: 'Repugnant',
    description: 'Physically unappealing to most other species.',
    category: 'negative',
    effects: { diplomacy: -10, tradeValue: -10, popAmenity: -10 },
    cost: -1,
    incompatibleWith: ['charismatic'],
  },
  {
    id: 'beautiful',
    name: 'Beautiful',
    description: 'Aesthetically pleasing species that inspires others.',
    category: 'positive',
    effects: { diplomacy: 10, tradeValue: 10, popAmenity: 10 },
    cost: 2,
    incompatibleWith: ['repugnant'],
  },
  {
    id: 'voidborn',
    name: 'Voidborn',
    description: 'Adapted to life in space stations and zero gravity.',
    category: 'neutral',
    effects: { habitability: -20, research: 10, megastructureSpeed: 10 },
    cost: 0,
    incompatibleWith: [],
  },
  {
    id: 'cave_dweller',
    name: 'Cave Dweller',
    description: 'Thrives underground in enclosed environments.',
    category: 'neutral',
    effects: { habitability: 5, miningYield: 10, sensorRange: -5 },
    cost: 0,
    incompatibleWith: [],
  },
  {
    id: 'aquatic',
    name: 'Aquatic',
    description: 'Requires aquatic environment for optimal functioning.',
    category: 'neutral',
    effects: { habitability: -15, energy: 10, food: 10, research: 5 },
    cost: 0,
    incompatibleWith: [],
  },
];

export const SPECIES_ETHICS: readonly Ethics[] = [
  {
    id: 'militarist',
    name: 'Militarist',
    description: 'Believes in strength through military power and conquest.',
    attractions: ['xenophobe', 'authoritarian', 'spiritualist'],
    opposites: ['pacifist', 'xenophile', 'egalitarian'],
    bonuses: { military: 15, alloys: 10, navalCapacity: 10, armyDamage: 10, fireRate: 5 },
    penalties: { diplomacy: -10, happiness: -5, research: -5 },
    icon: '⚔️',
  },
  {
    id: 'pacifist',
    name: 'Pacifist',
    description: 'Values peace, cooperation, and non-violent solutions.',
    attractions: ['xenophile', 'egalitarian', 'materialist'],
    opposites: ['militarist', 'xenophobe', 'authoritarian'],
    bonuses: { happiness: 10, unity: 10, diplomacy: 10, research: 5 },
    penalties: { military: -10, alloys: -10, navalCapacity: -5 },
    icon: '🕊️',
  },
  {
    id: 'xenophobe',
    name: 'Xenophobe',
    description: 'Distrusts alien species and prioritizes their own kind.',
    attractions: ['militarist', 'authoritarian', 'spiritualist'],
    opposites: ['xenophile', 'pacifist', 'egalitarian'],
    bonuses: { unity: 10, armyDamage: 10, adminCap: 5, claimCost: -10 },
    penalties: { diplomacy: -20, tradeValue: -10, popGrowthSpeed: -5 },
    icon: '🚫',
  },
  {
    id: 'xenophile',
    name: 'Xenophile',
    description: 'Fascinated by alien cultures and eager to cooperate.',
    attractions: ['pacifist', 'egalitarian', 'materialist'],
    opposites: ['xenophobe', 'militarist', 'authoritarian'],
    bonuses: { diplomacy: 20, tradeValue: 15, popGrowthSpeed: 10, migrationSpeed: 10 },
    penalties: { unity: -5, adminCap: -5 },
    icon: '👽',
  },
  {
    id: 'authoritarian',
    name: 'Authoritarian',
    description: 'Believes in strong centralized authority and social hierarchy.',
    attractions: ['militarist', 'xenophobe', 'spiritualist'],
    opposites: ['egalitarian', 'pacifist', 'individualist'],
    bonuses: { unity: 15, stabilityBonus: 10, crimeReduction: 10, alloys: 5 },
    penalties: { happiness: -10, diplomacy: -5, consumerGoods: -5 },
    icon: '👑',
  },
  {
    id: 'egalitarian',
    name: 'Egalitarian',
    description: 'Committed to equality and democratic principles.',
    attractions: ['pacifist', 'xenophile', 'materialist'],
    opposites: ['authoritarian', 'militarist', 'xenophobe'],
    bonuses: { happiness: 10, unity: 10, research: 5, diplomacy: 5 },
    penalties: { alloys: -5, adminCap: -5, stabilityBonus: -5 },
    icon: '⚖️',
  },
  {
    id: 'spiritualist',
    name: 'Spiritualist',
    description: 'Guided by faith and belief in the transcendent.',
    attractions: ['militarist', 'authoritarian', 'xenophobe'],
    opposites: ['materialist', 'machine_intelligence'],
    bonuses: { unity: 20, happiness: 10, psionic: 10, influence: 5 },
    penalties: { research: -10, alloys: -5 },
    icon: '🙏',
  },
  {
    id: 'materialist',
    name: 'Materialist',
    description: 'Values scientific progress and empirical knowledge above all.',
    attractions: ['pacifist', 'xenophile', 'egalitarian'],
    opposites: ['spiritualist', 'hive_mind'],
    bonuses: { research: 20, physics: 10, engineering: 10, society: 10 },
    penalties: { unity: -10, happiness: -5 },
    icon: '🔬',
  },
  {
    id: 'gestalt_hive',
    name: 'Gestalt Consciousness',
    description: 'A unified collective mind controlling all individuals.',
    attractions: [],
    opposites: ['individualist', 'egalitarian'],
    bonuses: { unity: 30, crimeReduction: 20, popGrowthSpeed: 15, military: 10 },
    penalties: { diplomacy: -40, happiness: -20, tradeValue: -30 },
    icon: '🧠',
  },
  {
    id: 'gestalt_machine',
    name: 'Machine Intelligence',
    description: 'A network of artificial intelligences operating as one.',
    attractions: [],
    opposites: ['spiritualist', 'individualist'],
    bonuses: { research: 25, unity: 25, crimeReduction: 30, buildSpeed: 10 },
    penalties: { diplomacy: -40, happiness: -30, tradeValue: -30, popGrowthSpeed: -10 },
    icon: '🤖',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Driven by profit and commercial interests.',
    attractions: ['materialist', 'individualist'],
    opposites: ['egalitarian', 'spiritualist'],
    bonuses: { tradeValue: 20, energy: 15, minerals: 10, branchOfficeValue: 15 },
    penalties: { unity: -10, happiness: -5, alloys: -5 },
    icon: '💼',
  },
  {
    id: 'individualist',
    name: 'Individualist',
    description: 'Prioritizes personal freedom and self-determination.',
    attractions: ['egalitarian', 'pacifist', 'corporate'],
    opposites: ['authoritarian', 'hive_mind', 'machine_intelligence'],
    bonuses: { happiness: 10, tradeValue: 10, leaderExperienceGain: 10 },
    penalties: { unity: -15, stabilityBonus: -10, adminCap: -5 },
    icon: '🌟',
  },
];

export const AUTHORITY_TYPES: readonly AuthorityType[] = [
  {
    id: 'democracy',
    name: 'Democracy',
    description: 'Government by the people through elected representatives.',
    ethicsRestriction: ['pacifist', 'egalitarian', 'xenophile', 'materialist'],
    bonuses: { happiness: 10, unity: 10, research: 5, diplomacy: 5, consumerGoods: 5 },
    penalties: { alloys: -5, stabilityBonus: -5 },
    specialMechanics: ['elections every 10 years', 'leader term limits', 'policy cooldowns reduced 20%'],
  },
  {
    id: 'oligarchy',
    name: 'Oligarchy',
    description: 'Rule by a select group of powerful individuals.',
    ethicsRestriction: ['materialist', 'xenophobe', 'corporate', 'individualist'],
    bonuses: { economy: 15, tradeValue: 10, influence: 10, alloys: 5 },
    penalties: { happiness: -10, unity: -5, diplomacy: -5 },
    specialMechanics: ['powerful leaders with unique agendas', 'council size increased by 2', 'edict duration +25%'],
  },
  {
    id: 'dictatorship',
    name: 'Dictatorship',
    description: 'Absolute rule by a single leader with unchecked power.',
    ethicsRestriction: ['militarist', 'authoritarian', 'xenophobe'],
    bonuses: { military: 15, alloys: 10, unity: 10, adminCap: 5 },
    penalties: { happiness: -15, diplomacy: -10, research: -5 },
    specialMechanics: ['permanent ruler', 'can purge populations', 'aggressive expansion costs -20%'],
  },
  {
    id: 'imperial',
    name: 'Imperial',
    description: 'Hereditary rule passed down through a royal bloodline.',
    ethicsRestriction: ['authoritarian', 'spiritualist', 'militarist'],
    bonuses: { unity: 15, stabilityBonus: 10, alloys: 5, influence: 10 },
    penalties: { research: -5, happiness: -10, consumerGoods: -5 },
    specialMechanics: ['dynastic succession', 'imperial court mechanics', 'subject loyalty +20%'],
  },
  {
    id: 'hive_mind',
    name: 'Hive Mind',
    description: 'All individuals share a single collective consciousness.',
    ethicsRestriction: ['gestalt_hive'],
    bonuses: { unity: 30, crimeReduction: 20, popGrowthSpeed: 15, military: 10, adminCap: 20 },
    penalties: { diplomacy: -40, happiness: -30, tradeValue: -30, consumerGoods: -50 },
    specialMechanics: ['no individual leaders', 'population cannot be displaced', 'assimilation of pops', 'can purge at will'],
  },
  {
    id: 'machine_intelligence',
    name: 'Machine Intelligence',
    description: 'A network of artificial intelligences governing all systems.',
    ethicsRestriction: ['gestalt_machine'],
    bonuses: { research: 25, unity: 25, crimeReduction: 30, buildSpeed: 10, adminCap: 20 },
    penalties: { diplomacy: -40, happiness: -40, tradeValue: -30, popGrowthSpeed: -10 },
    specialMechanics: ['no biological pops', 'assembly only', 'can purge organic pops', 'specialist pop assembly'],
  },
  {
    id: 'corporate_dynasty',
    name: 'Corporate Dynasty',
    description: 'Rule by the most successful corporate entities.',
    ethicsRestriction: ['corporate', 'materialist', 'individualist'],
    bonuses: { tradeValue: 20, energy: 15, branchOfficeValue: 20, minerals: 10 },
    penalties: { unity: -10, happiness: -5, alloys: -5, research: -5 },
    specialMechanics: ['branch offices on all planets', 'trade value doubled on planets', 'special edicts for megacorps'],
  },
  {
    id: 'shared_burden',
    name: 'Shared Burden',
    description: 'Communal society where all labor and resources are shared.',
    ethicsRestriction: ['egalitarian', 'pacifist', 'materialist'],
    bonuses: { unity: 20, happiness: 15, housing: 2, amenity: 10 },
    penalties: { alloys: -10, energy: -5, minerals: -5, consumerGoods: -10 },
    specialMechanics: ['no stratum system', 'unemployment is beneficial', 'shared housing mechanics', 'no trade value'],
  },
];

export const SPECIES_ORIGINS: readonly Origin[] = [
  {
    id: 'lost_colony',
    name: 'Lost Colony',
    description: 'A colony ship from a long-lost Earth-type homeworld.',
    requirements: {},
    bonuses: { habitability: 10, popGrowthSpeed: 10, research: 5 },
    specialMechanics: ['starts with a relic world', 'unique dig site chain', 'bonus to habitability'],
    startEffect: 'colonists awaken from cryosleep on a habitable world',
  },
  {
    id: 'mechanist',
    name: 'Mechanist',
    description: 'Early spacefaring civilization focused on mechanical augmentation.',
    requirements: { ethics: ['materialist'] },
    bonuses: { research: 10, cybernetic: 10, buildSpeed: 10 },
    specialMechanics: ['starts with robot assembly plant', 'robotic pops from game start', 'engineering research +20%'],
    startEffect: 'empire begins with robotic workforce augmentation',
  },
  {
    id: 'syncretic_evolution',
    name: 'Syncretic Evolution',
    description: 'Two species evolved together in symbiosis.',
    requirements: {},
    bonuses: { unity: 10, happiness: 5, diplomacy: 5 },
    specialMechanics: ['secondary species with different traits', 'shared worlds', 'bonus to diplomatic relations'],
    startEffect: 'empire begins with two co-existing species',
  },
  {
    id: 'post_apocalyptic',
    name: 'Post-Apocalyptic',
    description: 'Survivors of a devastating nuclear war on their homeworld.',
    requirements: {},
    bonuses: { habitability: 15, armyDamage: 10, planetaryDefense: 15 },
    specialMechanics: ['starts on tomb world', 'can colonize tomb worlds normally', 'radiation resistance'],
    startEffect: 'civilization rebuilds from radioactive ashes',
  },
  {
    id: 'remnants',
    name: 'Remnants',
    description: 'Descendants of a once-great fallen empire.',
    requirements: {},
    bonuses: { unity: 15, research: 10, alloys: 5 },
    specialMechanics: ['starts on relic world', 'ancient technologies available', 'dig sites on homeworld'],
    startEffect: 'empire discovers ancient technology among ruins',
  },
  {
    id: 'scion',
    name: 'Scion',
    description: 'A young empire under the patronage of an ancient fallen empire.',
    requirements: { ethics: ['spiritualist'] },
    bonuses: { unity: 10, diplomacy: 15, alloys: 5 },
    specialMechanics: ['patron fallen empire', 'special diplomatic options', 'protection from early wars'],
    startEffect: 'fallen empire takes interest in the civilization',
  },
  {
    id: 'federation_founders',
    name: 'Federation Founders',
    description: 'Natural diplomats who quickly form interstellar alliances.',
    requirements: { ethics: ['xenophile', 'egalitarian'] },
    bonuses: { diplomacy: 20, federationWeight: 20, diploWeight: 10 },
    specialMechanics: ['starts in a federation', 'federation influence gain +50%', 'can propose federation laws early'],
    startEffect: 'empire begins as founding member of a galactic federation',
  },
  {
    id: 'void_dwellers',
    name: 'Void Dwellers',
    description: 'Adapted to life in space stations, uncomfortable on planets.',
    requirements: {},
    bonuses: { research: 10, megastructureSpeed: 15, alloys: 5 },
    specialMechanics: ['starts with three habitats', 'reduced planetary habitability', 'habitat construction bonus'],
    startEffect: 'civilization thrives in orbital habitats',
  },
  {
    id: 'tree_of_life',
    name: 'Tree of Life',
    description: 'Homeworld centered around a massive, sacred tree organism.',
    requirements: { ethics: ['spiritualist', 'pacifist'] },
    bonuses: { unity: 15, popGrowthSpeed: 10, food: 15 },
    specialMechanics: ['unique planetary feature', 'tree of life as building', 'bonus to biological pops'],
    startEffect: 'ancient tree organism nurtures the species',
  },
  {
    id: 'ocean_paradise',
    name: 'Ocean Paradise',
    description: 'A lush oceanic homeworld with abundant life.',
    requirements: {},
    bonuses: { habitability: 10, food: 10, energy: 10, happiness: 5 },
    specialMechanics: ['starts on ocean world', 'aquatic preference', 'fishing and seafood bonus'],
    startEffect: 'oceanic world teeming with marine life',
  },
  {
    id: 'prosperous_unification',
    name: 'Prosperous Unification',
    description: 'Recently unified planetary government with strong infrastructure.',
    requirements: {},
    bonuses: { stabilityBonus: 10, unity: 10, consumerGoods: 10, alloys: 5 },
    specialMechanics: ['starts with additional districts', 'bonus to all resources', 'improved diplomatic standing'],
    startEffect: 'recently unified planet enjoys prosperity',
  },
  {
    id: 'galactic_doorstep',
    name: 'Galactic Doorstep',
    description: 'Located at a strategic chokepoint in galactic hyperspace lanes.',
    requirements: {},
    bonuses: { sensorRange: 20, ftlSpeed: 10, tradeValue: 15 },
    specialMechanics: ['strategic location', 'bonus to trade routes', 'early sensor advantage'],
    startEffect: 'empire sits at a crucial galactic crossroads',
  },
  {
    id: 'resource_consolidation',
    name: 'Resource Consolidation',
    description: 'Expert resource extraction and processing capabilities.',
    requirements: {},
    bonuses: { minerals: 20, energy: 15, alloys: 10, miningYield: 15 },
    specialMechanics: ['extra mineral deposits', 'reduced mining cost', 'bonus to mining stations'],
    startEffect: 'abundant mineral and energy resources discovered',
  },
  {
    id: 'common_ground',
    name: 'Common Ground',
    description: 'Multiple species sharing a homeworld in peaceful coexistence.',
    requirements: {},
    bonuses: { diplomacy: 10, unity: 10, popGrowthSpeed: 10 },
    specialMechanics: ['starts with two species', 'bonus to happiness', 'shared planetary features'],
    startEffect: 'multiple species peacefully share the homeworld',
  },
  {
    id: 'hegemon',
    name: 'Hegemon',
    description: 'Dominant power in a local stellar neighborhood.',
    requirements: { ethics: ['militarist', 'authoritarian'] },
    bonuses: { military: 15, alloys: 10, influence: 10, claimCost: -10 },
    specialMechanics: ['starts with subject empire', 'aggressive expansion bonus', 'improved fleet capacity'],
    startEffect: 'empire dominates its local stellar region',
  },
  {
    id: 'doomsday',
    name: 'Doomsday',
    description: 'Homeworld is doomed - you must evacuate before it is destroyed.',
    requirements: {},
    bonuses: { sublightSpeed: 10, ftlSpeed: 15, habitability: 10 },
    specialMechanics: ['homeworld decays over time', 'must expand rapidly', 'evacuation bonus'],
    startEffect: 'homeworld begins to deteriorate rapidly',
  },
  {
    id: 'knockout',
    name: 'Knockout',
    description: 'Start with an advantage but suffer penalties as game progresses.',
    requirements: {},
    bonuses: { military: 20, alloys: 15, research: 10 },
    specialMechanics: ['powerful early game', 'diminishing bonuses', 'must capitalize on advantage'],
    startEffect: 'empire begins with significant military advantage',
  },
  {
    id: 'payback',
    name: 'Payback',
    description: 'Seek revenge against those who wronged your species.',
    requirements: {},
    bonuses: { military: 10, armyDamage: 15, alloys: 10 },
    specialMechanics: ['special revenge mechanics', 'bonus against specific empire', 'revenge edicts'],
    startEffect: 'empire discovers who destroyed their colony',
  },
  {
    id: 'subterranean',
    name: 'Subterranean',
    description: 'Species adapted to living deep underground.',
    requirements: {},
    bonuses: { miningYield: 15, planetaryDefense: 10, habitability: 5 },
    specialMechanics: ['underground start', 'tunnel network', 'bonus to minerals and alloys'],
    startEffect: 'civilization thrives in underground caverns',
  },
  {
    id: 'on_the_shoulders_of_giants',
    name: 'On the Shoulders of Giants',
    description: 'Built upon the discoveries of a long-dead precursor civilization.',
    requirements: {},
    bonuses: { research: 15, unity: 10, alloys: 5 },
    specialMechanics: ['ancient technology', 'precursor relics', 'research acceleration'],
    startEffect: 'empire discovers precursor technology among ruins',
  },
];

export const GOVERNMENT_TYPES: readonly GovernmentType[] = [
  {
    id: 'federal_republic',
    name: 'Federal Republic',
    authorityRequired: ['democracy'],
    bonuses: { unity: 10, happiness: 5, research: 5, diplomacy: 5 },
    edicts: [
      { id: 'fr_federalism', name: 'Federalism', description: 'Decentralize governance for local autonomy.', duration: 60, cost: 500, effects: { happiness: 10, unity: 15, stabilityBonus: 5 } },
      { id: 'fr_representation', name: 'Expanded Representation', description: 'Give more voices in government.', duration: 45, cost: 400, effects: { unity: 10, research: 5, diplomacy: 10 } },
    ],
  },
  {
    id: 'parliamentary_oligarchy',
    name: 'Parliamentary Oligarchy',
    authorityRequired: ['oligarchy'],
    bonuses: { economy: 10, tradeValue: 10, influence: 5, alloys: 5 },
    edicts: [
      { id: 'po_trade_laws', name: 'Trade Laws', description: 'Enact favorable trade regulations.', duration: 60, cost: 600, effects: { tradeValue: 20, energy: 15, branchOfficeValue: 10 } },
      { id: 'po_noble_privileges', name: 'Noble Privileges', description: 'Grant special rights to the ruling class.', duration: 45, cost: 500, effects: { influence: 15, alloys: 10, happiness: -5 } },
    ],
  },
  {
    id: 'military_junta',
    name: 'Military Junta',
    authorityRequired: ['dictatorship'],
    bonuses: { military: 20, alloys: 15, navalCapacity: 10, armyDamage: 10 },
    edicts: [
      { id: 'mj_martial_law', name: 'Martial Law', description: 'Place all sectors under military control.', duration: 30, cost: 800, effects: { stabilityBonus: 20, crimeReduction: 30, happiness: -15 } },
      { id: 'mj_total_war', name: 'Total War', description: 'Mobilize entire economy for war.', duration: 60, cost: 1000, effects: { alloys: 30, military: 20, consumerGoods: -20 } },
    ],
  },
  {
    id: 'galactic_empire',
    name: 'Galactic Empire',
    authorityRequired: ['imperial', 'dictatorship'],
    bonuses: { unity: 15, stabilityBonus: 10, alloys: 10, influence: 15 },
    edicts: [
      { id: 'ge_imperial_decree', name: 'Imperial Decree', description: 'Issue an absolute command.', duration: 60, cost: 1000, effects: { unity: 25, influence: 20, alloys: 15 } },
      { id: 'ge_subjugate', name: 'Subjugation', description: 'Demand submission from weaker empires.', duration: 30, cost: 1500, effects: { claimCost: -20, subjectLoyalty: 20, diplomaticWeight: 15 } },
    ],
  },
  {
    id: 'hive_swarm',
    name: 'Hive Swarm',
    authorityRequired: ['hive_mind'],
    bonuses: { unity: 30, crimeReduction: 20, popGrowthSpeed: 20, military: 15 },
    edicts: [
      { id: 'hs_consume_world', name: 'Consume World', description: 'Devour a planet for biomass.', duration: 0, cost: 0, effects: { popGrowthSpeed: 50, food: 100, habitability: 10 } },
      { id: 'hs_evolutionary_mastery', name: 'Evolutionary Mastery', description: 'Rapidly evolve the species.', duration: 60, cost: 0, effects: { armyDamage: 30, habitability: 20, popGrowthSpeed: 15 } },
    ],
  },
  {
    id: 'machine_network',
    name: 'Machine Network',
    authorityRequired: ['machine_intelligence'],
    bonuses: { research: 20, unity: 25, buildSpeed: 15, crimeReduction: 30 },
    edicts: [
      { id: 'mn_assimilate', name: 'Assimilate', description: 'Convert organic pops to machines.', duration: 0, cost: 0, effects: { cybernetic: 30, popGrowthSpeed: 20, happiness: 10 } },
      { id: 'mn_resource_optimization', name: 'Resource Optimization', description: 'Maximize efficiency across all systems.', duration: 60, cost: 0, effects: { energy: 25, minerals: 25, alloys: 15 } },
    ],
  },
  {
    id: 'trade_league',
    name: 'Trade League',
    authorityRequired: ['corporate_dynasty', 'corporate'],
    bonuses: { tradeValue: 25, energy: 20, branchOfficeValue: 25, minerals: 10 },
    edicts: [
      { id: 'tl_free_trade', name: 'Free Trade', description: 'Open all borders for trade.', duration: 60, cost: 800, effects: { tradeValue: 30, energy: 25, branchOfficeValue: 20 } },
      { id: 'tl_corporate_expansion', name: 'Corporate Expansion', description: 'Expand corporate holdings across the galaxy.', duration: 60, cost: 1200, effects: { branchOfficeValue: 40, energy: 30, consumerGoods: -10 } },
    ],
  },
  {
    id: 'holy_tribunal',
    name: 'Holy Tribunal',
    authorityRequired: ['imperial', 'dictatorship', 'authoritarian'],
    bonuses: { unity: 20, psionic: 15, happiness: 10, alloys: 5 },
    edicts: [
      { id: 'ht_inquisition', name: 'Inquisition', description: 'Root out heresy and alien influence.', duration: 60, cost: 1000, effects: { unity: 30, crimeReduction: 25, diplomacy: -15 } },
      { id: 'ht_divine_mandate', name: 'Divine Mandate', description: 'Claim divine right to rule.', duration: 60, cost: 800, effects: { unity: 25, stabilityBonus: 15, subjectLoyalty: 10 } },
    ],
  },
  {
    id: 'direct_democracy',
    name: 'Direct Democracy',
    authorityRequired: ['democracy'],
    bonuses: { happiness: 15, unity: 15, research: 10, diplomacy: 10 },
    edicts: [
      { id: 'dd_referendum', name: 'Referendum', description: 'Put major decisions to popular vote.', duration: 30, cost: 400, effects: { happiness: 20, unity: 20, stabilityBonus: 10 } },
      { id: 'dd_civic_duty', name: 'Civic Duty', description: 'Encourage active participation in governance.', duration: 60, cost: 300, effects: { unity: 15, research: 10, happiness: 10 } },
    ],
  },
  {
    id: 'enlightened_tyranny',
    name: 'Enlightened Tyranny',
    authorityRequired: ['dictatorship'],
    bonuses: { research: 15, unity: 10, alloys: 10, influence: 10 },
    edicts: [
      { id: 'et_state_atheism', name: 'State Atheism', description: 'Promote scientific inquiry over religion.', duration: 60, cost: 600, effects: { research: 25, unity: -10, society: 15 } },
      { id: 'et_forced_modification', name: 'Forced Modification', description: 'Enforce genetic or cybernetic standards.', duration: 0, cost: 1000, effects: { cybernetic: 20, happiness: -15, popGrowthSpeed: 10 } },
    ],
  },
  {
    id: 'feudal_empire',
    name: 'Feudal Empire',
    authorityRequired: ['imperial'],
    bonuses: { alloys: 15, unity: 10, stabilityBonus: 10, claimCost: -10 },
    edicts: [
      { id: 'fe_feudal_levies', name: 'Feudal Levies', description: 'Raise armies from loyal vassals.', duration: 60, cost: 500, effects: { alloys: 20, military: 15, armyDamage: 15 } },
      { id: 'fe_land_reform', name: 'Land Reform', description: 'Redistribute planetary holdings.', duration: 45, cost: 700, effects: { minerals: 25, food: 20, housing: 3 } },
    ],
  },
  {
    id: 'civic_republic',
    name: 'Civic Republic',
    authorityRequired: ['democracy'],
    bonuses: { unity: 10, research: 10, diplomacy: 10, happiness: 5 },
    edicts: [
      { id: 'cr_public_education', name: 'Public Education', description: 'Invest in education for all citizens.', duration: 60, cost: 500, effects: { research: 20, unity: 10, leaderExperienceGain: 10 } },
      { id: 'cr_constitutional_rights', name: 'Constitutional Rights', description: 'Enshrine protections for all citizens.', duration: 60, cost: 400, effects: { happiness: 15, unity: 15, stabilityBonus: 10 } },
    ],
  },
];

export const SPECIES_ARCHETYPES: readonly SpeciesArchetype[] = [
  {
    id: 'human_democracy',
    name: 'Human Democracy',
    description: 'Versatile human civilization with democratic traditions.',
    defaultEthics: ['egalitarian', 'individualist'],
    defaultAuthority: 'democracy',
    traits: ['intelligent', 'adaptable', 'nomadic', 'natural_sociologists'],
    portrait: 'human',
    homeworldName: 'Earth',
    shipPrefix: 'UES',
    planetPrefix: 'Terra',
  },
  {
    id: 'klingon_empire',
    name: 'Klingon Empire',
    description: 'Warrior culture that values honor and combat prowess.',
    defaultEthics: ['militarist', 'authoritarian'],
    defaultAuthority: 'imperial',
    traits: ['strong', 'aggressive', 'resilient', 'enduring'],
    portrait: 'klingon',
    homeworldName: 'Qo\'noS',
    shipPrefix: 'IKS',
    planetPrefix: 'Qo',
  },
  {
    id: 'borg_collective',
    name: 'Borg Collective',
    description: 'Hive-minded cybernetic organisms focused on perfection.',
    defaultEthics: ['gestalt_hive'],
    defaultAuthority: 'hive_mind',
    traits: ['cybernetic', 'hive_mind', 'intelligent', 'strong'],
    portrait: 'borg',
    homeworldName: 'Unicomplex',
    shipPrefix: 'BORG',
    planetPrefix: 'Sector',
  },
  {
    id: 'romulan_star_empire',
    name: 'Romulan Star Empire',
    description: 'Secretive and cunning empire built on espionage and intrigue.',
    defaultEthics: ['authoritarian', 'xenophobe'],
    defaultAuthority: 'dictatorship',
    traits: ['intelligent', 'repulsive', 'solitary', 'natural_physicists'],
    portrait: 'romulan',
    homeworldName: 'Romulus',
    shipPrefix: 'IRW',
    planetPrefix: 'Rom',
  },
  {
    id: 'vulcan_science',
    name: 'Vulcan Science',
    description: 'Logical and peaceful civilization dedicated to scientific inquiry.',
    defaultEthics: ['pacifist', 'materialist', 'egalitarian'],
    defaultAuthority: 'democracy',
    traits: ['intelligent', 'natural_physicists', 'long_lived', 'diplomatic'],
    portrait: 'vulcan',
    homeworldName: 'Vulcan',
    shipPrefix: 'VSS',
    planetPrefix: 'Vul',
  },
  {
    id: 'cardassian_union',
    name: 'Cardassian Union',
    description: 'Militaristic state built on surveillance and central control.',
    defaultEthics: ['militarist', 'authoritarian', 'xenophobe'],
    defaultAuthority: 'dictatorship',
    traits: ['strong', 'repulsive', 'industrious', 'rigid'],
    portrait: 'cardassian',
    homeworldName: 'Cardassia',
    shipPrefix: 'CDS',
    planetPrefix: 'Card',
  },
  {
    id: 'ferengi_commerce',
    name: 'Ferengi Commerce Authority',
    description: 'Profit-driven civilization where all decisions are economic.',
    defaultEthics: ['corporate', 'individualist'],
    defaultAuthority: 'corporate_dynasty',
    traits: ['thrifty', 'industrious', 'diminutive', 'flexible'],
    portrait: 'ferengi',
    homeworldName: 'Ferenginar',
    shipPrefix: 'FCA',
    planetPrefix: 'Fer',
  },
  {
    id: 'andorian_federation',
    name: 'Andorian Federation',
    description: 'Proud warrior species committed to coalition defense.',
    defaultEthics: ['militarist', 'xenophile', 'egalitarian'],
    defaultAuthority: 'democracy',
    traits: ['aggressive', 'defensive', 'industrious', 'charismatic'],
    portrait: 'andorian',
    homeworldName: 'Andoria',
    shipPrefix: 'AFS',
    planetPrefix: 'And',
  },
  {
    id: 'tellarite_republic',
    name: 'Tellarite Republic',
    description: 'Argumentative but fair species that values debate.',
    defaultEthics: ['egalitarian', 'individualist'],
    defaultAuthority: 'democracy',
    traits: ['unintelligent', 'industrious', 'repulsive', 'nomadic'],
    portrait: 'tellarite',
    homeworldName: 'Tellar',
    shipPrefix: 'TRS',
    planetPrefix: 'Tel',
  },
  {
    id: 'xindi_council',
    name: 'Xindi Council',
    description: 'Multi-species coalition governing through consensus.',
    defaultEthics: ['pacifist', 'xenophile', 'egalitarian'],
    defaultAuthority: 'democracy',
    traits: ['adaptable', 'diplomatic', 'intelligent', 'charismatic'],
    portrait: 'xindi',
    homeworldName: 'Xindus',
    shipPrefix: 'XCS',
    planetPrefix: 'Xin',
  },
];

export const SPECIES_NAME_POOLS: NamePool[] = [
  {
    firstNames: ['James', 'Emily', 'Michael', 'Sarah', 'David', 'Lisa', 'John', 'Maria', 'Robert', 'Jennifer', 'William', 'Elizabeth', 'Richard', 'Patricia', 'Thomas', 'Barbara', 'Charles', 'Susan', 'Daniel', 'Jessica'],
    lastNames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez'],
    shipPrefixes: ['UES', 'USS', 'UEV', 'UER', 'UEC', 'UEP', 'UES', 'UEG', 'UEN', 'UEL'],
    planetPrefixes: ['Terra', 'Novus', 'Nova', 'Prime', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Solaris'],
  },
  {
    firstNames: ['Kahless', 'L\'Rok', 'Torg', 'Kurn', 'Worf', 'B\'Vat', 'Gorkon', 'Azetbur', 'Molor', 'Torghen', 'Kempec', 'Maltz', 'Tog', 'Konmel', 'K\'Talg', 'Lork', 'Drex', 'Krot', 'Ganal', 'Mok'],
    lastNames: ['moQ', 'Qapla', 'bIp', 'tlhIngan', 'Hegh', 'batlh', 'yaS', 'toDuj', 'vIq', 'Qoy', 'yaH', 'QaQ', 'tIq', 'nIH', 'baQ', 'tlhaQ', 'laD', 'Qob', 'bIr', 'Soj'],
    shipPrefixes: ['IKS', 'IKV', 'IKC', 'IKB', 'IKM', 'IKR', 'IKT', 'IKE', 'IKF', 'IKD'],
    planetPrefixes: ['Qo', 'NoH', 'VeS', 'tIq', 'HoS', 'baH', 'puq', 'loD', 'be', 'tlh'],
  },
  {
    firstNames: ['Locutus', 'Seven', 'Three', 'Five', 'Two', 'Eight', 'Nine', 'Four', 'One', 'Zero', 'Six', 'SevenOfNine', 'ThreeOfFive', 'EightOfTen', 'TwoOfSix', 'FourOfSeven', 'NineOfOne', 'ZeroOfEight', 'FiveOfTwo', 'SixOfThree'],
    lastNames: ['ofNine', 'ofFive', 'ofTen', 'ofSix', 'ofSeven', 'ofOne', 'ofEight', 'ofTwo', 'ofThree', 'ofFour', 'ofTwelve', 'ofFifteen', 'ofTwenty', 'ofTwentyFive', 'ofThirty', 'ofThirtyFive', 'ofForty', 'ofFortyFive', 'ofFifty', 'ofFiftyFive'],
    shipPrefixes: ['BORG', 'UNIMATRIX', 'DRONE', 'ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON', 'ZETA', 'ETA'],
    planetPrefixes: ['Sector', 'Unimatrix', 'Node', 'Grid', 'Matrix', 'Collective', 'Assimilation', 'Perfection', 'Drone', 'Submatrix'],
  },
  {
    firstNames: ['Toreth', 'Neron', 'Donatra', 'Selok', 'Riker', 'Tal', 'Shiar', 'Chulan', 'Valdore', 'Miran', 'Rian', 'Terel', 'Daeid', 'Linn', 'Preloc', 'Toreth', 'Neylon', 'Kell', 'Tal\'a', 'Irhani'],
    lastNames: ['ChR', 'sRek', 'trIvam', 'tRivok', 'iLan', 'aeLan', 'oRack', 'uSak', 'eRin', 'iNak', 'yRath', 'aDak', 'oVek', 'uRath', 'eTak', 'iVok', 'aLan', 'oKet', 'uNak', 'eRak'],
    shipPrefixes: ['IRW', 'IRC', 'IRV', 'IRF', 'IRM', 'IRT', 'IRE', 'IRP', 'IRG', 'IRB'],
    planetPrefixes: ['Rom', 'Ki', 'Var', 'Nel', 'Drak', 'Vor', 'Tan', 'Sel', 'Dak', 'Ri'],
  },
  {
    firstNames: ['Sarek', 'Spock', 'T\'Pol', 'Sylvia', 'Stamets', 'Tuvok', 'Selar', 'T\'Pau', 'Surak', 'Kolinahr', 'Sybok', 'Valeris', 'V\'Lar', 'Soval', 'T\'Mir', 'Veskar', 'Rekar', 'T\'Rel', 'Soral', 'T\'Vek'],
    lastNames: ['ofVulcan', 'ofMountSeleya', 'ofShiKahr', 'ofP\'Jem', 'ofT\'Lar', 'ofSakhar', 'ofKolinahr', 'ofVulcanIsles', 'ofFirePlains', 'ofGol', 'ofDakal', 'ofLeKala', 'ofDahar', 'ofKahr', 'ofT\'Nagala', 'ofKohlinar', 'ofT\'Rar', 'ofVak', 'ofSurak', 'ofT\'Var'],
    shipPrefixes: ['VSS', 'VSC', 'VSE', 'VSF', 'VSM', 'VST', 'VSR', 'VSA', 'VSL', 'VSD'],
    planetPrefixes: ['Vul', 'T\'Lar', 'P\'Jem', 'Seleya', 'ShiKahr', 'Kolinahr', 'Gol', 'Dakal', 'LeKala', 'Kahr'],
  },
  {
    firstNames: ['Dukat', 'Gul', 'Ghem', 'Tain', 'Damar', 'Rusot', 'Broca', 'Kell', 'Lemec', 'Telev', 'Dexa', 'Boral', 'Gor', 'Erek', 'Milani', 'Ipket', 'Lupok', 'Neral', 'Tobar', 'Gos'],
    lastNames: ['Cardassian', 'ofCardassia', 'ofOpaka', 'ofDukoth', 'ofEmpok', 'ofGalor', 'ofCentral', 'ofDakora', 'ofKartag', 'ofLakar', 'ofTarka', 'ofVoran', 'ofZayal', 'ofAmleth', 'ofRegar', 'ofRondor', 'ofToran', 'ofVelk', 'ofVreenak', 'ofZiyal'],
    shipPrefixes: ['CDS', 'CDF', 'CDV', 'CDM', 'CDE', 'CDT', 'CDA', 'CDB', 'CDG', 'CDR'],
    planetPrefixes: ['Card', 'Dak', 'Vor', 'Am', 'Gal', 'Op', 'Em', 'Tor', 'Vel', 'Reg'],
  },
  {
    firstNames: ['Quark', 'Rom', 'Nog', 'Ishka', 'Leck', 'Krax', 'Brunt', 'Gaila', 'Liquidator', 'Daimon', 'Zek', 'MaiHar', 'Lumba', 'Mennar', 'Pel', 'Grathon', 'Tolar', 'Nilva', 'Bunt', 'Stol'],
    lastNames: ['ofFerenginar', 'SonofIshka', 'SonofKrax', 'BrotherofRom', 'oftheBar', 'ofLatinum', 'theAcquisitor', 'ofBargain', 'theNegotiator', 'theProfit', 'ofTrade', 'theShrewd', 'ofCommerce', 'theClever', 'ofWealth', 'theOpportunist', 'ofDeal', 'theEnterprising', 'ofGold', 'theShark'],
    shipPrefixes: ['FCA', 'FTC', 'FPV', 'FMB', 'FGE', 'FTR', 'FAG', 'FBB', 'FBG', 'FLC'],
    planetPrefixes: ['Fer', 'Zek', 'Lum', 'Qua', 'Nog', 'Bri', 'Gal', 'Pel', 'Nil', 'Men'],
  },
  {
    firstNames: ['Shran', 'Thy\'lek', 'Jhamel', 'Krot', 'Pren', 'Vanik', 'Ranul', 'Kersh', 'Talas', 'Ven', 'Yarines', 'Ghee', 'Zeth', 'Shar', 'Trel', 'Kol', 'Hav', 'Zan', 'Dath', 'Rei'],
    lastNames: ['ofAndoria', 'ofTheMoon', 'Iceborn', 'ofShran', 'ofAnomaly', 'Frostwalker', 'ofThePolar', 'ofCryos', 'ofWinterhold', 'ofTheCore', 'IceDrifter', 'ofCryo', 'ofFrost', 'ofTheNorth', 'Glacier', 'ofTheDeep', 'ofCryoVault', 'ofThePole', 'ofWinter', 'Frostborn'],
    shipPrefixes: ['AFS', 'AFC', 'AFV', 'AFM', 'AFE', 'AFT', 'AFR', 'AFG', 'AFB', 'AFI'],
    planetPrefixes: ['And', 'Sho', 'Cry', 'Fro', 'Ice', 'Pol', 'Nex', 'Zen', 'Vel', 'Gal'],
  },
  {
    firstNames: ['Grumman', 'Graal', 'Malik', 'Nakamura', 'Thy', 'Grelt', 'Kor', 'Navaar', 'Grall', 'Virk', 'Tek', 'Gral', 'Nak', 'Gris', 'Mak', 'Grom', 'Nik', 'Gar', 'Tal', 'Val'],
    lastNames: ['ofTellar', 'theArguer', 'ofDispute', 'theContender', 'ofDebate', 'theChallenger', 'ofContention', 'theProtester', 'ofDiscord', 'theObjector', 'ofDissent', 'theQuestioner', 'ofChallenge', 'theRefuter', 'ofChallenge', 'theDissenter', 'ofOpposition', 'theContrarian', 'ofDisagreement', 'theOpponent'],
    shipPrefixes: ['TRS', 'TRV', 'TRM', 'TRE', 'TRT', 'TRA', 'TRB', 'TRG', 'TRF', 'TRN'],
    planetPrefixes: ['Tel', 'Gra', 'Grum', 'Mal', 'Nak', 'Thy', 'Grel', 'Virk', 'Navaar', 'Tek'],
  },
  {
    firstNames: ['Dolim', 'Goralis', 'Khael', 'Dexil', 'Kindra', 'Surah', 'Gavus', 'Shash', 'Jhaim', 'Orin', 'Mikaal', 'Kova', 'Lira', 'Shel', 'Tevun', 'Vael', 'Ryn', 'Zeph', 'Kal', 'Dra'],
    lastNames: ['ofXindus', 'ofTheCluster', 'Primal', 'ofArchaeo', 'ofTheGrove', 'ofTheAncient', 'ofTheDeep', 'ofTheFirst', 'ofThePrimordial', 'ofTheOriginal', 'ofTheAncient', 'ofTheRoot', 'ofTheCore', 'ofTheHeart', 'ofTheCenter', 'ofTheSource', 'ofTheBeginning', 'ofTheOrigin', 'ofTheGenesis', 'ofTheDawn'],
    shipPrefixes: ['XCS', 'XCV', 'XCM', 'XCE', 'XCT', 'XCA', 'XCB', 'XCG', 'XCF', 'XCN'],
    planetPrefixes: ['Xin', 'Gor', 'Dol', 'Kha', 'Dex', 'Kin', 'Sur', 'Gav', 'Sha', 'Jha'],
  },
];

export const TRAIT_COST_TOTAL = 0;
export const MAX_TRAITS = 5;
export const STARTING_TRAIT_POINTS = 5;

export function getTraitById(id: string): SpeciesTrait | undefined {
  return SPECIES_TRAITS.find((t) => t.id === id);
}

export function getTraitsByCategory(category: TraitCategory): readonly SpeciesTrait[] {
  return SPECIES_TRAITS.filter((t) => t.category === category);
}

export function getEthicsById(id: EthicsId): Ethics | undefined {
  return SPECIES_ETHICS.find((e) => e.id === id);
}

export function getAuthorityById(id: AuthorityId): AuthorityType | undefined {
  return AUTHORITY_TYPES.find((a) => a.id === id);
}

export function getOriginById(id: string): Origin | undefined {
  return SPECIES_ORIGINS.find((o) => o.id === id);
}

export function getGovernmentById(id: string): GovernmentType | undefined {
  return GOVERNMENT_TYPES.find((g) => g.id === id);
}

export function getArchetypeById(id: SpeciesArchetypeId): SpeciesArchetype | undefined {
  return SPECIES_ARCHETYPES.find((a) => a.id === id);
}

export function getArchetypeByName(name: string): SpeciesArchetype | undefined {
  return SPECIES_ARCHETYPES.find((a) => a.name.toLowerCase() === name.toLowerCase());
}

export function getNamePoolForArchetype(archetypeId: SpeciesArchetypeId): NamePool | undefined {
  const idx = SPECIES_ARCHETYPES.findIndex((a) => a.id === archetypeId);
  return idx >= 0 ? SPECIES_NAME_POOLS[idx] : undefined;
}

export function getCompatibleAuthorities(ethics: readonly EthicsId[]): readonly AuthorityType[] {
  return AUTHORITY_TYPES.filter((a) =>
    a.ethicsRestriction.some((e) => ethics.includes(e))
  );
}

export function getCompatibleOrigins(ethics: readonly EthicsId[], authority: AuthorityId): readonly Origin[] {
  return SPECIES_ORIGINS.filter((o) => {
    if (o.requirements.ethics && o.requirements.ethics.length > 0) {
      if (!o.requirements.ethics.some((e) => ethics.includes(e))) return false;
    }
    if (o.requirements.authority && o.requirements.authority.length > 0) {
      if (!o.requirements.authority.includes(authority)) return false;
    }
    return true;
  });
}

export function getGovernmentsForAuthority(authority: AuthorityId): readonly GovernmentType[] {
  return GOVERNMENT_TYPES.filter((g) => g.authorityRequired.includes(authority));
}

export function calculateTraitPointCost(traits: readonly string[]): number {
  return traits.reduce((total, traitId) => {
    const trait = getTraitById(traitId);
    return total + (trait?.cost ?? 0);
  }, 0);
}

export function areTraitsCompatible(trait1Id: string, trait2Id: string): boolean {
  const trait1 = getTraitById(trait1Id);
  const trait2 = getTraitById(trait2Id);
  if (!trait1 || !trait2) return false;
  return !trait1.incompatibleWith.includes(trait2Id) && !trait2.incompatibleWith.includes(trait1Id);
}

export function validateTraits(traits: readonly string[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (traits.length > MAX_TRAITS) {
    errors.push(`Too many traits: ${traits.length}/${MAX_TRAITS}`);
  }
  const pointCost = calculateTraitPointCost(traits);
  if (pointCost > STARTING_TRAIT_POINTS) {
    errors.push(`Trait cost exceeds available points: ${pointCost}/${STARTING_TRAIT_POINTS}`);
  }
  for (let i = 0; i < traits.length; i++) {
    for (let j = i + 1; j < traits.length; j++) {
      if (!areTraitsCompatible(traits[i], traits[j])) {
        errors.push(`Incompatible traits: ${traits[i]} and ${traits[j]}`);
      }
    }
  }
  return { valid: errors.length === 0, errors };
}

export default {
  SPECIES_TRAITS,
  SPECIES_ETHICS,
  AUTHORITY_TYPES,
  SPECIES_ORIGINS,
  GOVERNMENT_TYPES,
  SPECIES_ARCHETYPES,
  SPECIES_NAME_POOLS,
  TRAIT_COST_TOTAL,
  MAX_TRAITS,
  STARTING_TRAIT_POINTS,
  getTraitById,
  getTraitsByCategory,
  getEthicsById,
  getAuthorityById,
  getOriginById,
  getGovernmentById,
  getArchetypeById,
  getArchetypeByName,
  getNamePoolForArchetype,
  getCompatibleAuthorities,
  getCompatibleOrigins,
  getGovernmentsForAuthority,
  calculateTraitPointCost,
  areTraitsCompatible,
  validateTraits,
};
