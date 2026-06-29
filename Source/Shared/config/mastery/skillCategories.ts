// AUTO-GENERATED: 2026-06-20T04:13:39.467Z
export const TOTAL_CATEGORIES = 98;
export const TOTAL_SUBCATEGORIES = 980;

export interface SkillSubcategory {
  id: string;
  name: string;
  description: string;
  skillCount: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  subcategories: SkillSubcategory[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    "id": "cat_fc_1",
    "name": "Fleet Command",
    "icon": "🚀",
    "color": "#ef4444",
    "description": "Mastery in fleet command for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_fc_1_1",
        "name": "Battleline Tactics",
        "description": "Specialization in battleline tactics.",
        "skillCount": 10
      },
      {
        "id": "sub_fc_1_2",
        "name": "Carrier Operations",
        "description": "Specialization in carrier operations.",
        "skillCount": 10
      },
      {
        "id": "sub_fc_1_3",
        "name": "Escourt Doctrine",
        "description": "Specialization in escourt doctrine.",
        "skillCount": 10
      },
      {
        "id": "sub_fc_1_4",
        "name": "Capital Ship Mastery",
        "description": "Specialization in capital ship mastery.",
        "skillCount": 10
      },
      {
        "id": "sub_fc_1_5",
        "name": "Fleet Logistics",
        "description": "Specialization in fleet logistics.",
        "skillCount": 10
      },
      {
        "id": "sub_fc_1_6",
        "name": "Rapid Deployment",
        "description": "Specialization in rapid deployment.",
        "skillCount": 10
      },
      {
        "id": "sub_fc_1_7",
        "name": "Flotilla Coordination",
        "description": "Specialization in flotilla coordination.",
        "skillCount": 10
      },
      {
        "id": "sub_fc_1_8",
        "name": "Armada Strategy",
        "description": "Specialization in armada strategy.",
        "skillCount": 10
      },
      {
        "id": "sub_fc_1_9",
        "name": "Naval Gunnery",
        "description": "Specialization in naval gunnery.",
        "skillCount": 10
      },
      {
        "id": "sub_fc_1_10",
        "name": "Siege Warfare",
        "description": "Specialization in siege warfare.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_gw_2",
    "name": "Ground Warfare",
    "icon": "⚔️",
    "color": "#f97316",
    "description": "Mastery in ground warfare for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_gw_2_1",
        "name": "Infantry Doctrine",
        "description": "Specialization in infantry doctrine.",
        "skillCount": 10
      },
      {
        "id": "sub_gw_2_2",
        "name": "Mech Armor",
        "description": "Specialization in mech armor.",
        "skillCount": 10
      },
      {
        "id": "sub_gw_2_3",
        "name": "Urban Combat",
        "description": "Specialization in urban combat.",
        "skillCount": 10
      },
      {
        "id": "sub_gw_2_4",
        "name": "Jungle Warfare",
        "description": "Specialization in jungle warfare.",
        "skillCount": 10
      },
      {
        "id": "sub_gw_2_5",
        "name": "Arctic Operations",
        "description": "Specialization in arctic operations.",
        "skillCount": 10
      },
      {
        "id": "sub_gw_2_6",
        "name": "Desert Tactics",
        "description": "Specialization in desert tactics.",
        "skillCount": 10
      },
      {
        "id": "sub_gw_2_7",
        "name": "Mountain Assault",
        "description": "Specialization in mountain assault.",
        "skillCount": 10
      },
      {
        "id": "sub_gw_2_8",
        "name": "Amphibious Ops",
        "description": "Specialization in amphibious ops.",
        "skillCount": 10
      },
      {
        "id": "sub_gw_2_9",
        "name": "Drop Pod Assault",
        "description": "Specialization in drop pod assault.",
        "skillCount": 10
      },
      {
        "id": "sub_gw_2_10",
        "name": "Trench Warfare",
        "description": "Specialization in trench warfare.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_ord_3",
    "name": "Ordnance",
    "icon": "💥",
    "color": "#dc2626",
    "description": "Mastery in ordnance for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_ord_3_1",
        "name": "Kinetic Weapons",
        "description": "Specialization in kinetic weapons.",
        "skillCount": 10
      },
      {
        "id": "sub_ord_3_2",
        "name": "Energy Weapons",
        "description": "Specialization in energy weapons.",
        "skillCount": 10
      },
      {
        "id": "sub_ord_3_3",
        "name": "Plasma Systems",
        "description": "Specialization in plasma systems.",
        "skillCount": 10
      },
      {
        "id": "sub_ord_3_4",
        "name": "Missile Tech",
        "description": "Specialization in missile tech.",
        "skillCount": 10
      },
      {
        "id": "sub_ord_3_5",
        "name": "Torpedo Systems",
        "description": "Specialization in torpedo systems.",
        "skillCount": 10
      },
      {
        "id": "sub_ord_3_6",
        "name": "Orbital Bombardment",
        "description": "Specialization in orbital bombardment.",
        "skillCount": 10
      },
      {
        "id": "sub_ord_3_7",
        "name": "EMP Warfare",
        "description": "Specialization in emp warfare.",
        "skillCount": 10
      },
      {
        "id": "sub_ord_3_8",
        "name": "Antimatter Weapons",
        "description": "Specialization in antimatter weapons.",
        "skillCount": 10
      },
      {
        "id": "sub_ord_3_9",
        "name": "Dark Matter Arms",
        "description": "Specialization in dark matter arms.",
        "skillCount": 10
      },
      {
        "id": "sub_ord_3_10",
        "name": "Nova Charges",
        "description": "Specialization in nova charges.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_ds_4",
    "name": "Defensive Systems",
    "icon": "🛡️",
    "color": "#2563eb",
    "description": "Mastery in defensive systems for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_ds_4_1",
        "name": "Shield Matrix",
        "description": "Specialization in shield matrix.",
        "skillCount": 10
      },
      {
        "id": "sub_ds_4_2",
        "name": "Point Defense",
        "description": "Specialization in point defense.",
        "skillCount": 10
      },
      {
        "id": "sub_ds_4_3",
        "name": "Armor Plating",
        "description": "Specialization in armor plating.",
        "skillCount": 10
      },
      {
        "id": "sub_ds_4_4",
        "name": "Electronic Countermeasures",
        "description": "Specialization in electronic countermeasures.",
        "skillCount": 10
      },
      {
        "id": "sub_ds_4_5",
        "name": "Hull Reinforcement",
        "description": "Specialization in hull reinforcement.",
        "skillCount": 10
      },
      {
        "id": "sub_ds_4_6",
        "name": "Damage Control",
        "description": "Specialization in damage control.",
        "skillCount": 10
      },
      {
        "id": "sub_ds_4_7",
        "name": "Force Fields",
        "description": "Specialization in force fields.",
        "skillCount": 10
      },
      {
        "id": "sub_ds_4_8",
        "name": "Reflective Coating",
        "description": "Specialization in reflective coating.",
        "skillCount": 10
      },
      {
        "id": "sub_ds_4_9",
        "name": "Ablative Armor",
        "description": "Specialization in ablative armor.",
        "skillCount": 10
      },
      {
        "id": "sub_ds_4_10",
        "name": "Hardpoint Defense",
        "description": "Specialization in hardpoint defense.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_sse_5",
    "name": "Starship Engineering",
    "icon": "🔧",
    "color": "#7c3aed",
    "description": "Mastery in starship engineering for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_sse_5_1",
        "name": "Hull Design",
        "description": "Specialization in hull design.",
        "skillCount": 10
      },
      {
        "id": "sub_sse_5_2",
        "name": "Engine Systems",
        "description": "Specialization in engine systems.",
        "skillCount": 10
      },
      {
        "id": "sub_sse_5_3",
        "name": "Power Core",
        "description": "Specialization in power core.",
        "skillCount": 10
      },
      {
        "id": "sub_sse_5_4",
        "name": "Warp Drive",
        "description": "Specialization in warp drive.",
        "skillCount": 10
      },
      {
        "id": "sub_sse_5_5",
        "name": "Impulse Motors",
        "description": "Specialization in impulse motors.",
        "skillCount": 10
      },
      {
        "id": "sub_sse_5_6",
        "name": "Thruster Array",
        "description": "Specialization in thruster array.",
        "skillCount": 10
      },
      {
        "id": "sub_sse_5_7",
        "name": "Structural Integrity",
        "description": "Specialization in structural integrity.",
        "skillCount": 10
      },
      {
        "id": "sub_sse_5_8",
        "name": "Emergency Systems",
        "description": "Specialization in emergency systems.",
        "skillCount": 10
      },
      {
        "id": "sub_sse_5_9",
        "name": "Modular Design",
        "description": "Specialization in modular design.",
        "skillCount": 10
      },
      {
        "id": "sub_sse_5_10",
        "name": "Exotic Matter",
        "description": "Specialization in exotic matter.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_wt_6",
    "name": "Warp Technology",
    "icon": "🌀",
    "color": "#06b6d4",
    "description": "Mastery in warp technology for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_wt_6_1",
        "name": "Subspace Theory",
        "description": "Specialization in subspace theory.",
        "skillCount": 10
      },
      {
        "id": "sub_wt_6_2",
        "name": "Jump Gate Ops",
        "description": "Specialization in jump gate ops.",
        "skillCount": 10
      },
      {
        "id": "sub_wt_6_3",
        "name": "Folding Space",
        "description": "Specialization in folding space.",
        "skillCount": 10
      },
      {
        "id": "sub_wt_6_4",
        "name": "Blink Drive",
        "description": "Specialization in blink drive.",
        "skillCount": 10
      },
      {
        "id": "sub_wt_6_5",
        "name": "Quantum Tunneling",
        "description": "Specialization in quantum tunneling.",
        "skillCount": 10
      },
      {
        "id": "sub_wt_6_6",
        "name": "Wormhole Stabilization",
        "description": "Specialization in wormhole stabilization.",
        "skillCount": 10
      },
      {
        "id": "sub_wt_6_7",
        "name": "Dimensional Bypass",
        "description": "Specialization in dimensional bypass.",
        "skillCount": 10
      },
      {
        "id": "sub_wt_6_8",
        "name": "Hyperlane Navigation",
        "description": "Specialization in hyperlane navigation.",
        "skillCount": 10
      },
      {
        "id": "sub_wt_6_9",
        "name": "Slipstream Travel",
        "description": "Specialization in slipstream travel.",
        "skillCount": 10
      },
      {
        "id": "sub_wt_6_10",
        "name": "Warp Bubble Control",
        "description": "Specialization in warp bubble control.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_ast_7",
    "name": "Astrogation",
    "icon": "🧭",
    "color": "#0891b2",
    "description": "Mastery in astrogation for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_ast_7_1",
        "name": "Stellar Cartography",
        "description": "Specialization in stellar cartography.",
        "skillCount": 10
      },
      {
        "id": "sub_ast_7_2",
        "name": "Deep Space Navigation",
        "description": "Specialization in deep space navigation.",
        "skillCount": 10
      },
      {
        "id": "sub_ast_7_3",
        "name": "Gravitational Mapping",
        "description": "Specialization in gravitational mapping.",
        "skillCount": 10
      },
      {
        "id": "sub_ast_7_4",
        "name": "Asteroid Avoidance",
        "description": "Specialization in asteroid avoidance.",
        "skillCount": 10
      },
      {
        "id": "sub_ast_7_5",
        "name": "Nebula Transit",
        "description": "Specialization in nebula transit.",
        "skillCount": 10
      },
      {
        "id": "sub_ast_7_6",
        "name": "Black Hole Skirting",
        "description": "Specialization in black hole skirting.",
        "skillCount": 10
      },
      {
        "id": "sub_ast_7_7",
        "name": "Pulsar Timing",
        "description": "Specialization in pulsar timing.",
        "skillCount": 10
      },
      {
        "id": "sub_ast_7_8",
        "name": "Galactic Positioning",
        "description": "Specialization in galactic positioning.",
        "skillCount": 10
      },
      {
        "id": "sub_ast_7_9",
        "name": "Comet Trail Riding",
        "description": "Specialization in comet trail riding.",
        "skillCount": 10
      },
      {
        "id": "sub_ast_7_10",
        "name": "Dark Sector Mapping",
        "description": "Specialization in dark sector mapping.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_com_8",
    "name": "Communications",
    "icon": "📡",
    "color": "#0284c7",
    "description": "Mastery in communications for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_com_8_1",
        "name": "Subspace Relay",
        "description": "Specialization in subspace relay.",
        "skillCount": 10
      },
      {
        "id": "sub_com_8_2",
        "name": "Quantum Entanglement",
        "description": "Specialization in quantum entanglement.",
        "skillCount": 10
      },
      {
        "id": "sub_com_8_3",
        "name": "Laser Comm",
        "description": "Specialization in laser comm.",
        "skillCount": 10
      },
      {
        "id": "sub_com_8_4",
        "name": "Tachyon Burst",
        "description": "Specialization in tachyon burst.",
        "skillCount": 10
      },
      {
        "id": "sub_com_8_5",
        "name": "Neutrino Beam",
        "description": "Specialization in neutrino beam.",
        "skillCount": 10
      },
      {
        "id": "sub_com_8_6",
        "name": "Ansible Network",
        "description": "Specialization in ansible network.",
        "skillCount": 10
      },
      {
        "id": "sub_com_8_7",
        "name": "Fleet Broadcast",
        "description": "Specialization in fleet broadcast.",
        "skillCount": 10
      },
      {
        "id": "sub_com_8_8",
        "name": "Encrypted Channel",
        "description": "Specialization in encrypted channel.",
        "skillCount": 10
      },
      {
        "id": "sub_com_8_9",
        "name": "Emergency Signal",
        "description": "Specialization in emergency signal.",
        "skillCount": 10
      },
      {
        "id": "sub_com_8_10",
        "name": "Universal Translator",
        "description": "Specialization in universal translator.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_cw_9",
    "name": "Cyber Warfare",
    "icon": "💻",
    "color": "#4f46e5",
    "description": "Mastery in cyber warfare for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_cw_9_1",
        "name": "System Hacking",
        "description": "Specialization in system hacking.",
        "skillCount": 10
      },
      {
        "id": "sub_cw_9_2",
        "name": "Viral Implants",
        "description": "Specialization in viral implants.",
        "skillCount": 10
      },
      {
        "id": "sub_cw_9_3",
        "name": "Data Siphon",
        "description": "Specialization in data siphon.",
        "skillCount": 10
      },
      {
        "id": "sub_cw_9_4",
        "name": "Firewall Bypass",
        "description": "Specialization in firewall bypass.",
        "skillCount": 10
      },
      {
        "id": "sub_cw_9_5",
        "name": "Neural Jamming",
        "description": "Specialization in neural jamming.",
        "skillCount": 10
      },
      {
        "id": "sub_cw_9_6",
        "name": "Code Injection",
        "description": "Specialization in code injection.",
        "skillCount": 10
      },
      {
        "id": "sub_cw_9_7",
        "name": "Trojan Deployment",
        "description": "Specialization in trojan deployment.",
        "skillCount": 10
      },
      {
        "id": "sub_cw_9_8",
        "name": "Logic Bomb",
        "description": "Specialization in logic bomb.",
        "skillCount": 10
      },
      {
        "id": "sub_cw_9_9",
        "name": "Decryption Suite",
        "description": "Specialization in decryption suite.",
        "skillCount": 10
      },
      {
        "id": "sub_cw_9_10",
        "name": "AI Countermeasures",
        "description": "Specialization in ai countermeasures.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_esp_10",
    "name": "Espionage",
    "icon": "🕵️",
    "color": "#6366f1",
    "description": "Mastery in espionage for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_esp_10_1",
        "name": "Infiltration",
        "description": "Specialization in infiltration.",
        "skillCount": 10
      },
      {
        "id": "sub_esp_10_2",
        "name": "Sabotage",
        "description": "Specialization in sabotage.",
        "skillCount": 10
      },
      {
        "id": "sub_esp_10_3",
        "name": "Disinformation",
        "description": "Specialization in disinformation.",
        "skillCount": 10
      },
      {
        "id": "sub_esp_10_4",
        "name": "Cover Operations",
        "description": "Specialization in cover operations.",
        "skillCount": 10
      },
      {
        "id": "sub_esp_10_5",
        "name": "Asset Recruitment",
        "description": "Specialization in asset recruitment.",
        "skillCount": 10
      },
      {
        "id": "sub_esp_10_6",
        "name": "Dead Drops",
        "description": "Specialization in dead drops.",
        "skillCount": 10
      },
      {
        "id": "sub_esp_10_7",
        "name": "Surveillance",
        "description": "Specialization in surveillance.",
        "skillCount": 10
      },
      {
        "id": "sub_esp_10_8",
        "name": "Exfiltration",
        "description": "Specialization in exfiltration.",
        "skillCount": 10
      },
      {
        "id": "sub_esp_10_9",
        "name": "Deep Cover",
        "description": "Specialization in deep cover.",
        "skillCount": 10
      },
      {
        "id": "sub_esp_10_10",
        "name": "Counter-Intelligence",
        "description": "Specialization in counter-intelligence.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_dip_11",
    "name": "Diplomacy",
    "icon": "🤝",
    "color": "#8b5cf6",
    "description": "Mastery in diplomacy for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_dip_11_1",
        "name": "Trade Negotiation",
        "description": "Specialization in trade negotiation.",
        "skillCount": 10
      },
      {
        "id": "sub_dip_11_2",
        "name": "Treaty Drafting",
        "description": "Specialization in treaty drafting.",
        "skillCount": 10
      },
      {
        "id": "sub_dip_11_3",
        "name": "Cultural Exchange",
        "description": "Specialization in cultural exchange.",
        "skillCount": 10
      },
      {
        "id": "sub_dip_11_4",
        "name": "Mediation",
        "description": "Specialization in mediation.",
        "skillCount": 10
      },
      {
        "id": "sub_dip_11_5",
        "name": "Sanctions",
        "description": "Specialization in sanctions.",
        "skillCount": 10
      },
      {
        "id": "sub_dip_11_6",
        "name": "Public Relations",
        "description": "Specialization in public relations.",
        "skillCount": 10
      },
      {
        "id": "sub_dip_11_7",
        "name": "Interstellar Law",
        "description": "Specialization in interstellar law.",
        "skillCount": 10
      },
      {
        "id": "sub_dip_11_8",
        "name": "Ambassador Training",
        "description": "Specialization in ambassador training.",
        "skillCount": 10
      },
      {
        "id": "sub_dip_11_9",
        "name": "Summit Planning",
        "description": "Specialization in summit planning.",
        "skillCount": 10
      },
      {
        "id": "sub_dip_11_10",
        "name": "Peace Accord",
        "description": "Specialization in peace accord.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_gov_12",
    "name": "Governance",
    "icon": "🏛️",
    "color": "#a78bfa",
    "description": "Mastery in governance for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_gov_12_1",
        "name": "Colonial Administration",
        "description": "Specialization in colonial administration.",
        "skillCount": 10
      },
      {
        "id": "sub_gov_12_2",
        "name": "Tax Policy",
        "description": "Specialization in tax policy.",
        "skillCount": 10
      },
      {
        "id": "sub_gov_12_3",
        "name": "Legal Framework",
        "description": "Specialization in legal framework.",
        "skillCount": 10
      },
      {
        "id": "sub_gov_12_4",
        "name": "Bureaucracy",
        "description": "Specialization in bureaucracy.",
        "skillCount": 10
      },
      {
        "id": "sub_gov_12_5",
        "name": "Public Services",
        "description": "Specialization in public services.",
        "skillCount": 10
      },
      {
        "id": "sub_gov_12_6",
        "name": "Infrastructure Planning",
        "description": "Specialization in infrastructure planning.",
        "skillCount": 10
      },
      {
        "id": "sub_gov_12_7",
        "name": "Census Management",
        "description": "Specialization in census management.",
        "skillCount": 10
      },
      {
        "id": "sub_gov_12_8",
        "name": "Civic Programs",
        "description": "Specialization in civic programs.",
        "skillCount": 10
      },
      {
        "id": "sub_gov_12_9",
        "name": "Emergency Governance",
        "description": "Specialization in emergency governance.",
        "skillCount": 10
      },
      {
        "id": "sub_gov_12_10",
        "name": "Diplomatic Protocol",
        "description": "Specialization in diplomatic protocol.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_mno_13",
    "name": "Mining Operations",
    "icon": "⛏️",
    "color": "#d97706",
    "description": "Mastery in mining operations for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_mno_13_1",
        "name": "Asteroid Mining",
        "description": "Specialization in asteroid mining.",
        "skillCount": 10
      },
      {
        "id": "sub_mno_13_2",
        "name": "Planetary Extraction",
        "description": "Specialization in planetary extraction.",
        "skillCount": 10
      },
      {
        "id": "sub_mno_13_3",
        "name": "Deep Core Drilling",
        "description": "Specialization in deep core drilling.",
        "skillCount": 10
      },
      {
        "id": "sub_mno_13_4",
        "name": "Gas Giant Harvesting",
        "description": "Specialization in gas giant harvesting.",
        "skillCount": 10
      },
      {
        "id": "sub_mno_13_5",
        "name": "Ocean Mining",
        "description": "Specialization in ocean mining.",
        "skillCount": 10
      },
      {
        "id": "sub_mno_13_6",
        "name": "Glacier Excavation",
        "description": "Specialization in glacier excavation.",
        "skillCount": 10
      },
      {
        "id": "sub_mno_13_7",
        "name": "Volcanic Sampling",
        "description": "Specialization in volcanic sampling.",
        "skillCount": 10
      },
      {
        "id": "sub_mno_13_8",
        "name": "Moon Quarry",
        "description": "Specialization in moon quarry.",
        "skillCount": 10
      },
      {
        "id": "sub_mno_13_9",
        "name": "Orbital Mining",
        "description": "Specialization in orbital mining.",
        "skillCount": 10
      },
      {
        "id": "sub_mno_13_10",
        "name": "Subsurface Radar",
        "description": "Specialization in subsurface radar.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_ref_14",
    "name": "Refining",
    "icon": "🏭",
    "color": "#b45309",
    "description": "Mastery in refining for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_ref_14_1",
        "name": "Metal Processing",
        "description": "Specialization in metal processing.",
        "skillCount": 10
      },
      {
        "id": "sub_ref_14_2",
        "name": "Crystal Synthesis",
        "description": "Specialization in crystal synthesis.",
        "skillCount": 10
      },
      {
        "id": "sub_ref_14_3",
        "name": "Deuterium Fusion",
        "description": "Specialization in deuterium fusion.",
        "skillCount": 10
      },
      {
        "id": "sub_ref_14_4",
        "name": "Alloy Smelting",
        "description": "Specialization in alloy smelting.",
        "skillCount": 10
      },
      {
        "id": "sub_ref_14_5",
        "name": "Gas Purification",
        "description": "Specialization in gas purification.",
        "skillCount": 10
      },
      {
        "id": "sub_ref_14_6",
        "name": "Isotope Separation",
        "description": "Specialization in isotope separation.",
        "skillCount": 10
      },
      {
        "id": "sub_ref_14_7",
        "name": "Nanomaterial Production",
        "description": "Specialization in nanomaterial production.",
        "skillCount": 10
      },
      {
        "id": "sub_ref_14_8",
        "name": "Rare Element Extraction",
        "description": "Specialization in rare element extraction.",
        "skillCount": 10
      },
      {
        "id": "sub_ref_14_9",
        "name": "Plasma Refining",
        "description": "Specialization in plasma refining.",
        "skillCount": 10
      },
      {
        "id": "sub_ref_14_10",
        "name": "Carbon Cycling",
        "description": "Specialization in carbon cycling.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_mfg_15",
    "name": "Manufacturing",
    "icon": "⚙️",
    "color": "#92400e",
    "description": "Mastery in manufacturing for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_mfg_15_1",
        "name": "Component Assembly",
        "description": "Specialization in component assembly.",
        "skillCount": 10
      },
      {
        "id": "sub_mfg_15_2",
        "name": "Weapon Fabrication",
        "description": "Specialization in weapon fabrication.",
        "skillCount": 10
      },
      {
        "id": "sub_mfg_15_3",
        "name": "Ship Construction",
        "description": "Specialization in ship construction.",
        "skillCount": 10
      },
      {
        "id": "sub_mfg_15_4",
        "name": "Electronic Manufacturing",
        "description": "Specialization in electronic manufacturing.",
        "skillCount": 10
      },
      {
        "id": "sub_mfg_15_5",
        "name": "Chemical Synthesis",
        "description": "Specialization in chemical synthesis.",
        "skillCount": 10
      },
      {
        "id": "sub_mfg_15_6",
        "name": "Bio-Engineering",
        "description": "Specialization in bio-engineering.",
        "skillCount": 10
      },
      {
        "id": "sub_mfg_15_7",
        "name": "3D Printing",
        "description": "Specialization in 3d printing.",
        "skillCount": 10
      },
      {
        "id": "sub_mfg_15_8",
        "name": "Mass Production",
        "description": "Specialization in mass production.",
        "skillCount": 10
      },
      {
        "id": "sub_mfg_15_9",
        "name": "Custom Fabrication",
        "description": "Specialization in custom fabrication.",
        "skillCount": 10
      },
      {
        "id": "sub_mfg_15_10",
        "name": "Nano Assembly",
        "description": "Specialization in nano assembly.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_ens_16",
    "name": "Energy Systems",
    "icon": "⚡",
    "color": "#eab308",
    "description": "Mastery in energy systems for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_ens_16_1",
        "name": "Solar Collection",
        "description": "Specialization in solar collection.",
        "skillCount": 10
      },
      {
        "id": "sub_ens_16_2",
        "name": "Fusion Reactors",
        "description": "Specialization in fusion reactors.",
        "skillCount": 10
      },
      {
        "id": "sub_ens_16_3",
        "name": "Antimatter Cells",
        "description": "Specialization in antimatter cells.",
        "skillCount": 10
      },
      {
        "id": "sub_ens_16_4",
        "name": "Zero-Point Energy",
        "description": "Specialization in zero-point energy.",
        "skillCount": 10
      },
      {
        "id": "sub_ens_16_5",
        "name": "Plasma Conduits",
        "description": "Specialization in plasma conduits.",
        "skillCount": 10
      },
      {
        "id": "sub_ens_16_6",
        "name": "Bio-Electricity",
        "description": "Specialization in bio-electricity.",
        "skillCount": 10
      },
      {
        "id": "sub_ens_16_7",
        "name": "Dark Energy Tap",
        "description": "Specialization in dark energy tap.",
        "skillCount": 10
      },
      {
        "id": "sub_ens_16_8",
        "name": "Stellar Engine",
        "description": "Specialization in stellar engine.",
        "skillCount": 10
      },
      {
        "id": "sub_ens_16_9",
        "name": "Energy Storage",
        "description": "Specialization in energy storage.",
        "skillCount": 10
      },
      {
        "id": "sub_ens_16_10",
        "name": "Power Distribution",
        "description": "Specialization in power distribution.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_prp_17",
    "name": "Propulsion",
    "icon": "💨",
    "color": "#a3e635",
    "description": "Mastery in propulsion for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_prp_17_1",
        "name": "Ion Thrusters",
        "description": "Specialization in ion thrusters.",
        "skillCount": 10
      },
      {
        "id": "sub_prp_17_2",
        "name": "Fusion Drive",
        "description": "Specialization in fusion drive.",
        "skillCount": 10
      },
      {
        "id": "sub_prp_17_3",
        "name": "Antimatter Drive",
        "description": "Specialization in antimatter drive.",
        "skillCount": 10
      },
      {
        "id": "sub_prp_17_4",
        "name": "Solar Sail",
        "description": "Specialization in solar sail.",
        "skillCount": 10
      },
      {
        "id": "sub_prp_17_5",
        "name": "Ramscoop",
        "description": "Specialization in ramscoop.",
        "skillCount": 10
      },
      {
        "id": "sub_prp_17_6",
        "name": "Mass Driver",
        "description": "Specialization in mass driver.",
        "skillCount": 10
      },
      {
        "id": "sub_prp_17_7",
        "name": "Photon Sail",
        "description": "Specialization in photon sail.",
        "skillCount": 10
      },
      {
        "id": "sub_prp_17_8",
        "name": "Plasma Thruster",
        "description": "Specialization in plasma thruster.",
        "skillCount": 10
      },
      {
        "id": "sub_prp_17_9",
        "name": "Graviton Drive",
        "description": "Specialization in graviton drive.",
        "skillCount": 10
      },
      {
        "id": "sub_prp_17_10",
        "name": "Alcubierre Drive",
        "description": "Specialization in alcubierre drive.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_bio_18",
    "name": "Biology",
    "icon": "🧬",
    "color": "#22c55e",
    "description": "Mastery in biology for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_bio_18_1",
        "name": "Xenobiology",
        "description": "Specialization in xenobiology.",
        "skillCount": 10
      },
      {
        "id": "sub_bio_18_2",
        "name": "Genetic Engineering",
        "description": "Specialization in genetic engineering.",
        "skillCount": 10
      },
      {
        "id": "sub_bio_18_3",
        "name": "Bio-Synthesis",
        "description": "Specialization in bio-synthesis.",
        "skillCount": 10
      },
      {
        "id": "sub_bio_18_4",
        "name": "Pathogen Study",
        "description": "Specialization in pathogen study.",
        "skillCount": 10
      },
      {
        "id": "sub_bio_18_5",
        "name": "Ecological Design",
        "description": "Specialization in ecological design.",
        "skillCount": 10
      },
      {
        "id": "sub_bio_18_6",
        "name": "Terraforming",
        "description": "Specialization in terraforming.",
        "skillCount": 10
      },
      {
        "id": "sub_bio_18_7",
        "name": "Cloning",
        "description": "Specialization in cloning.",
        "skillCount": 10
      },
      {
        "id": "sub_bio_18_8",
        "name": "Cryogenics",
        "description": "Specialization in cryogenics.",
        "skillCount": 10
      },
      {
        "id": "sub_bio_18_9",
        "name": "DNA Repair",
        "description": "Specialization in dna repair.",
        "skillCount": 10
      },
      {
        "id": "sub_bio_18_10",
        "name": "Microbiome",
        "description": "Specialization in microbiome.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_med_19",
    "name": "Medicine",
    "icon": "🏥",
    "color": "#16a34a",
    "description": "Mastery in medicine for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_med_19_1",
        "name": "Trauma Surgery",
        "description": "Specialization in trauma surgery.",
        "skillCount": 10
      },
      {
        "id": "sub_med_19_2",
        "name": "Nanomedicine",
        "description": "Specialization in nanomedicine.",
        "skillCount": 10
      },
      {
        "id": "sub_med_19_3",
        "name": "Regeneration",
        "description": "Specialization in regeneration.",
        "skillCount": 10
      },
      {
        "id": "sub_med_19_4",
        "name": "Stasis Medicine",
        "description": "Specialization in stasis medicine.",
        "skillCount": 10
      },
      {
        "id": "sub_med_19_5",
        "name": "Neural Repair",
        "description": "Specialization in neural repair.",
        "skillCount": 10
      },
      {
        "id": "sub_med_19_6",
        "name": "Immune Enhancement",
        "description": "Specialization in immune enhancement.",
        "skillCount": 10
      },
      {
        "id": "sub_med_19_7",
        "name": "Genetic Therapy",
        "description": "Specialization in genetic therapy.",
        "skillCount": 10
      },
      {
        "id": "sub_med_19_8",
        "name": "Radiation Treatment",
        "description": "Specialization in radiation treatment.",
        "skillCount": 10
      },
      {
        "id": "sub_med_19_9",
        "name": "Bio-Prosthetics",
        "description": "Specialization in bio-prosthetics.",
        "skillCount": 10
      },
      {
        "id": "sub_med_19_10",
        "name": "Emergency Med",
        "description": "Specialization in emergency med.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_chm_20",
    "name": "Chemistry",
    "icon": "🧪",
    "color": "#15803d",
    "description": "Mastery in chemistry for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_chm_20_1",
        "name": "Organic Synthesis",
        "description": "Specialization in organic synthesis.",
        "skillCount": 10
      },
      {
        "id": "sub_chm_20_2",
        "name": "Inorganic Compounds",
        "description": "Specialization in inorganic compounds.",
        "skillCount": 10
      },
      {
        "id": "sub_chm_20_3",
        "name": "Polymer Science",
        "description": "Specialization in polymer science.",
        "skillCount": 10
      },
      {
        "id": "sub_chm_20_4",
        "name": "Catalysis",
        "description": "Specialization in catalysis.",
        "skillCount": 10
      },
      {
        "id": "sub_chm_20_5",
        "name": "Electrochemistry",
        "description": "Specialization in electrochemistry.",
        "skillCount": 10
      },
      {
        "id": "sub_chm_20_6",
        "name": "Photochemistry",
        "description": "Specialization in photochemistry.",
        "skillCount": 10
      },
      {
        "id": "sub_chm_20_7",
        "name": "Thermochemistry",
        "description": "Specialization in thermochemistry.",
        "skillCount": 10
      },
      {
        "id": "sub_chm_20_8",
        "name": "Quantum Chemistry",
        "description": "Specialization in quantum chemistry.",
        "skillCount": 10
      },
      {
        "id": "sub_chm_20_9",
        "name": "Astrochemistry",
        "description": "Specialization in astrochemistry.",
        "skillCount": 10
      },
      {
        "id": "sub_chm_20_10",
        "name": "Nanochemistry",
        "description": "Specialization in nanochemistry.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_phy_21",
    "name": "Physics",
    "icon": "⚛️",
    "color": "#84cc16",
    "description": "Mastery in physics for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_phy_21_1",
        "name": "Quantum Mechanics",
        "description": "Specialization in quantum mechanics.",
        "skillCount": 10
      },
      {
        "id": "sub_phy_21_2",
        "name": "Relativity",
        "description": "Specialization in relativity.",
        "skillCount": 10
      },
      {
        "id": "sub_phy_21_3",
        "name": "Thermodynamics",
        "description": "Specialization in thermodynamics.",
        "skillCount": 10
      },
      {
        "id": "sub_phy_21_4",
        "name": "Electromagnetism",
        "description": "Specialization in electromagnetism.",
        "skillCount": 10
      },
      {
        "id": "sub_phy_21_5",
        "name": "Nuclear Physics",
        "description": "Specialization in nuclear physics.",
        "skillCount": 10
      },
      {
        "id": "sub_phy_21_6",
        "name": "Particle Physics",
        "description": "Specialization in particle physics.",
        "skillCount": 10
      },
      {
        "id": "sub_phy_21_7",
        "name": "String Theory",
        "description": "Specialization in string theory.",
        "skillCount": 10
      },
      {
        "id": "sub_phy_21_8",
        "name": "Plasma Physics",
        "description": "Specialization in plasma physics.",
        "skillCount": 10
      },
      {
        "id": "sub_phy_21_9",
        "name": "Gravitational Theory",
        "description": "Specialization in gravitational theory.",
        "skillCount": 10
      },
      {
        "id": "sub_phy_21_10",
        "name": "Dark Matter Physics",
        "description": "Specialization in dark matter physics.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_mth_22",
    "name": "Mathematics",
    "icon": "📐",
    "color": "#10b981",
    "description": "Mastery in mathematics for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_mth_22_1",
        "name": "Calculus",
        "description": "Specialization in calculus.",
        "skillCount": 10
      },
      {
        "id": "sub_mth_22_2",
        "name": "Topology",
        "description": "Specialization in topology.",
        "skillCount": 10
      },
      {
        "id": "sub_mth_22_3",
        "name": "Number Theory",
        "description": "Specialization in number theory.",
        "skillCount": 10
      },
      {
        "id": "sub_mth_22_4",
        "name": "Statistics",
        "description": "Specialization in statistics.",
        "skillCount": 10
      },
      {
        "id": "sub_mth_22_5",
        "name": "Linear Algebra",
        "description": "Specialization in linear algebra.",
        "skillCount": 10
      },
      {
        "id": "sub_mth_22_6",
        "name": "Complex Analysis",
        "description": "Specialization in complex analysis.",
        "skillCount": 10
      },
      {
        "id": "sub_mth_22_7",
        "name": "Graph Theory",
        "description": "Specialization in graph theory.",
        "skillCount": 10
      },
      {
        "id": "sub_mth_22_8",
        "name": "Chaos Theory",
        "description": "Specialization in chaos theory.",
        "skillCount": 10
      },
      {
        "id": "sub_mth_22_9",
        "name": "Information Theory",
        "description": "Specialization in information theory.",
        "skillCount": 10
      },
      {
        "id": "sub_mth_22_10",
        "name": "Category Theory",
        "description": "Specialization in category theory.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_cs_23",
    "name": "Computer Science",
    "icon": "🖥️",
    "color": "#14b8a6",
    "description": "Mastery in computer science for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_cs_23_1",
        "name": "Algorithms",
        "description": "Specialization in algorithms.",
        "skillCount": 10
      },
      {
        "id": "sub_cs_23_2",
        "name": "Machine Learning",
        "description": "Specialization in machine learning.",
        "skillCount": 10
      },
      {
        "id": "sub_cs_23_3",
        "name": "Quantum Computing",
        "description": "Specialization in quantum computing.",
        "skillCount": 10
      },
      {
        "id": "sub_cs_23_4",
        "name": "Distributed Systems",
        "description": "Specialization in distributed systems.",
        "skillCount": 10
      },
      {
        "id": "sub_cs_23_5",
        "name": "Cryptography",
        "description": "Specialization in cryptography.",
        "skillCount": 10
      },
      {
        "id": "sub_cs_23_6",
        "name": "Neural Networks",
        "description": "Specialization in neural networks.",
        "skillCount": 10
      },
      {
        "id": "sub_cs_23_7",
        "name": "Compiler Design",
        "description": "Specialization in compiler design.",
        "skillCount": 10
      },
      {
        "id": "sub_cs_23_8",
        "name": "Data Structures",
        "description": "Specialization in data structures.",
        "skillCount": 10
      },
      {
        "id": "sub_cs_23_9",
        "name": "Operating Systems",
        "description": "Specialization in operating systems.",
        "skillCount": 10
      },
      {
        "id": "sub_cs_23_10",
        "name": "Network Protocols",
        "description": "Specialization in network protocols.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_mat_24",
    "name": "Materials Science",
    "icon": "🔬",
    "color": "#0d9488",
    "description": "Mastery in materials science for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_mat_24_1",
        "name": "Metallurgy",
        "description": "Specialization in metallurgy.",
        "skillCount": 10
      },
      {
        "id": "sub_mat_24_2",
        "name": "Ceramics",
        "description": "Specialization in ceramics.",
        "skillCount": 10
      },
      {
        "id": "sub_mat_24_3",
        "name": "Composites",
        "description": "Specialization in composites.",
        "skillCount": 10
      },
      {
        "id": "sub_mat_24_4",
        "name": "Polymers",
        "description": "Specialization in polymers.",
        "skillCount": 10
      },
      {
        "id": "sub_mat_24_5",
        "name": "Semiconductors",
        "description": "Specialization in semiconductors.",
        "skillCount": 10
      },
      {
        "id": "sub_mat_24_6",
        "name": "Superconductors",
        "description": "Specialization in superconductors.",
        "skillCount": 10
      },
      {
        "id": "sub_mat_24_7",
        "name": "Nanomaterials",
        "description": "Specialization in nanomaterials.",
        "skillCount": 10
      },
      {
        "id": "sub_mat_24_8",
        "name": "Biomaterials",
        "description": "Specialization in biomaterials.",
        "skillCount": 10
      },
      {
        "id": "sub_mat_24_9",
        "name": "Smart Materials",
        "description": "Specialization in smart materials.",
        "skillCount": 10
      },
      {
        "id": "sub_mat_24_10",
        "name": "Exotic Matter",
        "description": "Specialization in exotic matter.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_rob_25",
    "name": "Robotics",
    "icon": "🤖",
    "color": "#0f766e",
    "description": "Mastery in robotics for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_rob_25_1",
        "name": "Drone Systems",
        "description": "Specialization in drone systems.",
        "skillCount": 10
      },
      {
        "id": "sub_rob_25_2",
        "name": "Manipulator Arms",
        "description": "Specialization in manipulator arms.",
        "skillCount": 10
      },
      {
        "id": "sub_rob_25_3",
        "name": "Autonomous Nav",
        "description": "Specialization in autonomous nav.",
        "skillCount": 10
      },
      {
        "id": "sub_rob_25_4",
        "name": "Swarm Logic",
        "description": "Specialization in swarm logic.",
        "skillCount": 10
      },
      {
        "id": "sub_rob_25_5",
        "name": "Humanoid Design",
        "description": "Specialization in humanoid design.",
        "skillCount": 10
      },
      {
        "id": "sub_rob_25_6",
        "name": "Soft Robotics",
        "description": "Specialization in soft robotics.",
        "skillCount": 10
      },
      {
        "id": "sub_rob_25_7",
        "name": "Bio-Robots",
        "description": "Specialization in bio-robots.",
        "skillCount": 10
      },
      {
        "id": "sub_rob_25_8",
        "name": "Micro-Bots",
        "description": "Specialization in micro-bots.",
        "skillCount": 10
      },
      {
        "id": "sub_rob_25_9",
        "name": "Mecha Frames",
        "description": "Specialization in mecha frames.",
        "skillCount": 10
      },
      {
        "id": "sub_rob_25_10",
        "name": "Robotic Surgery",
        "description": "Specialization in robotic surgery.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_ai_26",
    "name": "Artificial Intelligence",
    "icon": "🧠",
    "color": "#134e4a",
    "description": "Mastery in artificial intelligence for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_ai_26_1",
        "name": "Neural Architecture",
        "description": "Specialization in neural architecture.",
        "skillCount": 10
      },
      {
        "id": "sub_ai_26_2",
        "name": "Natural Language",
        "description": "Specialization in natural language.",
        "skillCount": 10
      },
      {
        "id": "sub_ai_26_3",
        "name": "Computer Vision",
        "description": "Specialization in computer vision.",
        "skillCount": 10
      },
      {
        "id": "sub_ai_26_4",
        "name": "Decision Systems",
        "description": "Specialization in decision systems.",
        "skillCount": 10
      },
      {
        "id": "sub_ai_26_5",
        "name": "Pattern Recognition",
        "description": "Specialization in pattern recognition.",
        "skillCount": 10
      },
      {
        "id": "sub_ai_26_6",
        "name": "Predictive Models",
        "description": "Specialization in predictive models.",
        "skillCount": 10
      },
      {
        "id": "sub_ai_26_7",
        "name": "Generative AI",
        "description": "Specialization in generative ai.",
        "skillCount": 10
      },
      {
        "id": "sub_ai_26_8",
        "name": "Ethical AI",
        "description": "Specialization in ethical ai.",
        "skillCount": 10
      },
      {
        "id": "sub_ai_26_9",
        "name": "Self-Evolving AI",
        "description": "Specialization in self-evolving ai.",
        "skillCount": 10
      },
      {
        "id": "sub_ai_26_10",
        "name": "Collective Intelligence",
        "description": "Specialization in collective intelligence.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_qs_27",
    "name": "Quantum Sciences",
    "icon": "🔮",
    "color": "#7c3aed",
    "description": "Mastery in quantum sciences for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_qs_27_1",
        "name": "Quantum Computing",
        "description": "Specialization in quantum computing.",
        "skillCount": 10
      },
      {
        "id": "sub_qs_27_2",
        "name": "Quantum Encryption",
        "description": "Specialization in quantum encryption.",
        "skillCount": 10
      },
      {
        "id": "sub_qs_27_3",
        "name": "Quantum Sensors",
        "description": "Specialization in quantum sensors.",
        "skillCount": 10
      },
      {
        "id": "sub_qs_27_4",
        "name": "Quantum Teleportation",
        "description": "Specialization in quantum teleportation.",
        "skillCount": 10
      },
      {
        "id": "sub_qs_27_5",
        "name": "Quantum Entanglement",
        "description": "Specialization in quantum entanglement.",
        "skillCount": 10
      },
      {
        "id": "sub_qs_27_6",
        "name": "Quantum Field Theory",
        "description": "Specialization in quantum field theory.",
        "skillCount": 10
      },
      {
        "id": "sub_qs_27_7",
        "name": "Loop Quantum Gravity",
        "description": "Specialization in loop quantum gravity.",
        "skillCount": 10
      },
      {
        "id": "sub_qs_27_8",
        "name": "Quantum Cosmology",
        "description": "Specialization in quantum cosmology.",
        "skillCount": 10
      },
      {
        "id": "sub_qs_27_9",
        "name": "Quantum Biology",
        "description": "Specialization in quantum biology.",
        "skillCount": 10
      },
      {
        "id": "sub_qs_27_10",
        "name": "Quantum Metrology",
        "description": "Specialization in quantum metrology.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_xm_28",
    "name": "Exotic Matter",
    "icon": "💎",
    "color": "#c084fc",
    "description": "Mastery in exotic matter for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_xm_28_1",
        "name": "Dark Matter Manipulation",
        "description": "Specialization in dark matter manipulation.",
        "skillCount": 10
      },
      {
        "id": "sub_xm_28_2",
        "name": "Antimatter Containment",
        "description": "Specialization in antimatter containment.",
        "skillCount": 10
      },
      {
        "id": "sub_xm_28_3",
        "name": "Strange Matter",
        "description": "Specialization in strange matter.",
        "skillCount": 10
      },
      {
        "id": "sub_xm_28_4",
        "name": "Exotic States",
        "description": "Specialization in exotic states.",
        "skillCount": 10
      },
      {
        "id": "sub_xm_28_5",
        "name": "Negative Energy",
        "description": "Specialization in negative energy.",
        "skillCount": 10
      },
      {
        "id": "sub_xm_28_6",
        "name": "Phased Matter",
        "description": "Specialization in phased matter.",
        "skillCount": 10
      },
      {
        "id": "sub_xm_28_7",
        "name": "Tachyon Fields",
        "description": "Specialization in tachyon fields.",
        "skillCount": 10
      },
      {
        "id": "sub_xm_28_8",
        "name": "Spacetime Foam",
        "description": "Specialization in spacetime foam.",
        "skillCount": 10
      },
      {
        "id": "sub_xm_28_9",
        "name": "Vacuum Energy",
        "description": "Specialization in vacuum energy.",
        "skillCount": 10
      },
      {
        "id": "sub_xm_28_10",
        "name": "Dimensional Matter",
        "description": "Specialization in dimensional matter.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_grv_29",
    "name": "Gravitics",
    "icon": "🌍",
    "color": "#a855f7",
    "description": "Mastery in gravitics for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_grv_29_1",
        "name": "Gravity Control",
        "description": "Specialization in gravity control.",
        "skillCount": 10
      },
      {
        "id": "sub_grv_29_2",
        "name": "Anti-Gravity",
        "description": "Specialization in anti-gravity.",
        "skillCount": 10
      },
      {
        "id": "sub_grv_29_3",
        "name": "Graviton Emission",
        "description": "Specialization in graviton emission.",
        "skillCount": 10
      },
      {
        "id": "sub_grv_29_4",
        "name": "Tidal Manipulation",
        "description": "Specialization in tidal manipulation.",
        "skillCount": 10
      },
      {
        "id": "sub_grv_29_5",
        "name": "Orbital Mechanics",
        "description": "Specialization in orbital mechanics.",
        "skillCount": 10
      },
      {
        "id": "sub_grv_29_6",
        "name": "Gravity Lensing",
        "description": "Specialization in gravity lensing.",
        "skillCount": 10
      },
      {
        "id": "sub_grv_29_7",
        "name": "Mass Reduction",
        "description": "Specialization in mass reduction.",
        "skillCount": 10
      },
      {
        "id": "sub_grv_29_8",
        "name": "Spacetime Warping",
        "description": "Specialization in spacetime warping.",
        "skillCount": 10
      },
      {
        "id": "sub_grv_29_9",
        "name": "Gravity Shields",
        "description": "Specialization in gravity shields.",
        "skillCount": 10
      },
      {
        "id": "sub_grv_29_10",
        "name": "Gravitational Waves",
        "description": "Specialization in gravitational waves.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_am_30",
    "name": "Astrometrics",
    "icon": "🌟",
    "color": "#9333ea",
    "description": "Mastery in astrometrics for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_am_30_1",
        "name": "Stellar Classification",
        "description": "Specialization in stellar classification.",
        "skillCount": 10
      },
      {
        "id": "sub_am_30_2",
        "name": "Cosmic Distance",
        "description": "Specialization in cosmic distance.",
        "skillCount": 10
      },
      {
        "id": "sub_am_30_3",
        "name": "Redshift Analysis",
        "description": "Specialization in redshift analysis.",
        "skillCount": 10
      },
      {
        "id": "sub_am_30_4",
        "name": "Spectroscopy",
        "description": "Specialization in spectroscopy.",
        "skillCount": 10
      },
      {
        "id": "sub_am_30_5",
        "name": "Astrophotometry",
        "description": "Specialization in astrophotometry.",
        "skillCount": 10
      },
      {
        "id": "sub_am_30_6",
        "name": "Radio Astronomy",
        "description": "Specialization in radio astronomy.",
        "skillCount": 10
      },
      {
        "id": "sub_am_30_7",
        "name": "X-Ray Astronomy",
        "description": "Specialization in x-ray astronomy.",
        "skillCount": 10
      },
      {
        "id": "sub_am_30_8",
        "name": "Neutrino Astronomy",
        "description": "Specialization in neutrino astronomy.",
        "skillCount": 10
      },
      {
        "id": "sub_am_30_9",
        "name": "Gravitational Mapping",
        "description": "Specialization in gravitational mapping.",
        "skillCount": 10
      },
      {
        "id": "sub_am_30_10",
        "name": "Exoplanet Detection",
        "description": "Specialization in exoplanet detection.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_ps_31",
    "name": "Planetary Science",
    "icon": "🪐",
    "color": "#7e22ce",
    "description": "Mastery in planetary science for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_ps_31_1",
        "name": "Geology",
        "description": "Specialization in geology.",
        "skillCount": 10
      },
      {
        "id": "sub_ps_31_2",
        "name": "Atmospheric Science",
        "description": "Specialization in atmospheric science.",
        "skillCount": 10
      },
      {
        "id": "sub_ps_31_3",
        "name": "Oceanography",
        "description": "Specialization in oceanography.",
        "skillCount": 10
      },
      {
        "id": "sub_ps_31_4",
        "name": "Climatology",
        "description": "Specialization in climatology.",
        "skillCount": 10
      },
      {
        "id": "sub_ps_31_5",
        "name": "Seismology",
        "description": "Specialization in seismology.",
        "skillCount": 10
      },
      {
        "id": "sub_ps_31_6",
        "name": "Volcanology",
        "description": "Specialization in volcanology.",
        "skillCount": 10
      },
      {
        "id": "sub_ps_31_7",
        "name": "Glaciology",
        "description": "Specialization in glaciology.",
        "skillCount": 10
      },
      {
        "id": "sub_ps_31_8",
        "name": "Paleontology",
        "description": "Specialization in paleontology.",
        "skillCount": 10
      },
      {
        "id": "sub_ps_31_9",
        "name": "Mineralogy",
        "description": "Specialization in mineralogy.",
        "skillCount": 10
      },
      {
        "id": "sub_ps_31_10",
        "name": "Geomorphology",
        "description": "Specialization in geomorphology.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_tfr_32",
    "name": "Terraforming",
    "icon": "🌱",
    "color": "#6b21a8",
    "description": "Mastery in terraforming for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_tfr_32_1",
        "name": "Atmosphere Seeding",
        "description": "Specialization in atmosphere seeding.",
        "skillCount": 10
      },
      {
        "id": "sub_tfr_32_2",
        "name": "Water Generation",
        "description": "Specialization in water generation.",
        "skillCount": 10
      },
      {
        "id": "sub_tfr_32_3",
        "name": "Soil Chemistry",
        "description": "Specialization in soil chemistry.",
        "skillCount": 10
      },
      {
        "id": "sub_tfr_32_4",
        "name": "Temperature Control",
        "description": "Specialization in temperature control.",
        "skillCount": 10
      },
      {
        "id": "sub_tfr_32_5",
        "name": "Ecosystem Design",
        "description": "Specialization in ecosystem design.",
        "skillCount": 10
      },
      {
        "id": "sub_tfr_32_6",
        "name": "Pollution Cleanup",
        "description": "Specialization in pollution cleanup.",
        "skillCount": 10
      },
      {
        "id": "sub_tfr_32_7",
        "name": "Biome Creation",
        "description": "Specialization in biome creation.",
        "skillCount": 10
      },
      {
        "id": "sub_tfr_32_8",
        "name": "Weather Control",
        "description": "Specialization in weather control.",
        "skillCount": 10
      },
      {
        "id": "sub_tfr_32_9",
        "name": "Magnetic Field Gen",
        "description": "Specialization in magnetic field gen.",
        "skillCount": 10
      },
      {
        "id": "sub_tfr_32_10",
        "name": "Ocean Seeding",
        "description": "Specialization in ocean seeding.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_col_33",
    "name": "Colonization",
    "icon": "🏠",
    "color": "#581c87",
    "description": "Mastery in colonization for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_col_33_1",
        "name": "Settlement Design",
        "description": "Specialization in settlement design.",
        "skillCount": 10
      },
      {
        "id": "sub_col_33_2",
        "name": "Life Support",
        "description": "Specialization in life support.",
        "skillCount": 10
      },
      {
        "id": "sub_col_33_3",
        "name": "Colony Management",
        "description": "Specialization in colony management.",
        "skillCount": 10
      },
      {
        "id": "sub_col_33_4",
        "name": "Resource Allocation",
        "description": "Specialization in resource allocation.",
        "skillCount": 10
      },
      {
        "id": "sub_col_33_5",
        "name": "Expansion Planning",
        "description": "Specialization in expansion planning.",
        "skillCount": 10
      },
      {
        "id": "sub_col_33_6",
        "name": "Population Growth",
        "description": "Specialization in population growth.",
        "skillCount": 10
      },
      {
        "id": "sub_col_33_7",
        "name": "Cultural Preservation",
        "description": "Specialization in cultural preservation.",
        "skillCount": 10
      },
      {
        "id": "sub_col_33_8",
        "name": "Frontier Survival",
        "description": "Specialization in frontier survival.",
        "skillCount": 10
      },
      {
        "id": "sub_col_33_9",
        "name": "Outpost Building",
        "description": "Specialization in outpost building.",
        "skillCount": 10
      },
      {
        "id": "sub_col_33_10",
        "name": "Habitat Modules",
        "description": "Specialization in habitat modules.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_arc_34",
    "name": "Architecture",
    "icon": "🏗️",
    "color": "#3b0764",
    "description": "Mastery in architecture for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_arc_34_1",
        "name": "Space Stations",
        "description": "Specialization in space stations.",
        "skillCount": 10
      },
      {
        "id": "sub_arc_34_2",
        "name": "Orbital Habitats",
        "description": "Specialization in orbital habitats.",
        "skillCount": 10
      },
      {
        "id": "sub_arc_34_3",
        "name": "Planetary Cities",
        "description": "Specialization in planetary cities.",
        "skillCount": 10
      },
      {
        "id": "sub_arc_34_4",
        "name": "Deep Space Platforms",
        "description": "Specialization in deep space platforms.",
        "skillCount": 10
      },
      {
        "id": "sub_arc_34_5",
        "name": "Underground Bunkers",
        "description": "Specialization in underground bunkers.",
        "skillCount": 10
      },
      {
        "id": "sub_arc_34_6",
        "name": "Floating Cities",
        "description": "Specialization in floating cities.",
        "skillCount": 10
      },
      {
        "id": "sub_arc_34_7",
        "name": "Dyson Structures",
        "description": "Specialization in dyson structures.",
        "skillCount": 10
      },
      {
        "id": "sub_arc_34_8",
        "name": "Ring Worlds",
        "description": "Specialization in ring worlds.",
        "skillCount": 10
      },
      {
        "id": "sub_arc_34_9",
        "name": "Mega-Structures",
        "description": "Specialization in mega-structures.",
        "skillCount": 10
      },
      {
        "id": "sub_arc_34_10",
        "name": "Asteroid Bases",
        "description": "Specialization in asteroid bases.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_log_35",
    "name": "Logistics",
    "icon": "📦",
    "color": "#1e3a5f",
    "description": "Mastery in logistics for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_log_35_1",
        "name": "Supply Chains",
        "description": "Specialization in supply chains.",
        "skillCount": 10
      },
      {
        "id": "sub_log_35_2",
        "name": "Warehouse Systems",
        "description": "Specialization in warehouse systems.",
        "skillCount": 10
      },
      {
        "id": "sub_log_35_3",
        "name": "Route Optimization",
        "description": "Specialization in route optimization.",
        "skillCount": 10
      },
      {
        "id": "sub_log_35_4",
        "name": "Cargo Management",
        "description": "Specialization in cargo management.",
        "skillCount": 10
      },
      {
        "id": "sub_log_35_5",
        "name": "Fleet Scheduling",
        "description": "Specialization in fleet scheduling.",
        "skillCount": 10
      },
      {
        "id": "sub_log_35_6",
        "name": "Inventory Control",
        "description": "Specialization in inventory control.",
        "skillCount": 10
      },
      {
        "id": "sub_log_35_7",
        "name": "Distribution Networks",
        "description": "Specialization in distribution networks.",
        "skillCount": 10
      },
      {
        "id": "sub_log_35_8",
        "name": "Cold Storage",
        "description": "Specialization in cold storage.",
        "skillCount": 10
      },
      {
        "id": "sub_log_35_9",
        "name": "Emergency Reserves",
        "description": "Specialization in emergency reserves.",
        "skillCount": 10
      },
      {
        "id": "sub_log_35_10",
        "name": "Just-In-Time",
        "description": "Specialization in just-in-time.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_trd_36",
    "name": "Trading",
    "icon": "💰",
    "color": "#ca8a04",
    "description": "Mastery in trading for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_trd_36_1",
        "name": "Commodity Markets",
        "description": "Specialization in commodity markets.",
        "skillCount": 10
      },
      {
        "id": "sub_trd_36_2",
        "name": "Futures Trading",
        "description": "Specialization in futures trading.",
        "skillCount": 10
      },
      {
        "id": "sub_trd_36_3",
        "name": "Arbitrage",
        "description": "Specialization in arbitrage.",
        "skillCount": 10
      },
      {
        "id": "sub_trd_36_4",
        "name": "Currency Exchange",
        "description": "Specialization in currency exchange.",
        "skillCount": 10
      },
      {
        "id": "sub_trd_36_5",
        "name": "Risk Management",
        "description": "Specialization in risk management.",
        "skillCount": 10
      },
      {
        "id": "sub_trd_36_6",
        "name": "Market Analysis",
        "description": "Specialization in market analysis.",
        "skillCount": 10
      },
      {
        "id": "sub_trd_36_7",
        "name": "Trade Routes",
        "description": "Specialization in trade routes.",
        "skillCount": 10
      },
      {
        "id": "sub_trd_36_8",
        "name": "Supply-Demand",
        "description": "Specialization in supply-demand.",
        "skillCount": 10
      },
      {
        "id": "sub_trd_36_9",
        "name": "Price Controls",
        "description": "Specialization in price controls.",
        "skillCount": 10
      },
      {
        "id": "sub_trd_36_10",
        "name": "Bazaar Networks",
        "description": "Specialization in bazaar networks.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_fin_37",
    "name": "Finance",
    "icon": "📊",
    "color": "#a16207",
    "description": "Mastery in finance for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_fin_37_1",
        "name": "Investment Banking",
        "description": "Specialization in investment banking.",
        "skillCount": 10
      },
      {
        "id": "sub_fin_37_2",
        "name": "Credit Systems",
        "description": "Specialization in credit systems.",
        "skillCount": 10
      },
      {
        "id": "sub_fin_37_3",
        "name": "Insurance",
        "description": "Specialization in insurance.",
        "skillCount": 10
      },
      {
        "id": "sub_fin_37_4",
        "name": "Bond Markets",
        "description": "Specialization in bond markets.",
        "skillCount": 10
      },
      {
        "id": "sub_fin_37_5",
        "name": "Venture Capital",
        "description": "Specialization in venture capital.",
        "skillCount": 10
      },
      {
        "id": "sub_fin_37_6",
        "name": "Asset Management",
        "description": "Specialization in asset management.",
        "skillCount": 10
      },
      {
        "id": "sub_fin_37_7",
        "name": "Fiscal Policy",
        "description": "Specialization in fiscal policy.",
        "skillCount": 10
      },
      {
        "id": "sub_fin_37_8",
        "name": "Monetary Theory",
        "description": "Specialization in monetary theory.",
        "skillCount": 10
      },
      {
        "id": "sub_fin_37_9",
        "name": "Accounting",
        "description": "Specialization in accounting.",
        "skillCount": 10
      },
      {
        "id": "sub_fin_37_10",
        "name": "Auditing",
        "description": "Specialization in auditing.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_eco_38",
    "name": "Economics",
    "icon": "📈",
    "color": "#854d0e",
    "description": "Mastery in economics for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_eco_38_1",
        "name": "Microeconomics",
        "description": "Specialization in microeconomics.",
        "skillCount": 10
      },
      {
        "id": "sub_eco_38_2",
        "name": "Macroeconomics",
        "description": "Specialization in macroeconomics.",
        "skillCount": 10
      },
      {
        "id": "sub_eco_38_3",
        "name": "Game Theory",
        "description": "Specialization in game theory.",
        "skillCount": 10
      },
      {
        "id": "sub_eco_38_4",
        "name": "Behavioral Econ",
        "description": "Specialization in behavioral econ.",
        "skillCount": 10
      },
      {
        "id": "sub_eco_38_5",
        "name": "Development Econ",
        "description": "Specialization in development econ.",
        "skillCount": 10
      },
      {
        "id": "sub_eco_38_6",
        "name": "International Trade",
        "description": "Specialization in international trade.",
        "skillCount": 10
      },
      {
        "id": "sub_eco_38_7",
        "name": "Labor Economics",
        "description": "Specialization in labor economics.",
        "skillCount": 10
      },
      {
        "id": "sub_eco_38_8",
        "name": "Public Finance",
        "description": "Specialization in public finance.",
        "skillCount": 10
      },
      {
        "id": "sub_eco_38_9",
        "name": "Industrial Organization",
        "description": "Specialization in industrial organization.",
        "skillCount": 10
      },
      {
        "id": "sub_eco_38_10",
        "name": "Econometrics",
        "description": "Specialization in econometrics.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_ssc_39",
    "name": "Social Sciences",
    "icon": "👥",
    "color": "#713f12",
    "description": "Mastery in social sciences for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_ssc_39_1",
        "name": "Sociology",
        "description": "Specialization in sociology.",
        "skillCount": 10
      },
      {
        "id": "sub_ssc_39_2",
        "name": "Psychology",
        "description": "Specialization in psychology.",
        "skillCount": 10
      },
      {
        "id": "sub_ssc_39_3",
        "name": "Anthropology",
        "description": "Specialization in anthropology.",
        "skillCount": 10
      },
      {
        "id": "sub_ssc_39_4",
        "name": "Political Science",
        "description": "Specialization in political science.",
        "skillCount": 10
      },
      {
        "id": "sub_ssc_39_5",
        "name": "Geography",
        "description": "Specialization in geography.",
        "skillCount": 10
      },
      {
        "id": "sub_ssc_39_6",
        "name": "Demography",
        "description": "Specialization in demography.",
        "skillCount": 10
      },
      {
        "id": "sub_ssc_39_7",
        "name": "Criminology",
        "description": "Specialization in criminology.",
        "skillCount": 10
      },
      {
        "id": "sub_ssc_39_8",
        "name": "Linguistics",
        "description": "Specialization in linguistics.",
        "skillCount": 10
      },
      {
        "id": "sub_ssc_39_9",
        "name": "Archaeology",
        "description": "Specialization in archaeology.",
        "skillCount": 10
      },
      {
        "id": "sub_ssc_39_10",
        "name": "Ethnography",
        "description": "Specialization in ethnography.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_cst_40",
    "name": "Cultural Studies",
    "icon": "🎭",
    "color": "#422006",
    "description": "Mastery in cultural studies for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_cst_40_1",
        "name": "Art History",
        "description": "Specialization in art history.",
        "skillCount": 10
      },
      {
        "id": "sub_cst_40_2",
        "name": "Literature",
        "description": "Specialization in literature.",
        "skillCount": 10
      },
      {
        "id": "sub_cst_40_3",
        "name": "Music Theory",
        "description": "Specialization in music theory.",
        "skillCount": 10
      },
      {
        "id": "sub_cst_40_4",
        "name": "Philosophy",
        "description": "Specialization in philosophy.",
        "skillCount": 10
      },
      {
        "id": "sub_cst_40_5",
        "name": "Religious Studies",
        "description": "Specialization in religious studies.",
        "skillCount": 10
      },
      {
        "id": "sub_cst_40_6",
        "name": "Folklore",
        "description": "Specialization in folklore.",
        "skillCount": 10
      },
      {
        "id": "sub_cst_40_7",
        "name": "Mythology",
        "description": "Specialization in mythology.",
        "skillCount": 10
      },
      {
        "id": "sub_cst_40_8",
        "name": "Cinema Studies",
        "description": "Specialization in cinema studies.",
        "skillCount": 10
      },
      {
        "id": "sub_cst_40_9",
        "name": "Fashion Theory",
        "description": "Specialization in fashion theory.",
        "skillCount": 10
      },
      {
        "id": "sub_cst_40_10",
        "name": "Culinary Arts",
        "description": "Specialization in culinary arts.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_edu_41",
    "name": "Education",
    "icon": "📚",
    "color": "#1d4ed8",
    "description": "Mastery in education for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_edu_41_1",
        "name": "Pedagogy",
        "description": "Specialization in pedagogy.",
        "skillCount": 10
      },
      {
        "id": "sub_edu_41_2",
        "name": "Curriculum Design",
        "description": "Specialization in curriculum design.",
        "skillCount": 10
      },
      {
        "id": "sub_edu_41_3",
        "name": "E-Learning",
        "description": "Specialization in e-learning.",
        "skillCount": 10
      },
      {
        "id": "sub_edu_41_4",
        "name": "Mentorship",
        "description": "Specialization in mentorship.",
        "skillCount": 10
      },
      {
        "id": "sub_edu_41_5",
        "name": "Assessment Methods",
        "description": "Specialization in assessment methods.",
        "skillCount": 10
      },
      {
        "id": "sub_edu_41_6",
        "name": "Special Education",
        "description": "Specialization in special education.",
        "skillCount": 10
      },
      {
        "id": "sub_edu_41_7",
        "name": "Adult Education",
        "description": "Specialization in adult education.",
        "skillCount": 10
      },
      {
        "id": "sub_edu_41_8",
        "name": "Training Systems",
        "description": "Specialization in training systems.",
        "skillCount": 10
      },
      {
        "id": "sub_edu_41_9",
        "name": "Knowledge Management",
        "description": "Specialization in knowledge management.",
        "skillCount": 10
      },
      {
        "id": "sub_edu_41_10",
        "name": "Academic Research",
        "description": "Specialization in academic research.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_ldr_42",
    "name": "Leadership",
    "icon": "👑",
    "color": "#4338ca",
    "description": "Mastery in leadership for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_ldr_42_1",
        "name": "Command Presence",
        "description": "Specialization in command presence.",
        "skillCount": 10
      },
      {
        "id": "sub_ldr_42_2",
        "name": "Decision Making",
        "description": "Specialization in decision making.",
        "skillCount": 10
      },
      {
        "id": "sub_ldr_42_3",
        "name": "Team Building",
        "description": "Specialization in team building.",
        "skillCount": 10
      },
      {
        "id": "sub_ldr_42_4",
        "name": "Conflict Resolution",
        "description": "Specialization in conflict resolution.",
        "skillCount": 10
      },
      {
        "id": "sub_ldr_42_5",
        "name": "Strategic Planning",
        "description": "Specialization in strategic planning.",
        "skillCount": 10
      },
      {
        "id": "sub_ldr_42_6",
        "name": "Motivation",
        "description": "Specialization in motivation.",
        "skillCount": 10
      },
      {
        "id": "sub_ldr_42_7",
        "name": "Delegation",
        "description": "Specialization in delegation.",
        "skillCount": 10
      },
      {
        "id": "sub_ldr_42_8",
        "name": "Crisis Management",
        "description": "Specialization in crisis management.",
        "skillCount": 10
      },
      {
        "id": "sub_ldr_42_9",
        "name": "Vision Setting",
        "description": "Specialization in vision setting.",
        "skillCount": 10
      },
      {
        "id": "sub_ldr_42_10",
        "name": "Change Management",
        "description": "Specialization in change management.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_str_43",
    "name": "Strategy",
    "icon": "♟️",
    "color": "#3730a3",
    "description": "Mastery in strategy for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_str_43_1",
        "name": "Grand Strategy",
        "description": "Specialization in grand strategy.",
        "skillCount": 10
      },
      {
        "id": "sub_str_43_2",
        "name": "Operational Planning",
        "description": "Specialization in operational planning.",
        "skillCount": 10
      },
      {
        "id": "sub_str_43_3",
        "name": "Tactical Doctrine",
        "description": "Specialization in tactical doctrine.",
        "skillCount": 10
      },
      {
        "id": "sub_str_43_4",
        "name": "Wargaming",
        "description": "Specialization in wargaming.",
        "skillCount": 10
      },
      {
        "id": "sub_str_43_5",
        "name": "Intelligence Analysis",
        "description": "Specialization in intelligence analysis.",
        "skillCount": 10
      },
      {
        "id": "sub_str_43_6",
        "name": "Force Projection",
        "description": "Specialization in force projection.",
        "skillCount": 10
      },
      {
        "id": "sub_str_43_7",
        "name": "Asymmetric Warfare",
        "description": "Specialization in asymmetric warfare.",
        "skillCount": 10
      },
      {
        "id": "sub_str_43_8",
        "name": "Deterrence",
        "description": "Specialization in deterrence.",
        "skillCount": 10
      },
      {
        "id": "sub_str_43_9",
        "name": "Alliance Strategy",
        "description": "Specialization in alliance strategy.",
        "skillCount": 10
      },
      {
        "id": "sub_str_43_10",
        "name": "Economic Warfare",
        "description": "Specialization in economic warfare.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_tac_44",
    "name": "Tactics",
    "icon": "🎯",
    "color": "#312e81",
    "description": "Mastery in tactics for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_tac_44_1",
        "name": "Flanking Maneuvers",
        "description": "Specialization in flanking maneuvers.",
        "skillCount": 10
      },
      {
        "id": "sub_tac_44_2",
        "name": "Ambush Tactics",
        "description": "Specialization in ambush tactics.",
        "skillCount": 10
      },
      {
        "id": "sub_tac_44_3",
        "name": "Blitzkrieg",
        "description": "Specialization in blitzkrieg.",
        "skillCount": 10
      },
      {
        "id": "sub_tac_44_4",
        "name": "Defensive Posture",
        "description": "Specialization in defensive posture.",
        "skillCount": 10
      },
      {
        "id": "sub_tac_44_5",
        "name": "Combined Arms",
        "description": "Specialization in combined arms.",
        "skillCount": 10
      },
      {
        "id": "sub_tac_44_6",
        "name": "Hit and Run",
        "description": "Specialization in hit and run.",
        "skillCount": 10
      },
      {
        "id": "sub_tac_44_7",
        "name": "Siege Tactics",
        "description": "Specialization in siege tactics.",
        "skillCount": 10
      },
      {
        "id": "sub_tac_44_8",
        "name": "Retreat and Regroup",
        "description": "Specialization in retreat and regroup.",
        "skillCount": 10
      },
      {
        "id": "sub_tac_44_9",
        "name": "Night Operations",
        "description": "Specialization in night operations.",
        "skillCount": 10
      },
      {
        "id": "sub_tac_44_10",
        "name": "Amphibious Assault",
        "description": "Specialization in amphibious assault.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_rec_45",
    "name": "Reconnaissance",
    "icon": "👁️",
    "color": "#1e1b4b",
    "description": "Mastery in reconnaissance for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_rec_45_1",
        "name": "Scout Ships",
        "description": "Specialization in scout ships.",
        "skillCount": 10
      },
      {
        "id": "sub_rec_45_2",
        "name": "Probe Drones",
        "description": "Specialization in probe drones.",
        "skillCount": 10
      },
      {
        "id": "sub_rec_45_3",
        "name": "Sensor Sweeps",
        "description": "Specialization in sensor sweeps.",
        "skillCount": 10
      },
      {
        "id": "sub_rec_45_4",
        "name": "Recon Fighters",
        "description": "Specialization in recon fighters.",
        "skillCount": 10
      },
      {
        "id": "sub_rec_45_5",
        "name": "Stealth Scans",
        "description": "Specialization in stealth scans.",
        "skillCount": 10
      },
      {
        "id": "sub_rec_45_6",
        "name": "Long Range Detection",
        "description": "Specialization in long range detection.",
        "skillCount": 10
      },
      {
        "id": "sub_rec_45_7",
        "name": "Signal Intelligence",
        "description": "Specialization in signal intelligence.",
        "skillCount": 10
      },
      {
        "id": "sub_rec_45_8",
        "name": "Visual Surveillance",
        "description": "Specialization in visual surveillance.",
        "skillCount": 10
      },
      {
        "id": "sub_rec_45_9",
        "name": "Infrared Mapping",
        "description": "Specialization in infrared mapping.",
        "skillCount": 10
      },
      {
        "id": "sub_rec_45_10",
        "name": "Gravitational Sensing",
        "description": "Specialization in gravitational sensing.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_scc_46",
    "name": "Supply Chain",
    "icon": "🔗",
    "color": "#0c4a6e",
    "description": "Mastery in supply chain for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_scc_46_1",
        "name": "Procurement",
        "description": "Specialization in procurement.",
        "skillCount": 10
      },
      {
        "id": "sub_scc_46_2",
        "name": "Vendor Relations",
        "description": "Specialization in vendor relations.",
        "skillCount": 10
      },
      {
        "id": "sub_scc_46_3",
        "name": "Quality Control",
        "description": "Specialization in quality control.",
        "skillCount": 10
      },
      {
        "id": "sub_scc_46_4",
        "name": "Transportation",
        "description": "Specialization in transportation.",
        "skillCount": 10
      },
      {
        "id": "sub_scc_46_5",
        "name": "Warehousing",
        "description": "Specialization in warehousing.",
        "skillCount": 10
      },
      {
        "id": "sub_scc_46_6",
        "name": "Reverse Logistics",
        "description": "Specialization in reverse logistics.",
        "skillCount": 10
      },
      {
        "id": "sub_scc_46_7",
        "name": "Procurement Ethics",
        "description": "Specialization in procurement ethics.",
        "skillCount": 10
      },
      {
        "id": "sub_scc_46_8",
        "name": "Global Sourcing",
        "description": "Specialization in global sourcing.",
        "skillCount": 10
      },
      {
        "id": "sub_scc_46_9",
        "name": "Inventory Analytics",
        "description": "Specialization in inventory analytics.",
        "skillCount": 10
      },
      {
        "id": "sub_scc_46_10",
        "name": "Demand Forecasting",
        "description": "Specialization in demand forecasting.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_con_47",
    "name": "Construction",
    "icon": "🔩",
    "color": "#075985",
    "description": "Mastery in construction for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_con_47_1",
        "name": "Foundation Work",
        "description": "Specialization in foundation work.",
        "skillCount": 10
      },
      {
        "id": "sub_con_47_2",
        "name": "Structural Assembly",
        "description": "Specialization in structural assembly.",
        "skillCount": 10
      },
      {
        "id": "sub_con_47_3",
        "name": "Interior Fit-Out",
        "description": "Specialization in interior fit-out.",
        "skillCount": 10
      },
      {
        "id": "sub_con_47_4",
        "name": "Exterior Cladding",
        "description": "Specialization in exterior cladding.",
        "skillCount": 10
      },
      {
        "id": "sub_con_47_5",
        "name": "Mechanical Systems",
        "description": "Specialization in mechanical systems.",
        "skillCount": 10
      },
      {
        "id": "sub_con_47_6",
        "name": "Electrical Systems",
        "description": "Specialization in electrical systems.",
        "skillCount": 10
      },
      {
        "id": "sub_con_47_7",
        "name": "Plumbing",
        "description": "Specialization in plumbing.",
        "skillCount": 10
      },
      {
        "id": "sub_con_47_8",
        "name": "Fire Safety",
        "description": "Specialization in fire safety.",
        "skillCount": 10
      },
      {
        "id": "sub_con_47_9",
        "name": "Seismic Retrofitting",
        "description": "Specialization in seismic retrofitting.",
        "skillCount": 10
      },
      {
        "id": "sub_con_47_10",
        "name": "Smart Building",
        "description": "Specialization in smart building.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_inf_48",
    "name": "Infrastructure",
    "icon": "🌉",
    "color": "#0369a1",
    "description": "Mastery in infrastructure for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_inf_48_1",
        "name": "Road Networks",
        "description": "Specialization in road networks.",
        "skillCount": 10
      },
      {
        "id": "sub_inf_48_2",
        "name": "Power Grids",
        "description": "Specialization in power grids.",
        "skillCount": 10
      },
      {
        "id": "sub_inf_48_3",
        "name": "Water Systems",
        "description": "Specialization in water systems.",
        "skillCount": 10
      },
      {
        "id": "sub_inf_48_4",
        "name": "Communication Lines",
        "description": "Specialization in communication lines.",
        "skillCount": 10
      },
      {
        "id": "sub_inf_48_5",
        "name": "Transport Hubs",
        "description": "Specialization in transport hubs.",
        "skillCount": 10
      },
      {
        "id": "sub_inf_48_6",
        "name": "Public Transit",
        "description": "Specialization in public transit.",
        "skillCount": 10
      },
      {
        "id": "sub_inf_48_7",
        "name": "Telecommunications",
        "description": "Specialization in telecommunications.",
        "skillCount": 10
      },
      {
        "id": "sub_inf_48_8",
        "name": "Waste Management",
        "description": "Specialization in waste management.",
        "skillCount": 10
      },
      {
        "id": "sub_inf_48_9",
        "name": "Green Infrastructure",
        "description": "Specialization in green infrastructure.",
        "skillCount": 10
      },
      {
        "id": "sub_inf_48_10",
        "name": "Smart Cities",
        "description": "Specialization in smart cities.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_env_49",
    "name": "Environmental",
    "icon": "🌿",
    "color": "#0e7490",
    "description": "Mastery in environmental for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_env_49_1",
        "name": "Pollution Control",
        "description": "Specialization in pollution control.",
        "skillCount": 10
      },
      {
        "id": "sub_env_49_2",
        "name": "Conservation",
        "description": "Specialization in conservation.",
        "skillCount": 10
      },
      {
        "id": "sub_env_49_3",
        "name": "Renewable Energy",
        "description": "Specialization in renewable energy.",
        "skillCount": 10
      },
      {
        "id": "sub_env_49_4",
        "name": "Carbon Capture",
        "description": "Specialization in carbon capture.",
        "skillCount": 10
      },
      {
        "id": "sub_env_49_5",
        "name": "Water Treatment",
        "description": "Specialization in water treatment.",
        "skillCount": 10
      },
      {
        "id": "sub_env_49_6",
        "name": "Soil Remediation",
        "description": "Specialization in soil remediation.",
        "skillCount": 10
      },
      {
        "id": "sub_env_49_7",
        "name": "Wildlife Protection",
        "description": "Specialization in wildlife protection.",
        "skillCount": 10
      },
      {
        "id": "sub_env_49_8",
        "name": "Climate Modeling",
        "description": "Specialization in climate modeling.",
        "skillCount": 10
      },
      {
        "id": "sub_env_49_9",
        "name": "Waste Recycling",
        "description": "Specialization in waste recycling.",
        "skillCount": 10
      },
      {
        "id": "sub_env_49_10",
        "name": "Sustainable Design",
        "description": "Specialization in sustainable design.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_agr_50",
    "name": "Agriculture",
    "icon": "🌾",
    "color": "#0891b2",
    "description": "Mastery in agriculture for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_agr_50_1",
        "name": "Hydroponics",
        "description": "Specialization in hydroponics.",
        "skillCount": 10
      },
      {
        "id": "sub_agr_50_2",
        "name": "Vertical Farming",
        "description": "Specialization in vertical farming.",
        "skillCount": 10
      },
      {
        "id": "sub_agr_50_3",
        "name": "Genetic Crops",
        "description": "Specialization in genetic crops.",
        "skillCount": 10
      },
      {
        "id": "sub_agr_50_4",
        "name": "Aquaculture",
        "description": "Specialization in aquaculture.",
        "skillCount": 10
      },
      {
        "id": "sub_agr_50_5",
        "name": "Agroforestry",
        "description": "Specialization in agroforestry.",
        "skillCount": 10
      },
      {
        "id": "sub_agr_50_6",
        "name": "Soil Science",
        "description": "Specialization in soil science.",
        "skillCount": 10
      },
      {
        "id": "sub_agr_50_7",
        "name": "Pest Management",
        "description": "Specialization in pest management.",
        "skillCount": 10
      },
      {
        "id": "sub_agr_50_8",
        "name": "Irrigation Systems",
        "description": "Specialization in irrigation systems.",
        "skillCount": 10
      },
      {
        "id": "sub_agr_50_9",
        "name": "Food Processing",
        "description": "Specialization in food processing.",
        "skillCount": 10
      },
      {
        "id": "sub_agr_50_10",
        "name": "Agricultural Robotics",
        "description": "Specialization in agricultural robotics.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_fds_51",
    "name": "Food Science",
    "icon": "🍽️",
    "color": "#155e75",
    "description": "Mastery in food science for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_fds_51_1",
        "name": "Nutrition",
        "description": "Specialization in nutrition.",
        "skillCount": 10
      },
      {
        "id": "sub_fds_51_2",
        "name": "Food Preservation",
        "description": "Specialization in food preservation.",
        "skillCount": 10
      },
      {
        "id": "sub_fds_51_3",
        "name": "Fermentation",
        "description": "Specialization in fermentation.",
        "skillCount": 10
      },
      {
        "id": "sub_fds_51_4",
        "name": "Food Chemistry",
        "description": "Specialization in food chemistry.",
        "skillCount": 10
      },
      {
        "id": "sub_fds_51_5",
        "name": "Packaging Science",
        "description": "Specialization in packaging science.",
        "skillCount": 10
      },
      {
        "id": "sub_fds_51_6",
        "name": "Flavor Science",
        "description": "Specialization in flavor science.",
        "skillCount": 10
      },
      {
        "id": "sub_fds_51_7",
        "name": "Food Safety",
        "description": "Specialization in food safety.",
        "skillCount": 10
      },
      {
        "id": "sub_fds_51_8",
        "name": "Microbiology",
        "description": "Specialization in microbiology.",
        "skillCount": 10
      },
      {
        "id": "sub_fds_51_9",
        "name": "Dietary Engineering",
        "description": "Specialization in dietary engineering.",
        "skillCount": 10
      },
      {
        "id": "sub_fds_51_10",
        "name": "Synthetic Nutrition",
        "description": "Specialization in synthetic nutrition.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_tex_52",
    "name": "Textiles",
    "icon": "🧵",
    "color": "#164e63",
    "description": "Mastery in textiles for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_tex_52_1",
        "name": "Fiber Science",
        "description": "Specialization in fiber science.",
        "skillCount": 10
      },
      {
        "id": "sub_tex_52_2",
        "name": "Weaving",
        "description": "Specialization in weaving.",
        "skillCount": 10
      },
      {
        "id": "sub_tex_52_3",
        "name": "Dyeing",
        "description": "Specialization in dyeing.",
        "skillCount": 10
      },
      {
        "id": "sub_tex_52_4",
        "name": "Smart Fabrics",
        "description": "Specialization in smart fabrics.",
        "skillCount": 10
      },
      {
        "id": "sub_tex_52_5",
        "name": "Protective Clothing",
        "description": "Specialization in protective clothing.",
        "skillCount": 10
      },
      {
        "id": "sub_tex_52_6",
        "name": "Nanofibers",
        "description": "Specialization in nanofibers.",
        "skillCount": 10
      },
      {
        "id": "sub_tex_52_7",
        "name": "Bio-Textiles",
        "description": "Specialization in bio-textiles.",
        "skillCount": 10
      },
      {
        "id": "sub_tex_52_8",
        "name": "Sustainable Fabrics",
        "description": "Specialization in sustainable fabrics.",
        "skillCount": 10
      },
      {
        "id": "sub_tex_52_9",
        "name": "Military Gear",
        "description": "Specialization in military gear.",
        "skillCount": 10
      },
      {
        "id": "sub_tex_52_10",
        "name": "Space Suits",
        "description": "Specialization in space suits.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_trn_53",
    "name": "Transportation",
    "icon": "🚄",
    "color": "#1e3a5f",
    "description": "Mastery in transportation for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_trn_53_1",
        "name": "Ground Transport",
        "description": "Specialization in ground transport.",
        "skillCount": 10
      },
      {
        "id": "sub_trn_53_2",
        "name": "Air Transport",
        "description": "Specialization in air transport.",
        "skillCount": 10
      },
      {
        "id": "sub_trn_53_3",
        "name": "Space Transport",
        "description": "Specialization in space transport.",
        "skillCount": 10
      },
      {
        "id": "sub_trn_53_4",
        "name": "Maglev Systems",
        "description": "Specialization in maglev systems.",
        "skillCount": 10
      },
      {
        "id": "sub_trn_53_5",
        "name": "Hyperloop",
        "description": "Specialization in hyperloop.",
        "skillCount": 10
      },
      {
        "id": "sub_trn_53_6",
        "name": "Autonomous Vehicles",
        "description": "Specialization in autonomous vehicles.",
        "skillCount": 10
      },
      {
        "id": "sub_trn_53_7",
        "name": "Public Transit",
        "description": "Specialization in public transit.",
        "skillCount": 10
      },
      {
        "id": "sub_trn_53_8",
        "name": "Freight Systems",
        "description": "Specialization in freight systems.",
        "skillCount": 10
      },
      {
        "id": "sub_trn_53_9",
        "name": "Interplanetary Travel",
        "description": "Specialization in interplanetary travel.",
        "skillCount": 10
      },
      {
        "id": "sub_trn_53_10",
        "name": "Pedestrian Design",
        "description": "Specialization in pedestrian design.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_mnt_54",
    "name": "Mining Technology",
    "icon": "🔨",
    "color": "#44403c",
    "description": "Mastery in mining technology for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_mnt_54_1",
        "name": "Drilling Systems",
        "description": "Specialization in drilling systems.",
        "skillCount": 10
      },
      {
        "id": "sub_mnt_54_2",
        "name": "Blasting Tech",
        "description": "Specialization in blasting tech.",
        "skillCount": 10
      },
      {
        "id": "sub_mnt_54_3",
        "name": "Conveyor Systems",
        "description": "Specialization in conveyor systems.",
        "skillCount": 10
      },
      {
        "id": "sub_mnt_54_4",
        "name": "Ventilation",
        "description": "Specialization in ventilation.",
        "skillCount": 10
      },
      {
        "id": "sub_mnt_54_5",
        "name": "Rock Mechanics",
        "description": "Specialization in rock mechanics.",
        "skillCount": 10
      },
      {
        "id": "sub_mnt_54_6",
        "name": "Mine Safety",
        "description": "Specialization in mine safety.",
        "skillCount": 10
      },
      {
        "id": "sub_mnt_54_7",
        "name": "Automation",
        "description": "Specialization in automation.",
        "skillCount": 10
      },
      {
        "id": "sub_mnt_54_8",
        "name": "Exploration Geophysics",
        "description": "Specialization in exploration geophysics.",
        "skillCount": 10
      },
      {
        "id": "sub_mnt_54_9",
        "name": "Tailings Management",
        "description": "Specialization in tailings management.",
        "skillCount": 10
      },
      {
        "id": "sub_mnt_54_10",
        "name": "Mine Reclamation",
        "description": "Specialization in mine reclamation.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_ehr_55",
    "name": "Energy Harvesting",
    "icon": "🔋",
    "color": "#57534e",
    "description": "Mastery in energy harvesting for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_ehr_55_1",
        "name": "Piezoelectric",
        "description": "Specialization in piezoelectric.",
        "skillCount": 10
      },
      {
        "id": "sub_ehr_55_2",
        "name": "Thermoelectric",
        "description": "Specialization in thermoelectric.",
        "skillCount": 10
      },
      {
        "id": "sub_ehr_55_3",
        "name": "Triboelectric",
        "description": "Specialization in triboelectric.",
        "skillCount": 10
      },
      {
        "id": "sub_ehr_55_4",
        "name": "Photovoltaic",
        "description": "Specialization in photovoltaic.",
        "skillCount": 10
      },
      {
        "id": "sub_ehr_55_5",
        "name": "Wind Turbines",
        "description": "Specialization in wind turbines.",
        "skillCount": 10
      },
      {
        "id": "sub_ehr_55_6",
        "name": "Tidal Energy",
        "description": "Specialization in tidal energy.",
        "skillCount": 10
      },
      {
        "id": "sub_ehr_55_7",
        "name": "Geothermal",
        "description": "Specialization in geothermal.",
        "skillCount": 10
      },
      {
        "id": "sub_ehr_55_8",
        "name": "Biomass",
        "description": "Specialization in biomass.",
        "skillCount": 10
      },
      {
        "id": "sub_ehr_55_9",
        "name": "Hydroelectric",
        "description": "Specialization in hydroelectric.",
        "skillCount": 10
      },
      {
        "id": "sub_ehr_55_10",
        "name": "Osmotic Power",
        "description": "Specialization in osmotic power.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_ent_56",
    "name": "Entertainment",
    "icon": "🎮",
    "color": "#78716c",
    "description": "Mastery in entertainment for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_ent_56_1",
        "name": "Game Design",
        "description": "Specialization in game design.",
        "skillCount": 10
      },
      {
        "id": "sub_ent_56_2",
        "name": "Virtual Reality",
        "description": "Specialization in virtual reality.",
        "skillCount": 10
      },
      {
        "id": "sub_ent_56_3",
        "name": "Holographic Theater",
        "description": "Specialization in holographic theater.",
        "skillCount": 10
      },
      {
        "id": "sub_ent_56_4",
        "name": "Music Production",
        "description": "Specialization in music production.",
        "skillCount": 10
      },
      {
        "id": "sub_ent_56_5",
        "name": "Sports Systems",
        "description": "Specialization in sports systems.",
        "skillCount": 10
      },
      {
        "id": "sub_ent_56_6",
        "name": "Social Gaming",
        "description": "Specialization in social gaming.",
        "skillCount": 10
      },
      {
        "id": "sub_ent_56_7",
        "name": "Immersive Cinema",
        "description": "Specialization in immersive cinema.",
        "skillCount": 10
      },
      {
        "id": "sub_ent_56_8",
        "name": "Theme Parks",
        "description": "Specialization in theme parks.",
        "skillCount": 10
      },
      {
        "id": "sub_ent_56_9",
        "name": "Interactive Art",
        "description": "Specialization in interactive art.",
        "skillCount": 10
      },
      {
        "id": "sub_ent_56_10",
        "name": "Digital Fashion",
        "description": "Specialization in digital fashion.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_trs_57",
    "name": "Tourism",
    "icon": "✈️",
    "color": "#a8a29e",
    "description": "Mastery in tourism for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_trs_57_1",
        "name": "Space Tourism",
        "description": "Specialization in space tourism.",
        "skillCount": 10
      },
      {
        "id": "sub_trs_57_2",
        "name": "Planetary Resorts",
        "description": "Specialization in planetary resorts.",
        "skillCount": 10
      },
      {
        "id": "sub_trs_57_3",
        "name": "Adventure Travel",
        "description": "Specialization in adventure travel.",
        "skillCount": 10
      },
      {
        "id": "sub_trs_57_4",
        "name": "Cultural Tourism",
        "description": "Specialization in cultural tourism.",
        "skillCount": 10
      },
      {
        "id": "sub_trs_57_5",
        "name": "Eco-Tourism",
        "description": "Specialization in eco-tourism.",
        "skillCount": 10
      },
      {
        "id": "sub_trs_57_6",
        "name": "Luxury Cruises",
        "description": "Specialization in luxury cruises.",
        "skillCount": 10
      },
      {
        "id": "sub_trs_57_7",
        "name": "Historical Sites",
        "description": "Specialization in historical sites.",
        "skillCount": 10
      },
      {
        "id": "sub_trs_57_8",
        "name": "Wildlife Tours",
        "description": "Specialization in wildlife tours.",
        "skillCount": 10
      },
      {
        "id": "sub_trs_57_9",
        "name": "Medical Tourism",
        "description": "Specialization in medical tourism.",
        "skillCount": 10
      },
      {
        "id": "sub_trs_57_10",
        "name": "Dark Tourism",
        "description": "Specialization in dark tourism.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_arc2_58",
    "name": "Archaeology",
    "icon": "🏺",
    "color": "#78716c",
    "description": "Mastery in archaeology for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_arc2_58_1",
        "name": "Excavation Methods",
        "description": "Specialization in excavation methods.",
        "skillCount": 10
      },
      {
        "id": "sub_arc2_58_2",
        "name": "Dating Techniques",
        "description": "Specialization in dating techniques.",
        "skillCount": 10
      },
      {
        "id": "sub_arc2_58_3",
        "name": "Artifact Conservation",
        "description": "Specialization in artifact conservation.",
        "skillCount": 10
      },
      {
        "id": "sub_arc2_58_4",
        "name": "Paleolithic Studies",
        "description": "Specialization in paleolithic studies.",
        "skillCount": 10
      },
      {
        "id": "sub_arc2_58_5",
        "name": "Marine Archaeology",
        "description": "Specialization in marine archaeology.",
        "skillCount": 10
      },
      {
        "id": "sub_arc2_58_6",
        "name": "Aerial Survey",
        "description": "Specialization in aerial survey.",
        "skillCount": 10
      },
      {
        "id": "sub_arc2_58_7",
        "name": "DNA Analysis",
        "description": "Specialization in dna analysis.",
        "skillCount": 10
      },
      {
        "id": "sub_arc2_58_8",
        "name": "3D Scanning",
        "description": "Specialization in 3d scanning.",
        "skillCount": 10
      },
      {
        "id": "sub_arc2_58_9",
        "name": "Digital Reconstruction",
        "description": "Specialization in digital reconstruction.",
        "skillCount": 10
      },
      {
        "id": "sub_arc2_58_10",
        "name": "Cultural Heritage",
        "description": "Specialization in cultural heritage.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_his_59",
    "name": "History",
    "icon": "📜",
    "color": "#a16207",
    "description": "Mastery in history for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_his_59_1",
        "name": "Ancient Civilizations",
        "description": "Specialization in ancient civilizations.",
        "skillCount": 10
      },
      {
        "id": "sub_his_59_2",
        "name": "Medieval Period",
        "description": "Specialization in medieval period.",
        "skillCount": 10
      },
      {
        "id": "sub_his_59_3",
        "name": "Renaissance",
        "description": "Specialization in renaissance.",
        "skillCount": 10
      },
      {
        "id": "sub_his_59_4",
        "name": "Industrial Revolution",
        "description": "Specialization in industrial revolution.",
        "skillCount": 10
      },
      {
        "id": "sub_his_59_5",
        "name": "Modern History",
        "description": "Specialization in modern history.",
        "skillCount": 10
      },
      {
        "id": "sub_his_59_6",
        "name": "Military History",
        "description": "Specialization in military history.",
        "skillCount": 10
      },
      {
        "id": "sub_his_59_7",
        "name": "Maritime History",
        "description": "Specialization in maritime history.",
        "skillCount": 10
      },
      {
        "id": "sub_his_59_8",
        "name": "Economic History",
        "description": "Specialization in economic history.",
        "skillCount": 10
      },
      {
        "id": "sub_his_59_9",
        "name": "Technological History",
        "description": "Specialization in technological history.",
        "skillCount": 10
      },
      {
        "id": "sub_his_59_10",
        "name": "Social History",
        "description": "Specialization in social history.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_lin_60",
    "name": "Linguistics",
    "icon": "💬",
    "color": "#4d7c0f",
    "description": "Mastery in linguistics for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_lin_60_1",
        "name": "Phonetics",
        "description": "Specialization in phonetics.",
        "skillCount": 10
      },
      {
        "id": "sub_lin_60_2",
        "name": "Syntax",
        "description": "Specialization in syntax.",
        "skillCount": 10
      },
      {
        "id": "sub_lin_60_3",
        "name": "Semantics",
        "description": "Specialization in semantics.",
        "skillCount": 10
      },
      {
        "id": "sub_lin_60_4",
        "name": "Pragmatics",
        "description": "Specialization in pragmatics.",
        "skillCount": 10
      },
      {
        "id": "sub_lin_60_5",
        "name": "Sociolinguistics",
        "description": "Specialization in sociolinguistics.",
        "skillCount": 10
      },
      {
        "id": "sub_lin_60_6",
        "name": "Computational Linguistics",
        "description": "Specialization in computational linguistics.",
        "skillCount": 10
      },
      {
        "id": "sub_lin_60_7",
        "name": "Historical Linguistics",
        "description": "Specialization in historical linguistics.",
        "skillCount": 10
      },
      {
        "id": "sub_lin_60_8",
        "name": "Neurolinguistics",
        "description": "Specialization in neurolinguistics.",
        "skillCount": 10
      },
      {
        "id": "sub_lin_60_9",
        "name": "Applied Linguistics",
        "description": "Specialization in applied linguistics.",
        "skillCount": 10
      },
      {
        "id": "sub_lin_60_10",
        "name": "Language Documentation",
        "description": "Specialization in language documentation.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_hzm_61",
    "name": "Hazardous Materials",
    "icon": "☢️",
    "color": "#dc2626",
    "description": "Mastery in hazardous materials for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_hzm_61_1",
        "name": "Radiation Handling",
        "description": "Specialization in radiation handling.",
        "skillCount": 10
      },
      {
        "id": "sub_hzm_61_2",
        "name": "Chemical Safety",
        "description": "Specialization in chemical safety.",
        "skillCount": 10
      },
      {
        "id": "sub_hzm_61_3",
        "name": "Biological Hazards",
        "description": "Specialization in biological hazards.",
        "skillCount": 10
      },
      {
        "id": "sub_hzm_61_4",
        "name": "Nuclear Waste",
        "description": "Specialization in nuclear waste.",
        "skillCount": 10
      },
      {
        "id": "sub_hzm_61_5",
        "name": "Plasma Containment",
        "description": "Specialization in plasma containment.",
        "skillCount": 10
      },
      {
        "id": "sub_hzm_61_6",
        "name": "Antimatter Safety",
        "description": "Specialization in antimatter safety.",
        "skillCount": 10
      },
      {
        "id": "sub_hzm_61_7",
        "name": "Exotic Materials",
        "description": "Specialization in exotic materials.",
        "skillCount": 10
      },
      {
        "id": "sub_hzm_61_8",
        "name": "Emergency Response",
        "description": "Specialization in emergency response.",
        "skillCount": 10
      },
      {
        "id": "sub_hzm_61_9",
        "name": "Decontamination",
        "description": "Specialization in decontamination.",
        "skillCount": 10
      },
      {
        "id": "sub_hzm_61_10",
        "name": "Hazard Assessment",
        "description": "Specialization in hazard assessment.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_ems_62",
    "name": "Emergency Systems",
    "icon": "🚨",
    "color": "#ea580c",
    "description": "Mastery in emergency systems for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_ems_62_1",
        "name": "Evacuation Procedures",
        "description": "Specialization in evacuation procedures.",
        "skillCount": 10
      },
      {
        "id": "sub_ems_62_2",
        "name": "Fire Suppression",
        "description": "Specialization in fire suppression.",
        "skillCount": 10
      },
      {
        "id": "sub_ems_62_3",
        "name": "Flood Control",
        "description": "Specialization in flood control.",
        "skillCount": 10
      },
      {
        "id": "sub_ems_62_4",
        "name": "Seismic Response",
        "description": "Specialization in seismic response.",
        "skillCount": 10
      },
      {
        "id": "sub_ems_62_5",
        "name": "Medical Emergency",
        "description": "Specialization in medical emergency.",
        "skillCount": 10
      },
      {
        "id": "sub_ems_62_6",
        "name": "Hazmat Response",
        "description": "Specialization in hazmat response.",
        "skillCount": 10
      },
      {
        "id": "sub_ems_62_7",
        "name": "Search and Rescue",
        "description": "Specialization in search and rescue.",
        "skillCount": 10
      },
      {
        "id": "sub_ems_62_8",
        "name": "Crisis Communication",
        "description": "Specialization in crisis communication.",
        "skillCount": 10
      },
      {
        "id": "sub_ems_62_9",
        "name": "Disaster Recovery",
        "description": "Specialization in disaster recovery.",
        "skillCount": 10
      },
      {
        "id": "sub_ems_62_10",
        "name": "Civil Defense",
        "description": "Specialization in civil defense.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_int_63",
    "name": "Intelligence",
    "icon": "🔍",
    "color": "#7c2d12",
    "description": "Mastery in intelligence for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_int_63_1",
        "name": "SIGINT",
        "description": "Specialization in sigint.",
        "skillCount": 10
      },
      {
        "id": "sub_int_63_2",
        "name": "HUMINT",
        "description": "Specialization in humint.",
        "skillCount": 10
      },
      {
        "id": "sub_int_63_3",
        "name": "MASINT",
        "description": "Specialization in masint.",
        "skillCount": 10
      },
      {
        "id": "sub_int_63_4",
        "name": "GEOINT",
        "description": "Specialization in geoint.",
        "skillCount": 10
      },
      {
        "id": "sub_int_63_5",
        "name": "OSINT",
        "description": "Specialization in osint.",
        "skillCount": 10
      },
      {
        "id": "sub_int_63_6",
        "name": "CYBINT",
        "description": "Specialization in cybint.",
        "skillCount": 10
      },
      {
        "id": "sub_int_63_7",
        "name": "TECHINT",
        "description": "Specialization in techint.",
        "skillCount": 10
      },
      {
        "id": "sub_int_63_8",
        "name": "COMINT",
        "description": "Specialization in comint.",
        "skillCount": 10
      },
      {
        "id": "sub_int_63_9",
        "name": "FISINT",
        "description": "Specialization in fisint.",
        "skillCount": 10
      },
      {
        "id": "sub_int_63_10",
        "name": "RADINT",
        "description": "Specialization in radint.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_ci_64",
    "name": "Counter-Intelligence",
    "icon": "🔒",
    "color": "#431407",
    "description": "Mastery in counter-intelligence for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_ci_64_1",
        "name": "Mole Hunting",
        "description": "Specialization in mole hunting.",
        "skillCount": 10
      },
      {
        "id": "sub_ci_64_2",
        "name": "Deception Ops",
        "description": "Specialization in deception ops.",
        "skillCount": 10
      },
      {
        "id": "sub_ci_64_3",
        "name": "Double Agents",
        "description": "Specialization in double agents.",
        "skillCount": 10
      },
      {
        "id": "sub_ci_64_4",
        "name": "Defensive Security",
        "description": "Specialization in defensive security.",
        "skillCount": 10
      },
      {
        "id": "sub_ci_64_5",
        "name": "Compartmentalization",
        "description": "Specialization in compartmentalization.",
        "skillCount": 10
      },
      {
        "id": "sub_ci_64_6",
        "name": "Polygraph Systems",
        "description": "Specialization in polygraph systems.",
        "skillCount": 10
      },
      {
        "id": "sub_ci_64_7",
        "name": "Surveillance Detection",
        "description": "Specialization in surveillance detection.",
        "skillCount": 10
      },
      {
        "id": "sub_ci_64_8",
        "name": "Damage Assessment",
        "description": "Specialization in damage assessment.",
        "skillCount": 10
      },
      {
        "id": "sub_ci_64_9",
        "name": "Source Protection",
        "description": "Specialization in source protection.",
        "skillCount": 10
      },
      {
        "id": "sub_ci_64_10",
        "name": "Disinformation",
        "description": "Specialization in disinformation.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_sec_65",
    "name": "Security",
    "icon": "🔐",
    "color": "#1c1917",
    "description": "Mastery in security for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_sec_65_1",
        "name": "Perimeter Defense",
        "description": "Specialization in perimeter defense.",
        "skillCount": 10
      },
      {
        "id": "sub_sec_65_2",
        "name": "Access Control",
        "description": "Specialization in access control.",
        "skillCount": 10
      },
      {
        "id": "sub_sec_65_3",
        "name": "Threat Assessment",
        "description": "Specialization in threat assessment.",
        "skillCount": 10
      },
      {
        "id": "sub_sec_65_4",
        "name": "Physical Security",
        "description": "Specialization in physical security.",
        "skillCount": 10
      },
      {
        "id": "sub_sec_65_5",
        "name": "Network Security",
        "description": "Specialization in network security.",
        "skillCount": 10
      },
      {
        "id": "sub_sec_65_6",
        "name": "Personnel Security",
        "description": "Specialization in personnel security.",
        "skillCount": 10
      },
      {
        "id": "sub_sec_65_7",
        "name": "Facility Security",
        "description": "Specialization in facility security.",
        "skillCount": 10
      },
      {
        "id": "sub_sec_65_8",
        "name": "Transport Security",
        "description": "Specialization in transport security.",
        "skillCount": 10
      },
      {
        "id": "sub_sec_65_9",
        "name": "Maritime Security",
        "description": "Specialization in maritime security.",
        "skillCount": 10
      },
      {
        "id": "sub_sec_65_10",
        "name": "Space Security",
        "description": "Specialization in space security.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_pro_66",
    "name": "Propaganda",
    "icon": "📺",
    "color": "#44403c",
    "description": "Mastery in propaganda for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_pro_66_1",
        "name": "Media Control",
        "description": "Specialization in media control.",
        "skillCount": 10
      },
      {
        "id": "sub_pro_66_2",
        "name": "Public Messaging",
        "description": "Specialization in public messaging.",
        "skillCount": 10
      },
      {
        "id": "sub_pro_66_3",
        "name": "Cultural Influence",
        "description": "Specialization in cultural influence.",
        "skillCount": 10
      },
      {
        "id": "sub_pro_66_4",
        "name": "Digital Propaganda",
        "description": "Specialization in digital propaganda.",
        "skillCount": 10
      },
      {
        "id": "sub_pro_66_5",
        "name": "Censorship",
        "description": "Specialization in censorship.",
        "skillCount": 10
      },
      {
        "id": "sub_pro_66_6",
        "name": "Narrative Shaping",
        "description": "Specialization in narrative shaping.",
        "skillCount": 10
      },
      {
        "id": "sub_pro_66_7",
        "name": "Emotional Appeals",
        "description": "Specialization in emotional appeals.",
        "skillCount": 10
      },
      {
        "id": "sub_pro_66_8",
        "name": "Myth Making",
        "description": "Specialization in myth making.",
        "skillCount": 10
      },
      {
        "id": "sub_pro_66_9",
        "name": "Symbolism",
        "description": "Specialization in symbolism.",
        "skillCount": 10
      },
      {
        "id": "sub_pro_66_10",
        "name": "Counter-Narrative",
        "description": "Specialization in counter-narrative.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_psy_67",
    "name": "Psychological Ops",
    "icon": "🧠",
    "color": "#57534e",
    "description": "Mastery in psychological ops for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_psy_67_1",
        "name": "Morale Operations",
        "description": "Specialization in morale operations.",
        "skillCount": 10
      },
      {
        "id": "sub_psy_67_2",
        "name": "Deception",
        "description": "Specialization in deception.",
        "skillCount": 10
      },
      {
        "id": "sub_psy_67_3",
        "name": "Intimidation",
        "description": "Specialization in intimidation.",
        "skillCount": 10
      },
      {
        "id": "sub_psy_67_4",
        "name": "Recruitment",
        "description": "Specialization in recruitment.",
        "skillCount": 10
      },
      {
        "id": "sub_psy_67_5",
        "name": "Information Warfare",
        "description": "Specialization in information warfare.",
        "skillCount": 10
      },
      {
        "id": "sub_psy_67_6",
        "name": "Cultural Operations",
        "description": "Specialization in cultural operations.",
        "skillCount": 10
      },
      {
        "id": "sub_psy_67_7",
        "name": "Leaflet Campaigns",
        "description": "Specialization in leaflet campaigns.",
        "skillCount": 10
      },
      {
        "id": "sub_psy_67_8",
        "name": "Radio Broadcasts",
        "description": "Specialization in radio broadcasts.",
        "skillCount": 10
      },
      {
        "id": "sub_psy_67_9",
        "name": "Social Media Ops",
        "description": "Specialization in social media ops.",
        "skillCount": 10
      },
      {
        "id": "sub_psy_67_10",
        "name": "Cognitive Warfare",
        "description": "Specialization in cognitive warfare.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_nar_68",
    "name": "Naval Architecture",
    "icon": "🚢",
    "color": "#0369a1",
    "description": "Mastery in naval architecture for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_nar_68_1",
        "name": "Hull Design",
        "description": "Specialization in hull design.",
        "skillCount": 10
      },
      {
        "id": "sub_nar_68_2",
        "name": "Hydrodynamics",
        "description": "Specialization in hydrodynamics.",
        "skillCount": 10
      },
      {
        "id": "sub_nar_68_3",
        "name": "Buoyancy Systems",
        "description": "Specialization in buoyancy systems.",
        "skillCount": 10
      },
      {
        "id": "sub_nar_68_4",
        "name": "Marine Propulsion",
        "description": "Specialization in marine propulsion.",
        "skillCount": 10
      },
      {
        "id": "sub_nar_68_5",
        "name": "Deck Systems",
        "description": "Specialization in deck systems.",
        "skillCount": 10
      },
      {
        "id": "sub_nar_68_6",
        "name": "Navigation Equipment",
        "description": "Specialization in navigation equipment.",
        "skillCount": 10
      },
      {
        "id": "sub_nar_68_7",
        "name": "Safety Systems",
        "description": "Specialization in safety systems.",
        "skillCount": 10
      },
      {
        "id": "sub_nar_68_8",
        "name": "Weather Resistance",
        "description": "Specialization in weather resistance.",
        "skillCount": 10
      },
      {
        "id": "sub_nar_68_9",
        "name": "Underwater Design",
        "description": "Specialization in underwater design.",
        "skillCount": 10
      },
      {
        "id": "sub_nar_68_10",
        "name": "Ice Breaking",
        "description": "Specialization in ice breaking.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_aer_69",
    "name": "Aerospace",
    "icon": "✈️",
    "color": "#1d4ed8",
    "description": "Mastery in aerospace for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_aer_69_1",
        "name": "Aerodynamics",
        "description": "Specialization in aerodynamics.",
        "skillCount": 10
      },
      {
        "id": "sub_aer_69_2",
        "name": "Flight Control",
        "description": "Specialization in flight control.",
        "skillCount": 10
      },
      {
        "id": "sub_aer_69_3",
        "name": "Avionics",
        "description": "Specialization in avionics.",
        "skillCount": 10
      },
      {
        "id": "sub_aer_69_4",
        "name": "Propulsion Integration",
        "description": "Specialization in propulsion integration.",
        "skillCount": 10
      },
      {
        "id": "sub_aer_69_5",
        "name": "Thermal Protection",
        "description": "Specialization in thermal protection.",
        "skillCount": 10
      },
      {
        "id": "sub_aer_69_6",
        "name": "Structural Design",
        "description": "Specialization in structural design.",
        "skillCount": 10
      },
      {
        "id": "sub_aer_69_7",
        "name": "Cockpit Systems",
        "description": "Specialization in cockpit systems.",
        "skillCount": 10
      },
      {
        "id": "sub_aer_69_8",
        "name": "Landing Gear",
        "description": "Specialization in landing gear.",
        "skillCount": 10
      },
      {
        "id": "sub_aer_69_9",
        "name": "Payload Integration",
        "description": "Specialization in payload integration.",
        "skillCount": 10
      },
      {
        "id": "sub_aer_69_10",
        "name": "Flight Testing",
        "description": "Specialization in flight testing.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_ore_70",
    "name": "Ordnance Engineering",
    "icon": "💣",
    "color": "#b91c1c",
    "description": "Mastery in ordnance engineering for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_ore_70_1",
        "name": "Explosive Design",
        "description": "Specialization in explosive design.",
        "skillCount": 10
      },
      {
        "id": "sub_ore_70_2",
        "name": "Fuze Systems",
        "description": "Specialization in fuze systems.",
        "skillCount": 10
      },
      {
        "id": "sub_ore_70_3",
        "name": "Warhead Design",
        "description": "Specialization in warhead design.",
        "skillCount": 10
      },
      {
        "id": "sub_ore_70_4",
        "name": "Propellant Tech",
        "description": "Specialization in propellant tech.",
        "skillCount": 10
      },
      {
        "id": "sub_ore_70_5",
        "name": "Ballistics",
        "description": "Specialization in ballistics.",
        "skillCount": 10
      },
      {
        "id": "sub_ore_70_6",
        "name": "Guidance Systems",
        "description": "Specialization in guidance systems.",
        "skillCount": 10
      },
      {
        "id": "sub_ore_70_7",
        "name": "Detonation Sequencing",
        "description": "Specialization in detonation sequencing.",
        "skillCount": 10
      },
      {
        "id": "sub_ore_70_8",
        "name": "Safety Mechanisms",
        "description": "Specialization in safety mechanisms.",
        "skillCount": 10
      },
      {
        "id": "sub_ore_70_9",
        "name": "Fuzing Logic",
        "description": "Specialization in fuzing logic.",
        "skillCount": 10
      },
      {
        "id": "sub_ore_70_10",
        "name": "Warhead Materials",
        "description": "Specialization in warhead materials.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_bal_71",
    "name": "Ballistics",
    "icon": "🎯",
    "color": "#991b1b",
    "description": "Mastery in ballistics for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_bal_71_1",
        "name": "External Ballistics",
        "description": "Specialization in external ballistics.",
        "skillCount": 10
      },
      {
        "id": "sub_bal_71_2",
        "name": "Terminal Ballistics",
        "description": "Specialization in terminal ballistics.",
        "skillCount": 10
      },
      {
        "id": "sub_bal_71_3",
        "name": "Interior Ballistics",
        "description": "Specialization in interior ballistics.",
        "skillCount": 10
      },
      {
        "id": "sub_bal_71_4",
        "name": "Trajectory Computing",
        "description": "Specialization in trajectory computing.",
        "skillCount": 10
      },
      {
        "id": "sub_bal_71_5",
        "name": "Wind Correction",
        "description": "Specialization in wind correction.",
        "skillCount": 10
      },
      {
        "id": "sub_bal_71_6",
        "name": "Gravity Compensation",
        "description": "Specialization in gravity compensation.",
        "skillCount": 10
      },
      {
        "id": "sub_bal_71_7",
        "name": "Ricochet Analysis",
        "description": "Specialization in ricochet analysis.",
        "skillCount": 10
      },
      {
        "id": "sub_bal_71_8",
        "name": "Penetration Mechanics",
        "description": "Specialization in penetration mechanics.",
        "skillCount": 10
      },
      {
        "id": "sub_bal_71_9",
        "name": "Fragmentation",
        "description": "Specialization in fragmentation.",
        "skillCount": 10
      },
      {
        "id": "sub_bal_71_10",
        "name": "Armor Defeat",
        "description": "Specialization in armor defeat.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_exp_72",
    "name": "Explosives",
    "icon": "🧨",
    "color": "#7f1d1d",
    "description": "Mastery in explosives for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_exp_72_1",
        "name": "High Explosives",
        "description": "Specialization in high explosives.",
        "skillCount": 10
      },
      {
        "id": "sub_exp_72_2",
        "name": "Low Explosives",
        "description": "Specialization in low explosives.",
        "skillCount": 10
      },
      {
        "id": "sub_exp_72_3",
        "name": "Shaped Charges",
        "description": "Specialization in shaped charges.",
        "skillCount": 10
      },
      {
        "id": "sub_exp_72_4",
        "name": "Thermobaric",
        "description": "Specialization in thermobaric.",
        "skillCount": 10
      },
      {
        "id": "sub_exp_72_5",
        "name": "Plastic Explosives",
        "description": "Specialization in plastic explosives.",
        "skillCount": 10
      },
      {
        "id": "sub_exp_72_6",
        "name": "Propellants",
        "description": "Specialization in propellants.",
        "skillCount": 10
      },
      {
        "id": "sub_exp_72_7",
        "name": "Pyrotechnics",
        "description": "Specialization in pyrotechnics.",
        "skillCount": 10
      },
      {
        "id": "sub_exp_72_8",
        "name": "Chemical Synthesis",
        "description": "Specialization in chemical synthesis.",
        "skillCount": 10
      },
      {
        "id": "sub_exp_72_9",
        "name": "Safety Protocols",
        "description": "Specialization in safety protocols.",
        "skillCount": 10
      },
      {
        "id": "sub_exp_72_10",
        "name": "Storage Systems",
        "description": "Specialization in storage systems.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_wds_73",
    "name": "Warhead Design",
    "icon": "💨",
    "color": "#6b1212",
    "description": "Mastery in warhead design for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_wds_73_1",
        "name": "Kinetic Warheads",
        "description": "Specialization in kinetic warheads.",
        "skillCount": 10
      },
      {
        "id": "sub_wds_73_2",
        "name": "Cluster Munitions",
        "description": "Specialization in cluster munitions.",
        "skillCount": 10
      },
      {
        "id": "sub_wds_73_3",
        "name": "Penetrators",
        "description": "Specialization in penetrators.",
        "skillCount": 10
      },
      {
        "id": "sub_wds_73_4",
        "name": "Incendiary",
        "description": "Specialization in incendiary.",
        "skillCount": 10
      },
      {
        "id": "sub_wds_73_5",
        "name": "Nuclear Warheads",
        "description": "Specialization in nuclear warheads.",
        "skillCount": 10
      },
      {
        "id": "sub_wds_73_6",
        "name": " EMP Warheads",
        "description": "Specialization in  emp warheads.",
        "skillCount": 10
      },
      {
        "id": "sub_wds_73_7",
        "name": "Chemical Warheads",
        "description": "Specialization in chemical warheads.",
        "skillCount": 10
      },
      {
        "id": "sub_wds_73_8",
        "name": "Biological Warheads",
        "description": "Specialization in biological warheads.",
        "skillCount": 10
      },
      {
        "id": "sub_wds_73_9",
        "name": "Stealth Warheads",
        "description": "Specialization in stealth warheads.",
        "skillCount": 10
      },
      {
        "id": "sub_wds_73_10",
        "name": "Smart Warheads",
        "description": "Specialization in smart warheads.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_ben_74",
    "name": "Bio-Engineering",
    "icon": "🧫",
    "color": "#15803d",
    "description": "Mastery in bio-engineering for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_ben_74_1",
        "name": "Gene Editing",
        "description": "Specialization in gene editing.",
        "skillCount": 10
      },
      {
        "id": "sub_ben_74_2",
        "name": "Protein Engineering",
        "description": "Specialization in protein engineering.",
        "skillCount": 10
      },
      {
        "id": "sub_ben_74_3",
        "name": "Synthetic Biology",
        "description": "Specialization in synthetic biology.",
        "skillCount": 10
      },
      {
        "id": "sub_ben_74_4",
        "name": "Bioinformatics",
        "description": "Specialization in bioinformatics.",
        "skillCount": 10
      },
      {
        "id": "sub_ben_74_5",
        "name": "Metabolic Engineering",
        "description": "Specialization in metabolic engineering.",
        "skillCount": 10
      },
      {
        "id": "sub_ben_74_6",
        "name": "Tissue Engineering",
        "description": "Specialization in tissue engineering.",
        "skillCount": 10
      },
      {
        "id": "sub_ben_74_7",
        "name": "Bioprinting",
        "description": "Specialization in bioprinting.",
        "skillCount": 10
      },
      {
        "id": "sub_ben_74_8",
        "name": "Bioremediation",
        "description": "Specialization in bioremediation.",
        "skillCount": 10
      },
      {
        "id": "sub_ben_74_9",
        "name": "Enzyme Design",
        "description": "Specialization in enzyme design.",
        "skillCount": 10
      },
      {
        "id": "sub_ben_74_10",
        "name": "Bio-Informatics",
        "description": "Specialization in bio-informatics.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_nan_75",
    "name": "Nanotechnology",
    "icon": "🔬",
    "color": "#166534",
    "description": "Mastery in nanotechnology for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_nan_75_1",
        "name": "Molecular Assembly",
        "description": "Specialization in molecular assembly.",
        "skillCount": 10
      },
      {
        "id": "sub_nan_75_2",
        "name": "Nanobots",
        "description": "Specialization in nanobots.",
        "skillCount": 10
      },
      {
        "id": "sub_nan_75_3",
        "name": "Nanomedicine",
        "description": "Specialization in nanomedicine.",
        "skillCount": 10
      },
      {
        "id": "sub_nan_75_4",
        "name": "Nanoelectronics",
        "description": "Specialization in nanoelectronics.",
        "skillCount": 10
      },
      {
        "id": "sub_nan_75_5",
        "name": "Nanomaterials",
        "description": "Specialization in nanomaterials.",
        "skillCount": 10
      },
      {
        "id": "sub_nan_75_6",
        "name": "Nanophotonics",
        "description": "Specialization in nanophotonics.",
        "skillCount": 10
      },
      {
        "id": "sub_nan_75_7",
        "name": "Nanofabrication",
        "description": "Specialization in nanofabrication.",
        "skillCount": 10
      },
      {
        "id": "sub_nan_75_8",
        "name": "Nano-Optics",
        "description": "Specialization in nano-optics.",
        "skillCount": 10
      },
      {
        "id": "sub_nan_75_9",
        "name": "Nano-Fluidics",
        "description": "Specialization in nano-fluidics.",
        "skillCount": 10
      },
      {
        "id": "sub_nan_75_10",
        "name": "Nano-Bio Interface",
        "description": "Specialization in nano-bio interface.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_plp_76",
    "name": "Plasma Physics",
    "icon": "🔮",
    "color": "#7e22ce",
    "description": "Mastery in plasma physics for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_plp_76_1",
        "name": "Magnetic Confinement",
        "description": "Specialization in magnetic confinement.",
        "skillCount": 10
      },
      {
        "id": "sub_plp_76_2",
        "name": "Inertial Fusion",
        "description": "Specialization in inertial fusion.",
        "skillCount": 10
      },
      {
        "id": "sub_plp_76_3",
        "name": "Plasma Acceleration",
        "description": "Specialization in plasma acceleration.",
        "skillCount": 10
      },
      {
        "id": "sub_plp_76_4",
        "name": "Plasma Thrusters",
        "description": "Specialization in plasma thrusters.",
        "skillCount": 10
      },
      {
        "id": "sub_plp_76_5",
        "name": "Plasma Cutting",
        "description": "Specialization in plasma cutting.",
        "skillCount": 10
      },
      {
        "id": "sub_plp_76_6",
        "name": "Plasma Chemistry",
        "description": "Specialization in plasma chemistry.",
        "skillCount": 10
      },
      {
        "id": "sub_plp_76_7",
        "name": "Plasma Diagnostics",
        "description": "Specialization in plasma diagnostics.",
        "skillCount": 10
      },
      {
        "id": "sub_plp_76_8",
        "name": "Plasma Instabilities",
        "description": "Specialization in plasma instabilities.",
        "skillCount": 10
      },
      {
        "id": "sub_plp_76_9",
        "name": "Plasma Turbulence",
        "description": "Specialization in plasma turbulence.",
        "skillCount": 10
      },
      {
        "id": "sub_plp_76_10",
        "name": "Plasma Astrophysics",
        "description": "Specialization in plasma astrophysics.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_the_77",
    "name": "Thermal Engineering",
    "icon": "🌡️",
    "color": "#dc2626",
    "description": "Mastery in thermal engineering for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_the_77_1",
        "name": "Heat Transfer",
        "description": "Specialization in heat transfer.",
        "skillCount": 10
      },
      {
        "id": "sub_the_77_2",
        "name": "Cryogenics",
        "description": "Specialization in cryogenics.",
        "skillCount": 10
      },
      {
        "id": "sub_the_77_3",
        "name": "Thermal Insulation",
        "description": "Specialization in thermal insulation.",
        "skillCount": 10
      },
      {
        "id": "sub_the_77_4",
        "name": "Cooling Systems",
        "description": "Specialization in cooling systems.",
        "skillCount": 10
      },
      {
        "id": "sub_the_77_5",
        "name": "Heat Exchangers",
        "description": "Specialization in heat exchangers.",
        "skillCount": 10
      },
      {
        "id": "sub_the_77_6",
        "name": "Thermal Management",
        "description": "Specialization in thermal management.",
        "skillCount": 10
      },
      {
        "id": "sub_the_77_7",
        "name": "Phase Change",
        "description": "Specialization in phase change.",
        "skillCount": 10
      },
      {
        "id": "sub_the_77_8",
        "name": "Radiative Cooling",
        "description": "Specialization in radiative cooling.",
        "skillCount": 10
      },
      {
        "id": "sub_the_77_9",
        "name": "Thermal Shock",
        "description": "Specialization in thermal shock.",
        "skillCount": 10
      },
      {
        "id": "sub_the_77_10",
        "name": "Heat Pipes",
        "description": "Specialization in heat pipes.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_opt_78",
    "name": "Optics",
    "icon": "🔭",
    "color": "#2563eb",
    "description": "Mastery in optics for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_opt_78_1",
        "name": "Laser Technology",
        "description": "Specialization in laser technology.",
        "skillCount": 10
      },
      {
        "id": "sub_opt_78_2",
        "name": "Adaptive Optics",
        "description": "Specialization in adaptive optics.",
        "skillCount": 10
      },
      {
        "id": "sub_opt_78_3",
        "name": "Fiber Optics",
        "description": "Specialization in fiber optics.",
        "skillCount": 10
      },
      {
        "id": "sub_opt_78_4",
        "name": "Lens Design",
        "description": "Specialization in lens design.",
        "skillCount": 10
      },
      {
        "id": "sub_opt_78_5",
        "name": "Spectroscopy",
        "description": "Specialization in spectroscopy.",
        "skillCount": 10
      },
      {
        "id": "sub_opt_78_6",
        "name": "Holography",
        "description": "Specialization in holography.",
        "skillCount": 10
      },
      {
        "id": "sub_opt_78_7",
        "name": "Photonic Computing",
        "description": "Specialization in photonic computing.",
        "skillCount": 10
      },
      {
        "id": "sub_opt_78_8",
        "name": "Quantum Optics",
        "description": "Specialization in quantum optics.",
        "skillCount": 10
      },
      {
        "id": "sub_opt_78_9",
        "name": "Nonlinear Optics",
        "description": "Specialization in nonlinear optics.",
        "skillCount": 10
      },
      {
        "id": "sub_opt_78_10",
        "name": "Metamaterial Optics",
        "description": "Specialization in metamaterial optics.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_aco_79",
    "name": "Acoustics",
    "icon": "🔊",
    "color": "#1d4ed8",
    "description": "Mastery in acoustics for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_aco_79_1",
        "name": "Sonar Systems",
        "description": "Specialization in sonar systems.",
        "skillCount": 10
      },
      {
        "id": "sub_aco_79_2",
        "name": "Noise Control",
        "description": "Specialization in noise control.",
        "skillCount": 10
      },
      {
        "id": "sub_aco_79_3",
        "name": "Ultrasonics",
        "description": "Specialization in ultrasonics.",
        "skillCount": 10
      },
      {
        "id": "sub_aco_79_4",
        "name": "Acoustic Materials",
        "description": "Specialization in acoustic materials.",
        "skillCount": 10
      },
      {
        "id": "sub_aco_79_5",
        "name": "Room Acoustics",
        "description": "Specialization in room acoustics.",
        "skillCount": 10
      },
      {
        "id": "sub_aco_79_6",
        "name": "Psychoacoustics",
        "description": "Specialization in psychoacoustics.",
        "skillCount": 10
      },
      {
        "id": "sub_aco_79_7",
        "name": "Acoustic Holography",
        "description": "Specialization in acoustic holography.",
        "skillCount": 10
      },
      {
        "id": "sub_aco_79_8",
        "name": "Structural Acoustics",
        "description": "Specialization in structural acoustics.",
        "skillCount": 10
      },
      {
        "id": "sub_aco_79_9",
        "name": "Bioacoustics",
        "description": "Specialization in bioacoustics.",
        "skillCount": 10
      },
      {
        "id": "sub_aco_79_10",
        "name": "Acoustic Metamaterials",
        "description": "Specialization in acoustic metamaterials.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_sem_80",
    "name": "Semiconductor",
    "icon": "💾",
    "color": "#4f46e5",
    "description": "Mastery in semiconductor for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_sem_80_1",
        "name": "Chip Design",
        "description": "Specialization in chip design.",
        "skillCount": 10
      },
      {
        "id": "sub_sem_80_2",
        "name": "Photolithography",
        "description": "Specialization in photolithography.",
        "skillCount": 10
      },
      {
        "id": "sub_sem_80_3",
        "name": "Doping",
        "description": "Specialization in doping.",
        "skillCount": 10
      },
      {
        "id": "sub_sem_80_4",
        "name": "Clean Room",
        "description": "Specialization in clean room.",
        "skillCount": 10
      },
      {
        "id": "sub_sem_80_5",
        "name": "Wafer Processing",
        "description": "Specialization in wafer processing.",
        "skillCount": 10
      },
      {
        "id": "sub_sem_80_6",
        "name": "Packaging",
        "description": "Specialization in packaging.",
        "skillCount": 10
      },
      {
        "id": "sub_sem_80_7",
        "name": "Testing",
        "description": "Specialization in testing.",
        "skillCount": 10
      },
      {
        "id": "sub_sem_80_8",
        "name": "Yield Optimization",
        "description": "Specialization in yield optimization.",
        "skillCount": 10
      },
      {
        "id": "sub_sem_80_9",
        "name": "New Materials",
        "description": "Specialization in new materials.",
        "skillCount": 10
      },
      {
        "id": "sub_sem_80_10",
        "name": "Quantum Dots",
        "description": "Specialization in quantum dots.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_pws_81",
    "name": "Power Systems",
    "icon": "🔌",
    "color": "#ea580c",
    "description": "Mastery in power systems for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_pws_81_1",
        "name": "Grid Management",
        "description": "Specialization in grid management.",
        "skillCount": 10
      },
      {
        "id": "sub_pws_81_2",
        "name": "Transformer Design",
        "description": "Specialization in transformer design.",
        "skillCount": 10
      },
      {
        "id": "sub_pws_81_3",
        "name": "Power Electronics",
        "description": "Specialization in power electronics.",
        "skillCount": 10
      },
      {
        "id": "sub_pws_81_4",
        "name": "Battery Systems",
        "description": "Specialization in battery systems.",
        "skillCount": 10
      },
      {
        "id": "sub_pws_81_5",
        "name": "Fuel Cells",
        "description": "Specialization in fuel cells.",
        "skillCount": 10
      },
      {
        "id": "sub_pws_81_6",
        "name": "Capacitor Banks",
        "description": "Specialization in capacitor banks.",
        "skillCount": 10
      },
      {
        "id": "sub_pws_81_7",
        "name": "Superconducting Cables",
        "description": "Specialization in superconducting cables.",
        "skillCount": 10
      },
      {
        "id": "sub_pws_81_8",
        "name": "Microgrids",
        "description": "Specialization in microgrids.",
        "skillCount": 10
      },
      {
        "id": "sub_pws_81_9",
        "name": "Smart Grids",
        "description": "Specialization in smart grids.",
        "skillCount": 10
      },
      {
        "id": "sub_pws_81_10",
        "name": "Wireless Power",
        "description": "Specialization in wireless power.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_sts_82",
    "name": "Storage Systems",
    "icon": "📦",
    "color": "#c2410c",
    "description": "Mastery in storage systems for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_sts_82_1",
        "name": "Battery Tech",
        "description": "Specialization in battery tech.",
        "skillCount": 10
      },
      {
        "id": "sub_sts_82_2",
        "name": "Hydrogen Storage",
        "description": "Specialization in hydrogen storage.",
        "skillCount": 10
      },
      {
        "id": "sub_sts_82_3",
        "name": "Compressed Gas",
        "description": "Specialization in compressed gas.",
        "skillCount": 10
      },
      {
        "id": "sub_sts_82_4",
        "name": "Flywheels",
        "description": "Specialization in flywheels.",
        "skillCount": 10
      },
      {
        "id": "sub_sts_82_5",
        "name": "Pumped Hydro",
        "description": "Specialization in pumped hydro.",
        "skillCount": 10
      },
      {
        "id": "sub_sts_82_6",
        "name": "Thermal Storage",
        "description": "Specialization in thermal storage.",
        "skillCount": 10
      },
      {
        "id": "sub_sts_82_7",
        "name": "Chemical Storage",
        "description": "Specialization in chemical storage.",
        "skillCount": 10
      },
      {
        "id": "sub_sts_82_8",
        "name": "Gravitational",
        "description": "Specialization in gravitational.",
        "skillCount": 10
      },
      {
        "id": "sub_sts_82_9",
        "name": "Magnetic Storage",
        "description": "Specialization in magnetic storage.",
        "skillCount": 10
      },
      {
        "id": "sub_sts_82_10",
        "name": "Nuclear Storage",
        "description": "Specialization in nuclear storage.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_wam_83",
    "name": "Waste Management",
    "icon": "♻️",
    "color": "#16a34a",
    "description": "Mastery in waste management for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_wam_83_1",
        "name": "Recycling",
        "description": "Specialization in recycling.",
        "skillCount": 10
      },
      {
        "id": "sub_wam_83_2",
        "name": "Composting",
        "description": "Specialization in composting.",
        "skillCount": 10
      },
      {
        "id": "sub_wam_83_3",
        "name": "Incineration",
        "description": "Specialization in incineration.",
        "skillCount": 10
      },
      {
        "id": "sub_wam_83_4",
        "name": "Landfill Management",
        "description": "Specialization in landfill management.",
        "skillCount": 10
      },
      {
        "id": "sub_wam_83_5",
        "name": "Hazardous Waste",
        "description": "Specialization in hazardous waste.",
        "skillCount": 10
      },
      {
        "id": "sub_wam_83_6",
        "name": "E-Waste",
        "description": "Specialization in e-waste.",
        "skillCount": 10
      },
      {
        "id": "sub_wam_83_7",
        "name": "Plasma Gasification",
        "description": "Specialization in plasma gasification.",
        "skillCount": 10
      },
      {
        "id": "sub_wam_83_8",
        "name": "Bioremediation",
        "description": "Specialization in bioremediation.",
        "skillCount": 10
      },
      {
        "id": "sub_wam_83_9",
        "name": "Zero Waste",
        "description": "Specialization in zero waste.",
        "skillCount": 10
      },
      {
        "id": "sub_wam_83_10",
        "name": "Circular Economy",
        "description": "Specialization in circular economy.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_was_84",
    "name": "Water Systems",
    "icon": "💧",
    "color": "#0284c7",
    "description": "Mastery in water systems for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_was_84_1",
        "name": "Desalination",
        "description": "Specialization in desalination.",
        "skillCount": 10
      },
      {
        "id": "sub_was_84_2",
        "name": "Water Purification",
        "description": "Specialization in water purification.",
        "skillCount": 10
      },
      {
        "id": "sub_was_84_3",
        "name": "Piping Systems",
        "description": "Specialization in piping systems.",
        "skillCount": 10
      },
      {
        "id": "sub_was_84_4",
        "name": "Reservoir Design",
        "description": "Specialization in reservoir design.",
        "skillCount": 10
      },
      {
        "id": "sub_was_84_5",
        "name": "Rainwater Harvesting",
        "description": "Specialization in rainwater harvesting.",
        "skillCount": 10
      },
      {
        "id": "sub_was_84_6",
        "name": "Greywater Reuse",
        "description": "Specialization in greywater reuse.",
        "skillCount": 10
      },
      {
        "id": "sub_was_84_7",
        "name": "Flood Control",
        "description": "Specialization in flood control.",
        "skillCount": 10
      },
      {
        "id": "sub_was_84_8",
        "name": "Aquifer Management",
        "description": "Specialization in aquifer management.",
        "skillCount": 10
      },
      {
        "id": "sub_was_84_9",
        "name": "Ice Harvesting",
        "description": "Specialization in ice harvesting.",
        "skillCount": 10
      },
      {
        "id": "sub_was_84_10",
        "name": "Atmospheric Water",
        "description": "Specialization in atmospheric water.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_atm_85",
    "name": "Atmospheric Science",
    "icon": "🌤️",
    "color": "#0ea5e9",
    "description": "Mastery in atmospheric science for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_atm_85_1",
        "name": "Meteorology",
        "description": "Specialization in meteorology.",
        "skillCount": 10
      },
      {
        "id": "sub_atm_85_2",
        "name": "Climate Science",
        "description": "Specialization in climate science.",
        "skillCount": 10
      },
      {
        "id": "sub_atm_85_3",
        "name": "Air Quality",
        "description": "Specialization in air quality.",
        "skillCount": 10
      },
      {
        "id": "sub_atm_85_4",
        "name": "Atmospheric Chemistry",
        "description": "Specialization in atmospheric chemistry.",
        "skillCount": 10
      },
      {
        "id": "sub_atm_85_5",
        "name": "Cloud Physics",
        "description": "Specialization in cloud physics.",
        "skillCount": 10
      },
      {
        "id": "sub_atm_85_6",
        "name": "Radiation Budget",
        "description": "Specialization in radiation budget.",
        "skillCount": 10
      },
      {
        "id": "sub_atm_85_7",
        "name": "Weather Modeling",
        "description": "Specialization in weather modeling.",
        "skillCount": 10
      },
      {
        "id": "sub_atm_85_8",
        "name": "Extreme Weather",
        "description": "Specialization in extreme weather.",
        "skillCount": 10
      },
      {
        "id": "sub_atm_85_9",
        "name": "Atmospheric Dynamics",
        "description": "Specialization in atmospheric dynamics.",
        "skillCount": 10
      },
      {
        "id": "sub_atm_85_10",
        "name": "Paleoclimate",
        "description": "Specialization in paleoclimate.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_sei_86",
    "name": "Seismology",
    "icon": "🏔️",
    "color": "#78716c",
    "description": "Mastery in seismology for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_sei_86_1",
        "name": "Earthquake Detection",
        "description": "Specialization in earthquake detection.",
        "skillCount": 10
      },
      {
        "id": "sub_sei_86_2",
        "name": "Seismic Waves",
        "description": "Specialization in seismic waves.",
        "skillCount": 10
      },
      {
        "id": "sub_sei_86_3",
        "name": "Fault Analysis",
        "description": "Specialization in fault analysis.",
        "skillCount": 10
      },
      {
        "id": "sub_sei_86_4",
        "name": "Tsunami Warning",
        "description": "Specialization in tsunami warning.",
        "skillCount": 10
      },
      {
        "id": "sub_sei_86_5",
        "name": "Seismic Tomography",
        "description": "Specialization in seismic tomography.",
        "skillCount": 10
      },
      {
        "id": "sub_sei_86_6",
        "name": "Microseismic Monitoring",
        "description": "Specialization in microseismic monitoring.",
        "skillCount": 10
      },
      {
        "id": "sub_sei_86_7",
        "name": "Induced Seismicity",
        "description": "Specialization in induced seismicity.",
        "skillCount": 10
      },
      {
        "id": "sub_sei_86_8",
        "name": "Seismic Hazard",
        "description": "Specialization in seismic hazard.",
        "skillCount": 10
      },
      {
        "id": "sub_sei_86_9",
        "name": "Building Codes",
        "description": "Specialization in building codes.",
        "skillCount": 10
      },
      {
        "id": "sub_sei_86_10",
        "name": "Early Warning",
        "description": "Specialization in early warning.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_vlc_87",
    "name": "Volcanology",
    "icon": "🌋",
    "color": "#dc2626",
    "description": "Mastery in volcanology for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_vlc_87_1",
        "name": "Magma Dynamics",
        "description": "Specialization in magma dynamics.",
        "skillCount": 10
      },
      {
        "id": "sub_vlc_87_2",
        "name": "Eruption Prediction",
        "description": "Specialization in eruption prediction.",
        "skillCount": 10
      },
      {
        "id": "sub_vlc_87_3",
        "name": "Volcanic Gases",
        "description": "Specialization in volcanic gases.",
        "skillCount": 10
      },
      {
        "id": "sub_vlc_87_4",
        "name": "Lava Flows",
        "description": "Specialization in lava flows.",
        "skillCount": 10
      },
      {
        "id": "sub_vlc_87_5",
        "name": "Pyroclastic Flows",
        "description": "Specialization in pyroclastic flows.",
        "skillCount": 10
      },
      {
        "id": "sub_vlc_87_6",
        "name": "Volcanic Hazards",
        "description": "Specialization in volcanic hazards.",
        "skillCount": 10
      },
      {
        "id": "sub_vlc_87_7",
        "name": "Geothermal Energy",
        "description": "Specialization in geothermal energy.",
        "skillCount": 10
      },
      {
        "id": "sub_vlc_87_8",
        "name": "Volcanic Soils",
        "description": "Specialization in volcanic soils.",
        "skillCount": 10
      },
      {
        "id": "sub_vlc_87_9",
        "name": "Monitoring Systems",
        "description": "Specialization in monitoring systems.",
        "skillCount": 10
      },
      {
        "id": "sub_vlc_87_10",
        "name": "Volcanic Petrology",
        "description": "Specialization in volcanic petrology.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_ocn_88",
    "name": "Oceanography",
    "icon": "🌊",
    "color": "#0284c7",
    "description": "Mastery in oceanography for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_ocn_88_1",
        "name": "Physical Oceanography",
        "description": "Specialization in physical oceanography.",
        "skillCount": 10
      },
      {
        "id": "sub_ocn_88_2",
        "name": "Chemical Oceanography",
        "description": "Specialization in chemical oceanography.",
        "skillCount": 10
      },
      {
        "id": "sub_ocn_88_3",
        "name": "Marine Biology",
        "description": "Specialization in marine biology.",
        "skillCount": 10
      },
      {
        "id": "sub_ocn_88_4",
        "name": "Deep Sea Exploration",
        "description": "Specialization in deep sea exploration.",
        "skillCount": 10
      },
      {
        "id": "sub_ocn_88_5",
        "name": "Ocean Currents",
        "description": "Specialization in ocean currents.",
        "skillCount": 10
      },
      {
        "id": "sub_ocn_88_6",
        "name": "Tidal Systems",
        "description": "Specialization in tidal systems.",
        "skillCount": 10
      },
      {
        "id": "sub_ocn_88_7",
        "name": "Coral Reef Science",
        "description": "Specialization in coral reef science.",
        "skillCount": 10
      },
      {
        "id": "sub_ocn_88_8",
        "name": "Marine Geology",
        "description": "Specialization in marine geology.",
        "skillCount": 10
      },
      {
        "id": "sub_ocn_88_9",
        "name": "Polar Oceans",
        "description": "Specialization in polar oceans.",
        "skillCount": 10
      },
      {
        "id": "sub_ocn_88_10",
        "name": "Ocean Acidification",
        "description": "Specialization in ocean acidification.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_glc_89",
    "name": "Glaciology",
    "icon": "🧊",
    "color": "#93c5fd",
    "description": "Mastery in glaciology for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_glc_89_1",
        "name": "Ice Core Analysis",
        "description": "Specialization in ice core analysis.",
        "skillCount": 10
      },
      {
        "id": "sub_glc_89_2",
        "name": "Glacial Dynamics",
        "description": "Specialization in glacial dynamics.",
        "skillCount": 10
      },
      {
        "id": "sub_glc_89_3",
        "name": "Permafrost",
        "description": "Specialization in permafrost.",
        "skillCount": 10
      },
      {
        "id": "sub_glc_89_4",
        "name": "Ice Sheet Modeling",
        "description": "Specialization in ice sheet modeling.",
        "skillCount": 10
      },
      {
        "id": "sub_glc_89_5",
        "name": "Glacial Erosion",
        "description": "Specialization in glacial erosion.",
        "skillCount": 10
      },
      {
        "id": "sub_glc_89_6",
        "name": "Sea Ice",
        "description": "Specialization in sea ice.",
        "skillCount": 10
      },
      {
        "id": "sub_glc_89_7",
        "name": "Iceberg Tracking",
        "description": "Specialization in iceberg tracking.",
        "skillCount": 10
      },
      {
        "id": "sub_glc_89_8",
        "name": "Cryoconite",
        "description": "Specialization in cryoconite.",
        "skillCount": 10
      },
      {
        "id": "sub_glc_89_9",
        "name": "Glacial Lakes",
        "description": "Specialization in glacial lakes.",
        "skillCount": 10
      },
      {
        "id": "sub_glc_89_10",
        "name": "Paleoglaciology",
        "description": "Specialization in paleoglaciology.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_dem_90",
    "name": "Demography",
    "icon": "📊",
    "color": "#6366f1",
    "description": "Mastery in demography for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_dem_90_1",
        "name": "Population Dynamics",
        "description": "Specialization in population dynamics.",
        "skillCount": 10
      },
      {
        "id": "sub_dem_90_2",
        "name": "Migration Patterns",
        "description": "Specialization in migration patterns.",
        "skillCount": 10
      },
      {
        "id": "sub_dem_90_3",
        "name": "Fertility Studies",
        "description": "Specialization in fertility studies.",
        "skillCount": 10
      },
      {
        "id": "sub_dem_90_4",
        "name": "Mortality Analysis",
        "description": "Specialization in mortality analysis.",
        "skillCount": 10
      },
      {
        "id": "sub_dem_90_5",
        "name": "Age Structure",
        "description": "Specialization in age structure.",
        "skillCount": 10
      },
      {
        "id": "sub_dem_90_6",
        "name": "Urbanization",
        "description": "Specialization in urbanization.",
        "skillCount": 10
      },
      {
        "id": "sub_dem_90_7",
        "name": "Population Forecasting",
        "description": "Specialization in population forecasting.",
        "skillCount": 10
      },
      {
        "id": "sub_dem_90_8",
        "name": "Census Methods",
        "description": "Specialization in census methods.",
        "skillCount": 10
      },
      {
        "id": "sub_dem_90_9",
        "name": "Spatial Demography",
        "description": "Specialization in spatial demography.",
        "skillCount": 10
      },
      {
        "id": "sub_dem_90_10",
        "name": "Historical Demography",
        "description": "Specialization in historical demography.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_ant_91",
    "name": "Anthropology",
    "icon": "🗿",
    "color": "#a16207",
    "description": "Mastery in anthropology for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_ant_91_1",
        "name": "Cultural Anthropology",
        "description": "Specialization in cultural anthropology.",
        "skillCount": 10
      },
      {
        "id": "sub_ant_91_2",
        "name": "Physical Anthropology",
        "description": "Specialization in physical anthropology.",
        "skillCount": 10
      },
      {
        "id": "sub_ant_91_3",
        "name": "Archaeological Anthropology",
        "description": "Specialization in archaeological anthropology.",
        "skillCount": 10
      },
      {
        "id": "sub_ant_91_4",
        "name": "Linguistic Anthropology",
        "description": "Specialization in linguistic anthropology.",
        "skillCount": 10
      },
      {
        "id": "sub_ant_91_5",
        "name": "Medical Anthropology",
        "description": "Specialization in medical anthropology.",
        "skillCount": 10
      },
      {
        "id": "sub_ant_91_6",
        "name": "Digital Anthropology",
        "description": "Specialization in digital anthropology.",
        "skillCount": 10
      },
      {
        "id": "sub_ant_91_7",
        "name": "Urban Anthropology",
        "description": "Specialization in urban anthropology.",
        "skillCount": 10
      },
      {
        "id": "sub_ant_91_8",
        "name": "Applied Anthropology",
        "description": "Specialization in applied anthropology.",
        "skillCount": 10
      },
      {
        "id": "sub_ant_91_9",
        "name": "Visual Anthropology",
        "description": "Specialization in visual anthropology.",
        "skillCount": 10
      },
      {
        "id": "sub_ant_91_10",
        "name": "Business Anthropology",
        "description": "Specialization in business anthropology.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_pol_92",
    "name": "Political Science",
    "icon": "🗳️",
    "color": "#1e40af",
    "description": "Mastery in political science for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_pol_92_1",
        "name": "Comparative Politics",
        "description": "Specialization in comparative politics.",
        "skillCount": 10
      },
      {
        "id": "sub_pol_92_2",
        "name": "International Relations",
        "description": "Specialization in international relations.",
        "skillCount": 10
      },
      {
        "id": "sub_pol_92_3",
        "name": "Political Theory",
        "description": "Specialization in political theory.",
        "skillCount": 10
      },
      {
        "id": "sub_pol_92_4",
        "name": "Public Administration",
        "description": "Specialization in public administration.",
        "skillCount": 10
      },
      {
        "id": "sub_pol_92_5",
        "name": "Political Economy",
        "description": "Specialization in political economy.",
        "skillCount": 10
      },
      {
        "id": "sub_pol_92_6",
        "name": "Electoral Systems",
        "description": "Specialization in electoral systems.",
        "skillCount": 10
      },
      {
        "id": "sub_pol_92_7",
        "name": "Constitutional Law",
        "description": "Specialization in constitutional law.",
        "skillCount": 10
      },
      {
        "id": "sub_pol_92_8",
        "name": "Political Behavior",
        "description": "Specialization in political behavior.",
        "skillCount": 10
      },
      {
        "id": "sub_pol_92_9",
        "name": "Conflict Studies",
        "description": "Specialization in conflict studies.",
        "skillCount": 10
      },
      {
        "id": "sub_pol_92_10",
        "name": "Political Communication",
        "description": "Specialization in political communication.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_phi_93",
    "name": "Philosophy",
    "icon": "🤔",
    "color": "#5b21b6",
    "description": "Mastery in philosophy for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_phi_93_1",
        "name": "Ethics",
        "description": "Specialization in ethics.",
        "skillCount": 10
      },
      {
        "id": "sub_phi_93_2",
        "name": "Epistemology",
        "description": "Specialization in epistemology.",
        "skillCount": 10
      },
      {
        "id": "sub_phi_93_3",
        "name": "Metaphysics",
        "description": "Specialization in metaphysics.",
        "skillCount": 10
      },
      {
        "id": "sub_phi_93_4",
        "name": "Logic",
        "description": "Specialization in logic.",
        "skillCount": 10
      },
      {
        "id": "sub_phi_93_5",
        "name": "Aesthetics",
        "description": "Specialization in aesthetics.",
        "skillCount": 10
      },
      {
        "id": "sub_phi_93_6",
        "name": "Political Philosophy",
        "description": "Specialization in political philosophy.",
        "skillCount": 10
      },
      {
        "id": "sub_phi_93_7",
        "name": "Philosophy of Mind",
        "description": "Specialization in philosophy of mind.",
        "skillCount": 10
      },
      {
        "id": "sub_phi_93_8",
        "name": "Philosophy of Science",
        "description": "Specialization in philosophy of science.",
        "skillCount": 10
      },
      {
        "id": "sub_phi_93_9",
        "name": "Existentialism",
        "description": "Specialization in existentialism.",
        "skillCount": 10
      },
      {
        "id": "sub_phi_93_10",
        "name": "Phenomenology",
        "description": "Specialization in phenomenology.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_law_94",
    "name": "Law",
    "icon": "⚖️",
    "color": "#1e3a5f",
    "description": "Mastery in law for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_law_94_1",
        "name": "Criminal Law",
        "description": "Specialization in criminal law.",
        "skillCount": 10
      },
      {
        "id": "sub_law_94_2",
        "name": "Civil Law",
        "description": "Specialization in civil law.",
        "skillCount": 10
      },
      {
        "id": "sub_law_94_3",
        "name": "International Law",
        "description": "Specialization in international law.",
        "skillCount": 10
      },
      {
        "id": "sub_law_94_4",
        "name": "Corporate Law",
        "description": "Specialization in corporate law.",
        "skillCount": 10
      },
      {
        "id": "sub_law_94_5",
        "name": "Environmental Law",
        "description": "Specialization in environmental law.",
        "skillCount": 10
      },
      {
        "id": "sub_law_94_6",
        "name": "Space Law",
        "description": "Specialization in space law.",
        "skillCount": 10
      },
      {
        "id": "sub_law_94_7",
        "name": "Cyber Law",
        "description": "Specialization in cyber law.",
        "skillCount": 10
      },
      {
        "id": "sub_law_94_8",
        "name": "Intellectual Property",
        "description": "Specialization in intellectual property.",
        "skillCount": 10
      },
      {
        "id": "sub_law_94_9",
        "name": "Human Rights",
        "description": "Specialization in human rights.",
        "skillCount": 10
      },
      {
        "id": "sub_law_94_10",
        "name": "Maritime Law",
        "description": "Specialization in maritime law.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_eth_95",
    "name": "Ethics",
    "icon": "🎖️",
    "color": "#7c2d12",
    "description": "Mastery in ethics for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_eth_95_1",
        "name": "Bioethics",
        "description": "Specialization in bioethics.",
        "skillCount": 10
      },
      {
        "id": "sub_eth_95_2",
        "name": "AI Ethics",
        "description": "Specialization in ai ethics.",
        "skillCount": 10
      },
      {
        "id": "sub_eth_95_3",
        "name": "Military Ethics",
        "description": "Specialization in military ethics.",
        "skillCount": 10
      },
      {
        "id": "sub_eth_95_4",
        "name": "Environmental Ethics",
        "description": "Specialization in environmental ethics.",
        "skillCount": 10
      },
      {
        "id": "sub_eth_95_5",
        "name": "Medical Ethics",
        "description": "Specialization in medical ethics.",
        "skillCount": 10
      },
      {
        "id": "sub_eth_95_6",
        "name": "Business Ethics",
        "description": "Specialization in business ethics.",
        "skillCount": 10
      },
      {
        "id": "sub_eth_95_7",
        "name": "Research Ethics",
        "description": "Specialization in research ethics.",
        "skillCount": 10
      },
      {
        "id": "sub_eth_95_8",
        "name": "Engineering Ethics",
        "description": "Specialization in engineering ethics.",
        "skillCount": 10
      },
      {
        "id": "sub_eth_95_9",
        "name": "Digital Ethics",
        "description": "Specialization in digital ethics.",
        "skillCount": 10
      },
      {
        "id": "sub_eth_95_10",
        "name": "Space Ethics",
        "description": "Specialization in space ethics.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_phl_96",
    "name": "Public Health",
    "icon": "🏥",
    "color": "#16a34a",
    "description": "Mastery in public health for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_phl_96_1",
        "name": "Epidemiology",
        "description": "Specialization in epidemiology.",
        "skillCount": 10
      },
      {
        "id": "sub_phl_96_2",
        "name": "Health Policy",
        "description": "Specialization in health policy.",
        "skillCount": 10
      },
      {
        "id": "sub_phl_96_3",
        "name": "Community Health",
        "description": "Specialization in community health.",
        "skillCount": 10
      },
      {
        "id": "sub_phl_96_4",
        "name": "Global Health",
        "description": "Specialization in global health.",
        "skillCount": 10
      },
      {
        "id": "sub_phl_96_5",
        "name": "Mental Health",
        "description": "Specialization in mental health.",
        "skillCount": 10
      },
      {
        "id": "sub_phl_96_6",
        "name": "Occupational Health",
        "description": "Specialization in occupational health.",
        "skillCount": 10
      },
      {
        "id": "sub_phl_96_7",
        "name": "Environmental Health",
        "description": "Specialization in environmental health.",
        "skillCount": 10
      },
      {
        "id": "sub_phl_96_8",
        "name": "Health Education",
        "description": "Specialization in health education.",
        "skillCount": 10
      },
      {
        "id": "sub_phl_96_9",
        "name": "Biostatistics",
        "description": "Specialization in biostatistics.",
        "skillCount": 10
      },
      {
        "id": "sub_phl_96_10",
        "name": "Health Systems",
        "description": "Specialization in health systems.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_nut_97",
    "name": "Nutrition",
    "icon": "🥗",
    "color": "#65a30d",
    "description": "Mastery in nutrition for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_nut_97_1",
        "name": "Clinical Nutrition",
        "description": "Specialization in clinical nutrition.",
        "skillCount": 10
      },
      {
        "id": "sub_nut_97_2",
        "name": "Sports Nutrition",
        "description": "Specialization in sports nutrition.",
        "skillCount": 10
      },
      {
        "id": "sub_nut_97_3",
        "name": "Military Nutrition",
        "description": "Specialization in military nutrition.",
        "skillCount": 10
      },
      {
        "id": "sub_nut_97_4",
        "name": "Space Nutrition",
        "description": "Specialization in space nutrition.",
        "skillCount": 10
      },
      {
        "id": "sub_nut_97_5",
        "name": "Pediatric Nutrition",
        "description": "Specialization in pediatric nutrition.",
        "skillCount": 10
      },
      {
        "id": "sub_nut_97_6",
        "name": "Geriatric Nutrition",
        "description": "Specialization in geriatric nutrition.",
        "skillCount": 10
      },
      {
        "id": "sub_nut_97_7",
        "name": "Nutraceuticals",
        "description": "Specialization in nutraceuticals.",
        "skillCount": 10
      },
      {
        "id": "sub_nut_97_8",
        "name": "Diet Planning",
        "description": "Specialization in diet planning.",
        "skillCount": 10
      },
      {
        "id": "sub_nut_97_9",
        "name": "Supplementation",
        "description": "Specialization in supplementation.",
        "skillCount": 10
      },
      {
        "id": "sub_nut_97_10",
        "name": "Metabolic Science",
        "description": "Specialization in metabolic science.",
        "skillCount": 10
      }
    ]
  },
  {
    "id": "cat_spt_98",
    "name": "Sports Science",
    "icon": "🏅",
    "color": "#ea580c",
    "description": "Mastery in sports science for stellar empire command.",
    "subcategories": [
      {
        "id": "sub_spt_98_1",
        "name": "Exercise Physiology",
        "description": "Specialization in exercise physiology.",
        "skillCount": 10
      },
      {
        "id": "sub_spt_98_2",
        "name": "Biomechanics",
        "description": "Specialization in biomechanics.",
        "skillCount": 10
      },
      {
        "id": "sub_spt_98_3",
        "name": "Sport Psychology",
        "description": "Specialization in sport psychology.",
        "skillCount": 10
      },
      {
        "id": "sub_spt_98_4",
        "name": "Performance Analysis",
        "description": "Specialization in performance analysis.",
        "skillCount": 10
      },
      {
        "id": "sub_spt_98_5",
        "name": "Recovery Science",
        "description": "Specialization in recovery science.",
        "skillCount": 10
      },
      {
        "id": "sub_spt_98_6",
        "name": "Training Methods",
        "description": "Specialization in training methods.",
        "skillCount": 10
      },
      {
        "id": "sub_spt_98_7",
        "name": "Nutrition for Sports",
        "description": "Specialization in nutrition for sports.",
        "skillCount": 10
      },
      {
        "id": "sub_spt_98_8",
        "name": "Anti-Doping",
        "description": "Specialization in anti-doping.",
        "skillCount": 10
      },
      {
        "id": "sub_spt_98_9",
        "name": "Equipment Design",
        "description": "Specialization in equipment design.",
        "skillCount": 10
      },
      {
        "id": "sub_spt_98_10",
        "name": "Athletic Performance",
        "description": "Specialization in athletic performance.",
        "skillCount": 10
      }
    ]
  }
];
