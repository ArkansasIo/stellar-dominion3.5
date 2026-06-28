/**
 * Resource & Economy Settings
 * Port prices, production rates, planet defaults, and IGB rates.
 */

export const RESOURCE_SETTINGS = {
  // Ore
  orePrice: 11,
  oreDelta: 5,
  oreRate: 75000,
  orePRate: 0.25,
  oreLimit: 500_000_000,

  // Organics
  organicsPrice: 5,
  organicsDelta: 2,
  organicsRate: 5000,
  organicsPRate: 0.5,
  organicsLimit: 500_000_000,

  // Goods
  goodsPrice: 15,
  goodsDelta: 7,
  goodsRate: 75000,
  goodsPRate: 0.25,
  goodsLimit: 500_000_000,

  // Energy
  energyPrice: 3,
  energyDelta: 1,
  energyRate: 75000,
  energyPRate: 0.5,
  energyLimit: 5_000_000_000,

  // Planet defaults
  defaultProdOre: 20.0,
  defaultProdOrganics: 20.0,
  defaultProdGoods: 20.0,
  defaultProdEnergy: 20.0,
  defaultProdFighters: 10.0,
  defaultProdTorp: 10.0,

  // IGB rates
  ibankInterest: 0.00015,
  ibankPaymentFee: 0.05,
  ibankLoanInterest: 0.0010,
  ibankLoanFactor: 0.10,
  ibankLoanLimit: 0.25,

  // Inventory & upgrades
  inventoryFactor: 1,
  upgradeCost: 1000,
  upgradeFactor: 2,
  levelFactor: 1.5,
} as const;

export type ResourceSettings = typeof RESOURCE_SETTINGS;
