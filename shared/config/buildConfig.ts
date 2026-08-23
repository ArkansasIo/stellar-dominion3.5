export const BUILD_INFO = {
  appName: "Universe Civilization: Empire at War",
  buildName: "Nexus Alpha Command Release",
  releaseLabel: "Alpha 1.5.1",
  version: "1.5.1",
  patchVersion: "Alpha 1.5.1",
  buildChannel: "Production" as "Development" | "Production" | "Staging",
  buildNumber: 2026082301,
  buildId: "NEXUS-ALPHA-20260823.01",
  buildDate: "2026-08-23",
  buildTime: "EDT 19:36",
  buildTimestamp: "2026-08-23T19:36:00-04:00",
  gitCommit: "release-managed",
  gitBranch: "main",
  devName: "Stephen",
  devAlias: "ArkansasIo",
  developerId: "ARKANSASIO-DEV-001",
  studioName: "ArkansasIo Studio",
  publisherName: "ArkansasIo",
  publisherId: "ARKANSASIO-PUBLISHER-001",
  releaseStatus: "Current" as "Current" | "Preview" | "Archived",
  copyright: "2025-2026 Stephen / ArkansasIo",
  license: "MIT License",
  universeId: "Nexus-Alpha",
  engineVersion: "1.0.0",
  protocolVersion: "v2",
  minClientVersion: "1.5.1",
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
  return `${BUILD_INFO.appName} ${BUILD_INFO.releaseLabel} (${BUILD_INFO.buildName})`;
}

export function getFooterBuildString(): string {
  return `${BUILD_INFO.releaseLabel} • Build ${BUILD_INFO.buildNumber} • ${BUILD_INFO.buildId}`;
}

export function getDisplayVersion(): string {
  return BUILD_INFO.releaseLabel;
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
