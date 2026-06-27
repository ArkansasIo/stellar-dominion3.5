export const RESOURCE_CONFIG = {
  ore: {
    price: 11,
    delta: 5,
    rate: 75000,
    prate: 0.25,
    limit: 500000000,
  },
  organics: {
    price: 5,
    delta: 2,
    rate: 5000,
    prate: 0.5,
    limit: 500000000,
  },
  goods: {
    price: 15,
    delta: 7,
    rate: 75000,
    prate: 0.25,
    limit: 500000000,
  },
  energy: {
    price: 3,
    delta: 1,
    rate: 75000,
    prate: 0.5,
    limit: 5000000000,
  },
  fighters: {
    price: 50,
    prate: 0.01,
  },
  torpedoes: {
    price: 25,
    prate: 0.025,
    dmgRate: 10,
  },
  credits: {
    prate: 3.0,
  },
  armor: {
    price: 5,
  },
  defaultProdOre: 20.0,
  defaultProdOrganics: 20.0,
  defaultProdGoods: 20.0,
  defaultProdEnergy: 20.0,
  defaultProdFighters: 10.0,
  defaultProdTorpedoes: 10.0,
  inventoryFactor: 1,
  maxCreditsWithoutBase: 10000000,
  maxCreditsOnPlanet: 10000000000000000,
  portRegenRate: 10,
  colonistPrice: 5,
} as const;

export type ResourceType = "ore" | "organics" | "goods" | "energy" | "fighters" | "torpedoes" | "credits" | "armor";

export interface Resources {
  ore: number;
  organics: number;
  goods: number;
  energy: number;
  fighters: number;
  torpedoes: number;
  credits: number;
}

export interface ResourceLimits {
  ore: number;
  organics: number;
  goods: number;
  energy: number;
}

export interface ResourceEntry {
  price: number;
  delta: number;
  rate: number;
  prate: number;
  limit: number;
}

export interface CreditsResource {
  prate: number;
}

export interface DefaultProduction {
  defaultProdOre: number;
  defaultProdOrganics: number;
  defaultProdGoods: number;
  defaultProdEnergy: number;
  defaultProdFighters: number;
  defaultProdTorpedoes: number;
}

export interface PortConfig {
  portRegenRate: number;
  maxCreditsWithoutBase: number;
  maxCreditsOnPlanet: number;
}

export type ResourceConfig = typeof RESOURCE_CONFIG;

export const RESOURCES = RESOURCE_CONFIG;
