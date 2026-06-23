export interface ChapterPrelude {
  chapter: number;
  title: string;
  narrative: string;
  hook: string;
}

export interface FeatureUnlock {
  label: string;
  href: string;
  description: string;
}

export interface ActPrelude {
  act: number;
  title: string;
  subtitle: string;
  epigraph: string;
  narrative: string;
  chapters: ChapterPrelude[];
  closingNote: string;
  unlocks: FeatureUnlock[];
}

export const ACT_FEATURE_UNLOCKS: Array<{ act: number; unlocks: FeatureUnlock[] }> = [
  {
    act: 1,
    unlocks: [
      { label: "Command Center", href: "/empire-command-center", description: "Central hub for empire status and strategic alerts" },
      { label: "Resources", href: "/resources", description: "Track and manage metal, crystal, energy, and reserves" },
      { label: "Facilities", href: "/facilities", description: "Construct and upgrade industrial and research buildings" },
      { label: "Colonies", href: "/colonies", description: "Manage colonization targets and expansion plans" },
    ],
  },
  {
    act: 2,
    unlocks: [
      { label: "Market", href: "/merchants", description: "Trade resources and negotiate with merchant caravans" },
      { label: "Commander", href: "/commander", description: "Customize your commander identity and personal stats" },
      { label: "Empire Profile", href: "/empire-profile", description: "Manage your empire's core attributes and specializations" },
    ],
  },
  {
    act: 3,
    unlocks: [
      { label: "Exploration", href: "/exploration", description: "Run exploration loops and reveal frontier opportunities" },
      { label: "Celestial Browser", href: "/celestial-browser", description: "Inspect stars, planets, and celestial objects" },
      { label: "Biome Codex", href: "/biome-codex", description: "Study biome entries and environmental data" },
      { label: "Research Hub", href: "/research", description: "View research priorities and laboratory output" },
    ],
  },
  {
    act: 4,
    unlocks: [
      { label: "Shipyard", href: "/shipyard", description: "Construct ships and prepare fleets for deployment" },
      { label: "Ship Fitting", href: "/fitting", description: "Customize ship modules, weapons, and equipment" },
      { label: "Fleet Command", href: "/fleet", description: "Dispatch fleets, track missions, and manage formations" },
      { label: "Combat Center", href: "/combat", description: "Engage combat systems and active battle mechanics" },
    ],
  },
  {
    act: 5,
    unlocks: [
      { label: "Government", href: "/government", description: "Review state structure, laws, and governing bonuses" },
      { label: "Factions", href: "/factions", description: "Navigate faction relations and influence networks" },
      { label: "Leaderboard", href: "/leaderboard", description: "Compare empire performance against other players" },
    ],
  },
  {
    act: 6,
    unlocks: [
      { label: "Battle Logs", href: "/battle-logs", description: "Review previous engagements and combat outcomes" },
      { label: "Army", href: "/army", description: "Review land units, formations, and force composition" },
      { label: "Army Management", href: "/army-management", description: "Train, equip, and reorganize planetary armies" },
      { label: "Training Center", href: "/training-center", description: "Unlock training tracks and manage force capacity" },
    ],
  },
  {
    act: 7,
    unlocks: [
      { label: "Stations", href: "/stations", description: "Control orbital stations, outposts, and support platforms" },
      { label: "Megastructures", href: "/megastructures", description: "Develop late-game empire-scale construction projects" },
      { label: "Resource Refineries", href: "/resource-refineries", description: "Convert and refine resources from raw materials" },
      { label: "Power Grid", href: "/power-grid", description: "Generate, transmit, and route power across worlds" },
    ],
  },
  {
    act: 8,
    unlocks: [
      { label: "Interstellar", href: "/interstellar", description: "Explore broader interstellar travel and system links" },
      { label: "Galaxy Map", href: "/galaxy", description: "Browse sector positions, neighbors, and route planning" },
      { label: "Warp Network", href: "/warp-network", description: "Manage travel corridors and inter-system movement" },
      { label: "Spore Drive", href: "/spore-drive", description: "Advanced faster-than-light travel system" },
    ],
  },
  {
    act: 9,
    unlocks: [
      { label: "Alliance", href: "/alliance", description: "Manage alliance structure and cooperative play" },
      { label: "Guilds", href: "/guilds", description: "Organize guild participation and group identity" },
      { label: "Friends", href: "/friends", description: "Track friends and cooperative player lists" },
      { label: "Messages", href: "/messages", description: "Read diplomatic and operational communications" },
    ],
  },
  {
    act: 10,
    unlocks: [
      { label: "Dimensional Anomalies", href: "/dimensional-anomalies", description: "Discover and explore 90 dimensional gate anomalies" },
      { label: "Expeditions", href: "/expeditions", description: "Launch deep-space missions for risk and reward" },
      { label: "Universe View", href: "/universe", description: "Inspect the full universe and long-range spatial context" },
    ],
  },
  {
    act: 11,
    unlocks: [
      { label: "Technology Tree", href: "/technology-tree", description: "Browse upgrade dependencies and long-term tech routes" },
      { label: "Knowledge Library", href: "/knowledge-library", description: "Study mastery tracks and cross-discipline synergies" },
      { label: "Blueprints", href: "/blueprints", description: "Review unlocked designs and production schematics" },
      { label: "Artifacts", href: "/artifacts", description: "Inspect rare artifacts that modify empire capabilities" },
      { label: "Relics", href: "/relics", description: "Manage relic bonuses and rare discovery effects" },
    ],
  },
  {
    act: 12,
    unlocks: [
      { label: "Kardashev Scale", href: "/empire-progression", description: "Track empire advancement through progression tiers" },
      { label: "Civilization Systems", href: "/civilization-systems", description: "Review civilization bonuses and societal traits" },
      { label: "Civilization Mgmt", href: "/civilization-management", description: "Adjust policies and manage civilization development" },
      { label: "Orbital Defense", href: "/orbital-defense", description: "Build offensive satellites, shield platforms, and fortresses" },
      { label: "Planet Occupation", href: "/planet-occupation", description: "Control captured worlds through garrisons and fortifications" },
    ],
  },
];

export function getUnlocksForAct(act: number): FeatureUnlock[] {
  return ACT_FEATURE_UNLOCKS.find((entry) => entry.act === act)?.unlocks ?? [];
}

export const ACT_PRELUDES: ActPrelude[] = [
  {
    act: 1,
    title: "Embers of Origin",
    subtitle: "Chapter I — Colonial Stabilization",
    epigraph: "\"Every empire begins with a single spark in the dark.\"",
    narrative:
      "In the aftermath of the Collapse, the old Terran Confederacy lies in ruins. Fleeing factions scatter across the Orion Arm aboard generation ships and colony transports, chasing rumors of habitable worlds beyond the Reach. You are among the last commanders to depart Terra Prime — carrying with you the final seed vaults, the classified archives of the Confederacy Fleet, and the weight of a civilization that no longer exists.\n\nYour convoy emerges from the slipstream above Veridian-7, a temperate world orbiting a stable K-type star. Sensors confirm breathable atmosphere, fresh water, and mineral deposits sufficient for industrial bootstrap. But the planet is not uninhabited. Automated defense grids from a forgotten expedition still pulse in orbit, and something else — a signal, ancient and deliberate — echoes from deep beneath the southern continent.\n\nAdmiral Vex, your chief strategist, advises caution. \"We have one chance to establish a foothold. If we fail here, there is no second convoy.\" The crew is exhausted. Resources are thin. The first decisions you make on Veridian-7 will determine whether humanity endures — or joins the long silence of extinct civilizations.",
    chapters: [
      {
        chapter: 1,
        title: "First Light",
        narrative:
          "Dawn breaks over Veridian-7 as your dropship descends through layers of copper-colored cloud. The landing zone — a broad river delta surrounded by crystalline forests — is marked by the skeletal remains of an old Confederacy beacon. Your engineering teams deploy atmospheric processors and begin erecting the first habitat modules. Within hours, the colony's basic life-support systems hum to life. The first light of a new civilization flickers against the alien sky.",
        hook: "Establish the colony's first settlement and bring power online.",
      },
      {
        chapter: 2,
        title: "First Resources",
        narrative:
          "The delta's riverbed yields raw metal deposits — oxidized iron and trace lithium — but the real prize lies in the quartz-rich highlands to the north. Mining drones are dispatched, and for the first time, refined materials flow into the fabrication bays. Crystal growth chambers begin producing the optical substrates needed for advanced comms. Every unit of metal and crystal mined is a step away from extinction.",
        hook: "Secure a sustainable resource pipeline to fuel expansion.",
      },
      {
        chapter: 3,
        title: "First Fleet",
        narrative:
          "With materials secured, the shipyard roars to life. The first corvettes — lightweight, fast, designed for patrol and reconnaissance — roll off the assembly line. They are crude by Confederacy standards, but they are yours. As the first formation launches into orbit, Admiral Vex watches from the command deck. \"Now,\" he says, \"we are no longer refugees. We are a nation.\"",
        hook: "Construct your first patrol fleet and establish orbital presence.",
      },
    ],
    closingNote:
      "The colony holds. The fleet patrols. But the ancient signal from the southern continent continues to pulse — patient, unanswered, and growing stronger.",
  },
  {
    act: 2,
    title: "Fractured Alliances",
    subtitle: "Chapter II — Diplomatic Conflict",
    epigraph: "\"Trust is the currency of peace; betrayal is its tax.\"",
    narrative:
      "Three years have passed since the founding of Veridian-7. The colony has grown into a modest stellar nation, its orbital shipyards producing frigates and its research labs decoding fragments of Confederacy science. But peace is fragile.\n\nA convoy from the Kessler Drift — a loose coalition of merchant families and independent operators — arrives in system under the flag of parley. Trade Master Voss, their elected spokesman, proposes a mutual defense pact and shared access to the warp gates discovered in the outer system. It is an attractive offer. The Drift convoy carries rare deuterium reserves and navigational data that would take your engineers decades to compile.\n\nBut Envoy Halden, your diplomatic liaison, intercepts encrypted transmissions from the Drift fleet. They are coordinating with Void Corsair elements — pirates who have been raiding outer colonies for months. The alliance may be genuine, or it may be a trap. Meanwhile, a third faction — the Zyx Collective, a silicon-based hive intelligence — has begun probing Veridian-7's sensor grid. They are curious. They are watching. And they are deciding whether humanity is worth preserving — or erasing.",
    chapters: [
      {
        chapter: 1,
        title: "The Parley",
        narrative:
          "Trade Master Voss docks at the orbital station with a retinue of aides and a cargo hold full of gifts — rare alloys, star charts, and a bottle of synthesized Terran whiskey that predates the Collapse. The negotiations are cordial, even warm. But beneath the pleasantries, each side probes for weakness. Your task is to secure the deuterium reserves without surrendering strategic autonomy.",
        hook: "Navigate the diplomatic summit and secure the trade agreement.",
      },
      {
        chapter: 2,
        title: "Shadows in the Signal",
        narrative:
          "Halden's intelligence team decrypts the Corsair transmissions. The pirates are not merely allied with elements of the Drift — they are embedded within the convoy. The question becomes: does Voss know? Is he complicit, or is he being used? You must decide whether to confront the evidence publicly, risking war, or use it as leverage in private.",
        hook: "Investigate the hidden Corsair presence within the Drift convoy.",
      },
      {
        chapter: 3,
        title: "The Collective's Probe",
        narrative:
          "Zyx probes — small, autonomous, and highly advanced — breach the outer sensor perimeter and begin cataloging Veridian-7's defenses. They do not attack. They simply observe. The Collective's motives are inscrutable: they have annihilated less-developed civilizations and uplifted others. Your response to their surveillance will determine whether the Zyx see humanity as a partner, a curiosity, or a threat.",
        hook: "Respond to the Zyx Collective's incursion without escalating to conflict.",
      },
    ],
    closingNote:
      "The alliances you forge — and the enemies you make — in these first encounters will echo across the galaxy for centuries.",
  },
  {
    act: 3,
    title: "Echoes of the Void",
    subtitle: "Chapter III — Anomaly Incursions",
    epigraph: "\"The void does not sleep. It waits.\"",
    narrative:
      "The ancient signal from Veridian-7's southern continent has changed. What was once a steady pulse has evolved into a complex, modulating frequency — almost like language, but not quite. Dr. Elara Kern, the colony's chief physicist, believes the signal originates from a structure buried kilometers beneath the planet's crust. She calls it the \"Nexus,\" and she is convinced it predates known galactic civilization by millions of years.\n\nThen the anomalies begin. Localized gravity distortions ripple across the colony. Ships in orbit report phantom radar contacts — vessels that match no known configuration. A research team on the southern continent goes silent. When a rescue expedition arrives, they find the team alive but unresponsive, standing in a circle around a newly opened sinkhole, staring into darkness.\n\nOracle Nira, a mysterious figure who arrived with the Zyx delegation, warns that the Nexus is a boundary marker — a seal placed by an ancient civilization to keep something contained. \"You have disturbed a lock,\" she says. \"And the thing behind it is now awake.\"",
    chapters: [
      {
        chapter: 1,
        title: "The Signal Shifts",
        narrative:
          "Dr. Kern's instruments confirm what the colony has feared: the signal is accelerating. Each pulse carries more information, more energy. Electromagnetic interference disrupts communications across the southern hemisphere. Your scientists race to decode the signal's structure before it overwhelms the colony's shielding.",
        hook: "Analyze the evolving signal and protect the colony from interference.",
      },
      {
        chapter: 2,
        title: "The Sinkhole",
        narrative:
          "Beneath the southern continent, the sinkhole reveals a vast subterranean chamber — walls covered in geometric patterns that glow with bioluminescent energy. The rescue team's leader, once recovered, describes visions: a civilization of immense power, a war fought across dimensions, and a prison built to hold the vanquished. The chamber is the anteroom of the Nexus.",
        hook: "Explore the sinkhole chamber and decipher the ancient inscriptions.",
      },
      {
        chapter: 3,
        title: "The Breach",
        narrative:
          "The Nexus activates. A column of light erupts from the sinkhole, piercing the atmosphere and visible from orbit. Within the light, shapes move — vast, geometric, alien. The seal is breaking. Oracle Nira reveals that the only way to reseal the Nexus is to interface with its core system, a task that requires a technology humanity does not possess. Unless you can find it — fast.",
        hook: "Race to reseal the Nexus before the breach consumes the colony.",
      },
    ],
    closingNote:
      "The Nexus falls silent, but its final transmission carries a warning: you are not the first to find it, and you will not be the last.",
  },
  {
    act: 4,
    title: "Siege of the Rift",
    subtitle: "Chapter IV — Multi-Front War",
    epigraph: "\"In war, the front is everywhere.\"",
    narrative:
      "The activation of the Nexus has drawn attention — and not all of it is friendly. The energy surge was detectable across the sector, and factions that had previously ignored Veridian-7 now see it as either a threat or an opportunity.\n\nThe Void Corsairs, emboldened by their intelligence operatives within the Drift, launch a coordinated strike against the colony's outer mining stations. Simultaneously, the Zyx Collective — alarmed by the Nexus breach — mobilizes a fleet to \"sterilize\" the planet, convinced that humanity cannot be trusted with ancient technology. Marshal Vex, your military commander, faces an impossible calculus: fight on two fronts, or negotiate with one enemy while destroying the other.\n\nThe colony's fleet — now grown to a respectable force of corvettes, frigates, and a single heavy cruiser — is stretched to its limit. Every decision carries the weight of extinction.",
    chapters: [
      {
        chapter: 1,
        title: "Corsair Assault",
        narrative:
          "The Void Corsairs strike at dawn — a swarm of fast attack craft and boarding shuttles targeting the outer asteroid mining belt. Your garrison forces are outnumbered three to one. The battle for Station Kappa begins in the corridors of a converted mining rig, where every room becomes a chokepoint.",
        hook: "Defend the mining stations against the Corsair onslaught.",
      },
      {
        chapter: 2,
        title: "The Collective's Ultimatum",
        narrative:
          "A Zyx diplomatic drone arrives with an ultimatum: surrender the Nexus technology and submit to Collective oversight, or face planetary sterilization. The Zyx fleet — a formation of geometric warships that dwarf anything in your arsenal — holds position at the system's edge. You have seventy-two hours.",
        hook: "Respond to the Zyx ultimatum while managing the ongoing Corsair threat.",
      },
      {
        chapter: 3,
        title: "The Counterstrike",
        narrative:
          "Marshal Vex proposes a desperate plan: use the Nexus energy residue to power a single devastating strike against the Corsair fleet, then leverage the demonstration to renegotiate with the Zyx. It is a gamble. If the Nexus energy cannot be controlled, the weapon could consume your own ships. If the Zyx do not respond to displays of force with diplomacy, the colony is lost.",
        hook: "Execute the counterstrike and attempt to break the siege.",
      },
    ],
    closingNote:
      "The siege is broken, but at great cost. The galaxy has learned that Veridian-7 will not fall easily — and that lesson carries consequences.",
  },
  {
    act: 5,
    title: "Crown of the Stars",
    subtitle: "Chapter V — Endgame Sovereignty",
    epigraph: "\"Sovereignty is not given. It is taken, and defended, and lived.\"",
    narrative:
      "In the aftermath of the siege, Veridian-7 has earned something rare in the post-Collapse galaxy: respect. The Zyx Collective, impressed by humanity's resilience, offers a formal non-aggression pact. The Corsairs, defeated but not destroyed, retreat to the outer rim. The Merchant Guilds, sensing opportunity, flood the system with trade proposals.\n\nBut respect is not sovereignty. The galactic community — such as it is — recognizes no new nations. To earn a seat among the established powers, Veridian-7 must demonstrate civilizational maturity: a functioning government, a stable economy, military self-sufficiency, and a contribution to collective knowledge.\n\nRegent Solari, the colony's elected leader, convenes the First Congress. The delegates debate the future: should Veridian-7 model itself after the old Confederacy, or forge something new? The answer will shape not just a colony, but a civilization.",
    chapters: [
      {
        chapter: 1,
        title: "The First Congress",
        narrative:
          "Representatives from every settlement, station, and fleet element gather in the Veridian Hall — a converted cargo bay, now draped in banners and illuminated by holographic displays showing the colony's growth. The debates are fierce. Some advocate military expansion; others call for scientific isolationism. Regent Solari holds the floor with quiet authority.",
        hook: "Navigate the First Congress and establish the colony's governmental framework.",
      },
      {
        chapter: 2,
        title: "The Economic Foundation",
        narrative:
          "With government established, attention turns to economy. The Merchant Guilds propose a trade corridor linking Veridian-7 to the wider galactic market. But the terms are favorable to the Guilds, not the colony. Your economic advisors urge you to build independent trade capacity — but that requires ships, infrastructure, and time you may not have.",
        hook: "Build the economic infrastructure needed for galactic trade.",
      },
      {
        chapter: 3,
        title: "The Sovereignty Declaration",
        narrative:
          "After months of preparation, Regent Solari stands before the Galactic Council — a body of the galaxy's established powers — and formally declares Veridian-7 a sovereign state. The declaration is met with silence, then murmurs, then a single voice of dissent from the Void Corsair delegation. The vote is called.",
        hook: "Secure recognition of Veridian-7's sovereignty before the Galactic Council.",
      },
    ],
    closingNote:
      "The Council votes. The colony is no longer a colony. It is a nation — small, young, and determined.",
  },
  {
    act: 6,
    title: "Veil of Mirrors",
    subtitle: "Chapter VI — Espionage and Counter-Intelligence",
    epigraph: "\"The most dangerous weapon is the truth, distorted.\"",
    narrative:
      "Sovereignty has brought recognition — and enemies. Cipher Yva, head of Veridian-7's nascent intelligence service, reports alarming developments: a mole within the Congress, feeding classified Nexus research to an unknown recipient. Simultaneously, deep-cover agents in the Merchant Guilds report that several trade agreements have been quietly rewritten to extract Veridian-7's technological secrets.\n\nThe galaxy's powers have decided that Veridian-7's Nexus access is too valuable — and too dangerous — to remain in human hands. Espionage, sabotage, and disinformation campaigns target the colony from every direction. Cipher Yva must build a counter-intelligence apparatus from scratch, while you navigate a web of deception where every ally may be a spy and every enemy may be telling the truth.",
    chapters: [
      {
        chapter: 1,
        title: "The Mole Hunt",
        narrative:
          "Cipher Yva presents her findings: three suspects within the Congress, each with access to classified Nexus data. The evidence is circumstantial, the stakes are existential. You must identify the traitor before they transmit the next batch of secrets — but a wrong accusation could shatter the fragile political unity you've built.",
        hook: "Identify and neutralize the mole within the Congress.",
      },
      {
        chapter: 2,
        title: "The Disinformation Web",
        narrative:
          "False reports flood the colony's intelligence channels: phantom fleet movements, fabricated diplomatic communications, planted evidence of military buildup. The purpose is chaos — to overwhelm your analysts and obscure the real threats. Yva proposes a counter-operation: feed disinformation back through the compromised channels to trace the source.",
        hook: "Trace and disrupt the disinformation network targeting Veridian-7.",
      },
      {
        chapter: 3,
        title: "The Double Agent",
        narrative:
          "The mole hunt leads to an unexpected conclusion: one of the suspects is not a traitor, but a double agent — working for you while pretending to work for the enemy. The revelation changes everything. The double agent offers to lead you to the puppet master, but the operation will require sacrificing a valuable intelligence asset.",
        hook: "Leverage the double agent to expose the true architect of the espionage campaign.",
      },
    ],
    closingNote:
      "The veil lifts, but the face behind it is not what you expected. The real game has only just begun.",
  },
  {
    act: 7,
    title: "Iron Communion",
    subtitle: "Chapter VII — Industrial Mobilization",
    epigraph: "\"Steel builds empires. Will sustains them.\"",
    narrative:
      "The espionage crisis has revealed a deeper truth: Veridian-7's industrial capacity is insufficient for the threats it faces. The colony's shipyards can produce corvettes and frigates, but the galaxy's major powers deploy dreadnoughts, carriers, and weapons platforms that dwarf anything in your fleet. To survive, you must industrialize — rapidly, massively, and at a scale that pushes your civilization to its limits.\n\nWarden Torin, the colony's chief industrialist, proposes the Iron Communion: a coordinated mobilization of every factory, mine, refinery, and fabrication facility in the system. It will require sacrifices — rationing, forced labor shifts, the conversion of civilian infrastructure to military production. But without it, Veridian-7 will remain a minor power in a galaxy of titans.\n\nThe debate fractures the Congress. Some delegates call it tyranny. Others call it survival. You must decide.",
    chapters: [
      {
        chapter: 1,
        title: "The Mobilization Decree",
        narrative:
          "Warden Torin presents the industrial blueprint: a network of orbital foundries, deep-core mines, and automated fabrication lines capable of producing capital ships within a decade. The cost is staggering — three years of total economic mobilization. The Congress votes, narrowly, in favor. Now the work begins.",
        hook: "Implement the industrial mobilization and establish the orbital foundry network.",
      },
      {
        chapter: 2,
        title: "The Resource Crisis",
        narrative:
          "The mobilization devours raw materials at a rate that exceeds projections. Deuterium reserves dwindle. Crystal growth chambers are pushed beyond safe limits. A mining accident on Veridian-7's largest nickel deposit kills dozens and halts production for weeks. Torin demands more. The planet gives less.",
        hook: "Resolve the resource crisis without halting industrial production.",
      },
      {
        chapter: 3,
        title: "The First Capital Ship",
        narrative:
          "After months of relentless effort, the first capital ship — the ironclad cruiser *Veridian's Resolve* — rolls out of the orbital foundry. It is massive, heavily armed, and crewed by the colony's finest. As it takes its position in the fleet formation, the colony watches from every screen, every window, every observation deck. It is more than a ship. It is proof that Veridian-7 can stand among the stars.",
        hook: "Commission the first capital ship and demonstrate Veridian-7's industrial might.",
      },
    ],
    closingNote:
      "The foundries burn bright. The fleet grows. But in the outer dark, something ancient has taken notice of the new fire in the galaxy.",
  },
  {
    act: 8,
    title: "Tides of Helios",
    subtitle: "Chapter VIII — Deep-Space Naval Campaigns",
    epigraph: "\"The void between stars is not empty. It is a battlefield.\"",
    narrative:
      "With a fleet capable of projecting power beyond the home system, Veridian-7 faces a new challenge: the outer frontier. Deep-space surveys reveal a network of wormhole gates — ancient structures, possibly related to the Nexus — connecting distant regions of the galaxy. Control of these gates means control of interstellar travel itself.\n\nBut the gates are contested. The Void Corsairs have established a foothold around the Helios Gate, the most stable and strategically vital of the wormhole network. Admiral Zeph, your fleet commander, proposes a campaign to seize the gate — a campaign that will require every ship, every crew, and every tactical advantage you possess.\n\nThe Tides of Helios have begun.",
    chapters: [
      {
        chapter: 1,
        title: "Operation Gatebreak",
        narrative:
          "Admiral Zeph's battle plan unfolds in three phases: a feint to draw the Corsair screen away from the gate, a concentrated strike by the capital ship group, and a boarding action to seize the gate's control systems. The operation begins at the edge of the Helios system, where your fleet emerges from slipspace in formation.",
        hook: "Execute the opening phase of the Helios Gate assault.",
      },
      {
        chapter: 2,
        title: "The Corsair Counterattack",
        narrative:
          "The Corsairs anticipated the assault. Their hidden reserves — a fleet of heavy cruisers and destroyer escorts — spring from concealment behind the system's asteroid belt. The battle devolves into a chaotic melee, ship-to-ship, weapon-to-weapon. The *Veridian's Resolve* takes heavy damage but holds the line.",
        hook: "Survive the Corsair counterattack and maintain fleet cohesion.",
      },
      {
        chapter: 3,
        title: "Seizing the Gate",
        narrative:
          "In the battle's final hours, a marine boarding team led by Commander Ryla breaches the Corsair-held gate station. The fighting is brutal — corridor by corridor, module by module. When the dust settles, Veridian-7's flag flies over the Helios Gate. The gateway to the wider galaxy is open.",
        hook: "Complete the capture of the Helios Gate and secure interstellar access.",
      },
    ],
    closingNote:
      "The Helios Gate activates under Veridian-7 control. On the other side, entire civilizations await — some friendly, some hostile, and some that have been waiting for this moment for millennia.",
  },
  {
    act: 9,
    title: "Ashen Tribunal",
    subtitle: "Chapter IX — Civil Unrest and Tribunal Politics",
    epigraph: "\"Justice is the foundation. Without it, every wall crumbles.\"",
    narrative:
      "Victory in the Helios campaign has brought spoils — and resentment. Colonists who bore the brunt of the Iron Communion's sacrifices demand reparations. Fleet veterans, wounded and forgotten, stage protests in the orbital stations. A faction within the Congress, led by Magistrate Kheir, calls for a tribunal to investigate war crimes — specifically, the civilian casualties during the Corsair siege of Station Kappa.\n\nThe tribunal is politically motivated, designed to undermine the military's influence and shift power toward the civilian judiciary. But the accusations are not entirely baseless. During the siege, a Corsair prisoner was executed without trial — an act that, while tactically justified, violated the colony's own emerging legal code.\n\nYou must navigate the tribunal without destroying the unity you've built — or the principles you're fighting for.",
    chapters: [
      {
        chapter: 1,
        title: "The Tribunal Convenes",
        narrative:
          "Magistrate Kheir opens the proceedings with a blistering indictment: the military's reckless tactics, the unauthorized execution, the suppression of dissent during the Iron Communion. The courtroom — a repurposed hangar bay, filled with delegates, journalists, and citizens — erupts. Your chief of staff is named as a defendant.",
        hook: "Navigate the tribunal proceedings and defend the military's actions.",
      },
      {
        chapter: 2,
        title: "The Public Unrest",
        narrative:
          "Outside the tribunal, protests turn violent. Orbital station workers blockade supply routes. A faction of enlisted marines refuses orders, demanding their comrades be exonerated. The colony's fragile social fabric threatens to tear. Cipher Yva reports that foreign intelligence services are funding the unrest.",
        hook: "Restore public order while the tribunal proceeds.",
      },
      {
        chapter: 3,
        title: "The Verdict",
        narrative:
          "After weeks of testimony, Magistrate Kheir delivers the verdict: the execution was unlawful, but the military's broader actions during the siege were justified. The chief of staff is censured but not removed. The verdict satisfies no one completely — which, perhaps, is the mark of true justice. Kheir approaches you privately. \"This was never about punishment,\" she says. \"It was about precedent.\"",
        hook: "Accept the tribunal's ruling and rebuild institutional trust.",
      },
    ],
    closingNote:
      "The tribunal closes. The colony emerges wounded but intact — and with a legal framework that will serve it for generations.",
  },
  {
    act: 10,
    title: "Stormline Ascendant",
    subtitle: "Chapter X — Frontier Expansion Under Hostile Skies",
    epigraph: "\"The frontier is not a place. It is a choice.\"",
    narrative:
      "With internal stability restored, Veridian-7 turns outward. Pathfinder Ryl, the colony's chief explorer, identifies a cluster of habitable worlds beyond the Helios Gate — the Stormline, a region of space battered by electromagnetic storms that make conventional navigation nearly impossible. But within the storms lie resources, strategic positions, and — according to Ryl's charts — the remains of an ancient shipyard.\n\nThe Stormline is contested territory. The Zyx Collective claims sovereignty over its inner worlds. The Merchant Guilds control its trade routes. And something else — something that moves within the storms themselves — has been detected by long-range sensors. An intelligence. Old. Patient. Watching.\n\nRyl presents the colonization proposal: establish a network of outpost stations within the Stormline, secure access to the ancient shipyard, and assert Veridian-7's presence before the region is claimed by others. The Congress approves — reluctantly. The risks are immense. The rewards, potentially civilization-defining.",
    chapters: [
      {
        chapter: 1,
        title: "Into the Storm",
        narrative:
          "Ryl's expedition fleet — six fast couriers equipped with storm-penetrating shields — enters the Stormline. The electromagnetic chaos plays havoc with sensors and communications. Navigation becomes a matter of instinct and dead reckoning. After three days of blind flying, the fleet emerges into a pocket of calm: a star system with two habitable moons and a derelict station orbiting a gas giant.",
        hook: "Navigate the Stormline and establish the first forward outpost.",
      },
      {
        chapter: 2,
        title: "The Ancient Shipyard",
        narrative:
          "Ryl's team boards the derelict station and discovers its true nature: not a shipyard, but a construction archive. Vast databanks contain blueprints for technologies humanity has never imagined — energy shields that could protect entire planets, drives that fold space itself, weapons that could sterilize a star system. The data is intact. The question is whether to use it.",
        hook: "Investigate the ancient shipyard and secure its technological archives.",
      },
      {
        chapter: 3,
        title: "The Stormline Claim",
        narrative:
          "As Ryl establishes outposts, Zyx Collective ships arrive in force. They demand withdrawal, citing their sovereignty claim. But Ryl has the ancient shipyard data — and the technological leverage it provides. The negotiation is tense. For the first time, Veridian-7 negotiates not as a supplicant, but as a peer.",
        hook: "Negotiate the Stormline boundaries with the Zyx Collective.",
      },
    ],
    closingNote:
      "The Stormline falls under joint jurisdiction. The ancient blueprints are secured. And the intelligence in the storms — whatever it is — has not revealed itself. Yet.",
  },
  {
    act: 11,
    title: "Shattered Zenith",
    subtitle: "Chapter XI — Ancient Superweapon Race",
    epigraph: "\"Power that can destroy a world is power that can end a galaxy.\"",
    narrative:
      "The ancient shipyard's blueprints include a single entry marked with symbols no one can decipher — except Dr. Kern, who has spent years studying the Nexus. She identifies the symbols as warnings: the blueprints describe a weapon platform of extraordinary power, capable of projecting force across light-years. The ancient civilization that built the Nexus also built this weapon — and then destroyed it, scattering its components across the galaxy.\n\nNow, someone is reassembling it. Fragmented intelligence from Cipher Yva's network reveals that the Void Corsairs, the Zyx Collective, and at least one unknown faction are racing to collect the weapon components. If any single power assembles the weapon, the balance of the galaxy collapses overnight.\n\nHighseer Vale, an ancient figure who claims to have been a guardian of the original weapon's destruction, arrives at Veridian-7 with a proposal: join the race, secure the components, and ensure the weapon is never used. It is the only option. The alternative is to let it fall into the hands of those who would wield it.",
    chapters: [
      {
        chapter: 1,
        title: "The Scattering",
        narrative:
          "Vale provides coordinates for the first component: a fragment buried in the core of a dying star in the Corsair-controlled outer rim. The retrieval mission requires a specially shielded vessel and a crew willing to fly into a stellar inferno. The *Veridian's Resolve*, now repaired and upgraded with Stormline-derived shielding, is chosen for the mission.",
        hook: "Retrieve the first weapon component from the dying star.",
      },
      {
        chapter: 2,
        title: "The Race",
        narrative:
          "Intelligence confirms that the Zyx Collective has located a second component in the deep void between galaxies — a region of absolute darkness and cold. The Collective dispatches a fleet of autonomous probes. You must reach the third component — hidden in the ruins of a dead civilization on the far side of the Stormline — before they consolidate their advantage.",
        hook: "Compete against the Zyx Collective to secure the remaining components.",
      },
      {
        chapter: 3,
        title: "The Assembly",
        narrative:
          "Three components secured. The weapon platform could be assembled — but doing so would mean wielding power that could reshape the galaxy. Vale urges destruction. Kern urges study. The Congress is divided. The decision falls to you: forge the ultimate deterrent, or ensure it never exists?",
        hook: "Decide the fate of the ancient superweapon components.",
      },
    ],
    closingNote:
      "The components are sealed in a vault beneath Veridian-7, guarded by the most powerful security systems the colony can devise. The weapon exists — but it will not be used. Not today.",
  },
  {
    act: 12,
    title: "Dominion Eternal",
    subtitle: "Chapter XII — Final Convergence and Galactic Rule",
    epigraph: "\"Dominion is not domination. It is stewardship of the stars.\"",
    narrative:
      "Decades have passed since the founding of Veridian-7. The colony is now the capital of a interstellar nation spanning dozens of systems, its fleet the strongest in the sector, its technology the envy of the galaxy. But the ancient intelligence detected in the Stormline has finally revealed itself — and it changes everything.\n\nSovereign Ardent, an entity of pure energy that claims to be the last surviving member of the civilization that built the Nexus and the weapon platform, arrives in system. It does not threaten. It does not bargain. It simply states a fact: the seal on the Nexus was never meant to contain a prisoner. It was meant to contain a seed — the origin point of all galactic life. The Nexus is the cradle of civilization, and Veridian-7 is its newest guardian.\n\nThe responsibility is immense. Every faction in the galaxy — human, Zyx, Corsair, Merchant, and all the others — must accept a shared stewardship or risk the destruction of the very foundation of life. It is the ultimate diplomatic challenge: uniting a galaxy not against a common enemy, but around a common purpose.",
    chapters: [
      {
        chapter: 1,
        title: "The Sovereign's Revelation",
        narrative:
          "Ardent projects its consciousness into the Veridian Hall, filling the chamber with light and ancient memory. It shows the delegates the history of the galaxy — the rise and fall of civilizations, the wars fought over the Nexus, the countless species that have emerged from its seed. Humanity is not special. But humanity is here, now, and the choice of what comes next is yours.",
        hook: "Absorb the Sovereign's revelation and prepare for the galactic summit.",
      },
      {
        chapter: 2,
        title: "The Galactic Summit",
        narrative:
          "Delegates from every known civilization gather on Veridian-7 for the first Galactic Summit. The Zyx Collective sends its Nexus. The Merchant Guilds send Trade Master Voss, aged but sharp. Even the Void Corsairs send a representative. The debates are epic — spanning days, touching every grievance, every ambition, every fear. But the Nexus cannot wait forever.",
        hook: "Lead the Galactic Summit toward a unified galactic charter.",
      },
      {
        chapter: 3,
        title: "Eternal Stewardship",
        narrative:
          "The charter is signed. Every civilization accepts shared guardianship of the Nexus. Veridian-7, as the closest civilization to the cradle, is designated the primary steward — a role that carries honor, responsibility, and the certainty that future challenges will dwarf anything yet faced. Sovereign Ardent, its mission complete, dissolves into the Nexus, returning to the seed from which all life emerged.\n\nThe galaxy is not perfect. It is not peaceful. But it is united in purpose — and for the first time since the Collapse, the future is not a threat. It is a promise.",
        hook: "Establish the framework for Eternal Stewardship and conclude the campaign.",
      },
    ],
    closingNote:
      "The stars burn bright. The Nexus pulses with ancient life. And in the Veridian system, a civilization that began with a single spark now tends the flame of all galactic existence. The dominion is eternal — not because it is absolute, but because it is shared.",
  },
];

export function getActPrelude(act: number): ActPrelude | undefined {
  return ACT_PRELUDES.find((prelude) => prelude.act === act);
}

export function getChapterPrelude(act: number, chapter: number): ChapterPrelude | undefined {
  const actPrelude = getActPrelude(act);
  return actPrelude?.chapters.find((ch) => ch.chapter === chapter);
}
