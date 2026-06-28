export const FEATURE_FLAGS_CONFIG = {
  allowFullscan: true,
  allowNavcomp: true,
  allowIbank: true,
  allowGenesisDestroy: true,
  sofaOn: true,
  ksmAllowed: true,
  bountyAllSpecial: true,
  serverClosed: false,
  accountCreationClosed: false,
  displayPassword: false,
  schedPlanetValidCredits: false,
  corpPlanetTransfers: false,
  minCaptureValue: 0,
} as const;

export interface FeatureFlags {
  allowFullscan: boolean;
  allowNavcomp: boolean;
  allowIbank: boolean;
  allowGenesisDestroy: boolean;
  sofaOn: boolean;
  ksmAllowed: boolean;
  bountyAllSpecial: boolean;
  serverClosed: boolean;
  accountCreationClosed: boolean;
  displayPassword: boolean;
  schedPlanetValidCredits: boolean;
  corpPlanetTransfers: boolean;
  minCaptureValue: number;
}

export const FEATURES = FEATURE_FLAGS_CONFIG;
