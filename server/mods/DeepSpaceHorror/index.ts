import { GameMod, ModHooks } from "../../systems/modSystem";

export default class DeepSpaceHorror extends GameMod {
  readonly name = "DeepSpaceHorror";
  readonly version = "1.0.0";
  readonly author = "OGame Open Source Team";
  readonly description = "Adds Leviathan space monsters and space portals";

  readonly MONSTER_TYPES = {
    AMOEBA: { id: 9001, name: "Space Amoeba", structure: 8000, shield: 10, attack: 150 },
    GUARDIAN: { id: 9002, name: "Guardian", structure: 35000, shield: 500, attack: 800 },
    JUGGERNAUT: { id: 9003, name: "Juggernaut", structure: 150000, shield: 2000, attack: 5000 },
  };

  async onInstall(): Promise<void> { console.log("DeepSpaceHorror installed"); }
  async onUninstall(): Promise<void> { console.log("DeepSpaceHorror uninstalled"); }
  async onInit(): Promise<void> {
    this.registerHook(ModHooks.ROUTE, this.addRoutes.bind(this));
    this.registerHook(ModHooks.BATTLE_POST, this.monsterBattleCheck.bind(this));
    this.registerHook(ModHooks.EXPLORATION, this.portalEncounter.bind(this));
  }

  private addRoutes(req: any, res: any): boolean {
    if (req.path === "/api/mod/deepspace/monsters") {
      res.json({ monsters: Object.values(this.MONSTER_TYPES) });
      return true;
    }
    return false;
  }

  private monsterBattleCheck(result: any) {
    if (Math.random() < 0.01) {
      // 1% chance Leviathan appears in battle
      result.leviathanEncounter = true;
      result.leviathanType = Object.values(this.MONSTER_TYPES)[Math.floor(Math.random() * 3)];
      return true;
    }
    return false;
  }

  private portalEncounter(exploration: any) {
    if (Math.random() < 0.05) {
      // 5% chance of finding space portal in expeditions
      exploration.spacePortal = {
        found: true,
        destination: `[${Math.floor(Math.random() * 9) + 1}:${Math.floor(Math.random() * 499) + 1}:${Math.floor(Math.random() * 15) + 1}]`,
        monsters: Math.random() > 0.5,
      };
      return true;
    }
    return false;
  }
}
