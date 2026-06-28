import { GameMod, ModHooks } from "../../systems/modSystem";
import { Router } from "express";

export default class BogusMod extends GameMod {
  readonly name = "BogusMod";
  readonly version = "1.0.0";
  readonly author = "OGame Open Source Team";
  readonly description = "Example mod - adds Tritium resource and Tip of the Day";

  async onInstall(): Promise<void> { console.log("BogusMod installed"); }
  async onUninstall(): Promise<void> { console.log("BogusMod uninstalled"); }
  async onInit(): Promise<void> {
    this.registerHook(ModHooks.RESOURCES, this.addTritium.bind(this));
    this.registerHook(ModHooks.PRODUCTION, this.tritiumProduction.bind(this));
    this.registerHook(ModHooks.MENU_ITEMS, this.addMenuItems.bind(this));
    this.registerHook(ModHooks.ROUTE, this.addRoutes.bind(this));
  }

  private addTritium(resources: any) {
    resources.tritium = resources.tritium || 0;
    return true;
  }

  private tritiumProduction(production: any, planet: any) {
    production.tritium = Math.floor(planet.buildings?.metalMine || 0) * 5;
    return true;
  }

  private addMenuItems(menu: any[]) {
    menu.push({ label: "Tip of the Day", page: "tipoftheday", icon: "lightbulb" });
    return true;
  }

  private addRoutes(req: any, res: any): boolean {
    if (req.path === "/api/mod/bogus/tip") {
      const tips = [
        "Build more mines to increase resource production!",
        "Research technologies to unlock new ships!",
        "Join an alliance for protection and trade!",
        "Use espionage probes to scout enemies before attacking!",
      ];
      res.json({ tip: tips[Math.floor(Math.random() * tips.length)] });
      return true;
    }
    return false;
  }
}
