#!/usr/bin/env node
const fs = require('fs');

const CLASSES = [
  {
    id: 'warlord', name: 'Warlord', icon: '\u2694\uFE0F', color: '#dc2626',
    subclasses: [
      { id: 'warlord_vanguard', name: 'Vanguard', icon: '\uD83D\uDD25', desc: 'Frontline assault specialist with maximum damage output.', prefix: 'wv', nodes: [
        {n:'Blade Initiate',s:'weaponDamage',d:'+10% weapon damage',i:'\u2694\uFE0F',t:1,l:10,p:1,r:'normal',x:0,y:0},
        {n:'Fire Discipline',s:'weaponSpeed',d:'+8% weapon speed',i:'\uD83C\uDFAF',t:5,l:50,p:1,r:'normal',x:1,y:0,pr:['wv_1']},
        {n:'Critical Eye',s:'weaponCritChance',d:'+5% crit chance',i:'\uD83D\uDC41\uFE0F',t:10,l:100,p:1,r:'normal',x:2,y:0,pr:['wv_2']},
        {n:'Rending Strikes',s:'weaponCritDamage',d:'+25% crit damage',i:'\uD83D\uDCA5',t:20,l:200,p:3,r:'notable',x:3,y:0,pr:['wv_3']},
        {n:'Energy Surge',s:'energyWeapons',d:'+15% energy damage',i:'\u26A1',t:15,l:150,p:2,r:'normal',x:2,y:1,pr:['wv_3']},
        {n:'Kinetic Impact',s:'kineticWeapons',d:'+15% kinetic damage',i:'\uD83D\uDD29',t:15,l:150,p:2,r:'normal',x:2,y:2,pr:['wv_3']},
        {n:'Explosive Payload',s:'explosiveWeapons',d:'+20% explosive damage',i:'\uD83D\uDCA3',t:18,l:180,p:2,r:'normal',x:3,y:1,pr:['wv_3']},
        {n:'Beam Focusing',s:'beamWeapons',d:'+18% beam damage',i:'\uD83D\uDD26',t:18,l:180,p:2,r:'normal',x:3,y:2,pr:['wv_3']},
        {n:'Precision Targeting',s:'weaponRange',d:'+12% weapon range',i:'\uD83D\uDD2D',t:25,l:250,p:3,r:'normal',x:4,y:0,pr:['wv_4']},
        {n:'War Fury',s:'weaponDamage',d:'+20% weapon damage below 50% hull',i:'\uD83D\uDE21',t:40,l:400,p:5,r:'keystone',x:4,y:1,pr:['wv_4','wv_5']},
        {n:'Volley Fire',s:'weaponSpeed',d:'+15% fire rate',i:'\uD83D\uDD2B',t:30,l:300,p:3,r:'normal',x:4,y:2,pr:['wv_4']},
        {n:'Critical Mastery',s:'weaponCritDamage',d:'+30% crit damage',i:'\uD83D\uDC80',t:35,l:350,p:4,r:'notable',x:5,y:0,pr:['wv_3','wv_4']},
        {n:'Devastating Blows',s:'weaponDamage',d:'+25% weapon damage',i:'\uD83D\uDCA5',t:45,l:450,p:5,r:'normal',x:5,y:1,pr:['wv_10']},
        {n:'Siege Breaker',s:'weaponDamage',d:'+35% damage to structures',i:'\uD83C\uDFF0',t:50,l:500,p:5,r:'normal',x:5,y:2,pr:['wv_10']},
        {n:'Armor Piercing',s:'weaponDamage',d:'+20% armor penetration',i:'\uD83C\uDFAF',t:55,l:550,p:5,r:'normal',x:6,y:2,pr:['wv_14']},
        {n:'Infinite Arsenal',s:'weaponDamage',d:'+40% all weapon damage',i:'\uD83D\uDD25',t:70,l:700,p:8,r:'keystone',x:6,y:1,pr:['wv_10','wv_12']},
        {n:'Annihilation Protocol',s:'weaponCritDamage',d:'+50% crit damage, +15% crit chance',i:'\u2620\uFE0F',t:80,l:800,p:12,r:'ascendancy',x:6,y:0,pr:['wv_12']},
        {n:'Titan Slayer',s:'weaponDamage',d:'+45% damage to bosses',i:'\uD83D\uDC09',t:75,l:750,p:10,r:'notable',x:7,y:1,pr:['wv_16']},
        {n:'Warlord\'s Wrath',s:'weaponDamage',d:'+60% weapon damage, +25% crit',i:'\uD83D\uDC51',t:90,l:900,p:15,r:'ascendancy',x:7,y:0,pr:['wv_17']},
      ]},
      { id: 'warlord_berserker', name: 'Berserker', icon: '\uD83E\uDE78', desc: 'Risk-taking combatant who gains power from damage taken.', prefix: 'wb', nodes: [
        {n:'Bloodlust',s:'weaponDamage',d:'+12% damage per 10% missing hull',i:'\uD83E\uDE78',t:1,l:10,p:1,r:'normal',x:0,y:0},
        {n:'Thick Skin',s:'armorValue',d:'+15% armor value',i:'\uD83D\uDEE1\uFE0F',t:5,l:50,p:1,r:'normal',x:1,y:0,pr:['wb_1']},
        {n:'Explosive Mastery',s:'explosiveWeapons',d:'+20% explosive weapon damage',i:'\uD83D\uDCA3',t:10,l:100,p:1,r:'normal',x:2,y:0,pr:['wb_2']},
        {n:'Last Stand',s:'hullHp',d:'+20% hull HP, cannot die for 3s once',i:'\uD83D\uDC80',t:25,l:250,p:3,r:'notable',x:3,y:0,pr:['wb_3']},
        {n:'Damage Return',s:'damageReduction',d:'Reflect 8% of incoming damage',i:'\uD83D\uDD04',t:15,l:150,p:2,r:'normal',x:2,y:1,pr:['wb_3']},
        {n:'Berserker\'s Blood',s:'weaponDamage',d:'+15% weapon damage per 10% missing HP',i:'\uD83E\uDE78',t:30,l:300,p:3,r:'normal',x:3,y:1,pr:['wb_3']},
        {n:'Unyielding',s:'hullHp',d:'+25% hull HP, +15% health regen',i:'\uD83D\uDCAA',t:35,l:350,p:4,r:'normal',x:3,y:2,pr:['wb_3']},
        {n:'Pain Tolerance',s:'damageReduction',d:'+15% damage reduction',i:'\uD83D\uDEE1\uFE0F',t:20,l:200,p:2,r:'normal',x:4,y:1,pr:['wb_3']},
        {n:'Rage Engine',s:'weaponDamage',d:'+1% damage per second in combat (max 30%)',i:'\uD83D\uDD25',t:45,l:450,p:5,r:'keystone',x:4,y:0,pr:['wb_4']},
        {n:'Blood Frenzy',s:'weaponSpeed',d:'+20% fire rate below 30% HP',i:'\u26A1',t:40,l:400,p:5,r:'notable',x:5,y:1,pr:['wb_9']},
        {n:'Undying Will',s:'hullHp',d:'+35% hull HP, revive once per battle',i:'\uD83C\uDFF4',t:50,l:500,p:5,r:'normal',x:5,y:0,pr:['wb_4']},
        {n:'Crimson Armor',s:'armorValue',d:'+30% armor, +20% damage reduction',i:'\uD83D\uDD34',t:55,l:550,p:5,r:'normal',x:5,y:2,pr:['wb_4']},
        {n:'Death Wish',s:'weaponDamage',d:'+50% damage below 20% HP',i:'\u2620\uFE0F',t:60,l:600,p:8,r:'keystone',x:6,y:0,pr:['wb_11']},
        {n:'Adrenaline Rush',s:'weaponSpeed',d:'+30% fire rate, +20% crit chance',i:'\uD83D\uDC89',t:65,l:650,p:8,r:'normal',x:6,y:1,pr:['wb_10']},
        {n:'Blood Storm',s:'weaponDamage',d:'+40% AoE damage',i:'\uD83C\uDF2A\uFE0F',t:70,l:700,p:8,r:'normal',x:6,y:2,pr:['wb_12']},
        {n:'Deathless Rage',s:'weaponDamage',d:'+40% damage, +30% speed below 20% hull',i:'\u2620\uFE0F',t:85,l:850,p:12,r:'ascendancy',x:7,y:0,pr:['wb_13']},
        {n:'Rampage',s:'weaponDamage',d:'+25% damage per kill in battle',i:'\uD83D\uDD25',t:75,l:750,p:10,r:'normal',x:7,y:2,pr:['wb_14']},
        {n:'Immortal Berserker',s:'weaponDamage',d:'+80% all damage, immune to death once',i:'\uD83D\uDC51',t:95,l:950,p:15,r:'ascendancy',x:7,y:1,pr:['wb_16']},
        {n:'Berserker\'s Legacy',s:'weaponDamage',d:'+60% weapon damage, +30% crit',i:'\uD83C\uDFC6',t:99,l:999,p:20,r:'ascendancy',x:8,y:1,pr:['wb_18']},
      ]},
      { id: 'warlord_tactician', name: 'Tactician', icon: '\uD83D\uDCCB', desc: 'Fleet commander who empowers allied ships.', prefix: 'wt', nodes: [
        {n:'Command Presence',s:'fleetCommandRange',d:'+10% fleet command range',i:'\uD83D\uDCE1',t:1,l:10,p:1,r:'normal',x:0,y:0},
        {n:'Beam Focus',s:'beamWeapons',d:'+15% beam weapon damage',i:'\uD83D\uDD26',t:5,l:50,p:1,r:'normal',x:1,y:0,pr:['wt_1']},
        {n:'Targeting Array',s:'targetingSpeed',d:'+20% targeting, +10% scan',i:'\uD83C\uDFAF',t:10,l:100,p:1,r:'normal',x:2,y:0,pr:['wt_2']},
        {n:'EW Resistance',s:'electronicWarfare',d:'+25% EW resistance',i:'\uD83D\uDEE1\uFE0F',t:15,l:150,p:2,r:'normal',x:2,y:1,pr:['wt_3']},
        {n:'Morale Boost',s:'crewEfficiency',d:'+15% crew efficiency for allies',i:'\u2728',t:25,l:250,p:3,r:'normal',x:3,y:1,pr:['wt_3']},
        {n:'Fleet Commander',s:'weaponDamage',d:'All allies +10% weapon damage',i:'\u2B50',t:30,l:300,p:3,r:'notable',x:3,y:0,pr:['wt_3']},
        {n:'Tactical Genius',s:'weaponDamage',d:'+20% damage to targets below 50% HP',i:'\uD83E\uDDE0',t:35,l:350,p:4,r:'normal',x:3,y:2,pr:['wt_3']},
        {n:'Scan Enhancement',s:'sensorStrength',d:'+20% sensor strength',i:'\uD83D\uDCE1',t:20,l:200,p:2,r:'normal',x:4,y:1,pr:['wt_3']},
        {n:'Fleet Coordination',s:'weaponSpeed',d:'+15% fire rate for all allies',i:'\uD83D\uDCE1',t:40,l:400,p:5,r:'normal',x:5,y:1,pr:['wt_7']},
        {n:'Synergy Matrix',s:'weaponDamage',d:'+2% damage per ally in fleet (max 10)',i:'\uD83D\uDD17',t:50,l:500,p:5,r:'keystone',x:4,y:0,pr:['wt_6']},
        {n:'Strategic Withdrawal',s:'avoidance',d:'+20% fleet evasion',i:'\uD83D\uDCA8',t:45,l:450,p:5,r:'normal',x:5,y:0,pr:['wt_9']},
        {n:'Combat Medic',s:'repairAmount',d:'+20% repair for all allies',i:'\uD83D\uDC9A',t:55,l:550,p:5,r:'normal',x:5,y:2,pr:['wt_7']},
        {n:'Grand Strategy',s:'weaponDamage',d:'+30% all damage, +20% fleet speed',i:'\uD83D\uDC51',t:60,l:600,p:8,r:'keystone',x:6,y:0,pr:['wt_11']},
        {n:'Tactical Supremacy',s:'weaponDamage',d:'+25% first strike damage',i:'\u26A1',t:65,l:650,p:8,r:'normal',x:6,y:1,pr:['wt_10']},
        {n:'Fleet Support',s:'crewEfficiency',d:'+30% crew efficiency',i:'\uD83D\uDC65',t:70,l:700,p:8,r:'normal',x:6,y:2,pr:['wt_12']},
        {n:'Grand Strategist',s:'weaponDamage',d:'+25% all damage, +15% speed',i:'\uD83C\uDFC6',t:90,l:900,p:12,r:'ascendancy',x:7,y:0,pr:['wt_13']},
        {n:'Inspiring Leader',s:'crewEfficiency',d:'+40% crew efficiency, +25% morale',i:'\u2B50',t:80,l:800,p:10,r:'notable',x:7,y:2,pr:['wt_13']},
        {n:'Supreme Commander',s:'weaponDamage',d:'+50% all damage, +30% fleet stats',i:'\uD83D\uDC51',t:99,l:999,p:20,r:'ascendancy',x:7,y:1,pr:['wt_15']},
        {n:'Eternal Tactician',s:'weaponDamage',d:'+70% all damage, fleet immune to morale',i:'\u267E\uFE0F',t:95,l:950,p:15,r:'ascendancy',x:8,y:1,pr:['wt_17']},
      ]},
    ],
  },
  {
    id: 'architect', name: 'Architect', icon: '\uD83C\uDFD7\uFE0F', color: '#f59e0b',
    subclasses: [
      { id: 'architect_mogul', name: 'Trade Mogul', icon: '\uD83D\uDCB0', desc: 'Supreme economic power and market dominance.', prefix: 'am', nodes: [
        {n:'Shrewd Eye',s:'resourceBonus',d:'+10% trade profit',i:'\uD83D\uDC41\uFE0F',t:1,l:10,p:1,r:'normal',x:0,y:0},
        {n:'Bulk Trading',s:'cargoCapacity',d:'+20% cargo capacity',i:'\uD83D\uDCE6',t:5,l:50,p:1,r:'normal',x:1,y:0,pr:['am_1']},
        {n:'Tax Evasion',s:'empireTaxReduction',d:'-15% empire tax',i:'\uD83C\uDFE6',t:10,l:100,p:1,r:'normal',x:2,y:0,pr:['am_2']},
        {n:'Processing Mastery',s:'processingSpeed',d:'+25% processing speed',i:'\u2699\uFE0F',t:15,l:150,p:2,r:'normal',x:2,y:1,pr:['am_3']},
        {n:'Price Manipulation',s:'resourceBonus',d:'+15% resource bonus',i:'\uD83D\uDCC8',t:20,l:200,p:2,r:'normal',x:3,y:1,pr:['am_3']},
        {n:'Market Monopoly',s:'miningYield',d:'+30% resource production',i:'\uD83D\uDCCA',t:25,l:250,p:3,r:'notable',x:3,y:0,pr:['am_3']},
        {n:'Logistics Network',s:'logisticsBandwidth',d:'+20% logistics bandwidth',i:'\uD83D\uDE9B',t:30,l:300,p:3,r:'normal',x:3,y:2,pr:['am_3']},
        {n:'Supply Chain',s:'cargoCapacity',d:'+30% cargo capacity',i:'\uD83D\uDCE6',t:35,l:350,p:4,r:'normal',x:4,y:1,pr:['am_3']},
        {n:'Trade Empire',s:'resourceBonus',d:'+5% resource per alliance member (max 10)',i:'\uD83D\uDC51',t:50,l:500,p:5,r:'keystone',x:4,y:0,pr:['am_6']},
        {n:'Market Dominance',s:'resourceBonus',d:'+25% all resource production',i:'\uD83D\uDC8E',t:55,l:550,p:5,r:'notable',x:5,y:0,pr:['am_9']},
        {n:'Cartel Formation',s:'resourceBonus',d:'+35% trade profit, -20% market taxes',i:'\uD83E\uDD1D',t:60,l:600,p:8,r:'keystone',x:5,y:1,pr:['am_10']},
        {n:'Industrial Titan',s:'miningYield',d:'+40% mining yield, +30% processing',i:'\uD83C\uDFED',t:65,l:650,p:8,r:'normal',x:5,y:2,pr:['am_10']},
        {n:'Financial Empire',s:'resourceBonus',d:'+50% all resources, -30% costs',i:'\uD83D\uDCB0',t:75,l:750,p:10,r:'keystone',x:6,y:0,pr:['am_11']},
        {n:'Trade Monarch',s:'resourceBonus',d:'+60% trade profit, +40% cargo',i:'\uD83D\uDC51',t:80,l:800,p:10,r:'notable',x:6,y:1,pr:['am_13']},
        {n:'Economic Singularity',s:'miningYield',d:'+100% all resource production',i:'\uD83D\uDC8E',t:90,l:900,p:12,r:'ascendancy',x:7,y:0,pr:['am_13']},
        {n:'Supply Mastery',s:'logisticsBandwidth',d:'+40% logistics, +25% repair',i:'\uD83D\uDD27',t:70,l:700,p:8,r:'normal',x:6,y:2,pr:['am_12']},
        {n:'Eternal Mogul',s:'resourceBonus',d:'+80% all income, unlimited cargo',i:'\u267E\uFE0F',t:99,l:999,p:20,r:'ascendancy',x:7,y:1,pr:['am_14']},
        {n:'Galactic Banker',s:'resourceBonus',d:'+90% all income, zero market fees',i:'\uD83C\uDFE6',t:95,l:950,p:15,r:'ascendancy',x:8,y:1,pr:['am_17']},
      ]},
      { id: 'architect_engineer', name: 'Master Engineer', icon: '\uD83D\uDD27', desc: 'Construction speed and building efficiency.', prefix: 'ae', nodes: [
        {n:'Efficient Design',s:'buildSpeedBonus',d:'+10% build speed',i:'\u26A1',t:1,l:10,p:1,r:'normal',x:0,y:0},
        {n:'Power Grid',s:'modulePowergrid',d:'+15% module powergrid',i:'\uD83D\uDD0C',t:5,l:50,p:1,r:'normal',x:1,y:0,pr:['ae_1']},
        {n:'CPU Optimization',s:'moduleCpu',d:'+15% module CPU',i:'\uD83D\uDCBB',t:10,l:100,p:1,r:'normal',x:2,y:0,pr:['ae_2']},
        {n:'Hull Reinforcement',s:'hullHp',d:'+20% hull HP',i:'\uD83D\uDEE1\uFE0F',t:15,l:150,p:2,r:'normal',x:2,y:1,pr:['ae_3']},
        {n:'Resource Efficiency',s:'resourceBonus',d:'+15% resource efficiency',i:'\uD83D\uDCB0',t:20,l:200,p:2,r:'normal',x:3,y:1,pr:['ae_3']},
        {n:'Modular Design',s:'modulePowergrid',d:'+20% powergrid, +15% CPU',i:'\uD83D\uDD27',t:30,l:300,p:3,r:'normal',x:3,y:2,pr:['ae_3']},
        {n:'Speed Builder',s:'buildSpeedBonus',d:'+40% build speed, -20% cost',i:'\uD83C\uDFD7\uFE0F',t:25,l:250,p:3,r:'notable',x:3,y:0,pr:['ae_3']},
        {n:'Overclocking',s:'moduleCpu',d:'+25% module CPU',i:'\u26A1',t:35,l:350,p:4,r:'normal',x:4,y:1,pr:['ae_3']},
        {n:'Megastructure Mastery',s:'buildSpeedBonus',d:'+50% build speed, megastructures -30%',i:'\uD83C\uDFDB\uFE0F',t:55,l:550,p:5,r:'keystone',x:4,y:0,pr:['ae_7']},
        {n:'Nanotech Integration',s:'repairAmount',d:'+30% repair amount',i:'\uD83D\uDD2C',t:45,l:450,p:5,r:'normal',x:5,y:1,pr:['ae_9']},
        {n:'Quantum Engineering',s:'buildSpeedBonus',d:'+60% build speed, -25% costs',i:'\u269B\uFE0F',t:65,l:650,p:8,r:'keystone',x:5,y:0,pr:['ae_9']},
        {n:'Automated Systems',s:'buildSpeedBonus',d:'+40% build speed, +30% module stats',i:'\uD83E\uDD16',t:70,l:700,p:8,r:'normal',x:5,y:2,pr:['ae_9']},
        {n:'Structural Perfection',s:'hullHp',d:'+40% hull HP, +25% armor',i:'\uD83C\uDFF0',t:75,l:750,p:10,r:'keystone',x:6,y:0,pr:['ae_11']},
        {n:'Master Builder',s:'buildSpeedBonus',d:'+70% build speed, +40% all module stats',i:'\uD83C\uDFD7\uFE0F',t:80,l:800,p:10,r:'notable',x:6,y:1,pr:['ae_13']},
        {n:'Architect of Infinity',s:'buildSpeedBonus',d:'+100% build speed, -40% costs',i:'\uD83C\uDF1F',t:95,l:950,p:15,r:'ascendancy',x:7,y:0,pr:['ae_14']},
        {n:'Eternal Engineer',s:'modulePowergrid',d:'+80% powergrid, +60% CPU',i:'\u267E\uFE0F',t:99,l:999,p:20,r:'ascendancy',x:7,y:1,pr:['ae_16']},
        {n:'Perfectionist',s:'resourceBonus',d:'+50% resource efficiency',i:'\uD83D\uDC8E',t:85,l:850,p:10,r:'normal',x:7,y:2,pr:['ae_16']},
        {n:'Legendary Crafter',s:'buildSpeedBonus',d:'+90% build speed, all items +20% stats',i:'\uD83C\uDFC6',t:90,l:900,p:12,r:'ascendancy',x:6,y:2,pr:['ae_15']},
      ]},
      { id: 'architect_researcher', name: 'Research Director', icon: '\uD83D\uDD2C', desc: 'Accelerated research and technology.', prefix: 'ar', nodes: [
        {n:'Focused Study',s:'researchSpeed',d:'+10% research speed',i:'\uD83D\uDCDA',t:1,l:10,p:1,r:'normal',x:0,y:0},
        {n:'Data Mining',s:'xpBonus',d:'+8% XP bonus',i:'\u2B50',t:5,l:50,p:1,r:'normal',x:1,y:0,pr:['ar_1']},
        {n:'Lab Efficiency',s:'researchSpeed',d:'+20% research speed',i:'\uD83E\uDDEA',t:10,l:100,p:1,r:'normal',x:2,y:0,pr:['ar_2']},
        {n:'Turn Efficiency',s:'turnEfficiency',d:'+15% turn efficiency',i:'\u23F1\uFE0F',t:20,l:200,p:2,r:'normal',x:2,y:1,pr:['ar_3']},
        {n:'Knowledge Network',s:'researchSpeed',d:'+25% research speed',i:'\uD83C\uDF10',t:25,l:250,p:3,r:'normal',x:3,y:1,pr:['ar_3']},
        {n:'Theory Crafting',s:'xpBonus',d:'+15% XP, +10% research',i:'\uD83D\uDCD6',t:35,l:350,p:4,r:'normal',x:3,y:2,pr:['ar_3']},
        {n:'Breakthrough',s:'researchSpeed',d:'+30% research, chance skip tiers',i:'\uD83D\uDCA1',t:30,l:300,p:3,r:'notable',x:3,y:0,pr:['ar_3']},
        {n:'Quantum Computing',s:'researchSpeed',d:'+35% research speed',i:'\u269B\uFE0F',t:40,l:400,p:5,r:'normal',x:4,y:1,pr:['ar_3']},
        {n:'Technology Singularity',s:'researchSpeed',d:'+60% research, -25% tech costs',i:'\uD83C\uDF10',t:60,l:600,p:5,r:'keystone',x:4,y:0,pr:['ar_7']},
        {n:'Neural Interface',s:'xpBonus',d:'+30% XP bonus',i:'\uD83E\uDDE0',t:50,l:500,p:5,r:'normal',x:5,y:1,pr:['ar_8']},
        {n:'Scientific Mastery',s:'researchSpeed',d:'+70% research, +40% XP',i:'\uD83D\uDD2C',t:70,l:700,p:8,r:'keystone',x:5,y:0,pr:['ar_9']},
        {n:'Data Harvesting',s:'researchSpeed',d:'+50% research speed',i:'\uD83D\uDCCA',t:75,l:750,p:8,r:'normal',x:5,y:2,pr:['ar_9']},
        {n:'Mind Expansion',s:'xpBonus',d:'+50% XP, +30% research',i:'\uD83E\uDDE0',t:80,l:800,p:10,r:'keystone',x:6,y:0,pr:['ar_11']},
        {n:'Cosmic Knowledge',s:'researchSpeed',d:'+80% research, unlock hidden techs',i:'\uD83C\uDF0C',t:85,l:850,p:10,r:'notable',x:6,y:1,pr:['ar_12']},
        {n:'Knowledge Lord',s:'xpBonus',d:'+70% XP, +50% research',i:'\uD83C\uDFC6',t:90,l:900,p:12,r:'ascendancy',x:6,y:2,pr:['ar_12']},
        {n:'Omniscient',s:'researchSpeed',d:'+100% research, +100% XP',i:'\uD83E\uDDE0',t:99,l:999,p:20,r:'ascendancy',x:7,y:0,pr:['ar_12']},
        {n:'Eternal Scholar',s:'researchSpeed',d:'+90% research, +60% XP',i:'\u267E\uFE0F',t:95,l:950,p:15,r:'ascendancy',x:7,y:1,pr:['ar_15']},
        {n:'Grand Architect of Knowledge',s:'researchSpeed',d:'+100% all research, all techs instant',i:'\uD83D\uDC51',t:99,l:999,p:20,r:'ascendancy',x:8,y:1,pr:['ar_17']},
      ]},
    ],
  },
  {
    id: 'sentinel', name: 'Sentinel', icon: '\uD83D\uDEE1\uFE0F', color: '#3b82f6',
    subclasses: [
      { id: 'sentinel_guardian', name: 'Guardian', icon: '\uD83D\uDD2E', desc: 'Supreme shield technology and energy defense.', prefix: 'sg', nodes: [
        {n:'Shield Mastery',s:'shieldHp',d:'+10% shield HP',i:'\uD83D\uDEE1\uFE0F',t:1,l:10,p:1,r:'normal',x:0,y:0},
        {n:'Shield Recharge',s:'shieldRecharge',d:'+15% shield recharge',i:'\u267B\uFE0F',t:5,l:50,p:1,r:'normal',x:1,y:0,pr:['sg_1']},
        {n:'Capacitor Grid',s:'capacitorCapacity',d:'+20% capacitor',i:'\uD83D\uDD0B',t:10,l:100,p:1,r:'normal',x:2,y:0,pr:['sg_2']},
        {n:'Cap Recharge',s:'capacitorRecharge',d:'+20% cap recharge',i:'\u26A1',t:15,l:150,p:2,r:'normal',x:2,y:1,pr:['sg_3']},
        {n:'Energy Barrier',s:'shieldHp',d:'+20% shield HP',i:'\uD83D\uDD35',t:20,l:200,p:2,r:'normal',x:3,y:1,pr:['sg_3']},
        {n:'Power Surge',s:'capacitorCapacity',d:'+25% capacitor',i:'\uD83D\uDD0B',t:30,l:300,p:3,r:'normal',x:3,y:2,pr:['sg_3']},
        {n:'Hardened Shields',s:'shieldHp',d:'+25% shield, +20% recharge',i:'\uD83D\uDD12',t:25,l:250,p:3,r:'notable',x:3,y:0,pr:['sg_3']},
        {n:'Shield Harmonics',s:'shieldRecharge',d:'+30% shield recharge',i:'\uD83C\uDFB5',t:35,l:350,p:4,r:'normal',x:4,y:1,pr:['sg_3']},
        {n:'Capacitor Mastery',s:'capacitorCapacity',d:'+40% capacitor, +30% recharge',i:'\u26A1',t:45,l:450,p:5,r:'normal',x:5,y:1,pr:['sg_8']},
        {n:'Ethereal Ward',s:'shieldHp',d:'+50% shield, absorb 20% hull damage',i:'\u2728',t:50,l:500,p:5,r:'keystone',x:4,y:0,pr:['sg_7']},
        {n:'Shield Fortress',s:'shieldHp',d:'+60% shield, +40% recharge',i:'\uD83C\uDFF0',t:60,l:600,p:8,r:'keystone',x:5,y:0,pr:['sg_10']},
        {n:'Energy Dominion',s:'capacitorCapacity',d:'+50% capacitor, +40% recharge',i:'\uD83D\uDC8E',t:65,l:650,p:8,r:'normal',x:5,y:2,pr:['sg_10']},
        {n:'Shield Overlord',s:'shieldHp',d:'+80% shield, +60% recharge',i:'\uD83D\uDC51',t:75,l:750,p:10,r:'notable',x:6,y:1,pr:['sg_11']},
        {n:'Impenetrable',s:'shieldHp',d:'+100% shield, +50% recharge',i:'\uD83D\uDC8E',t:90,l:900,p:12,r:'ascendancy',x:6,y:0,pr:['sg_11']},
        {n:'Eternal Guardian',s:'shieldHp',d:'+100% all shields, absorb 40% hull',i:'\u267E\uFE0F',t:99,l:999,p:20,r:'ascendancy',x:7,y:0,pr:['sg_13']},
        {n:'Capacitor God',s:'capacitorCapacity',d:'+90% capacitor, +70% recharge',i:'\u26A1',t:85,l:850,p:10,r:'normal',x:7,y:1,pr:['sg_13']},
        {n:'Shield Supreme',s:'shieldHp',d:'+120% shield, +100% recharge',i:'\uD83C\uDFC6',t:95,l:950,p:15,r:'ascendancy',x:7,y:2,pr:['sg_13']},
      ]},
      { id: 'sentinel_bulwark', name: 'Bulwark', icon: '\uD83C\uDFF0', desc: 'Maximum armor and damage reduction.', prefix: 'sb', nodes: [
        {n:'Armor Plating',s:'armorValue',d:'+10% armor',i:'\uD83D\uDEE1\uFE0F',t:1,l:10,p:1,r:'normal',x:0,y:0},
        {n:'Damage Reduction',s:'damageReduction',d:'+8% damage reduction',i:'\uD83D\uDEE1\uFE0F',t:5,l:50,p:1,r:'normal',x:1,y:0,pr:['sb_1']},
        {n:'Hull Fortification',s:'hullHp',d:'+20% hull HP',i:'\u2764\uFE0F',t:10,l:100,p:1,r:'normal',x:2,y:0,pr:['sb_2']},
        {n:'Health Regen',s:'healthRegen',d:'+25% health regen',i:'\uD83D\uDC9A',t:20,l:200,p:2,r:'normal',x:2,y:1,pr:['sb_3']},
        {n:'Steel Wall',s:'armorValue',d:'+25% armor',i:'\uD83E\uDDF1',t:25,l:250,p:3,r:'normal',x:3,y:1,pr:['sb_3']},
        {n:'Endurance',s:'hullHp',d:'+25% hull, +20% regen',i:'\uD83D\uDCAA',t:35,l:350,p:4,r:'normal',x:3,y:2,pr:['sb_3']},
        {n:'Fortress',s:'armorValue',d:'+30% armor, +15% DR',i:'\uD83C\uDFF0',t:30,l:300,p:3,r:'notable',x:3,y:0,pr:['sb_3']},
        {n:'Bastion',s:'damageReduction',d:'+20% damage reduction',i:'\uD83C\uDFF0',t:40,l:400,p:5,r:'normal',x:4,y:1,pr:['sb_3']},
        {n:'Regeneration Core',s:'healthRegen',d:'+40% health regen',i:'\uD83D\uDC9A',t:50,l:500,p:5,r:'normal',x:5,y:1,pr:['sb_8']},
        {n:'Unbreakable Wall',s:'armorValue',d:'+50% defenses, -20% damage taken',i:'\uD83C\uDFDB\uFE0F',t:55,l:550,p:5,r:'keystone',x:4,y:0,pr:['sb_7']},
        {n:'Titanium Core',s:'hullHp',d:'+50% hull, +30% armor',i:'\uD83D\uDC8E',t:70,l:700,p:8,r:'normal',x:5,y:2,pr:['sb_10']},
        {n:'Iron Fortress',s:'armorValue',d:'+60% armor, +30% DR',i:'\uD83C\uDFF0',t:65,l:650,p:8,r:'keystone',x:5,y:0,pr:['sb_10']},
        {n:'Defense Supreme',s:'armorValue',d:'+80% armor, +50% DR',i:'\uD83C\uDFC6',t:80,l:800,p:10,r:'notable',x:6,y:1,pr:['sb_11']},
        {n:'Immortal Fortress',s:'damageReduction',d:'+50% less damage, +100% all defense',i:'\uD83D\uDC51',t:95,l:950,p:15,r:'ascendancy',x:6,y:0,pr:['sb_13']},
        {n:'Regen Master',s:'healthRegen',d:'+60% regen, +40% hull',i:'\uD83D\uDC9A',t:85,l:850,p:10,r:'normal',x:7,y:1,pr:['sb_14']},
        {n:'Eternal Bulwark',s:'hullHp',d:'+100% hull, +80% armor',i:'\u267E\uFE0F',t:99,l:999,p:20,r:'ascendancy',x:7,y:0,pr:['sb_14']},
        {n:'Fortress Eternal',s:'armorValue',d:'+120% armor, +80% DR',i:'\u267E\uFE0F',t:90,l:900,p:12,r:'ascendancy',x:6,y:2,pr:['sb_12']},
      ]},
      { id: 'sentinel_healer', name: 'Fleet Medic', icon: '\uD83D\uDC9A', desc: 'Repair and logistics support.', prefix: 'sh', nodes: [
        {n:'Repair Basics',s:'repairAmount',d:'+10% repair amount',i:'\uD83D\uDD27',t:1,l:10,p:1,r:'normal',x:0,y:0},
        {n:'Logistics Bandwidth',s:'logisticsBandwidth',d:'+15% logistics',i:'\uD83D\uDCE1',t:5,l:50,p:1,r:'normal',x:1,y:0,pr:['sh_1']},
        {n:'Remote Repair',s:'repairAmount',d:'+20% repair range',i:'\uD83D\uDD27',t:10,l:100,p:1,r:'normal',x:2,y:0,pr:['sh_2']},
        {n:'Health Regen Aura',s:'healthRegen',d:'All ships regen 2% hull/sec',i:'\u2728',t:20,l:200,p:2,r:'normal',x:2,y:1,pr:['sh_3']},
        {n:'Emergency Repair',s:'repairAmount',d:'+30% repair amount',i:'\uD83C\uDE94',t:25,l:250,p:3,r:'normal',x:3,y:1,pr:['sh_3']},
        {n:'Shield Repair',s:'shieldRecharge',d:'+20% shield recharge',i:'\uD83D\uDEE1\uFE0F',t:35,l:350,p:4,r:'normal',x:3,y:2,pr:['sh_3']},
        {n:'Fleet Healer',s:'repairAmount',d:'+40% repair, +25% logistics',i:'\uD83D\uDC9A',t:30,l:300,p:3,r:'notable',x:3,y:0,pr:['sh_3']},
        {n:'Auto Repair',s:'healthRegen',d:'+25% health regen',i:'\u267B\uFE0F',t:40,l:400,p:5,r:'normal',x:4,y:1,pr:['sh_3']},
        {n:'Logistics Master',s:'logisticsBandwidth',d:'+40% logistics, +30% repair',i:'\uD83D\uDCE1',t:55,l:550,p:5,r:'normal',x:5,y:1,pr:['sh_8']},
        {n:'Miracle Worker',s:'repairAmount',d:'+60% repair, revive destroyed ships',i:'\uD83C\uDF1F',t:60,l:600,p:5,r:'keystone',x:4,y:0,pr:['sh_7']},
        {n:'Shield Restoration',s:'shieldRecharge',d:'+40% shield, +25% shield HP',i:'\uD83D\uDEE1\uFE0F',t:75,l:750,p:8,r:'normal',x:5,y:2,pr:['sh_10']},
        {n:'Divine Healing',s:'repairAmount',d:'+80% repair, +50% regen',i:'\u2728',t:70,l:700,p:8,r:'keystone',x:5,y:0,pr:['sh_10']},
        {n:'Fleet Medic Supreme',s:'repairAmount',d:'+90% repair, +60% regen',i:'\uD83C\uDFC6',t:85,l:850,p:10,r:'notable',x:6,y:1,pr:['sh_11']},
        {n:'Miracle Eternal',s:'repairAmount',d:'+120% repair, revive all',i:'\uD83C\uDF1F',t:90,l:900,p:12,r:'ascendancy',x:7,y:1,pr:['sh_13']},
        {n:'Immortality Engine',s:'repairAmount',d:'+100% repair, auto-repair to full',i:'\u267E\uFE0F',t:99,l:999,p:20,r:'ascendancy',x:6,y:0,pr:['sh_11']},
        {n:'Eternal Healer',s:'healthRegen',d:'+80% regen, +60% repair',i:'\u267E\uFE0F',t:95,l:950,p:15,r:'ascendancy',x:6,y:2,pr:['sh_12']},
      ]},
    ],
  },
  {
    id: 'explorer', name: 'Explorer', icon: '\uD83D\uDD2D', color: '#10b981',
    subclasses: [
      { id: 'explorer_pathfinder', name: 'Pathfinder', icon: '\uD83D\uDE80', desc: 'Unmatched warp speed and navigation.', prefix: 'ep', nodes: [
        {n:'Warp Efficiency',s:'warpSpeed',d:'+10% warp speed',i:'\uD83D\uDE80',t:1,l:10,p:1,r:'normal',x:0,y:0},
        {n:'Flight Speed',s:'flightVelocity',d:'+12% flight velocity',i:'\u2708\uFE0F',t:5,l:50,p:1,r:'normal',x:1,y:0,pr:['ep_1']},
        {n:'Agility',s:'agility',d:'+15% ship agility',i:'\uD83E\uDD85',t:10,l:100,p:1,r:'normal',x:2,y:0,pr:['ep_2']},
        {n:'Warp Stability',s:'warpStability',d:'+20% warp stability',i:'\uD83C\uDF00',t:15,l:150,p:2,r:'normal',x:2,y:1,pr:['ep_3']},
        {n:'Afterburner',s:'flightVelocity',d:'+18% flight velocity',i:'\uD83D\uDD25',t:20,l:200,p:2,r:'normal',x:3,y:1,pr:['ep_3']},
        {n:'Navigation Boost',s:'warpSpeed',d:'+22% warp speed',i:'\uD83E\uDDED',t:30,l:300,p:3,r:'normal',x:3,y:2,pr:['ep_3']},
        {n:'Light Speed',s:'warpSpeed',d:'+30% warp, +25% flight',i:'\uD83D\uDCA8',t:25,l:250,p:3,r:'notable',x:3,y:0,pr:['ep_3']},
        {n:'Fuel Efficiency',s:'fuelEfficiency',d:'+20% fuel efficiency',i:'\u26FD',t:35,l:350,p:4,r:'normal',x:4,y:1,pr:['ep_3']},
        {n:'Speed Demon',s:'flightVelocity',d:'+35% flight velocity',i:'\u26A1',t:45,l:450,p:5,r:'normal',x:5,y:1,pr:['ep_8']},
        {n:'Warp Gate Network',s:'warpSpeed',d:'+50% warp, instant warp',i:'\uD83C\uDF00',t:50,l:500,p:5,r:'keystone',x:4,y:0,pr:['ep_7']},
        {n:'Fuel Mastery',s:'fuelEfficiency',d:'+40% fuel efficiency',i:'\u26FD',t:65,l:650,p:8,r:'normal',x:5,y:2,pr:['ep_10']},
        {n:'Hyperdrive',s:'warpSpeed',d:'+60% warp, +40% flight',i:'\uD83D\uDE80',t:60,l:600,p:8,r:'keystone',x:5,y:0,pr:['ep_10']},
        {n:'Warp God',s:'warpSpeed',d:'+80% warp, +60% flight',i:'\uD83C\uDFC6',t:75,l:750,p:10,r:'notable',x:6,y:1,pr:['ep_11']},
        {n:'Transcendent Speed',s:'warpSpeed',d:'+100% all speed, instant warp',i:'\u26A1',t:90,l:900,p:12,r:'ascendancy',x:6,y:0,pr:['ep_12']},
        {n:'Eternal Pathfinder',s:'flightVelocity',d:'+120% speed, teleport once per battle',i:'\u267E\uFE0F',t:99,l:999,p:20,r:'ascendancy',x:7,y:0,pr:['ep_14']},
        {n:'Speed Supreme',s:'warpSpeed',d:'+90% warp, +70% flight',i:'\uD83C\uDF0C',t:85,l:850,p:10,r:'normal',x:7,y:1,pr:['ep_14']},
        {n:'Cosmic Traveler',s:'fuelEfficiency',d:'+60% fuel, +50% stability',i:'\uD83C\uDF1F',t:95,l:950,p:15,r:'ascendancy',x:7,y:2,pr:['ep_14']},
      ]},
      { id: 'explorer_scout', name: 'Scout', icon: '\uD83D\uDCE1', desc: 'Superior scanning and sensors.', prefix: 'es', nodes: [
        {n:'Enhanced Sensors',s:'sensorStrength',d:'+10% sensor strength',i:'\uD83D\uDCE1',t:1,l:10,p:1,r:'normal',x:0,y:0},
        {n:'Scan Resolution',s:'scanResolution',d:'+15% scan resolution',i:'\uD83D\uDD0D',t:5,l:50,p:1,r:'normal',x:1,y:0,pr:['es_1']},
        {n:'Signature Reduction',s:'signatureRadius',d:'-15% signature',i:'\uD83D\uDC7B',t:10,l:100,p:1,r:'normal',x:2,y:0,pr:['es_2']},
        {n:'Avoidance',s:'avoidance',d:'+15% avoidance',i:'\uD83D\uDCA8',t:15,l:150,p:2,r:'normal',x:2,y:1,pr:['es_3']},
        {n:'Targeting',s:'targetingSpeed',d:'+18% targeting speed',i:'\uD83C\uDFAF',t:20,l:200,p:2,r:'normal',x:3,y:1,pr:['es_3']},
        {n:'EW Basics',s:'electronicWarfare',d:'+15% EW strength',i:'\uD83D\uDCFB',t:30,l:300,p:3,r:'normal',x:3,y:2,pr:['es_3']},
        {n:'Master Scout',s:'sensorStrength',d:'+30% sensor, +25% scan',i:'\uD83D\uDD2D',t:25,l:250,p:3,r:'notable',x:3,y:0,pr:['es_3']},
        {n:'Detection Array',s:'sensorStrength',d:'+25% sensor strength',i:'\uD83D\uDCE1',t:35,l:350,p:4,r:'normal',x:4,y:1,pr:['es_3']},
        {n:'Advanced EW',s:'electronicWarfare',d:'+25% EW strength',i:'\uD83D\uDCFB',t:45,l:450,p:5,r:'normal',x:5,y:1,pr:['es_8']},
        {n:'Ghost Protocol',s:'signatureRadius',d:'-40% sig, +30% avoidance',i:'\uD83D\uDC7B',t:50,l:500,p:5,r:'keystone',x:4,y:0,pr:['es_7']},
        {n:'Stealth Mastery',s:'signatureRadius',d:'-50% sig, +40% avoidance',i:'\uD83C\uDF11',t:65,l:650,p:8,r:'normal',x:5,y:2,pr:['es_10']},
        {n:'Sensor Network',s:'sensorStrength',d:'+50% sensor, +40% scan',i:'\uD83C\uDF10',t:60,l:600,p:8,r:'keystone',x:5,y:0,pr:['es_10']},
        {n:'EW Master',s:'electronicWarfare',d:'+40% EW, +30% targeting',i:'\uD83C\uDFC6',t:75,l:750,p:10,r:'notable',x:6,y:1,pr:['es_11']},
        {n:'Invisible Hand',s:'sensorStrength',d:'+100% scan, +80% sig reduction',i:'\uD83C\uDF0C',t:90,l:900,p:12,r:'ascendancy',x:6,y:0,pr:['es_13']},
        {n:'Eternal Scout',s:'sensorStrength',d:'+120% sensor, +100% sig',i:'\u267E\uFE0F',t:99,l:999,p:20,r:'ascendancy',x:7,y:0,pr:['es_14']},
        {n:'Phantom Network',s:'electronicWarfare',d:'+60% EW, +50% targeting',i:'\uD83D\uDD78\uFE0F',t:85,l:850,p:10,r:'normal',x:7,y:1,pr:['es_14']},
        {n:'Omniscient Eye',s:'sensorStrength',d:'+150% sensor, see everything',i:'\uD83D\uDC41\uFE0F',t:95,l:950,p:15,r:'ascendancy',x:7,y:2,pr:['es_14']},
      ]},
      { id: 'explorer_salvager', name: 'Salvager', icon: '\u26CF\uFE0F', desc: 'Maximize resource recovery.', prefix: 'exs', nodes: [
        {n:'Mining Boost',s:'miningYield',d:'+10% mining yield',i:'\u26CF\uFE0F',t:1,l:10,p:1,r:'normal',x:0,y:0},
        {n:'Processing',s:'processingSpeed',d:'+12% processing',i:'\u2699\uFE0F',t:5,l:50,p:1,r:'normal',x:1,y:0,pr:['exs_1']},
        {n:'Deep Mining',s:'miningYield',d:'+15% mining yield',i:'\u26CF\uFE0F',t:10,l:100,p:1,r:'normal',x:2,y:0,pr:['exs_2']},
        {n:'Cargo Master',s:'cargoCapacity',d:'+20% cargo',i:'\uD83D\uDCE6',t:15,l:150,p:2,r:'normal',x:2,y:1,pr:['exs_3']},
        {n:'Scrap Collector',s:'resourceBonus',d:'+18% resource bonus',i:'\uD83D\uDD29',t:20,l:200,p:2,r:'normal',x:3,y:1,pr:['exs_3']},
        {n:'Mining Laser',s:'miningYield',d:'+20% mining yield',i:'\uD83D\uDD26',t:30,l:300,p:3,r:'normal',x:3,y:2,pr:['exs_3']},
        {n:'Resource Recovery',s:'miningYield',d:'+25% mining, +20% processing',i:'\uD83D\uDC8E',t:25,l:250,p:3,r:'notable',x:3,y:0,pr:['exs_3']},
        {n:'Efficient Processing',s:'processingSpeed',d:'+25% processing',i:'\u2699\uFE0F',t:35,l:350,p:4,r:'normal',x:4,y:1,pr:['exs_3']},
        {n:'Supply Master',s:'cargoCapacity',d:'+35% cargo',i:'\uD83D\uDCE6',t:45,l:450,p:5,r:'normal',x:5,y:1,pr:['exs_8']},
        {n:'Asteroid Breaker',s:'miningYield',d:'+50% mining, double resources chance',i:'\u2604\uFE0F',t:50,l:500,p:5,r:'keystone',x:4,y:0,pr:['exs_7']},
        {n:'Salvage King',s:'resourceBonus',d:'+40% resources, +30% cargo',i:'\uD83D\uDC51',t:65,l:650,p:8,r:'normal',x:5,y:2,pr:['exs_10']},
        {n:'Resource Empire',s:'miningYield',d:'+60% mining, +40% processing',i:'\uD83D\uDCB0',t:60,l:600,p:8,r:'keystone',x:5,y:0,pr:['exs_10']},
        {n:'Mining Overlord',s:'miningYield',d:'+80% mining, +50% cargo',i:'\uD83C\uDFC6',t:75,l:750,p:10,r:'notable',x:6,y:1,pr:['exs_11']},
        {n:'Cosmic Harvest',s:'miningYield',d:'+100% mining, all doubled',i:'\uD83C\uDF1F',t:90,l:900,p:12,r:'ascendancy',x:6,y:0,pr:['exs_13']},
        {n:'Eternal Salvager',s:'miningYield',d:'+120% mining, +80% processing',i:'\u267E\uFE0F',t:99,l:999,p:20,r:'ascendancy',x:7,y:0,pr:['exs_14']},
        {n:'Resource God',s:'resourceBonus',d:'+100% resources, +70% mining',i:'\uD83D\uDC8E',t:85,l:850,p:10,r:'normal',x:7,y:1,pr:['exs_14']},
        {n:'Cosmic Miner',s:'miningYield',d:'+150% mining, +100% processing',i:'\uD83C\uDF0C',t:95,l:950,p:15,r:'ascendancy',x:7,y:2,pr:['exs_14']},
      ]},
    ],
  },
  {
    id: 'spymaster', name: 'Spymaster', icon: '\uD83D\uDD75\uFE0F', color: '#8b5cf6',
    subclasses: [
      { id: 'spymaster_infiltrator', name: 'Infiltrator', icon: '\uD83D\uDDE1\uFE0F', desc: 'Stealth operations and sabotage.', prefix: 'si', nodes: [
        {n:'Stealth Basics',s:'electronicWarfare',d:'+10% EW strength',i:'\uD83D\uDD75\uFE0F',t:1,l:10,p:1,r:'normal',x:0,y:0},
        {n:'Sig Reduction',s:'signatureRadius',d:'-12% signature',i:'\uD83D\uDC7B',t:5,l:50,p:1,r:'normal',x:1,y:0,pr:['si_1']},
        {n:'Sabotage',s:'electronicWarfare',d:'+20% espionage success',i:'\uD83D\uDCA3',t:10,l:100,p:1,r:'normal',x:2,y:0,pr:['si_2']},
        {n:'Crowd Control',s:'crowdControl',d:'+20% CC strength',i:'\uD83D\uDD17',t:20,l:200,p:2,r:'normal',x:2,y:1,pr:['si_3']},
        {n:'Infiltration',s:'avoidance',d:'+18% avoidance',i:'\uD83C\uDF11',t:25,l:250,p:3,r:'normal',x:3,y:1,pr:['si_3']},
        {n:'Spy Network',s:'sensorStrength',d:'+20% sensor',i:'\uD83D\uDCE1',t:35,l:350,p:4,r:'normal',x:3,y:2,pr:['si_3']},
        {n:'Master Saboteur',s:'electronicWarfare',d:'+35% EW, +25% sabotage',i:'\uD83D\uDD25',t:30,l:300,p:3,r:'notable',x:3,y:0,pr:['si_3']},
        {n:'Electronic Dominance',s:'electronicWarfare',d:'+30% EW strength',i:'\uD83D\uDCFB',t:40,l:400,p:5,r:'normal',x:4,y:1,pr:['si_3']},
        {n:'Disable Systems',s:'crowdControl',d:'+30% CC strength',i:'\u26A1',t:50,l:500,p:5,r:'normal',x:5,y:1,pr:['si_8']},
        {n:'Shadow Network',s:'electronicWarfare',d:'+50% EW, can hack modules',i:'\uD83D\uDD78\uFE0F',t:55,l:550,p:5,r:'keystone',x:4,y:0,pr:['si_7']},
        {n:'EMP Storm',s:'electronicWarfare',d:'+45% EW, +35% CC',i:'\u26A1',t:70,l:700,p:8,r:'normal',x:5,y:2,pr:['si_10']},
        {n:'Invisible Empire',s:'electronicWarfare',d:'+60% EW, +40% avoidance',i:'\uD83C\uDF11',t:65,l:650,p:8,r:'keystone',x:5,y:0,pr:['si_10']},
        {n:'EW Overlord',s:'electronicWarfare',d:'+80% EW, +50% CC',i:'\uD83C\uDFC6',t:80,l:800,p:10,r:'notable',x:6,y:1,pr:['si_11']},
        {n:'Shadow Emperor',s:'electronicWarfare',d:'+100% EW, control ships 10s',i:'\uD83D\uDC51',t:95,l:950,p:15,r:'ascendancy',x:6,y:0,pr:['si_11']},
        {n:'Eternal Shadow',s:'electronicWarfare',d:'+120% EW, undetectable',i:'\u267E\uFE0F',t:99,l:999,p:20,r:'ascendancy',x:7,y:0,pr:['si_14']},
        {n:'Network Supreme',s:'sensorStrength',d:'+60% sensor, +50% targeting',i:'\uD83D\uDCE1',t:85,l:850,p:10,r:'normal',x:7,y:1,pr:['si_14']},
        {n:'Master of Shadows',s:'electronicWarfare',d:'+150% EW, +100% CC',i:'\uD83C\uDF00',t:90,l:900,p:12,r:'ascendancy',x:6,y:2,pr:['si_12']},
      ]},
      { id: 'spymaster_manipulator', name: 'Manipulator', icon: '\uD83C\uDFAD', desc: 'Social engineering and subterfuge.', prefix: 'sm', nodes: [
        {n:'Silver Tongue',s:'diplomacyBonus',d:'+10% diplomacy',i:'\uD83D\uDDE3\uFE0F',t:1,l:10,p:1,r:'normal',x:0,y:0},
        {n:'Prestige Gain',s:'prestigeBonus',d:'+12% prestige',i:'\u2B50',t:5,l:50,p:1,r:'normal',x:1,y:0,pr:['sm_1']},
        {n:'Blackmail',s:'diplomacyBonus',d:'+15% spy rewards',i:'\uD83D\uDCCB',t:10,l:100,p:1,r:'normal',x:2,y:0,pr:['sm_2']},
        {n:'Espionage Boost',s:'electronicWarfare',d:'+15% espionage success',i:'\uD83D\uDD75\uFE0F',t:20,l:200,p:2,r:'normal',x:2,y:1,pr:['sm_3']},
        {n:'Social Network',s:'diplomacyBonus',d:'+20% diplomacy',i:'\uD83C\uDF10',t:25,l:250,p:3,r:'normal',x:3,y:1,pr:['sm_3']},
        {n:'Trade Routes',s:'resourceBonus',d:'+15% trade profit',i:'\uD83D\uDCB0',t:35,l:350,p:4,r:'normal',x:3,y:2,pr:['sm_3']},
        {n:'Puppet Master',s:'diplomacyBonus',d:'+30% diplomacy, +20% prestige',i:'\uD83C\uDFAD',t:30,l:300,p:3,r:'notable',x:3,y:0,pr:['sm_3']},
        {n:'Influence',s:'prestigeBonus',d:'+25% prestige',i:'\u2B50',t:40,l:400,p:5,r:'normal',x:4,y:1,pr:['sm_3']},
        {n:'Black Market',s:'resourceBonus',d:'+30% trade profit',i:'\uD83C\uDFF4',t:55,l:550,p:5,r:'normal',x:5,y:1,pr:['sm_8']},
        {n:'Mind Control',s:'diplomacyBonus',d:'+50% diplomacy, convert diplomats',i:'\uD83E\uDDE0',t:60,l:600,p:5,r:'keystone',x:4,y:0,pr:['sm_7']},
        {n:'Prestige Empire',s:'prestigeBonus',d:'+50% prestige',i:'\uD83D\uDC8E',t:75,l:750,p:8,r:'normal',x:5,y:2,pr:['sm_10']},
        {n:'Political Dominance',s:'diplomacyBonus',d:'+60% diplomacy, +40% prestige',i:'\uD83D\uDC51',t:70,l:700,p:8,r:'keystone',x:5,y:0,pr:['sm_10']},
        {n:'Diplomacy Overlord',s:'diplomacyBonus',d:'+80% diplomacy, +60% prestige',i:'\uD83C\uDFC6',t:85,l:850,p:10,r:'notable',x:6,y:1,pr:['sm_11']},
        {n:'Galactic Puppeteer',s:'diplomacyBonus',d:'+100% diplomacy, control alliances',i:'\uD83D\uDC41\uFE0F',t:90,l:900,p:12,r:'ascendancy',x:6,y:0,pr:['sm_11']},
        {n:'Eternal Manipulator',s:'diplomacyBonus',d:'+120% diplomacy, +100% espionage',i:'\u267E\uFE0F',t:95,l:950,p:15,r:'ascendancy',x:6,y:2,pr:['sm_12']},
        {n:'Puppet Emperor',s:'diplomacyBonus',d:'+100% diplomacy, control alliances',i:'\uD83D\uDC51',t:99,l:999,p:20,r:'ascendancy',x:7,y:0,pr:['sm_12']},
        {n:'Supreme Manipulator',s:'prestigeBonus',d:'+100% prestige, +80% diplomacy',i:'\uD83C\uDF0C',t:99,l:999,p:20,r:'ascendancy',x:7,y:1,pr:['sm_16']},
      ]},
      { id: 'spymaster_assassin', name: 'Assassin', icon: '\uD83D\uDDE1\uFE0F', desc: 'Precision strikes and target elimination.', prefix: 'sa', nodes: [
        {n:'Precision Strike',s:'weaponCritChance',d:'+8% crit chance',i:'\uD83C\uDFAF',t:1,l:10,p:1,r:'normal',x:0,y:0},
        {n:'Lethal Damage',s:'weaponCritDamage',d:'+15% crit damage',i:'\uD83D\uDC80',t:5,l:50,p:1,r:'normal',x:1,y:0,pr:['sa_1']},
        {n:'Targeting',s:'targetingSpeed',d:'+15% targeting',i:'\uD83C\uDFAF',t:10,l:100,p:1,r:'normal',x:2,y:0,pr:['sa_2']},
        {n:'First Strike',s:'weaponDamage',d:'+20% first strike damage',i:'\u26A1',t:20,l:200,p:2,r:'normal',x:2,y:1,pr:['sa_3']},
        {n:'Silent Kill',s:'avoidance',d:'+18% avoidance',i:'\uD83D\uDC7B',t:25,l:250,p:3,r:'normal',x:3,y:1,pr:['sa_3']},
        {n:'Assassination',s:'weaponDamage',d:'+22% weapon damage',i:'\uD83D\uDDE1\uFE0F',t:35,l:350,p:4,r:'normal',x:3,y:2,pr:['sa_3']},
        {n:'Death Mark',s:'weaponDamage',d:'+25% damage to single targets',i:'\u2620\uFE0F',t:25,l:250,p:3,r:'notable',x:3,y:0,pr:['sa_3']},
        {n:'Expert Marksman',s:'weaponCritChance',d:'+20% crit chance',i:'\uD83C\uDFAF',t:40,l:400,p:5,r:'normal',x:4,y:1,pr:['sa_3']},
        {n:'Critical Mastery',s:'weaponCritDamage',d:'+40% crit damage',i:'\uD83D\uDCA5',t:55,l:550,p:5,r:'normal',x:5,y:1,pr:['sa_8']},
        {n:'Deadly Focus',s:'weaponCritChance',d:'+40% crit, +50% crit damage',i:'\uD83D\uDDE1\uFE0F',t:50,l:500,p:5,r:'keystone',x:4,y:0,pr:['sa_7']},
        {n:'Shadow Blade',s:'weaponDamage',d:'+50% weapon damage',i:'\uD83C\uDF11',t:70,l:700,p:8,r:'normal',x:5,y:2,pr:['sa_10']},
        {n:'Phantom Strike',s:'weaponCritChance',d:'+60% crit, +70% crit damage',i:'\uD83D\uDC7B',t:65,l:650,p:8,r:'keystone',x:5,y:0,pr:['sa_10']},
        {n:'Death Dealer',s:'weaponDamage',d:'+70% weapon, +50% crit',i:'\u2620\uFE0F',t:80,l:800,p:10,r:'notable',x:6,y:1,pr:['sa_11']},
        {n:'Assassin Supreme',s:'weaponCritChance',d:'+100% crit, +100% crit damage',i:'\uD83D\uDC7B',t:90,l:900,p:12,r:'ascendancy',x:6,y:0,pr:['sa_11']},
        {n:'Eternal Assassin',s:'weaponCritChance',d:'+120% crit, +120% crit damage',i:'\u267E\uFE0F',t:99,l:999,p:20,r:'ascendancy',x:7,y:0,pr:['sa_14']},
        {n:'Silent Death',s:'weaponDamage',d:'+90% weapon, +70% crit',i:'\uD83D\uDC80',t:85,l:850,p:10,r:'normal',x:7,y:1,pr:['sa_14']},
        {n:'Perfect Kill',s:'weaponCritChance',d:'+150% crit, +130% crit damage',i:'\uD83D\uDDE1\uFE0F',t:95,l:950,p:15,r:'ascendancy',x:7,y:2,pr:['sa_14']},
      ]},
    ],
  },
  {
    id: 'summoner', name: 'Summoner', icon: '\uD83D\uDC09', color: '#ec4899',
    subclasses: [
      { id: 'summoner_beastmaster', name: 'Beastmaster', icon: '\uD83D\uDC3E', desc: 'Command powerful companions.', prefix: 'sbm', nodes: [
        {n:'Companion Bond',s:'summonPower',d:'+10% summon power',i:'\uD83D\uDC3E',t:1,l:10,p:1,r:'normal',x:0,y:0},
        {n:'Pack Leader',s:'crewEfficiency',d:'+12% crew efficiency',i:'\uD83D\uDC65',t:5,l:50,p:1,r:'normal',x:1,y:0,pr:['sbm_1']},
        {n:'Feral Instinct',s:'summonPower',d:'+15% summon power',i:'\uD83E\uDD81',t:10,l:100,p:1,r:'normal',x:2,y:0,pr:['sbm_2']},
        {n:'Swarm',s:'summonPower',d:'+20% summon count',i:'\uD83D\uDC1D',t:20,l:200,p:2,r:'normal',x:2,y:1,pr:['sbm_3']},
        {n:'Beast Taming',s:'crewEfficiency',d:'+18% crew efficiency',i:'\uD83D\uDC3E',t:30,l:300,p:3,r:'normal',x:3,y:1,pr:['sbm_3']},
        {n:'Frenzy',s:'summonPower',d:'+22% summon power',i:'\uD83D\uDD25',t:35,l:350,p:4,r:'normal',x:3,y:2,pr:['sbm_3']},
        {n:'Alpha Companion',s:'summonPower',d:'+30% summon, +20% crew',i:'\uD83D\uDC09',t:25,l:250,p:3,r:'notable',x:3,y:0,pr:['sbm_3']},
        {n:'Pack Tactics',s:'weaponDamage',d:'+20% damage per summon',i:'\uD83D\uDC3A',t:40,l:400,p:5,r:'normal',x:4,y:1,pr:['sbm_3']},
        {n:'Beast Army',s:'summonPower',d:'+40% summon count, +30% power',i:'\uD83E\uDD81',t:55,l:550,p:5,r:'normal',x:5,y:1,pr:['sbm_8']},
        {n:'Apex Predator',s:'summonPower',d:'+50% summon, summons immune 5s',i:'\uD83D\uDC51',t:50,l:500,p:5,r:'keystone',x:4,y:0,pr:['sbm_7']},
        {n:'Pack Alpha',s:'weaponDamage',d:'+45% damage per summon',i:'\uD83D\uDC3A',t:70,l:700,p:8,r:'normal',x:5,y:2,pr:['sbm_10']},
        {n:'Monster Lord',s:'summonPower',d:'+60% summon, +40% crew',i:'\uD83D\uDC09',t:65,l:650,p:8,r:'keystone',x:5,y:0,pr:['sbm_10']},
        {n:'Beast Master Supreme',s:'summonPower',d:'+80% summon, +60% crew',i:'\uD83C\uDFC6',t:80,l:800,p:10,r:'notable',x:6,y:1,pr:['sbm_11']},
        {n:'Legendary Beast',s:'summonPower',d:'+100% summon, +50% crew',i:'\uD83C\uDF1F',t:90,l:900,p:12,r:'ascendancy',x:6,y:0,pr:['sbm_11']},
        {n:'Eternal Beastmaster',s:'summonPower',d:'+120% summon, +80% crew',i:'\u267E\uFE0F',t:99,l:999,p:20,r:'ascendancy',x:7,y:0,pr:['sbm_14']},
        {n:'Monster King',s:'summonPower',d:'+100% summon, +70% crew',i:'\uD83D\uDC51',t:85,l:850,p:10,r:'normal',x:7,y:1,pr:['sbm_14']},
        {n:'Cosmic Beast',s:'summonPower',d:'+150% summon, +100% crew',i:'\uD83C\uDF0C',t:95,l:950,p:15,r:'ascendancy',x:7,y:2,pr:['sbm_14']},
      ]},
      { id: 'summoner_commander', name: 'Fleet Commander', icon: '\uD83C\uDF96\uFE0F', desc: 'Maximize fleet synergy.', prefix: 'sfc', nodes: [
        {n:'Command Training',s:'crewEfficiency',d:'+10% crew efficiency',i:'\uD83D\uDC65',t:1,l:10,p:1,r:'normal',x:0,y:0},
        {n:'Fleet Coordination',s:'fleetCommandRange',d:'+12% command range',i:'\uD83D\uDCE1',t:5,l:50,p:1,r:'normal',x:1,y:0,pr:['sfc_1']},
        {n:'Battle Hardened',s:'crewEfficiency',d:'+15% crew efficiency',i:'\uD83C\uDF96\uFE0F',t:10,l:100,p:1,r:'normal',x:2,y:0,pr:['sfc_2']},
        {n:'Leadership Aura',s:'crewEfficiency',d:'+15% all stats for nearby',i:'\u2728',t:20,l:200,p:2,r:'normal',x:2,y:1,pr:['sfc_3']},
        {n:'Fleet Tactics',s:'weaponDamage',d:'+18% fleet damage',i:'\uD83D\uDCCB',t:25,l:250,p:3,r:'normal',x:3,y:1,pr:['sfc_3']},
        {n:'Command Presence',s:'crewEfficiency',d:'+22% crew efficiency',i:'\u2B50',t:35,l:350,p:4,r:'normal',x:3,y:2,pr:['sfc_3']},
        {n:'Admiral',s:'crewEfficiency',d:'+30% crew, +25% range',i:'\u2693',t:30,l:300,p:3,r:'notable',x:3,y:0,pr:['sfc_3']},
        {n:'Battle Commander',s:'weaponDamage',d:'+25% fleet damage, +20% speed',i:'\u2694\uFE0F',t:40,l:400,p:5,r:'normal',x:4,y:1,pr:['sfc_3']},
        {n:'Grand Fleet',s:'weaponDamage',d:'+35% fleet damage',i:'\uD83D\uDE80',t:55,l:550,p:5,r:'normal',x:5,y:1,pr:['sfc_8']},
        {n:'Supreme Admiral',s:'crewEfficiency',d:'+60% crew, +20% all stats',i:'\uD83C\uDFC6',t:60,l:600,p:5,r:'keystone',x:4,y:0,pr:['sfc_7']},
        {n:'Command Empire',s:'fleetCommandRange',d:'+50% range, +35% crew',i:'\uD83D\uDCE1',t:75,l:750,p:8,r:'normal',x:5,y:2,pr:['sfc_10']},
        {n:'Fleet Master',s:'crewEfficiency',d:'+70% crew, +40% all stats',i:'\u2693',t:70,l:700,p:8,r:'keystone',x:5,y:0,pr:['sfc_10']},
        {n:'Supreme Leader',s:'weaponDamage',d:'+60% fleet damage, +40% speed',i:'\uD83C\uDFC6',t:85,l:850,p:10,r:'notable',x:6,y:1,pr:['sfc_11']},
        {n:'Galactic Overlord',s:'crewEfficiency',d:'+100% crew, +50% all stats',i:'\u2604\uFE0F',t:90,l:900,p:12,r:'ascendancy',x:6,y:0,pr:['sfc_11']},
        {n:'Eternal Admiral',s:'crewEfficiency',d:'+120% crew, +80% all stats',i:'\u267E\uFE0F',t:95,l:950,p:15,r:'ascendancy',x:6,y:2,pr:['sfc_12']},
        {n:'Legendary Commander',s:'crewEfficiency',d:'+100% crew, +50% all stats',i:'\uD83D\uDC51',t:99,l:999,p:20,r:'ascendancy',x:7,y:0,pr:['sfc_12']},
        {n:'Command Eternal',s:'weaponDamage',d:'+80% fleet damage, +60% stats',i:'\u267E\uFE0F',t:99,l:999,p:20,r:'ascendancy',x:7,y:1,pr:['sfc_16']},
      ]},
      { id: 'summoner_alchemist', name: 'Alchemist', icon: '\u2697\uFE0F', desc: 'Craft consumables and augmentations.', prefix: 'sal', nodes: [
        {n:'Basic Crafting',s:'resourceBonus',d:'+10% resource bonus',i:'\uD83E\uDDEA',t:1,l:10,p:1,r:'normal',x:0,y:0},
        {n:'Potion Mastery',s:'xpBonus',d:'+12% XP bonus',i:'\u2B50',t:5,l:50,p:1,r:'normal',x:1,y:0,pr:['sal_1']},
        {n:'Transmutation',s:'resourceBonus',d:'+15% resource bonus',i:'\u2697\uFE0F',t:10,l:100,p:1,r:'normal',x:2,y:0,pr:['sal_2']},
        {n:'Turn Optimizer',s:'turnEfficiency',d:'+15% turn efficiency',i:'\u23F1\uFE0F',t:20,l:200,p:2,r:'normal',x:2,y:1,pr:['sal_3']},
        {n:'Resource Alchemy',s:'resourceBonus',d:'+20% resource bonus',i:'\uD83D\uDCB0',t:30,l:300,p:3,r:'normal',x:3,y:1,pr:['sal_3']},
        {n:'Crafting Boost',s:'buildSpeedBonus',d:'+18% build speed',i:'\uD83D\uDD27',t:35,l:350,p:4,r:'normal',x:3,y:2,pr:['sal_3']},
        {n:'Philosopher Stone',s:'resourceBonus',d:'+30% resources, +20% XP',i:'\uD83D\uDC8E',t:25,l:250,p:3,r:'notable',x:3,y:0,pr:['sal_3']},
        {n:'Elixir Expert',s:'xpBonus',d:'+25% XP bonus',i:'\uD83E\uDDEA',t:40,l:400,p:5,r:'normal',x:4,y:1,pr:['sal_3']},
        {n:'Master Alchemist',s:'xpBonus',d:'+40% XP, +30% resources',i:'\u2697\uFE0F',t:55,l:550,p:5,r:'normal',x:5,y:1,pr:['sal_8']},
        {n:'Golden Touch',s:'resourceBonus',d:'+50% resources, -30% crafting costs',i:'\uD83E\uDD47',t:50,l:500,p:5,r:'keystone',x:4,y:0,pr:['sal_7']},
        {n:'Crafting Master',s:'buildSpeedBonus',d:'+50% build, +35% resources',i:'\uD83C\uDFD7\uFE0F',t:70,l:700,p:8,r:'normal',x:5,y:2,pr:['sal_10']},
        {n:'Transmutation God',s:'resourceBonus',d:'+70% resources, +50% XP',i:'\uD83D\uDC8E',t:65,l:650,p:8,r:'keystone',x:5,y:0,pr:['sal_10']},
        {n:'Alchemy Overlord',s:'xpBonus',d:'+60% XP, +50% resources',i:'\uD83C\uDF1F',t:80,l:800,p:10,r:'notable',x:6,y:1,pr:['sal_11']},
        {n:'Elixir of Eternity',s:'resourceBonus',d:'+100% all bonuses, craft legendaries',i:'\uD83C\uDFC6',t:90,l:900,p:12,r:'ascendancy',x:6,y:0,pr:['sal_11']},
        {n:'Eternal Alchemist',s:'resourceBonus',d:'+120% resources, +100% XP',i:'\u267E\uFE0F',t:99,l:999,p:20,r:'ascendancy',x:7,y:0,pr:['sal_14']},
        {n:'Supreme Crafter',s:'buildSpeedBonus',d:'+80% build, +60% resources',i:'\uD83C\uDFC6',t:85,l:850,p:10,r:'normal',x:7,y:1,pr:['sal_14']},
        {n:'Cosmic Alchemist',s:'xpBonus',d:'+100% XP, +80% resources',i:'\uD83C\uDF0C',t:95,l:950,p:15,r:'ascendancy',x:7,y:2,pr:['sal_14']},
      ]},
    ],
  },
];

let totalNodes = 0;
const trees = CLASSES.map(cls => ({
  id: cls.id, name: cls.name, description: 'Masters of ' + cls.name.toLowerCase() + ' specialization.', icon: cls.icon, color: cls.color, ascendancyClass: cls.id,
  subClasses: cls.subclasses.map(sc => ({
    id: sc.id, name: sc.name, description: sc.desc, icon: sc.icon,
    nodes: sc.nodes.map((n, i) => {
      totalNodes++;
      return {
        id: sc.prefix + '_' + (i + 1), name: n.n, description: n.d, icon: n.i,
        rarity: n.r, tier: n.t, requiredLevel: n.l, requiredPoints: n.p,
        x: n.x, y: n.y,
        modifiers: [{ stat: n.s, value: n.r === 'ascendancy' ? 80 : n.r === 'keystone' ? 40 : n.r === 'notable' ? 25 : 15, isPercent: true }],
        requires: n.pr || [], ascendancyClass: cls.id, subClass: sc.id,
      };
    }),
  })),
}));

const output = `/**
 * COMMANDER TALENT TREE SYSTEM (Poe2-Inspired)
 * ============================================================================
 * Deep passive skill tree with level 1-999 progression and tier 1-99 nodes.
 * ${totalNodes} total talent nodes across 6 classes and 18 sub-classes.
 */

export type TalentNodeRarity = 'normal' | 'notable' | 'keystone' | 'ascendancy';

export type StatType =
  | 'hullHp' | 'shieldHp' | 'shieldRecharge' | 'armorValue'
  | 'weaponDamage' | 'weaponSpeed' | 'weaponRange' | 'weaponCritChance' | 'weaponCritDamage'
  | 'energyWeapons' | 'kineticWeapons' | 'explosiveWeapons' | 'beamWeapons'
  | 'miningYield' | 'processingSpeed' | 'cargoCapacity' | 'warpSpeed' | 'warpStability'
  | 'targetingSpeed' | 'scanResolution' | 'sensorStrength' | 'electronicWarfare'
  | 'repairAmount' | 'logisticsBandwidth' | 'fleetCommandRange'
  | 'empireTaxReduction' | 'buildSpeedBonus' | 'researchSpeed' | 'diplomacyBonus'
  | 'crewEfficiency' | 'modulePowergrid' | 'moduleCpu' | 'capacitorCapacity' | 'capacitorRecharge'
  | 'flightVelocity' | 'agility' | 'signatureRadius' | 'avoidance'
  | 'xpBonus' | 'resourceBonus' | 'prestigeBonus' | 'turnEfficiency'
  | 'healthRegen' | 'damageReduction' | 'crowdControl' | 'summonPower' | 'fuelEfficiency';

export interface StatModifier {
  stat: StatType;
  value: number;
  isPercent: boolean;
}

export interface TalentNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: TalentNodeRarity;
  tier: number;
  requiredLevel: number;
  requiredPoints: number;
  x: number;
  y: number;
  modifiers: StatModifier[];
  requires?: string[];
  ascendancyClass?: string;
  subClass?: string;
  subTalents?: SubTalent[];
}

export interface SubTalent {
  id: string;
  name: string;
  description: string;
  statBonus: StatType;
  value: number;
  isPercent: boolean;
  requiredPoints: number;
}

export interface TalentTree {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  ascendancyClass: string;
  subClasses: {
    id: string;
    name: string;
    description: string;
    icon: string;
    nodes: TalentNode[];
  }[];
}

export interface CommanderTalentState {
  allocatedNodes: string[];
  totalPointsSpent: number;
  ascendancyPoints: number;
  ascendancyPointsSpent: number;
  respecCount: number;
}

export const TALENT_TREES: TalentTree[] = ${JSON.stringify(trees, null, 2)};

export const TOTAL_TALENT_NODES = ${totalNodes};

export function getTalentPointsForLevel(level: number): number {
  let points = level;
  if (level >= 100) points += 10;
  if (level >= 300) points += 30;
  if (level >= 600) points += 60;
  if (level >= 999) points += 100;
  return points;
}

export function getAscendancyPointsForLevel(level: number): number {
  let points = 0;
  if (level >= 100) points += 1;
  if (level >= 300) points += 1;
  if (level >= 600) points += 1;
  if (level >= 999) points += 1;
  return points;
}

export function canAllocateNode(
  node: TalentNode,
  state: CommanderTalentState,
  commanderLevel: number,
  availablePoints: number
): boolean {
  if (state.allocatedNodes.includes(node.id)) return false;
  if (commanderLevel < node.requiredLevel) return false;
  const spentOnTree = state.allocatedNodes.length;
  const totalPoints = getTalentPointsForLevel(commanderLevel);
  const remaining = totalPoints - spentOnTree;
  if (remaining < node.requiredPoints) return false;
  if (node.requires && node.requires.length > 0) {
    const hasAllPrereqs = node.requires.every(reqId => state.allocatedNodes.includes(reqId));
    if (!hasAllPrereqs) return false;
  }
  if (node.rarity === 'ascendancy') {
    if (state.ascendancyPointsSpent >= state.ascendancyPoints) return false;
  }
  return true;
}

export function calculateTalentModifiers(
  state: CommanderTalentState
): Partial<Record<StatType, number>> {
  const modifiers: Partial<Record<StatType, number>> = {};
  for (const tree of TALENT_TREES) {
    for (const sub of tree.subClasses) {
      for (const node of sub.nodes) {
        if (state.allocatedNodes.includes(node.id)) {
          for (const mod of node.modifiers) {
            modifiers[mod.stat] = (modifiers[mod.stat] || 0) + mod.value;
          }
        }
      }
    }
  }
  return modifiers;
}

export function getAllNodes(): TalentNode[] {
  const nodes: TalentNode[] = [];
  for (const tree of TALENT_TREES) {
    for (const sub of tree.subClasses) {
      nodes.push(...sub.nodes);
    }
  }
  return nodes;
}

export function getNodeById(id: string): TalentNode | undefined {
  return getAllNodes().find(n => n.id === id);
}
`;

fs.writeFileSync('shared/config/commanderTalentTree.ts', output);
console.log('Generated ' + totalNodes + ' talent nodes across ' + CLASSES.length + ' classes.');
