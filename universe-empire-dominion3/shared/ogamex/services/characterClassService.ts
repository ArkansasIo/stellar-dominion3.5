import { characterClasses, type CharacterClassId } from "../enums";

type MaybePromise<T> = T | Promise<T>;

type StoredCharacterClass = CharacterClassId | number | null | undefined;

export interface CharacterClassUser {
  id: string | number;
  characterClass?: StoredCharacterClass;
  character_class?: StoredCharacterClass;
  characterClassFreeUsed?: boolean | null;
  character_class_free_used?: boolean | null;
  characterClassChangedAt?: Date | string | null;
  character_class_changed_at?: Date | string | null;
  darkMatter?: number | null;
  dark_matter?: number | null;
}

export interface CharacterClassPlanet {
  id?: string | number;
  crawlerPercent?: number | null;
  crawler_percent?: number | null;
}

export interface CharacterClassSettingsAdapter {
  get(key: string, fallback?: string): string | number | boolean | null | undefined;
}

export interface CharacterClassDarkMatterAdapter {
  canAfford(user: CharacterClassUser, amount: number): boolean;
  debit?(
    user: CharacterClassUser,
    amount: number,
    transactionType: string,
    description: string,
  ): MaybePromise<void>;
}

export interface CharacterClassFleetMissionAdapter {
  hasActiveFleetMissions(userId: string | number): MaybePromise<boolean>;
}

export interface CharacterClassPlanetAdapter {
  listUserPlanets(userId: string | number): MaybePromise<CharacterClassPlanet[]>;
  savePlanet?(planet: CharacterClassPlanet): MaybePromise<void>;
}

export interface CharacterClassPersistenceAdapter {
  saveUser?(user: CharacterClassUser): MaybePromise<void>;
}

export interface CharacterClassServiceDependencies {
  darkMatter: CharacterClassDarkMatterAdapter;
  settings: CharacterClassSettingsAdapter;
  fleetMissions?: CharacterClassFleetMissionAdapter;
  planets?: CharacterClassPlanetAdapter;
  persistence?: CharacterClassPersistenceAdapter;
  now?: () => Date;
}

export interface CharacterClassBonusSnapshot {
  classId: CharacterClassId | null;
  mineProductionBonus: number;
  energyProductionBonus: number;
  transporterSpeedBonus: number;
  transporterCargoBonus: number;
  crawlerBonusMultiplier: number;
  maxCrawlerOverload: number;
  combatShipSpeedBonus: number;
  recyclerSpeedBonus: number;
  deuteriumConsumptionMultiplier: number;
  recyclerPathfinderCargoBonus: number;
  additionalCombatResearchLevels: number;
  additionalFleetSlots: number;
  additionalMoonFields: number;
  detailedFleetSpeedSettings: boolean;
  reaperDebrisCollectionPercentage: number;
  researchTimeMultiplier: number;
  expeditionResourceMultiplier: number;
  planetSizeBonus: number;
  additionalExpeditions: number;
  expeditionEnemyChanceMultiplier: number;
  phalanxRangeBonus: number;
  expeditionSlotsBonus: number;
  inactiveLootPercentage: number;
  expeditionDebrisFieldsVisible: boolean;
}

export class CharacterClassSelectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CharacterClassSelectionError";
  }
}

const PLAYER_CLASS_TRANSACTION_TYPE = "player_class";

function normalizeCharacterClass(value: StoredCharacterClass): CharacterClassId | null {
  if (value == null) {
    return null;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase() as CharacterClassId;
    if (normalized in characterClasses) {
      return normalized;
    }
  }

  if (typeof value === "number") {
    const match = Object.values(characterClasses).find((definition) => definition.value === value);
    return match?.id ?? null;
  }

  return null;
}

function getStoredClass(user: CharacterClassUser): StoredCharacterClass {
  return user.characterClass ?? user.character_class ?? null;
}

function setStoredClass(user: CharacterClassUser, classId: CharacterClassId | null): void {
  const rawValue = classId ? characterClasses[classId].value : null;
  user.characterClass = classId;
  user.character_class = rawValue;
}

function hasFreeSelectionBeenUsed(user: CharacterClassUser): boolean {
  return Boolean(user.characterClassFreeUsed ?? user.character_class_free_used);
}

function setFreeSelectionUsed(user: CharacterClassUser, used: boolean): void {
  user.characterClassFreeUsed = used;
  user.character_class_free_used = used;
}

function setChangedAt(user: CharacterClassUser, value: Date): void {
  user.characterClassChangedAt = value;
  user.character_class_changed_at = value;
}

function getCrawlerPercent(planet: CharacterClassPlanet): number {
  return Number(planet.crawlerPercent ?? planet.crawler_percent ?? 0);
}

function setCrawlerPercent(planet: CharacterClassPlanet, value: number): void {
  planet.crawlerPercent = value;
  planet.crawler_percent = value;
}

export class CharacterClassService {
  private readonly darkMatter;
  private readonly settings;
  private readonly fleetMissions;
  private readonly planets;
  private readonly persistence;
  private readonly now;

  constructor(dependencies: CharacterClassServiceDependencies) {
    this.darkMatter = dependencies.darkMatter;
    this.settings = dependencies.settings;
    this.fleetMissions = dependencies.fleetMissions;
    this.planets = dependencies.planets;
    this.persistence = dependencies.persistence;
    this.now = dependencies.now ?? (() => new Date());
  }

  hasCharacterClass(user: CharacterClassUser): boolean {
    return this.getCharacterClass(user) !== null;
  }

  getCharacterClass(user: CharacterClassUser): CharacterClassId | null {
    return normalizeCharacterClass(getStoredClass(user));
  }

  isCollector(user: CharacterClassUser): boolean {
    return this.getCharacterClass(user) === "collector";
  }

  isGeneral(user: CharacterClassUser): boolean {
    return this.getCharacterClass(user) === "general";
  }

  isDiscoverer(user: CharacterClassUser): boolean {
    return this.getCharacterClass(user) === "discoverer";
  }

  getChangeCost(user: CharacterClassUser): number {
    const freeClassChanges = this.settings.get("dev_free_class_changes", "0");
    if (String(freeClassChanges ?? "0") !== "0") {
      return 0;
    }

    return hasFreeSelectionBeenUsed(user) ? 500000 : 0;
  }

  canChangeClass(user: CharacterClassUser, newClass: CharacterClassId): boolean {
    const currentClass = this.getCharacterClass(user);
    if (currentClass === newClass) {
      return false;
    }

    const cost = this.getChangeCost(user);
    return cost === 0 ? true : this.darkMatter.canAfford(user, cost);
  }

  async selectClass(user: CharacterClassUser, newClass: CharacterClassId): Promise<void> {
    const cost = this.getChangeCost(user);
    const currentClass = this.getCharacterClass(user);

    if (currentClass === newClass) {
      throw new CharacterClassSelectionError("This class is already selected");
    }

    if (cost > 0 && !this.darkMatter.canAfford(user, cost)) {
      throw new CharacterClassSelectionError("Not enough Dark Matter to change class");
    }

    if (await this.hasActiveFleetMissions(user)) {
      throw new CharacterClassSelectionError(
        "Cannot change character class while fleet missions are active. Please wait for all fleets to return.",
      );
    }

    if (cost > 0 && this.darkMatter.debit) {
      await this.darkMatter.debit(
        user,
        cost,
        PLAYER_CLASS_TRANSACTION_TYPE,
        `Changed character class to ${characterClasses[newClass].name}`,
      );
    }

    setStoredClass(user, newClass);
    setFreeSelectionUsed(user, true);
    setChangedAt(user, this.now());

    await this.persistence?.saveUser?.(user);

    if (newClass !== "collector") {
      await this.resetCrawlerOverload(user);
    }
  }

  async deselectClass(user: CharacterClassUser): Promise<void> {
    if (!this.hasCharacterClass(user)) {
      throw new CharacterClassSelectionError("No character class selected");
    }

    if (await this.hasActiveFleetMissions(user)) {
      throw new CharacterClassSelectionError(
        "Cannot deactivate character class while fleet missions are active. Please wait for all fleets to return.",
      );
    }

    setStoredClass(user, null);
    setChangedAt(user, this.now());

    await this.persistence?.saveUser?.(user);
    await this.resetCrawlerOverload(user);
  }

  async hasActiveFleetMissions(user: CharacterClassUser): Promise<boolean> {
    if (!this.fleetMissions) {
      return false;
    }

    return Boolean(await this.fleetMissions.hasActiveFleetMissions(user.id));
  }

  getMineProductionBonus(user: CharacterClassUser): number {
    return this.isCollector(user) ? 1.25 : 1.0;
  }

  getEnergyProductionBonus(user: CharacterClassUser): number {
    return this.isCollector(user) ? 1.1 : 1.0;
  }

  getTransporterSpeedBonus(user: CharacterClassUser): number {
    return this.isCollector(user) ? 2.0 : 1.0;
  }

  getTransporterCargoBonus(user: CharacterClassUser): number {
    return this.isCollector(user) ? 1.25 : 1.0;
  }

  getCrawlerBonusMultiplier(user: CharacterClassUser): number {
    return this.isCollector(user) ? 1.5 : 1.0;
  }

  getMaxCrawlerOverload(user: CharacterClassUser): number {
    return this.isCollector(user) ? 150 : 100;
  }

  async resetCrawlerOverload(user: CharacterClassUser): Promise<void> {
    if (!this.planets) {
      return;
    }

    const planets = await this.planets.listUserPlanets(user.id);
    for (const planet of planets) {
      if (getCrawlerPercent(planet) > 10) {
        setCrawlerPercent(planet, 10);
        await this.planets.savePlanet?.(planet);
      }
    }
  }

  getCombatShipSpeedBonus(user: CharacterClassUser): number {
    return this.isGeneral(user) ? 2.0 : 1.0;
  }

  getRecyclerSpeedBonus(user: CharacterClassUser): number {
    return this.isGeneral(user) ? 2.0 : 1.0;
  }

  getDeuteriumConsumptionMultiplier(user: CharacterClassUser): number {
    return this.isGeneral(user) ? 0.5 : 1.0;
  }

  getRecyclerPathfinderCargoBonus(user: CharacterClassUser): number {
    return this.isGeneral(user) ? 1.2 : 1.0;
  }

  getAdditionalCombatResearchLevels(user: CharacterClassUser): number {
    return this.isGeneral(user) ? 2 : 0;
  }

  getAdditionalFleetSlots(user: CharacterClassUser): number {
    return this.isGeneral(user) ? 2 : 0;
  }

  getAdditionalMoonFields(user: CharacterClassUser): number {
    return this.isGeneral(user) ? 5 : 0;
  }

  hasDetailedFleetSpeedSettings(user: CharacterClassUser): boolean {
    return this.isGeneral(user);
  }

  getReaperDebrisCollectionPercentage(): number {
    return 0.3;
  }

  getResearchTimeMultiplier(user: CharacterClassUser): number {
    return this.isDiscoverer(user) ? 0.75 : 1.0;
  }

  getExpeditionResourceMultiplier(
    user: CharacterClassUser,
    universeEconomicSpeed: number,
  ): number {
    return this.isDiscoverer(user) ? 1.5 * universeEconomicSpeed : 1.0;
  }

  getPlanetSizeBonus(user: CharacterClassUser): number {
    return this.isDiscoverer(user) ? 1.1 : 1.0;
  }

  getAdditionalExpeditions(user: CharacterClassUser): number {
    return this.isDiscoverer(user) ? 2 : 0;
  }

  getExpeditionEnemyChanceMultiplier(user: CharacterClassUser): number {
    return this.isDiscoverer(user) ? 0.5 : 1.0;
  }

  getPhalanxRangeBonus(user: CharacterClassUser): number {
    return this.isDiscoverer(user) ? 1.2 : 1.0;
  }

  getExpeditionSlotsBonus(user: CharacterClassUser): number {
    return this.isDiscoverer(user) ? 2 : 0;
  }

  getInactiveLootPercentage(user: CharacterClassUser): number {
    return this.isDiscoverer(user) ? 0.75 : 0.5;
  }

  getSpeedupDiscount(
    user: CharacterClassUser,
    type: "building" | "research" | "shipyard" | string,
  ): number {
    if (type === "building") {
      return this.isCollector(user) ? 0.9 : 1.0;
    }

    if (type === "research") {
      return this.isDiscoverer(user) ? 0.9 : 1.0;
    }

    if (type === "shipyard") {
      return this.isGeneral(user) ? 0.9 : 1.0;
    }

    return 1.0;
  }

  hasExpeditionDebrisFieldsVisible(user: CharacterClassUser): boolean {
    return this.isDiscoverer(user);
  }

  getBonusSnapshot(
    user: CharacterClassUser,
    universeEconomicSpeed = 1,
  ): CharacterClassBonusSnapshot {
    return {
      classId: this.getCharacterClass(user),
      mineProductionBonus: this.getMineProductionBonus(user),
      energyProductionBonus: this.getEnergyProductionBonus(user),
      transporterSpeedBonus: this.getTransporterSpeedBonus(user),
      transporterCargoBonus: this.getTransporterCargoBonus(user),
      crawlerBonusMultiplier: this.getCrawlerBonusMultiplier(user),
      maxCrawlerOverload: this.getMaxCrawlerOverload(user),
      combatShipSpeedBonus: this.getCombatShipSpeedBonus(user),
      recyclerSpeedBonus: this.getRecyclerSpeedBonus(user),
      deuteriumConsumptionMultiplier: this.getDeuteriumConsumptionMultiplier(user),
      recyclerPathfinderCargoBonus: this.getRecyclerPathfinderCargoBonus(user),
      additionalCombatResearchLevels: this.getAdditionalCombatResearchLevels(user),
      additionalFleetSlots: this.getAdditionalFleetSlots(user),
      additionalMoonFields: this.getAdditionalMoonFields(user),
      detailedFleetSpeedSettings: this.hasDetailedFleetSpeedSettings(user),
      reaperDebrisCollectionPercentage: this.getReaperDebrisCollectionPercentage(),
      researchTimeMultiplier: this.getResearchTimeMultiplier(user),
      expeditionResourceMultiplier: this.getExpeditionResourceMultiplier(
        user,
        universeEconomicSpeed,
      ),
      planetSizeBonus: this.getPlanetSizeBonus(user),
      additionalExpeditions: this.getAdditionalExpeditions(user),
      expeditionEnemyChanceMultiplier: this.getExpeditionEnemyChanceMultiplier(user),
      phalanxRangeBonus: this.getPhalanxRangeBonus(user),
      expeditionSlotsBonus: this.getExpeditionSlotsBonus(user),
      inactiveLootPercentage: this.getInactiveLootPercentage(user),
      expeditionDebrisFieldsVisible: this.hasExpeditionDebrisFieldsVisible(user),
    };
  }
}
