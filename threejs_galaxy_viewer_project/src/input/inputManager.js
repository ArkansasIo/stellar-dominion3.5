function normalizeStick(value) {
  if (Math.abs(value) < 0.16) {
    return 0;
  }
  return value;
}

function detectProfile(gamepad) {
  const id = (gamepad?.id || "").toLowerCase();
  if (id.includes("dualsense") || id.includes("wireless controller") || id.includes("playstation")) {
    return "ps5";
  }
  if (id.includes("xbox")) {
    return "xbox";
  }
  if (gamepad) {
    return "generic-gamepad";
  }
  return "keyboard-mouse";
}

export function setupInputManager(options) {
  const { state, sceneController } = options;
  let rafId = 0;
  let previousButtons = [];
  let lastProfile = "keyboard-mouse";
  const activeKeys = new Set();

  function handlePressed(index, buttons) {
    const pressed = Boolean(buttons[index]?.pressed);
    const previous = Boolean(previousButtons[index]);
    return pressed && !previous;
  }

  function pollGamepad() {
    if (activeKeys.has("w")) {
      sceneController.panCamera(0, -10);
    }
    if (activeKeys.has("s")) {
      sceneController.panCamera(0, 10);
    }
    if (activeKeys.has("a")) {
      sceneController.panCamera(-10, 0);
    }
    if (activeKeys.has("d")) {
      sceneController.panCamera(10, 0);
    }
    if (activeKeys.has("arrowleft")) {
      sceneController.orbitCamera(0.032, 0);
    }
    if (activeKeys.has("arrowright")) {
      sceneController.orbitCamera(-0.032, 0);
    }
    if (activeKeys.has("arrowup")) {
      sceneController.orbitCamera(0, -0.024);
    }
    if (activeKeys.has("arrowdown")) {
      sceneController.orbitCamera(0, 0.024);
    }
    if (activeKeys.has("z")) {
      sceneController.zoomCamera(-18);
    }
    if (activeKeys.has("x")) {
      sceneController.zoomCamera(18);
    }

    const gamepads = navigator.getGamepads?.() || [];
    const gamepad = gamepads.find(Boolean);

    if (!gamepad) {
      if (lastProfile !== "keyboard-mouse") {
        state.setInputProfile("keyboard-mouse");
        state.setControllerStatus("No controller connected");
        lastProfile = "keyboard-mouse";
      }
      previousButtons = [];
      rafId = window.requestAnimationFrame(pollGamepad);
      return;
    }

    const profile = detectProfile(gamepad);
    if (profile !== lastProfile) {
      state.setInputProfile(profile);
      lastProfile = profile;
    }
    state.setControllerStatus(`Connected: ${gamepad.id}`);

    const lx = normalizeStick(gamepad.axes[0] || 0);
    const ly = normalizeStick(gamepad.axes[1] || 0);
    const rx = normalizeStick(gamepad.axes[2] || 0);
    const ry = normalizeStick(gamepad.axes[3] || 0);
    const leftTrigger = gamepad.buttons[6]?.value || 0;
    const rightTrigger = gamepad.buttons[7]?.value || 0;

    if (lx || ly) {
      sceneController.panCamera(lx * 10, ly * 10);
    }
    if (rx || ry) {
      sceneController.orbitCamera(rx * 0.022, ry * 0.018);
    }
    if (leftTrigger > 0.08 || rightTrigger > 0.08) {
      sceneController.zoomCamera((rightTrigger - leftTrigger) * 22);
    }

    if (handlePressed(0, gamepad.buttons)) {
      sceneController.focusSelectedSystem();
    }
    if (handlePressed(1, gamepad.buttons)) {
      state.toggleMotion();
    }
    if (handlePressed(2, gamepad.buttons)) {
      state.cycleViewMode(1);
    }
    if (handlePressed(3, gamepad.buttons)) {
      state.regenerate();
    }
    if (handlePressed(4, gamepad.buttons)) {
      state.cycleMenu(-1);
    }
    if (handlePressed(5, gamepad.buttons)) {
      state.cycleMenu(1);
    }
    if (handlePressed(14, gamepad.buttons)) {
      state.cyclePage(-1);
    }
    if (handlePressed(15, gamepad.buttons)) {
      state.cyclePage(1);
    }
    if (handlePressed(12, gamepad.buttons)) {
      state.cycleShipControlMode(-1);
    }
    if (handlePressed(13, gamepad.buttons)) {
      state.cycleShipControlMode(1);
    }

    previousButtons = gamepad.buttons.map((button) => Boolean(button.pressed));
    rafId = window.requestAnimationFrame(pollGamepad);
  }

  window.addEventListener("gamepadconnected", (event) => {
    const profile = detectProfile(event.gamepad);
    state.setInputProfile(profile);
    state.setControllerStatus(`Connected: ${event.gamepad.id}`);
    lastProfile = profile;
  });

  window.addEventListener("gamepaddisconnected", () => {
    state.setInputProfile("keyboard-mouse");
    state.setControllerStatus("No controller connected");
    lastProfile = "keyboard-mouse";
  });

  window.addEventListener("pointerdown", () => {
    state.setInputProfile("keyboard-mouse");
  });

  window.addEventListener("keydown", () => {
    state.setInputProfile("keyboard-mouse");
  });

  window.addEventListener("keydown", (event) => {
    activeKeys.add(event.key.toLowerCase());
  });

  window.addEventListener("keyup", (event) => {
    activeKeys.delete(event.key.toLowerCase());
  });

  window.addEventListener("blur", () => {
    activeKeys.clear();
  });

  rafId = window.requestAnimationFrame(pollGamepad);

  return {
    dispose() {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    },
  };
}
