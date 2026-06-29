export const BUILD_INFO = {
  appName: "Stellar Dominion",
  buildName: "Nexus Alpha",
  version: "4.0.0",
  patchVersion: "4.0.0-alpha.1",
  buildChannel: "Development" as "Development" | "Production" | "Staging",
  buildNumber: 4001,
  buildDate: "2026-06-23",
  buildTime: "UTC 00:00",
  gitCommit: "fc3e2c1",
  gitBranch: "main",
  devName: "Stephen",
  devAlias: "ArkansasIo",
  studioName: "ArkansasIo Studio",
  copyright: "2025-2026 Stephen",
  license: "MIT License",
  universeId: "Nexus-Alpha",
  engineVersion: "1.0.0",
  protocolVersion: "v2",
  minClientVersion: "3.5.0",
  apiVersion: "v2",
  supportEmail: "support@stellardominion.com",
  websiteUrl: "https://stellardominion.com",
  githubUrl: "https://github.com/ArkansasIo/stellar-dominion3.5",
  discordUrl: "https://discord.gg/stellardominion",
  features: {
    seasons: true,
    alliances: true,
    raids: true,
    megastructures: true,
    diplomacy: true,
    espionage: true,
    groundCombat: true,
    stellarPhenomena: true,
  },
  servers: [
    { id: "nexus-alpha", name: "Nexus Alpha", region: "US East", status: "healthy" as const },
    { id: "cygnus-eu", name: "Cygnus", region: "EU West", status: "healthy" as const },
    { id: "orion-apac", name: "Orion", region: "APAC", status: "healthy" as const },
  ],
} as const;

export type BuildInfo = typeof BUILD_INFO;

export function getBuildLabel(): string {
  return `${BUILD_INFO.appName} ${BUILD_INFO.version} (${BUILD_INFO.buildName})`;
}

export function getFooterBuildString(): string {
  return `v${BUILD_INFO.version} • Build ${BUILD_INFO.buildNumber} • ${BUILD_INFO.gitCommit}`;
}

export function getDisplayVersion(): string {
  return `v${BUILD_INFO.version}`;
}

export function getPatchLabel(): string {
  return BUILD_INFO.patchVersion;
}

export function isProduction(): boolean {
  return BUILD_INFO.buildChannel === "Production";
}

export function isDevBuild(): boolean {
  return BUILD_INFO.buildChannel === "Development";
}
