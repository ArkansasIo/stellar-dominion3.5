/**
 * Special Device / Equipment Prices
 */

export const DEVICE_PRICES = {
  devGenesisPrice: 100_000_000,
  devBeaconPrice: 100,
  devEmerWarpPrice: 100_000_000,
  devWarpEditPrice: 100_000,
  devMineDeflectorPrice: 10,
  devEscapePodPrice: 100_000,
  devFuelScoopPrice: 100_000,
} as const;

export type DevicePrices = typeof DEVICE_PRICES;
