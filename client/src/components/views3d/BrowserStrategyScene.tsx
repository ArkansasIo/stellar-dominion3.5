import { useEffect, useRef } from "react";
import type { BrowserStrategyScenePreset } from "./sceneConfig";

interface BrowserStrategySceneProps {
  preset: BrowserStrategyScenePreset;
  animate?: boolean;
}

interface StarParticle {
  x: number;
  y: number;
  radius: number;
  depth: number;
  drift: number;
  alpha: number;
}

const clampPixelRatio = () => {
  if (typeof window === "undefined") {
    return 1;
  }

  return Math.min(window.devicePixelRatio || 1, 2);
};

const hashSeed = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return Math.abs(hash);
};

const createRandom = (seed: number) => {
  let state = seed || 1;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

const generateStars = (width: number, height: number, preset: BrowserStrategyScenePreset) => {
  const random = createRandom(hashSeed(preset.id));
  return Array.from({ length: preset.starCount }, () => ({
    x: random() * width,
    y: random() * height,
    radius: 0.4 + random() * 1.8,
    depth: 0.4 + random() * 1.2,
    drift: 0.2 + random() * 0.6,
    alpha: 0.22 + random() * 0.7,
  })) satisfies StarParticle[];
};

export function BrowserStrategyScene({ preset, animate = true }: BrowserStrategySceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let stars: StarParticle[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const pixelRatio = clampPixelRatio();
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      stars = generateStars(width, height, preset);
    };

    const draw = (elapsedMs: number) => {
      context.clearRect(0, 0, width, height);

      const baseGradient = context.createLinearGradient(0, 0, width, height);
      baseGradient.addColorStop(0, preset.palette.base);
      baseGradient.addColorStop(0.55, "#07111d");
      baseGradient.addColorStop(1, "#01050a");
      context.fillStyle = baseGradient;
      context.fillRect(0, 0, width, height);

      const glowGradient = context.createRadialGradient(width * 0.74, height * 0.22, 24, width * 0.74, height * 0.22, width * 0.36);
      glowGradient.addColorStop(0, `${preset.palette.glow}22`);
      glowGradient.addColorStop(0.55, `${preset.palette.accent}11`);
      glowGradient.addColorStop(1, "transparent");
      context.fillStyle = glowGradient;
      context.fillRect(0, 0, width, height);

      context.strokeStyle = preset.palette.grid;
      context.lineWidth = 1;
      for (let lineX = -40; lineX < width + 80; lineX += 48) {
        const offset = animate ? (elapsedMs * 0.01 * preset.driftSpeed) % 48 : 0;
        context.beginPath();
        context.moveTo(lineX + offset, 0);
        context.lineTo(lineX - 90 + offset, height);
        context.stroke();
      }

      context.globalCompositeOperation = "screen";
      for (const star of stars) {
        const driftX = animate ? (elapsedMs * 0.004 * star.drift * preset.driftSpeed) % (width + 40) : 0;
        const twinkle = animate ? 0.78 + Math.sin(elapsedMs * 0.0016 * star.depth + star.x) * 0.22 : 1;
        const starX = (star.x + driftX * star.depth) % (width + 20);
        const starY = star.y + Math.sin((elapsedMs * 0.00035 + star.x) * star.depth) * 6;

        context.beginPath();
        context.fillStyle = `rgba(255, 255, 255, ${star.alpha * twinkle})`;
        context.arc(starX, starY, star.radius, 0, Math.PI * 2);
        context.fill();
      }

      context.globalCompositeOperation = "source-over";
      const orbitCenterX = width * 0.73;
      const orbitCenterY = height * 0.62;

      for (let orbitIndex = 0; orbitIndex < preset.orbiters; orbitIndex += 1) {
        const orbitRadius = 82 + orbitIndex * 42;
        context.beginPath();
        context.strokeStyle = `rgba(255,255,255,${0.04 + orbitIndex * 0.012})`;
        context.lineWidth = 1;
        context.ellipse(orbitCenterX, orbitCenterY, orbitRadius, orbitRadius * 0.38, -0.28, 0, Math.PI * 2);
        context.stroke();

        const orbitAngle = (elapsedMs * 0.00024 * preset.driftSpeed) + orbitIndex * 1.18;
        const orbiterX = orbitCenterX + Math.cos(orbitAngle) * orbitRadius;
        const orbiterY = orbitCenterY + Math.sin(orbitAngle) * orbitRadius * 0.38;

        context.beginPath();
        context.fillStyle = orbitIndex % 2 === 0 ? preset.palette.accent : preset.palette.glow;
        context.arc(orbiterX, orbiterY, 2.4 + orbitIndex * 0.35, 0, Math.PI * 2);
        context.fill();
      }

      const planetGradient = context.createRadialGradient(width * 0.86, height * 0.78, 10, width * 0.86, height * 0.78, width * 0.14);
      planetGradient.addColorStop(0, `${preset.palette.glow}ee`);
      planetGradient.addColorStop(0.45, `${preset.palette.accent}aa`);
      planetGradient.addColorStop(1, `${preset.palette.base}11`);
      context.fillStyle = planetGradient;
      context.beginPath();
      context.arc(width * 0.86, height * 0.78, Math.max(width * 0.09, 76), 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "rgba(255,255,255,0.06)";
      context.beginPath();
      context.arc(width * 0.28, height * 0.24, 18, 0, Math.PI * 2);
      context.fill();
    };

    const renderFrame = (timestamp: number) => {
      draw(timestamp);
      if (animate) {
        animationFrame = window.requestAnimationFrame(renderFrame);
      }
    };

    resize();
    renderFrame(0);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [animate, preset]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" data-testid="browser-strategy-scene-canvas" />;
}
