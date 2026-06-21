export const KEYBOARD_LAYOUT = [
  ["Esc", "1", "2", "3", "R", "F"],
  ["Tab", "Q", "W", "E", "RMB"],
  ["Caps", "A", "S", "D", "Wheel"],
  ["Shift", "[", "]", ",", "."],
  ["Ctrl", "Arrows", "Z", "X", "Space"],
];

export const KEYBOARD_BINDINGS = [
  { key: "1 / 2 / 3", action: "Switch galaxy, system, and planet views" },
  { key: "R", action: "Regenerate the universe layout" },
  { key: "F", action: "Focus the active star system or planet" },
  { key: "Q / E", action: "Cycle ship control posture backward or forward" },
  { key: "[ / ]", action: "Cycle main menus" },
  { key: ", / .", action: "Cycle sub menus and pages" },
  { key: "W / A / S / D", action: "Pan camera across the universe view" },
  { key: "Arrow Keys", action: "Orbit the camera around the current target" },
  { key: "Z / X", action: "Zoom camera in or out" },
  { key: "Mouse Drag", action: "Orbit with the mouse" },
  { key: "Mouse Wheel", action: "Zoom with the mouse wheel" },
  { key: "Mouse Click", action: "Select stars and planets" },
];

export const CONTROLLER_BINDINGS = {
  xbox: {
    label: "Xbox Layout",
    faceButtons: [
      { key: "A", action: "Focus selection" },
      { key: "B", action: "Pause or resume motion" },
      { key: "X", action: "Cycle view mode" },
      { key: "Y", action: "Regenerate the galaxy" },
    ],
    shoulders: [
      { key: "LB / RB", action: "Cycle main menus" },
      { key: "LT / RT", action: "Zoom camera" },
    ],
    sticks: [
      { key: "Left Stick", action: "Pan camera" },
      { key: "Right Stick", action: "Orbit camera" },
    ],
    dpad: [
      { key: "D-pad Left / Right", action: "Cycle sub menus" },
      { key: "D-pad Up / Down", action: "Cycle ship posture" },
    ],
  },
  ps5: {
    label: "PS5 Layout",
    faceButtons: [
      { key: "Cross", action: "Focus selection" },
      { key: "Circle", action: "Pause or resume motion" },
      { key: "Square", action: "Cycle view mode" },
      { key: "Triangle", action: "Regenerate the galaxy" },
    ],
    shoulders: [
      { key: "L1 / R1", action: "Cycle main menus" },
      { key: "L2 / R2", action: "Zoom camera" },
    ],
    sticks: [
      { key: "Left Stick", action: "Pan camera" },
      { key: "Right Stick", action: "Orbit camera" },
    ],
    dpad: [
      { key: "D-pad Left / Right", action: "Cycle sub menus" },
      { key: "D-pad Up / Down", action: "Cycle ship posture" },
    ],
  },
  "generic-gamepad": {
    label: "Generic Gamepad",
    faceButtons: [
      { key: "South", action: "Focus selection" },
      { key: "East", action: "Pause or resume motion" },
      { key: "West", action: "Cycle view mode" },
      { key: "North", action: "Regenerate the galaxy" },
    ],
    shoulders: [
      { key: "L1 / R1", action: "Cycle main menus" },
      { key: "L2 / R2", action: "Zoom camera" },
    ],
    sticks: [
      { key: "Left Stick", action: "Pan camera" },
      { key: "Right Stick", action: "Orbit camera" },
    ],
    dpad: [
      { key: "D-pad Left / Right", action: "Cycle sub menus" },
      { key: "D-pad Up / Down", action: "Cycle ship posture" },
    ],
  },
};
