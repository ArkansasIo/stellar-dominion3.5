import { MENU_DEFINITIONS, getPageById } from "./src/data/menuConfig.js";
import { GALAXY_SCALE_PRESETS } from "./src/data/galaxyScalePresets.js";
import { GAME_RUNTIME_BRIDGE, summarizeRuntimeBridge } from "./src/data/gameRuntimeBridge.js";
import { PROJECT_SOURCE_LINKS, VIEWER_ASSET_MOUNTS } from "./src/data/projectLinks.js";
import { createSceneController } from "./src/3d/sceneController.js";
import { setupInputManager } from "./src/input/inputManager.js";
import { createViewerState } from "./src/state/viewerState.js";
import { createControlPanel } from "./src/ui/controlPanel.js";

const canvasRoot = document.querySelector("#viewer-root");
const hudRoot = document.querySelector("#hud-root");

const state = createViewerState({
  menus: MENU_DEFINITIONS,
  galaxyScalePresets: GALAXY_SCALE_PRESETS,
  initialSystemCount: 400,
  projectLinks: PROJECT_SOURCE_LINKS,
  assetMounts: VIEWER_ASSET_MOUNTS,
  runtimeBridgeSummary: summarizeRuntimeBridge(GAME_RUNTIME_BRIDGE),
});

const sceneController = createSceneController({
  container: canvasRoot,
  onSystemHover: (system) => state.setHoveredSystem(system),
  onSystemSelect: (system) => state.selectSystem(system),
  onPlanetSelect: ({ system, planet }) => {
    state.selectSystem(system);
    state.selectPlanet(planet);
  },
});

createControlPanel({
  root: hudRoot,
  state,
});

setupInputManager({
  state,
  sceneController,
});

const initialState = state.getState();
sceneController.rebuildGalaxy({
  seed: initialState.seed,
  systemCount: initialState.systemCount,
  bridgeData: GAME_RUNTIME_BRIDGE,
});
sceneController.applyPage(getPageById(initialState.activePageId));
sceneController.setViewMode(initialState.viewMode);
sceneController.applyShipControlMode(initialState.shipControlMode);

state.subscribe((nextState, previousState) => {
  if (
    nextState.seed !== previousState.seed ||
    nextState.systemCount !== previousState.systemCount
  ) {
    sceneController.rebuildGalaxy({
      seed: nextState.seed,
      systemCount: nextState.systemCount,
      bridgeData: GAME_RUNTIME_BRIDGE,
    });
  }

  if (nextState.activePageId !== previousState.activePageId) {
    sceneController.applyPage(getPageById(nextState.activePageId));
  }

  if (
    nextState.selectedSystem?.id !== previousState.selectedSystem?.id ||
    nextState.hoveredSystem?.id !== previousState.hoveredSystem?.id ||
    nextState.selectedPlanet?.id !== previousState.selectedPlanet?.id
  ) {
    sceneController.syncSelection({
      selectedSystemId: nextState.selectedSystem?.id || null,
      hoveredSystemId: nextState.hoveredSystem?.id || null,
      selectedPlanetId: nextState.selectedPlanet?.id || null,
    });
  }

  if (nextState.motionEnabled !== previousState.motionEnabled) {
    sceneController.setMotionEnabled(nextState.motionEnabled);
  }

  if (nextState.viewMode !== previousState.viewMode) {
    sceneController.setViewMode(nextState.viewMode);
  }

  if (nextState.shipControlMode !== previousState.shipControlMode) {
    sceneController.applyShipControlMode(nextState.shipControlMode);
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "r") {
    state.regenerate();
  }

  if (event.key.toLowerCase() === "f") {
    sceneController.focusSelectedSystem();
  }

  if (event.key === "1") {
    state.setViewMode("galaxy");
  }

  if (event.key === "2") {
    state.setViewMode("system");
  }

  if (event.key === "3") {
    state.setViewMode("planet");
  }

  if (event.key.toLowerCase() === "q") {
    state.cycleShipControlMode(-1);
  }

  if (event.key.toLowerCase() === "e") {
    state.cycleShipControlMode(1);
  }

  if (event.key === "[") {
    state.cycleMenu(-1);
  }

  if (event.key === "]") {
    state.cycleMenu(1);
  }

  if (event.key === ",") {
    state.cyclePage(-1);
  }

  if (event.key === ".") {
    state.cyclePage(1);
  }
});
