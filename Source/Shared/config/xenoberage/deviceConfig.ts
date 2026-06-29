export const DEVICE_CONFIG = {
  genesis: { price: 100000000, max: 10 },
  beacon: { price: 100, max: 10 },
  emerwarp: { price: 100000000, max: 10 },
  warpedit: { price: 100000, max: 10 },
  minedeflector: { price: 10, max: 10 },
  escapepod: { price: 100000 },
  fuelscoop: { price: 100000 },
  lssd: { price: 10000000000 },
} as const;

export type DeviceType = keyof typeof DEVICE_CONFIG;

export interface DevicePrice {
  price: number;
  max?: number;
}

export type DeviceConfig = typeof DEVICE_CONFIG;

export const DEVICES = DEVICE_CONFIG;
