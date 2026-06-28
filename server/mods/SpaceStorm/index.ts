import { GameMod, ModHooks } from "../../systems/modSystem";

export default class SpaceStorm extends GameMod {
  readonly name = "SpaceStorm";
  readonly version = "1.0.0";
  readonly author = "OGame Open Source Team";
  readonly description = "Dynamic space weather events affecting gameplay";

  readonly STORM_TYPES = [
    { id: 1, name: "Subspace Turbulence", effect: "fleet_speed", modifier: 0.5, duration: 3600 },
    { id: 2, name: "Subspace Jump", effect: "fleet_speed", modifier: 2.0, duration: 1800 },
    { id: 3, name: "Polar Shield Distortion", effect: "shield", modifier: 0.7, duration: 7200 },
    { id: 4, name: "Quantum Drive Instability", effect: "fuel", modifier: 1.5, duration: 3600 },
    { id: 5, name: "Chrono-Spy Disruption", effect: "espionage", modifier: 2.0, duration: 5400 },
    { id: 6, name: "Energy Collapse", effect: "energy", modifier: 0.5, duration: 9000 },
    { id: 7, name: "Gravitational Defense Anomaly", effect: "defense", modifier: 0.8, duration: 4800 },
    { id: 8, name: "Matter Signature", effect: "scan", modifier: 3.0, duration: 3000 },
    { id: 9, name: "Communication Breakdown", effect: "messages", modifier: 0, duration: 6000 },
    { id: 10, name: "Attack Reverberation", effect: "attack", modifier: 1.3, duration: 2400 },
  ];

  private activeStorms: Map<string, any> = new Map();

  async onInstall(): Promise<void> { console.log("SpaceStorm installed"); }
  async onUninstall(): Promise<void> { console.log("SpaceStorm uninstalled"); }
  async onInit(): Promise<void> {
    this.registerHook(ModHooks.MENU_ITEMS, this.addMenuItems.bind(this));
    this.registerHook(ModHooks.ROUTE, this.addRoutes.bind(this));
    this.registerHook(ModHooks.BONUSES, this.applyStormBonuses.bind(this));
    this.registerHook(ModHooks.QUEUE, this.processStormEvents.bind(this));

    // Start storm generation
    this.scheduleNextStorm();
  }

  private addMenuItems(menu: any[]) {
    menu.push({ label: "Space Weather", page: "spacestorm", icon: "cloud-lightning" });
    return true;
  }

  private addRoutes(req: any, res: any): boolean {
    if (req.path === "/api/mod/spacestorm/active") {
      res.json({
        storms: Array.from(this.activeStorms.values()),
        count: this.activeStorms.size,
      });
      return true;
    }
    return false;
  }

  private applyStormBonuses(bonuses: any) {
    this.activeStorms.forEach((storm) => {
      if (storm.modifier < 1) {
        bonuses[storm.type] = (bonuses[storm.type] || 1) * storm.modifier;
      }
    });
    return this.activeStorms.size > 0;
  }

  private processStormEvents(queue: any) {
    // Clean expired storms
    const now = Date.now();
    this.activeStorms.forEach((storm, id) => {
      if (storm.expiresAt <= now) {
        this.activeStorms.delete(id);
      }
    });
    return false;
  }

  private scheduleNextStorm() {
    const delay = 300000 + Math.random() * 600000; // 5-15 minutes
    setTimeout(() => {
      this.generateStorm();
      this.scheduleNextStorm();
    }, delay);
  }

  private generateStorm() {
    const storm = this.STORM_TYPES[Math.floor(Math.random() * this.STORM_TYPES.length)];
    const affectedRegion = `[${Math.floor(Math.random() * 9) + 1}:${Math.floor(Math.random() * 499) + 1}]`;
    const id = `storm_${Date.now()}`;
    this.activeStorms.set(id, {
      ...storm,
      id,
      region: affectedRegion,
      startedAt: Date.now(),
      expiresAt: Date.now() + storm.duration * 1000,
      severity: Math.random() > 0.7 ? "severe" : "moderate",
    });
    console.log(`[SpaceStorm] ${storm.name} affecting ${affectedRegion}`);
  }
}
