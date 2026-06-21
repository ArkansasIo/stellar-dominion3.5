import { cn } from "@/lib/utils";
import { BrowserStrategyScene } from "./BrowserStrategyScene";
import type { BrowserStrategyScenePreset } from "./sceneConfig";

interface SceneLayerProps {
  preset: BrowserStrategyScenePreset;
  backdropImage?: string;
  animate?: boolean;
}

export function SceneLayer({ preset, backdropImage, animate = true }: SceneLayerProps) {
  return (
    <div className="sd-scene-layer pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true" data-testid="scene-layer">
      <BrowserStrategyScene preset={preset} animate={animate} />

      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(2, 6, 23, 0.08), rgba(2, 6, 23, 0.7)), url(${preset.assetLayout.skybox.path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {backdropImage ? (
        <div
          className="absolute inset-0 opacity-20 mix-blend-screen"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1), transparent 40%), url(${backdropImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : null}

      <div
        className="sd-scene-hero absolute inset-y-0 right-[-6vw] hidden w-[42vw] min-w-[340px] max-w-[620px] opacity-70 lg:block"
        style={{
          backgroundImage: `url(${preset.assetLayout.hero.path})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right bottom",
          backgroundSize: "contain",
          filter: "drop-shadow(0 0 42px rgba(86, 167, 255, 0.18))",
        }}
      />

      <div
        className="sd-scene-support absolute bottom-[18%] left-[-3vw] hidden h-[30vw] w-[30vw] min-h-[200px] min-w-[200px] max-h-[420px] max-w-[420px] opacity-35 md:block"
        style={{
          backgroundImage: `url(${preset.assetLayout.support.path})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left center",
          backgroundSize: "contain",
        }}
      />

      <div
        className="sd-scene-fleet absolute left-[22%] top-[10%] hidden h-[180px] w-[340px] opacity-25 xl:block"
        style={{
          backgroundImage: `url(${preset.assetLayout.fleet.path})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",
          transform: "rotate(-8deg)",
        }}
      />

      <div
        className="sd-scene-grid absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `url(${preset.assetLayout.grid.path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div
        className={cn(
          "sd-scene-ring absolute right-[12%] top-[18%] hidden h-[220px] w-[220px] rounded-full xl:block",
          "border border-white/10 bg-white/[0.03] backdrop-blur-[1px]",
        )}
        style={{
          backgroundImage: `url(${preset.assetLayout.ring.path})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",
          boxShadow: `0 0 60px ${preset.palette.accent}22`,
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_34%),linear-gradient(180deg,rgba(2,6,23,0.02),rgba(2,6,23,0.5)_70%,rgba(2,6,23,0.74))]" />
    </div>
  );
}
