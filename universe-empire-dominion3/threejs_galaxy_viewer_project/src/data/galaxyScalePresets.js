export const GALAXY_SCALE_PRESETS = [
  {
    id: "tiny",
    label: "Tiny",
    systemCount: 200,
    systemDiameterAu: "100-220 AU",
    interstellarSpacingLy: "5-12 ly",
    galaxyDiameterLy: "120-220 ly",
    celestialBodiesEstimate: "2,000+ bodies",
    note: "Compact choke-point map with fast contact between neighboring stars.",
  },
  {
    id: "small",
    label: "Small",
    systemCount: 400,
    systemDiameterAu: "120-240 AU",
    interstellarSpacingLy: "6-16 ly",
    galaxyDiameterLy: "180-300 ly",
    celestialBodiesEstimate: "4,000+ bodies",
    note: "Close to the common smaller Stellaris layout with room for frontier wars.",
  },
  {
    id: "medium",
    label: "Medium",
    systemCount: 600,
    systemDiameterAu: "140-260 AU",
    interstellarSpacingLy: "8-20 ly",
    galaxyDiameterLy: "260-420 ly",
    celestialBodiesEstimate: "6,000+ bodies",
    note: "Classic strategy scale with strong hyperlane webs and several regional powers.",
  },
  {
    id: "large",
    label: "Large",
    systemCount: 800,
    systemDiameterAu: "160-280 AU",
    interstellarSpacingLy: "9-24 ly",
    galaxyDiameterLy: "320-520 ly",
    celestialBodiesEstimate: "8,000+ bodies",
    note: "Broad mid-to-late game galaxy with deeper borders and longer fleet lanes.",
  },
  {
    id: "huge",
    label: "Huge",
    systemCount: 1000,
    systemDiameterAu: "180-300 AU",
    interstellarSpacingLy: "10-30 ly",
    galaxyDiameterLy: "400-650 ly",
    celestialBodiesEstimate: "10,000+ bodies",
    note: "Stellaris huge-map style sector with very high node count and long campaign arcs.",
  },
];

export const CUSTOM_GALAXY_SCALE_PRESET = {
  id: "custom",
  label: "Custom",
  systemCount: 0,
  systemDiameterAu: "100-300 AU",
  interstellarSpacingLy: "5-50 ly",
  galaxyDiameterLy: "300-600 ly",
  celestialBodiesEstimate: "Variable body count",
  note: "Manual density profile derived from your current system-count slider.",
};

export function getGalaxyScalePresetById(presetId) {
  return GALAXY_SCALE_PRESETS.find((preset) => preset.id === presetId) || GALAXY_SCALE_PRESETS[1];
}

export function getMatchingGalaxyScalePreset(systemCount) {
  return GALAXY_SCALE_PRESETS.find((preset) => preset.systemCount === systemCount) || null;
}

export function buildGalaxyScaleSummary(systemCount) {
  const preset = getMatchingGalaxyScalePreset(systemCount);
  if (preset) {
    return preset;
  }

  const estimatedBodies = Math.max(systemCount * 10, systemCount);
  const minDiameter = Math.max(120, Math.round(systemCount * 0.4));
  const maxDiameter = Math.max(220, Math.round(systemCount * 0.65));
  return {
    ...CUSTOM_GALAXY_SCALE_PRESET,
    systemCount,
    galaxyDiameterLy: `${minDiameter}-${maxDiameter} ly`,
    celestialBodiesEstimate: `${estimatedBodies.toLocaleString()}+ bodies`,
  };
}
