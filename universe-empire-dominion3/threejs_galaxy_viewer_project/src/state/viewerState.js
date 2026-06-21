import { getDefaultPage, getMenuById } from "../data/menuConfig.js";
import {
  GALAXY_SCALE_PRESETS,
  buildGalaxyScaleSummary,
  getGalaxyScalePresetById,
  getMatchingGalaxyScalePreset,
} from "../data/galaxyScalePresets.js";

function randomSeed() {
  return Math.floor(Math.random() * 1000000);
}

export function createViewerState(options) {
  const menus = options.menus || [];
  const initialMenuId = menus[0]?.id || "command";
  const initialPage = getDefaultPage(initialMenuId);
  const listeners = new Set();
  const initialSystemCount = options.initialSystemCount || 400;
  const initialPreset = getMatchingGalaxyScalePreset(initialSystemCount) || getGalaxyScalePresetById("small");

  let state = {
    menus,
    galaxyScalePresets: options.galaxyScalePresets || GALAXY_SCALE_PRESETS,
    projectLinks: options.projectLinks || [],
    assetMounts: options.assetMounts || [],
    runtimeBridgeSummary: options.runtimeBridgeSummary || null,
    seed: randomSeed(),
    systemCount: initialSystemCount,
    galaxyScalePresetId: initialPreset.id,
    galaxyScaleSummary: buildGalaxyScaleSummary(initialSystemCount),
    motionEnabled: true,
    activeMenuId: initialMenuId,
    activePageId: initialPage.id,
    viewMode: initialPage.defaultViewMode || "galaxy",
    shipControlMode: "patrol",
    inputProfile: "keyboard-mouse",
    controllerStatus: "No controller connected",
    hoveredSystem: null,
    selectedSystem: null,
    selectedPlanet: null,
  };

  function emit(previousState) {
    for (const listener of listeners) {
      listener(state, previousState);
    }
  }

  function update(patch) {
    const previousState = state;
    state = { ...state, ...patch };
    emit(previousState);
  }

  return {
    getState() {
      return state;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setMenu(menuId) {
      const menu = getMenuById(menuId);
      update({
        activeMenuId: menu.id,
        activePageId: menu.pages[0]?.id || state.activePageId,
        viewMode: menu.pages[0]?.defaultViewMode || state.viewMode,
      });
    },
    setPage(pageId) {
      for (const menu of menus) {
        const page = menu.pages.find((entry) => entry.id === pageId);
        if (page) {
          update({
            activeMenuId: menu.id,
            activePageId: page.id,
            viewMode: page.defaultViewMode || state.viewMode,
          });
          return;
        }
      }
    },
    setHoveredSystem(system) {
      if (state.hoveredSystem?.id === system?.id) {
        return;
      }
      update({ hoveredSystem: system || null });
    },
    selectSystem(system) {
      update({
        selectedSystem: system || null,
        selectedPlanet: null,
      });
    },
    selectPlanet(planet) {
      update({
        selectedPlanet: planet || null,
        viewMode: planet ? "planet" : state.viewMode,
      });
    },
    setSystemCount(systemCount) {
      const normalized = Math.max(120, Math.min(1000, Math.round(Number(systemCount) || state.systemCount)));
      if (normalized === state.systemCount) {
        return;
      }
      const matchedPreset = getMatchingGalaxyScalePreset(normalized);
      update({
        systemCount: normalized,
        galaxyScalePresetId: matchedPreset?.id || "custom",
        galaxyScaleSummary: buildGalaxyScaleSummary(normalized),
        selectedSystem: null,
        hoveredSystem: null,
        selectedPlanet: null,
      });
    },
    setGalaxyScalePreset(presetId) {
      const preset = getGalaxyScalePresetById(presetId);
      update({
        galaxyScalePresetId: preset.id,
        galaxyScaleSummary: buildGalaxyScaleSummary(preset.systemCount),
        systemCount: preset.systemCount,
        selectedSystem: null,
        hoveredSystem: null,
        selectedPlanet: null,
      });
    },
    setViewMode(viewMode) {
      update({ viewMode });
    },
    cycleViewMode(step) {
      const modes = ["galaxy", "system", "planet"];
      const currentIndex = modes.indexOf(state.viewMode);
      const nextIndex = (currentIndex + step + modes.length) % modes.length;
      update({ viewMode: modes[nextIndex] });
    },
    setShipControlMode(shipControlMode) {
      update({ shipControlMode });
    },
    cycleShipControlMode(step) {
      const modes = ["patrol", "survey", "intercept", "colonize"];
      const currentIndex = modes.indexOf(state.shipControlMode);
      const nextIndex = (currentIndex + step + modes.length) % modes.length;
      update({ shipControlMode: modes[nextIndex] });
    },
    cycleMenu(step) {
      const currentIndex = menus.findIndex((entry) => entry.id === state.activeMenuId);
      const nextMenu = menus[(currentIndex + step + menus.length) % menus.length] || menus[0];
      update({
        activeMenuId: nextMenu.id,
        activePageId: nextMenu.pages[0]?.id || state.activePageId,
        viewMode: nextMenu.pages[0]?.defaultViewMode || state.viewMode,
      });
    },
    cyclePage(step) {
      const menu = getMenuById(state.activeMenuId);
      const pages = menu.pages || [];
      const currentIndex = pages.findIndex((entry) => entry.id === state.activePageId);
      const nextPage = pages[(currentIndex + step + pages.length) % pages.length] || pages[0];
      update({
        activeMenuId: menu.id,
        activePageId: nextPage.id,
        viewMode: nextPage.defaultViewMode || state.viewMode,
      });
    },
    setInputProfile(inputProfile) {
      if (state.inputProfile === inputProfile) {
        return;
      }
      update({ inputProfile });
    },
    setControllerStatus(controllerStatus) {
      if (state.controllerStatus === controllerStatus) {
        return;
      }
      update({ controllerStatus });
    },
    toggleMotion() {
      update({ motionEnabled: !state.motionEnabled });
    },
    regenerate() {
      update({
        seed: randomSeed(),
        selectedSystem: null,
        hoveredSystem: null,
        selectedPlanet: null,
      });
    },
  };
}
