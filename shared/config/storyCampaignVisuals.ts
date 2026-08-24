import { BACKGROUND_ASSETS } from "./gameAssetsConfig";

export type StoryAlertLevel = "GREEN" | "AMBER" | "RED" | "BLACK";

export interface StoryActVisual {
  act: number;
  imagePath: string;
  chapterLabel: string;
  alertLevel: StoryAlertLevel;
  briefing: string;
  missionFrame: string;
}

const GENERATED_ACT_ART: Record<number, string> = {
  1: "/assets/story/acts/act-01-embers-of-origin.png",
  2: "/assets/story/acts/act-02-fractured-alliances.png",
  3: "/assets/story/acts/act-03-echoes-of-the-void.png",
  4: "/assets/story/acts/act-04-siege-of-the-rift.png",
  5: "/assets/story/acts/act-05-crown-of-the-stars.png",
};

const FALLBACK_ART = [
  BACKGROUND_ASSETS.NEBULA.path,
  BACKGROUND_ASSETS.COMBAT.path,
  BACKGROUND_ASSETS.STAR_FIELD.path,
  BACKGROUND_ASSETS.SHIPYARD.path,
  BACKGROUND_ASSETS.GALAXY_MAP.path,
  BACKGROUND_ASSETS.GALAXY_MAP.path,
  BACKGROUND_ASSETS.NEBULA.path,
] as const;

const CHAPTER_LABELS = [
  "Frontier Ignition",
  "Diplomatic Faultline",
  "Anomaly Contact",
  "Riftline Assault",
  "Sovereignty Protocol",
  "Counterintelligence Veil",
  "Foundry Mobilization",
  "Helios Naval Front",
  "Tribunal Crisis",
  "Stormline Exodus",
  "Zenith Weapon Race",
  "Final Convergence",
] as const;

const ALERT_LEVELS: StoryAlertLevel[] = ["GREEN", "AMBER", "RED", "RED", "BLACK", "RED", "AMBER", "RED", "BLACK", "RED", "BLACK", "BLACK"];

const BRIEFINGS = [
  "A new command generation inherits a fragile colony network and must turn survival into a credible frontier doctrine.",
  "Every treaty now carries a hidden cost. Stabilize the alliance lattice before rival fleets turn diplomacy into open war.",
  "The void is answering back. Trace the anomaly signals and decide whether first contact is warning, invitation, or trap.",
  "The rift has become a battlefield. Coordinate carrier groups, orbital defenses, and evacuation corridors under fire.",
  "The galaxy is watching. Consolidate the coalition and prove that your empire can govern more than it can conquer.",
  "Enemy intelligence has breached the command lattice. Identify the false signal before it redirects the war effort.",
  "Industry becomes strategy. Rebuild the foundries, secure the supply chain, and convert raw output into decisive force.",
  "A naval campaign stretches beyond mapped space. Hold the Helios lanes while distance and enemy doctrine converge.",
  "Civil order is under review. Balance emergency powers, public trust, and military necessity before the tribunal fractures.",
  "The frontier is expanding faster than the charts. Secure new worlds through hostile storms and uncertain loyalties.",
  "Ancient superweapon traces have surfaced. Race rival expeditions to the Zenith before history becomes a weapon again.",
  "All storylines converge at the edge of the known universe. Choose what kind of dominion survives the final signal.",
] as const;

export const STORY_ACT_VISUALS: StoryActVisual[] = Array.from({ length: 12 }, (_, index) => {
  const act = index + 1;
  return {
    act,
    imagePath: GENERATED_ACT_ART[act] || FALLBACK_ART[index % FALLBACK_ART.length],
    chapterLabel: CHAPTER_LABELS[index],
    alertLevel: ALERT_LEVELS[index],
    briefing: BRIEFINGS[index],
    missionFrame: `ACT ${String(act).padStart(2, "0")} // CHAPTER GRID 01–05 // MISSION CONTROL`,
  };
});

export function getStoryActVisual(act: number): StoryActVisual {
  const index = Math.max(0, Math.min(STORY_ACT_VISUALS.length - 1, Math.floor(act) - 1));
  return STORY_ACT_VISUALS[index];
}

export function getStoryMissionVisual(act: number, chapter: number, missionType: "main" | "side") {
  const visual = getStoryActVisual(act);
  const chapterNumber = Math.max(1, Math.min(5, Math.floor(chapter)));
  let alertLevel = visual.alertLevel;
  if (missionType === "side" && alertLevel === "BLACK") alertLevel = "RED";
  if (chapterNumber >= 4 && alertLevel === "GREEN") alertLevel = "AMBER";
  return {
    imagePath: visual.imagePath,
    chapterLabel: `${visual.chapterLabel} // CHAPTER ${chapterNumber}`,
    alertLevel,
    alertLabel: `${alertLevel} ALERT`,
    frame: visual.missionFrame,
    briefing: visual.briefing,
  };
}

export function getStoryActImagePath(act: number): string { return getStoryActVisual(act).imagePath; }
export function getStoryChapterImagePath(act: number, _chapter: number): string { return getStoryActImagePath(act); }
export function getStoryMissionImagePath(act: number, chapter: number, missionType: "main" | "side"): string { return getStoryMissionVisual(act, chapter, missionType).imagePath; }
export function getStoryActAlertLevel(act: number): StoryAlertLevel { return getStoryActVisual(act).alertLevel; }
export function getStoryChapterLabel(act: number, chapter: number): string { return getStoryMissionVisual(act, chapter, "main").chapterLabel; }
export function getStoryBriefingCopy(act: number): string { return getStoryActVisual(act).briefing; }
export function getStoryBriefingTitle(act: number, chapter: number): string { return getStoryChapterLabel(act, chapter); }
export function getStoryMissionFrame(act: number): string { return getStoryActVisual(act).missionFrame; }
export function getStoryAlertLabel(act: number, chapter: number, missionType: "main" | "side"): string { return getStoryMissionVisual(act, chapter, missionType).alertLabel; }
export function getStoryVisualFallback(): string { return FALLBACK_ART[0]; }
export function getStoryActVisuals(): StoryActVisual[] { return STORY_ACT_VISUALS; }
export function getStoryVisuals(): StoryActVisual[] { return STORY_ACT_VISUALS; }
export function getGeneratedStoryArtActs(): number[] { return Object.keys(GENERATED_ACT_ART).map(Number); }
export function hasGeneratedStoryArt(act: number): boolean { return Boolean(GENERATED_ACT_ART[act]); }
export function isStoryVisualAlertCritical(act: number): boolean { return ["RED", "BLACK"].includes(getStoryActAlertLevel(act)); }
export function getStoryVisualAlt(act: number, chapter = 1): string { return `Act ${act}, Chapter ${chapter} original anime command briefing`; }
export function getStoryVisualPalette(act: number): "blue" | "violet" | "crimson" { const level = getStoryActAlertLevel(act); return level === "BLACK" || level === "RED" ? "crimson" : level === "AMBER" ? "violet" : "blue"; }
export function getStoryVisualThemeClass(act: number): string { return `story-alert-${getStoryVisualPalette(act)}`; }
export function getStoryVisualOverlayClass(act: number): string { return isStoryVisualAlertCritical(act) ? "bg-gradient-to-r from-slate-950/95 via-red-950/45 to-transparent" : "bg-gradient-to-r from-slate-950/95 via-blue-950/45 to-transparent"; }
export function getStoryVisualBadgeClass(act: number): string { return isStoryVisualAlertCritical(act) ? "border-red-400/50 bg-red-500/15 text-red-200" : "border-cyan-300/30 bg-cyan-400/10 text-cyan-100"; }
export function getStoryVisualProgressTone(act: number): string { return isStoryVisualAlertCritical(act) ? "bg-red-500" : "bg-cyan-400"; }

export const STORY_VISUAL_TOTAL_ACTS = STORY_ACT_VISUALS.length;
export const STORY_VISUAL_TOTAL_CHAPTERS = 5;
export const STORY_VISUAL_TOTAL_MISSIONS_PER_CHAPTER = 10;
export const STORY_VISUAL_GENERATED_ACTS = getGeneratedStoryArtActs().length;
export const STORY_VISUAL_FALLBACK_ACTS = STORY_VISUAL_TOTAL_ACTS - STORY_VISUAL_GENERATED_ACTS;
export const STORY_VISUAL_STYLE = "original-anime-command-briefing" as const;
export const STORY_VISUAL_VIDEO_PATH = "/assets/story/video/story-briefing-intro.mp4";
export const STORY_VISUAL_AUDIO_PATH = "/assets/audio/story-alert-briefing.mp3";
export const STORY_VISUAL_COPYRIGHT_NOTE = "Original Stellar Dominion artwork; no franchise characters or logos." as const;

export default STORY_ACT_VISUALS;
