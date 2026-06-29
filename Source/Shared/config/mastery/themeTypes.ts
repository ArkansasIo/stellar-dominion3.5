// AUTO-GENERATED: 2026-06-20T04:13:39.498Z
export const TOTAL_THEME_TYPES = 200;
export const TOTAL_THEME_SUBTYPES = 1000;

export const THEME_FAMILIES = ["Elemental","Cosmic","Biological","Mechanical","Chemical","Energy","Dimensional","Spectral","Metaphysical","Technological","Strategic","Tactical","Economic","Social","Environmental","Astral","Arcane","Martial","Cybernetic","Psionic"];

export interface ThemeSubType {
  id: string;
  name: string;
  description: string;
  modifier: string;
  icon: string;
}

export interface ThemeType {
  id: string;
  family: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subTypes: ThemeSubType[];
}

export const THEME_TYPES: ThemeType[] = [
  {
    "id": "theme_0",
    "family": "Elemental",
    "name": "Fire",
    "description": "Fire-themed abilities within the Elemental family.",
    "icon": "🔥",
    "color": "hsl(0, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_0_0",
        "name": "Fire Mastery",
        "description": "Advanced fire sub-type for elemental theme.",
        "modifier": "Power: +5%",
        "icon": "🔥"
      },
      {
        "id": "subtype_0_1",
        "name": "Fire Expertise",
        "description": "Advanced fire sub-type for elemental theme.",
        "modifier": "Precision: +10%",
        "icon": "🌋"
      },
      {
        "id": "subtype_0_2",
        "name": "Fire Mastery II",
        "description": "Advanced fire sub-type for elemental theme.",
        "modifier": "Duration: +15%",
        "icon": "☄️"
      },
      {
        "id": "subtype_0_3",
        "name": "Fire Mastery III",
        "description": "Advanced fire sub-type for elemental theme.",
        "modifier": "Range: +20%",
        "icon": "☀️"
      },
      {
        "id": "subtype_0_4",
        "name": "Fire Supremacy",
        "description": "Advanced fire sub-type for elemental theme.",
        "modifier": "Potency: +25%",
        "icon": "💥"
      }
    ]
  },
  {
    "id": "theme_1",
    "family": "Elemental",
    "name": "Ice",
    "description": "Ice-themed abilities within the Elemental family.",
    "icon": "❄️",
    "color": "hsl(1.894736842105263, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_1_0",
        "name": "Ice Mastery",
        "description": "Advanced ice sub-type for elemental theme.",
        "modifier": "Power: +5%",
        "icon": "❄️"
      },
      {
        "id": "subtype_1_1",
        "name": "Ice Expertise",
        "description": "Advanced ice sub-type for elemental theme.",
        "modifier": "Precision: +10%",
        "icon": "🧊"
      },
      {
        "id": "subtype_1_2",
        "name": "Ice Mastery II",
        "description": "Advanced ice sub-type for elemental theme.",
        "modifier": "Duration: +15%",
        "icon": "⛄"
      },
      {
        "id": "subtype_1_3",
        "name": "Ice Mastery III",
        "description": "Advanced ice sub-type for elemental theme.",
        "modifier": "Range: +20%",
        "icon": "🌨️"
      },
      {
        "id": "subtype_1_4",
        "name": "Ice Supremacy",
        "description": "Advanced ice sub-type for elemental theme.",
        "modifier": "Potency: +25%",
        "icon": "🥶"
      }
    ]
  },
  {
    "id": "theme_2",
    "family": "Elemental",
    "name": "Lightning",
    "description": "Lightning-themed abilities within the Elemental family.",
    "icon": "⚡",
    "color": "hsl(3.789473684210526, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_2_0",
        "name": "Lightning Mastery",
        "description": "Advanced lightning sub-type for elemental theme.",
        "modifier": "Power: +5%",
        "icon": "⚡"
      },
      {
        "id": "subtype_2_1",
        "name": "Lightning Expertise",
        "description": "Advanced lightning sub-type for elemental theme.",
        "modifier": "Precision: +10%",
        "icon": "🌩️"
      },
      {
        "id": "subtype_2_2",
        "name": "Lightning Mastery II",
        "description": "Advanced lightning sub-type for elemental theme.",
        "modifier": "Duration: +15%",
        "icon": "⚡"
      },
      {
        "id": "subtype_2_3",
        "name": "Lightning Mastery III",
        "description": "Advanced lightning sub-type for elemental theme.",
        "modifier": "Range: +20%",
        "icon": "💥"
      },
      {
        "id": "subtype_2_4",
        "name": "Lightning Supremacy",
        "description": "Advanced lightning sub-type for elemental theme.",
        "modifier": "Potency: +25%",
        "icon": "🔌"
      }
    ]
  },
  {
    "id": "theme_3",
    "family": "Elemental",
    "name": "Earth",
    "description": "Earth-themed abilities within the Elemental family.",
    "icon": "🌍",
    "color": "hsl(5.684210526315789, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_3_0",
        "name": "Earth Mastery",
        "description": "Advanced earth sub-type for elemental theme.",
        "modifier": "Power: +5%",
        "icon": "🌍"
      },
      {
        "id": "subtype_3_1",
        "name": "Earth Expertise",
        "description": "Advanced earth sub-type for elemental theme.",
        "modifier": "Precision: +10%",
        "icon": "⛰️"
      },
      {
        "id": "subtype_3_2",
        "name": "Earth Mastery II",
        "description": "Advanced earth sub-type for elemental theme.",
        "modifier": "Duration: +15%",
        "icon": "🪨"
      },
      {
        "id": "subtype_3_3",
        "name": "Earth Mastery III",
        "description": "Advanced earth sub-type for elemental theme.",
        "modifier": "Range: +20%",
        "icon": "🏔️"
      },
      {
        "id": "subtype_3_4",
        "name": "Earth Supremacy",
        "description": "Advanced earth sub-type for elemental theme.",
        "modifier": "Potency: +25%",
        "icon": "🌋"
      }
    ]
  },
  {
    "id": "theme_4",
    "family": "Elemental",
    "name": "Wind",
    "description": "Wind-themed abilities within the Elemental family.",
    "icon": "💨",
    "color": "hsl(7.578947368421052, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_4_0",
        "name": "Wind Mastery",
        "description": "Advanced wind sub-type for elemental theme.",
        "modifier": "Power: +5%",
        "icon": "💨"
      },
      {
        "id": "subtype_4_1",
        "name": "Wind Expertise",
        "description": "Advanced wind sub-type for elemental theme.",
        "modifier": "Precision: +10%",
        "icon": "🌬️"
      },
      {
        "id": "subtype_4_2",
        "name": "Wind Mastery II",
        "description": "Advanced wind sub-type for elemental theme.",
        "modifier": "Duration: +15%",
        "icon": "🌪️"
      },
      {
        "id": "subtype_4_3",
        "name": "Wind Mastery III",
        "description": "Advanced wind sub-type for elemental theme.",
        "modifier": "Range: +20%",
        "icon": "🌀"
      },
      {
        "id": "subtype_4_4",
        "name": "Wind Supremacy",
        "description": "Advanced wind sub-type for elemental theme.",
        "modifier": "Potency: +25%",
        "icon": "✈️"
      }
    ]
  },
  {
    "id": "theme_5",
    "family": "Elemental",
    "name": "Water",
    "description": "Water-themed abilities within the Elemental family.",
    "icon": "💧",
    "color": "hsl(9.473684210526315, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_5_0",
        "name": "Water Mastery",
        "description": "Advanced water sub-type for elemental theme.",
        "modifier": "Power: +5%",
        "icon": "💧"
      },
      {
        "id": "subtype_5_1",
        "name": "Water Expertise",
        "description": "Advanced water sub-type for elemental theme.",
        "modifier": "Precision: +10%",
        "icon": "🌊"
      },
      {
        "id": "subtype_5_2",
        "name": "Water Mastery II",
        "description": "Advanced water sub-type for elemental theme.",
        "modifier": "Duration: +15%",
        "icon": "🌊"
      },
      {
        "id": "subtype_5_3",
        "name": "Water Mastery III",
        "description": "Advanced water sub-type for elemental theme.",
        "modifier": "Range: +20%",
        "icon": "💦"
      },
      {
        "id": "subtype_5_4",
        "name": "Water Supremacy",
        "description": "Advanced water sub-type for elemental theme.",
        "modifier": "Potency: +25%",
        "icon": "💧"
      }
    ]
  },
  {
    "id": "theme_6",
    "family": "Elemental",
    "name": "Light",
    "description": "Light-themed abilities within the Elemental family.",
    "icon": "✨",
    "color": "hsl(11.368421052631579, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_6_0",
        "name": "Light Mastery",
        "description": "Advanced light sub-type for elemental theme.",
        "modifier": "Power: +5%",
        "icon": "✨"
      },
      {
        "id": "subtype_6_1",
        "name": "Light Expertise",
        "description": "Advanced light sub-type for elemental theme.",
        "modifier": "Precision: +10%",
        "icon": "💡"
      },
      {
        "id": "subtype_6_2",
        "name": "Light Mastery II",
        "description": "Advanced light sub-type for elemental theme.",
        "modifier": "Duration: +15%",
        "icon": "☀️"
      },
      {
        "id": "subtype_6_3",
        "name": "Light Mastery III",
        "description": "Advanced light sub-type for elemental theme.",
        "modifier": "Range: +20%",
        "icon": "🌟"
      },
      {
        "id": "subtype_6_4",
        "name": "Light Supremacy",
        "description": "Advanced light sub-type for elemental theme.",
        "modifier": "Potency: +25%",
        "icon": "💫"
      }
    ]
  },
  {
    "id": "theme_7",
    "family": "Elemental",
    "name": "Darkness",
    "description": "Darkness-themed abilities within the Elemental family.",
    "icon": "🌑",
    "color": "hsl(13.26315789473684, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_7_0",
        "name": "Darkness Mastery",
        "description": "Advanced darkness sub-type for elemental theme.",
        "modifier": "Power: +5%",
        "icon": "🌑"
      },
      {
        "id": "subtype_7_1",
        "name": "Darkness Expertise",
        "description": "Advanced darkness sub-type for elemental theme.",
        "modifier": "Precision: +10%",
        "icon": "🖤"
      },
      {
        "id": "subtype_7_2",
        "name": "Darkness Mastery II",
        "description": "Advanced darkness sub-type for elemental theme.",
        "modifier": "Duration: +15%",
        "icon": "⬛"
      },
      {
        "id": "subtype_7_3",
        "name": "Darkness Mastery III",
        "description": "Advanced darkness sub-type for elemental theme.",
        "modifier": "Range: +20%",
        "icon": "🌑"
      },
      {
        "id": "subtype_7_4",
        "name": "Darkness Supremacy",
        "description": "Advanced darkness sub-type for elemental theme.",
        "modifier": "Potency: +25%",
        "icon": "🌑"
      }
    ]
  },
  {
    "id": "theme_8",
    "family": "Elemental",
    "name": "Void",
    "description": "Void-themed abilities within the Elemental family.",
    "icon": "✦",
    "color": "hsl(15.157894736842104, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_8_0",
        "name": "Void Mastery",
        "description": "Advanced void sub-type for elemental theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_8_1",
        "name": "Void Expertise",
        "description": "Advanced void sub-type for elemental theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_8_2",
        "name": "Void Mastery II",
        "description": "Advanced void sub-type for elemental theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_8_3",
        "name": "Void Mastery III",
        "description": "Advanced void sub-type for elemental theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_8_4",
        "name": "Void Supremacy",
        "description": "Advanced void sub-type for elemental theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_9",
    "family": "Elemental",
    "name": "Plasma",
    "description": "Plasma-themed abilities within the Elemental family.",
    "icon": "✦",
    "color": "hsl(17.052631578947366, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_9_0",
        "name": "Plasma Mastery",
        "description": "Advanced plasma sub-type for elemental theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_9_1",
        "name": "Plasma Expertise",
        "description": "Advanced plasma sub-type for elemental theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_9_2",
        "name": "Plasma Mastery II",
        "description": "Advanced plasma sub-type for elemental theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_9_3",
        "name": "Plasma Mastery III",
        "description": "Advanced plasma sub-type for elemental theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_9_4",
        "name": "Plasma Supremacy",
        "description": "Advanced plasma sub-type for elemental theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_10",
    "family": "Cosmic",
    "name": "Star",
    "description": "Star-themed abilities within the Cosmic family.",
    "icon": "✦",
    "color": "hsl(18.94736842105263, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_10_0",
        "name": "Star Mastery",
        "description": "Advanced star sub-type for cosmic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_10_1",
        "name": "Star Expertise",
        "description": "Advanced star sub-type for cosmic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_10_2",
        "name": "Star Mastery II",
        "description": "Advanced star sub-type for cosmic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_10_3",
        "name": "Star Mastery III",
        "description": "Advanced star sub-type for cosmic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_10_4",
        "name": "Star Supremacy",
        "description": "Advanced star sub-type for cosmic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_11",
    "family": "Cosmic",
    "name": "Nebula",
    "description": "Nebula-themed abilities within the Cosmic family.",
    "icon": "✦",
    "color": "hsl(20.842105263157894, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_11_0",
        "name": "Nebula Mastery",
        "description": "Advanced nebula sub-type for cosmic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_11_1",
        "name": "Nebula Expertise",
        "description": "Advanced nebula sub-type for cosmic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_11_2",
        "name": "Nebula Mastery II",
        "description": "Advanced nebula sub-type for cosmic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_11_3",
        "name": "Nebula Mastery III",
        "description": "Advanced nebula sub-type for cosmic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_11_4",
        "name": "Nebula Supremacy",
        "description": "Advanced nebula sub-type for cosmic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_12",
    "family": "Cosmic",
    "name": "Black Hole",
    "description": "Black Hole-themed abilities within the Cosmic family.",
    "icon": "✦",
    "color": "hsl(22.736842105263158, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_12_0",
        "name": "Black Hole Mastery",
        "description": "Advanced black hole sub-type for cosmic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_12_1",
        "name": "Black Hole Expertise",
        "description": "Advanced black hole sub-type for cosmic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_12_2",
        "name": "Black Hole Mastery II",
        "description": "Advanced black hole sub-type for cosmic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_12_3",
        "name": "Black Hole Mastery III",
        "description": "Advanced black hole sub-type for cosmic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_12_4",
        "name": "Black Hole Supremacy",
        "description": "Advanced black hole sub-type for cosmic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_13",
    "family": "Cosmic",
    "name": "Pulsar",
    "description": "Pulsar-themed abilities within the Cosmic family.",
    "icon": "✦",
    "color": "hsl(24.63157894736842, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_13_0",
        "name": "Pulsar Mastery",
        "description": "Advanced pulsar sub-type for cosmic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_13_1",
        "name": "Pulsar Expertise",
        "description": "Advanced pulsar sub-type for cosmic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_13_2",
        "name": "Pulsar Mastery II",
        "description": "Advanced pulsar sub-type for cosmic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_13_3",
        "name": "Pulsar Mastery III",
        "description": "Advanced pulsar sub-type for cosmic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_13_4",
        "name": "Pulsar Supremacy",
        "description": "Advanced pulsar sub-type for cosmic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_14",
    "family": "Cosmic",
    "name": "Quasar",
    "description": "Quasar-themed abilities within the Cosmic family.",
    "icon": "✦",
    "color": "hsl(26.52631578947368, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_14_0",
        "name": "Quasar Mastery",
        "description": "Advanced quasar sub-type for cosmic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_14_1",
        "name": "Quasar Expertise",
        "description": "Advanced quasar sub-type for cosmic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_14_2",
        "name": "Quasar Mastery II",
        "description": "Advanced quasar sub-type for cosmic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_14_3",
        "name": "Quasar Mastery III",
        "description": "Advanced quasar sub-type for cosmic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_14_4",
        "name": "Quasar Supremacy",
        "description": "Advanced quasar sub-type for cosmic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_15",
    "family": "Cosmic",
    "name": "Supernova",
    "description": "Supernova-themed abilities within the Cosmic family.",
    "icon": "✦",
    "color": "hsl(28.421052631578945, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_15_0",
        "name": "Supernova Mastery",
        "description": "Advanced supernova sub-type for cosmic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_15_1",
        "name": "Supernova Expertise",
        "description": "Advanced supernova sub-type for cosmic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_15_2",
        "name": "Supernova Mastery II",
        "description": "Advanced supernova sub-type for cosmic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_15_3",
        "name": "Supernova Mastery III",
        "description": "Advanced supernova sub-type for cosmic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_15_4",
        "name": "Supernova Supremacy",
        "description": "Advanced supernova sub-type for cosmic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_16",
    "family": "Cosmic",
    "name": "Gravity",
    "description": "Gravity-themed abilities within the Cosmic family.",
    "icon": "✦",
    "color": "hsl(30.31578947368421, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_16_0",
        "name": "Gravity Mastery",
        "description": "Advanced gravity sub-type for cosmic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_16_1",
        "name": "Gravity Expertise",
        "description": "Advanced gravity sub-type for cosmic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_16_2",
        "name": "Gravity Mastery II",
        "description": "Advanced gravity sub-type for cosmic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_16_3",
        "name": "Gravity Mastery III",
        "description": "Advanced gravity sub-type for cosmic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_16_4",
        "name": "Gravity Supremacy",
        "description": "Advanced gravity sub-type for cosmic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_17",
    "family": "Cosmic",
    "name": "Dark Matter",
    "description": "Dark Matter-themed abilities within the Cosmic family.",
    "icon": "✦",
    "color": "hsl(32.21052631578947, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_17_0",
        "name": "Dark Matter Mastery",
        "description": "Advanced dark matter sub-type for cosmic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_17_1",
        "name": "Dark Matter Expertise",
        "description": "Advanced dark matter sub-type for cosmic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_17_2",
        "name": "Dark Matter Mastery II",
        "description": "Advanced dark matter sub-type for cosmic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_17_3",
        "name": "Dark Matter Mastery III",
        "description": "Advanced dark matter sub-type for cosmic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_17_4",
        "name": "Dark Matter Supremacy",
        "description": "Advanced dark matter sub-type for cosmic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_18",
    "family": "Cosmic",
    "name": "Dark Energy",
    "description": "Dark Energy-themed abilities within the Cosmic family.",
    "icon": "✦",
    "color": "hsl(34.10526315789473, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_18_0",
        "name": "Dark Energy Mastery",
        "description": "Advanced dark energy sub-type for cosmic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_18_1",
        "name": "Dark Energy Expertise",
        "description": "Advanced dark energy sub-type for cosmic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_18_2",
        "name": "Dark Energy Mastery II",
        "description": "Advanced dark energy sub-type for cosmic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_18_3",
        "name": "Dark Energy Mastery III",
        "description": "Advanced dark energy sub-type for cosmic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_18_4",
        "name": "Dark Energy Supremacy",
        "description": "Advanced dark energy sub-type for cosmic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_19",
    "family": "Cosmic",
    "name": "Cosmic Ray",
    "description": "Cosmic Ray-themed abilities within the Cosmic family.",
    "icon": "✦",
    "color": "hsl(36, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_19_0",
        "name": "Cosmic Ray Mastery",
        "description": "Advanced cosmic ray sub-type for cosmic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_19_1",
        "name": "Cosmic Ray Expertise",
        "description": "Advanced cosmic ray sub-type for cosmic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_19_2",
        "name": "Cosmic Ray Mastery II",
        "description": "Advanced cosmic ray sub-type for cosmic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_19_3",
        "name": "Cosmic Ray Mastery III",
        "description": "Advanced cosmic ray sub-type for cosmic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_19_4",
        "name": "Cosmic Ray Supremacy",
        "description": "Advanced cosmic ray sub-type for cosmic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_20",
    "family": "Biological",
    "name": "Organic",
    "description": "Organic-themed abilities within the Biological family.",
    "icon": "✦",
    "color": "hsl(37.89473684210526, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_20_0",
        "name": "Organic Mastery",
        "description": "Advanced organic sub-type for biological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_20_1",
        "name": "Organic Expertise",
        "description": "Advanced organic sub-type for biological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_20_2",
        "name": "Organic Mastery II",
        "description": "Advanced organic sub-type for biological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_20_3",
        "name": "Organic Mastery III",
        "description": "Advanced organic sub-type for biological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_20_4",
        "name": "Organic Supremacy",
        "description": "Advanced organic sub-type for biological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_21",
    "family": "Biological",
    "name": "Synthetic",
    "description": "Synthetic-themed abilities within the Biological family.",
    "icon": "✦",
    "color": "hsl(39.78947368421053, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_21_0",
        "name": "Synthetic Mastery",
        "description": "Advanced synthetic sub-type for biological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_21_1",
        "name": "Synthetic Expertise",
        "description": "Advanced synthetic sub-type for biological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_21_2",
        "name": "Synthetic Mastery II",
        "description": "Advanced synthetic sub-type for biological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_21_3",
        "name": "Synthetic Mastery III",
        "description": "Advanced synthetic sub-type for biological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_21_4",
        "name": "Synthetic Supremacy",
        "description": "Advanced synthetic sub-type for biological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_22",
    "family": "Biological",
    "name": "Hybrid",
    "description": "Hybrid-themed abilities within the Biological family.",
    "icon": "✦",
    "color": "hsl(41.68421052631579, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_22_0",
        "name": "Hybrid Mastery",
        "description": "Advanced hybrid sub-type for biological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_22_1",
        "name": "Hybrid Expertise",
        "description": "Advanced hybrid sub-type for biological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_22_2",
        "name": "Hybrid Mastery II",
        "description": "Advanced hybrid sub-type for biological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_22_3",
        "name": "Hybrid Mastery III",
        "description": "Advanced hybrid sub-type for biological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_22_4",
        "name": "Hybrid Supremacy",
        "description": "Advanced hybrid sub-type for biological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_23",
    "family": "Biological",
    "name": "Crystalline",
    "description": "Crystalline-themed abilities within the Biological family.",
    "icon": "✦",
    "color": "hsl(43.57894736842105, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_23_0",
        "name": "Crystalline Mastery",
        "description": "Advanced crystalline sub-type for biological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_23_1",
        "name": "Crystalline Expertise",
        "description": "Advanced crystalline sub-type for biological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_23_2",
        "name": "Crystalline Mastery II",
        "description": "Advanced crystalline sub-type for biological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_23_3",
        "name": "Crystalline Mastery III",
        "description": "Advanced crystalline sub-type for biological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_23_4",
        "name": "Crystalline Supremacy",
        "description": "Advanced crystalline sub-type for biological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_24",
    "family": "Biological",
    "name": "Fungal",
    "description": "Fungal-themed abilities within the Biological family.",
    "icon": "✦",
    "color": "hsl(45.473684210526315, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_24_0",
        "name": "Fungal Mastery",
        "description": "Advanced fungal sub-type for biological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_24_1",
        "name": "Fungal Expertise",
        "description": "Advanced fungal sub-type for biological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_24_2",
        "name": "Fungal Mastery II",
        "description": "Advanced fungal sub-type for biological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_24_3",
        "name": "Fungal Mastery III",
        "description": "Advanced fungal sub-type for biological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_24_4",
        "name": "Fungal Supremacy",
        "description": "Advanced fungal sub-type for biological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_25",
    "family": "Biological",
    "name": "Venomous",
    "description": "Venomous-themed abilities within the Biological family.",
    "icon": "✦",
    "color": "hsl(47.368421052631575, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_25_0",
        "name": "Venomous Mastery",
        "description": "Advanced venomous sub-type for biological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_25_1",
        "name": "Venomous Expertise",
        "description": "Advanced venomous sub-type for biological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_25_2",
        "name": "Venomous Mastery II",
        "description": "Advanced venomous sub-type for biological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_25_3",
        "name": "Venomous Mastery III",
        "description": "Advanced venomous sub-type for biological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_25_4",
        "name": "Venomous Supremacy",
        "description": "Advanced venomous sub-type for biological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_26",
    "family": "Biological",
    "name": "Regenerative",
    "description": "Regenerative-themed abilities within the Biological family.",
    "icon": "✦",
    "color": "hsl(49.26315789473684, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_26_0",
        "name": "Regenerative Mastery",
        "description": "Advanced regenerative sub-type for biological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_26_1",
        "name": "Regenerative Expertise",
        "description": "Advanced regenerative sub-type for biological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_26_2",
        "name": "Regenerative Mastery II",
        "description": "Advanced regenerative sub-type for biological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_26_3",
        "name": "Regenerative Mastery III",
        "description": "Advanced regenerative sub-type for biological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_26_4",
        "name": "Regenerative Supremacy",
        "description": "Advanced regenerative sub-type for biological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_27",
    "family": "Biological",
    "name": "Parasitic",
    "description": "Parasitic-themed abilities within the Biological family.",
    "icon": "✦",
    "color": "hsl(51.1578947368421, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_27_0",
        "name": "Parasitic Mastery",
        "description": "Advanced parasitic sub-type for biological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_27_1",
        "name": "Parasitic Expertise",
        "description": "Advanced parasitic sub-type for biological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_27_2",
        "name": "Parasitic Mastery II",
        "description": "Advanced parasitic sub-type for biological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_27_3",
        "name": "Parasitic Mastery III",
        "description": "Advanced parasitic sub-type for biological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_27_4",
        "name": "Parasitic Supremacy",
        "description": "Advanced parasitic sub-type for biological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_28",
    "family": "Biological",
    "name": "Symbiotic",
    "description": "Symbiotic-themed abilities within the Biological family.",
    "icon": "✦",
    "color": "hsl(53.05263157894736, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_28_0",
        "name": "Symbiotic Mastery",
        "description": "Advanced symbiotic sub-type for biological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_28_1",
        "name": "Symbiotic Expertise",
        "description": "Advanced symbiotic sub-type for biological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_28_2",
        "name": "Symbiotic Mastery II",
        "description": "Advanced symbiotic sub-type for biological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_28_3",
        "name": "Symbiotic Mastery III",
        "description": "Advanced symbiotic sub-type for biological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_28_4",
        "name": "Symbiotic Supremacy",
        "description": "Advanced symbiotic sub-type for biological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_29",
    "family": "Biological",
    "name": "Mutagenic",
    "description": "Mutagenic-themed abilities within the Biological family.",
    "icon": "✦",
    "color": "hsl(54.94736842105263, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_29_0",
        "name": "Mutagenic Mastery",
        "description": "Advanced mutagenic sub-type for biological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_29_1",
        "name": "Mutagenic Expertise",
        "description": "Advanced mutagenic sub-type for biological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_29_2",
        "name": "Mutagenic Mastery II",
        "description": "Advanced mutagenic sub-type for biological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_29_3",
        "name": "Mutagenic Mastery III",
        "description": "Advanced mutagenic sub-type for biological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_29_4",
        "name": "Mutagenic Supremacy",
        "description": "Advanced mutagenic sub-type for biological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_30",
    "family": "Mechanical",
    "name": "Kinetic",
    "description": "Kinetic-themed abilities within the Mechanical family.",
    "icon": "✦",
    "color": "hsl(56.84210526315789, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_30_0",
        "name": "Kinetic Mastery",
        "description": "Advanced kinetic sub-type for mechanical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_30_1",
        "name": "Kinetic Expertise",
        "description": "Advanced kinetic sub-type for mechanical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_30_2",
        "name": "Kinetic Mastery II",
        "description": "Advanced kinetic sub-type for mechanical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_30_3",
        "name": "Kinetic Mastery III",
        "description": "Advanced kinetic sub-type for mechanical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_30_4",
        "name": "Kinetic Supremacy",
        "description": "Advanced kinetic sub-type for mechanical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_31",
    "family": "Mechanical",
    "name": "Pneumatic",
    "description": "Pneumatic-themed abilities within the Mechanical family.",
    "icon": "✦",
    "color": "hsl(58.73684210526316, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_31_0",
        "name": "Pneumatic Mastery",
        "description": "Advanced pneumatic sub-type for mechanical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_31_1",
        "name": "Pneumatic Expertise",
        "description": "Advanced pneumatic sub-type for mechanical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_31_2",
        "name": "Pneumatic Mastery II",
        "description": "Advanced pneumatic sub-type for mechanical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_31_3",
        "name": "Pneumatic Mastery III",
        "description": "Advanced pneumatic sub-type for mechanical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_31_4",
        "name": "Pneumatic Supremacy",
        "description": "Advanced pneumatic sub-type for mechanical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_32",
    "family": "Mechanical",
    "name": "Hydraulic",
    "description": "Hydraulic-themed abilities within the Mechanical family.",
    "icon": "✦",
    "color": "hsl(60.63157894736842, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_32_0",
        "name": "Hydraulic Mastery",
        "description": "Advanced hydraulic sub-type for mechanical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_32_1",
        "name": "Hydraulic Expertise",
        "description": "Advanced hydraulic sub-type for mechanical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_32_2",
        "name": "Hydraulic Mastery II",
        "description": "Advanced hydraulic sub-type for mechanical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_32_3",
        "name": "Hydraulic Mastery III",
        "description": "Advanced hydraulic sub-type for mechanical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_32_4",
        "name": "Hydraulic Supremacy",
        "description": "Advanced hydraulic sub-type for mechanical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_33",
    "family": "Mechanical",
    "name": "Magnetic",
    "description": "Magnetic-themed abilities within the Mechanical family.",
    "icon": "✦",
    "color": "hsl(62.52631578947368, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_33_0",
        "name": "Magnetic Mastery",
        "description": "Advanced magnetic sub-type for mechanical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_33_1",
        "name": "Magnetic Expertise",
        "description": "Advanced magnetic sub-type for mechanical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_33_2",
        "name": "Magnetic Mastery II",
        "description": "Advanced magnetic sub-type for mechanical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_33_3",
        "name": "Magnetic Mastery III",
        "description": "Advanced magnetic sub-type for mechanical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_33_4",
        "name": "Magnetic Supremacy",
        "description": "Advanced magnetic sub-type for mechanical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_34",
    "family": "Mechanical",
    "name": "Electric",
    "description": "Electric-themed abilities within the Mechanical family.",
    "icon": "✦",
    "color": "hsl(64.42105263157895, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_34_0",
        "name": "Electric Mastery",
        "description": "Advanced electric sub-type for mechanical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_34_1",
        "name": "Electric Expertise",
        "description": "Advanced electric sub-type for mechanical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_34_2",
        "name": "Electric Mastery II",
        "description": "Advanced electric sub-type for mechanical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_34_3",
        "name": "Electric Mastery III",
        "description": "Advanced electric sub-type for mechanical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_34_4",
        "name": "Electric Supremacy",
        "description": "Advanced electric sub-type for mechanical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_35",
    "family": "Mechanical",
    "name": "Piezoelectric",
    "description": "Piezoelectric-themed abilities within the Mechanical family.",
    "icon": "✦",
    "color": "hsl(66.3157894736842, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_35_0",
        "name": "Piezoelectric Mastery",
        "description": "Advanced piezoelectric sub-type for mechanical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_35_1",
        "name": "Piezoelectric Expertise",
        "description": "Advanced piezoelectric sub-type for mechanical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_35_2",
        "name": "Piezoelectric Mastery II",
        "description": "Advanced piezoelectric sub-type for mechanical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_35_3",
        "name": "Piezoelectric Mastery III",
        "description": "Advanced piezoelectric sub-type for mechanical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_35_4",
        "name": "Piezoelectric Supremacy",
        "description": "Advanced piezoelectric sub-type for mechanical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_36",
    "family": "Mechanical",
    "name": "Thermal",
    "description": "Thermal-themed abilities within the Mechanical family.",
    "icon": "✦",
    "color": "hsl(68.21052631578947, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_36_0",
        "name": "Thermal Mastery",
        "description": "Advanced thermal sub-type for mechanical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_36_1",
        "name": "Thermal Expertise",
        "description": "Advanced thermal sub-type for mechanical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_36_2",
        "name": "Thermal Mastery II",
        "description": "Advanced thermal sub-type for mechanical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_36_3",
        "name": "Thermal Mastery III",
        "description": "Advanced thermal sub-type for mechanical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_36_4",
        "name": "Thermal Supremacy",
        "description": "Advanced thermal sub-type for mechanical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_37",
    "family": "Mechanical",
    "name": "Acoustic",
    "description": "Acoustic-themed abilities within the Mechanical family.",
    "icon": "✦",
    "color": "hsl(70.10526315789474, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_37_0",
        "name": "Acoustic Mastery",
        "description": "Advanced acoustic sub-type for mechanical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_37_1",
        "name": "Acoustic Expertise",
        "description": "Advanced acoustic sub-type for mechanical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_37_2",
        "name": "Acoustic Mastery II",
        "description": "Advanced acoustic sub-type for mechanical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_37_3",
        "name": "Acoustic Mastery III",
        "description": "Advanced acoustic sub-type for mechanical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_37_4",
        "name": "Acoustic Supremacy",
        "description": "Advanced acoustic sub-type for mechanical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_38",
    "family": "Mechanical",
    "name": "Optical",
    "description": "Optical-themed abilities within the Mechanical family.",
    "icon": "✦",
    "color": "hsl(72, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_38_0",
        "name": "Optical Mastery",
        "description": "Advanced optical sub-type for mechanical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_38_1",
        "name": "Optical Expertise",
        "description": "Advanced optical sub-type for mechanical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_38_2",
        "name": "Optical Mastery II",
        "description": "Advanced optical sub-type for mechanical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_38_3",
        "name": "Optical Mastery III",
        "description": "Advanced optical sub-type for mechanical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_38_4",
        "name": "Optical Supremacy",
        "description": "Advanced optical sub-type for mechanical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_39",
    "family": "Mechanical",
    "name": "Gravitonic",
    "description": "Gravitonic-themed abilities within the Mechanical family.",
    "icon": "✦",
    "color": "hsl(73.89473684210526, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_39_0",
        "name": "Gravitonic Mastery",
        "description": "Advanced gravitonic sub-type for mechanical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_39_1",
        "name": "Gravitonic Expertise",
        "description": "Advanced gravitonic sub-type for mechanical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_39_2",
        "name": "Gravitonic Mastery II",
        "description": "Advanced gravitonic sub-type for mechanical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_39_3",
        "name": "Gravitonic Mastery III",
        "description": "Advanced gravitonic sub-type for mechanical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_39_4",
        "name": "Gravitonic Supremacy",
        "description": "Advanced gravitonic sub-type for mechanical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_40",
    "family": "Chemical",
    "name": "Acid",
    "description": "Acid-themed abilities within the Chemical family.",
    "icon": "✦",
    "color": "hsl(75.78947368421052, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_40_0",
        "name": "Acid Mastery",
        "description": "Advanced acid sub-type for chemical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_40_1",
        "name": "Acid Expertise",
        "description": "Advanced acid sub-type for chemical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_40_2",
        "name": "Acid Mastery II",
        "description": "Advanced acid sub-type for chemical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_40_3",
        "name": "Acid Mastery III",
        "description": "Advanced acid sub-type for chemical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_40_4",
        "name": "Acid Supremacy",
        "description": "Advanced acid sub-type for chemical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_41",
    "family": "Chemical",
    "name": "Base",
    "description": "Base-themed abilities within the Chemical family.",
    "icon": "✦",
    "color": "hsl(77.68421052631578, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_41_0",
        "name": "Base Mastery",
        "description": "Advanced base sub-type for chemical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_41_1",
        "name": "Base Expertise",
        "description": "Advanced base sub-type for chemical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_41_2",
        "name": "Base Mastery II",
        "description": "Advanced base sub-type for chemical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_41_3",
        "name": "Base Mastery III",
        "description": "Advanced base sub-type for chemical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_41_4",
        "name": "Base Supremacy",
        "description": "Advanced base sub-type for chemical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_42",
    "family": "Chemical",
    "name": "Catalyst",
    "description": "Catalyst-themed abilities within the Chemical family.",
    "icon": "✦",
    "color": "hsl(79.57894736842105, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_42_0",
        "name": "Catalyst Mastery",
        "description": "Advanced catalyst sub-type for chemical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_42_1",
        "name": "Catalyst Expertise",
        "description": "Advanced catalyst sub-type for chemical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_42_2",
        "name": "Catalyst Mastery II",
        "description": "Advanced catalyst sub-type for chemical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_42_3",
        "name": "Catalyst Mastery III",
        "description": "Advanced catalyst sub-type for chemical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_42_4",
        "name": "Catalyst Supremacy",
        "description": "Advanced catalyst sub-type for chemical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_43",
    "family": "Chemical",
    "name": "Solvent",
    "description": "Solvent-themed abilities within the Chemical family.",
    "icon": "✦",
    "color": "hsl(81.47368421052632, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_43_0",
        "name": "Solvent Mastery",
        "description": "Advanced solvent sub-type for chemical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_43_1",
        "name": "Solvent Expertise",
        "description": "Advanced solvent sub-type for chemical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_43_2",
        "name": "Solvent Mastery II",
        "description": "Advanced solvent sub-type for chemical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_43_3",
        "name": "Solvent Mastery III",
        "description": "Advanced solvent sub-type for chemical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_43_4",
        "name": "Solvent Supremacy",
        "description": "Advanced solvent sub-type for chemical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_44",
    "family": "Chemical",
    "name": "Polymer",
    "description": "Polymer-themed abilities within the Chemical family.",
    "icon": "✦",
    "color": "hsl(83.36842105263158, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_44_0",
        "name": "Polymer Mastery",
        "description": "Advanced polymer sub-type for chemical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_44_1",
        "name": "Polymer Expertise",
        "description": "Advanced polymer sub-type for chemical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_44_2",
        "name": "Polymer Mastery II",
        "description": "Advanced polymer sub-type for chemical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_44_3",
        "name": "Polymer Mastery III",
        "description": "Advanced polymer sub-type for chemical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_44_4",
        "name": "Polymer Supremacy",
        "description": "Advanced polymer sub-type for chemical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_45",
    "family": "Chemical",
    "name": "Colloid",
    "description": "Colloid-themed abilities within the Chemical family.",
    "icon": "✦",
    "color": "hsl(85.26315789473684, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_45_0",
        "name": "Colloid Mastery",
        "description": "Advanced colloid sub-type for chemical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_45_1",
        "name": "Colloid Expertise",
        "description": "Advanced colloid sub-type for chemical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_45_2",
        "name": "Colloid Mastery II",
        "description": "Advanced colloid sub-type for chemical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_45_3",
        "name": "Colloid Mastery III",
        "description": "Advanced colloid sub-type for chemical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_45_4",
        "name": "Colloid Supremacy",
        "description": "Advanced colloid sub-type for chemical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_46",
    "family": "Chemical",
    "name": "Suspension",
    "description": "Suspension-themed abilities within the Chemical family.",
    "icon": "✦",
    "color": "hsl(87.1578947368421, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_46_0",
        "name": "Suspension Mastery",
        "description": "Advanced suspension sub-type for chemical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_46_1",
        "name": "Suspension Expertise",
        "description": "Advanced suspension sub-type for chemical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_46_2",
        "name": "Suspension Mastery II",
        "description": "Advanced suspension sub-type for chemical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_46_3",
        "name": "Suspension Mastery III",
        "description": "Advanced suspension sub-type for chemical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_46_4",
        "name": "Suspension Supremacy",
        "description": "Advanced suspension sub-type for chemical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_47",
    "family": "Chemical",
    "name": "Emulsion",
    "description": "Emulsion-themed abilities within the Chemical family.",
    "icon": "✦",
    "color": "hsl(89.05263157894737, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_47_0",
        "name": "Emulsion Mastery",
        "description": "Advanced emulsion sub-type for chemical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_47_1",
        "name": "Emulsion Expertise",
        "description": "Advanced emulsion sub-type for chemical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_47_2",
        "name": "Emulsion Mastery II",
        "description": "Advanced emulsion sub-type for chemical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_47_3",
        "name": "Emulsion Mastery III",
        "description": "Advanced emulsion sub-type for chemical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_47_4",
        "name": "Emulsion Supremacy",
        "description": "Advanced emulsion sub-type for chemical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_48",
    "family": "Chemical",
    "name": "Aerosol",
    "description": "Aerosol-themed abilities within the Chemical family.",
    "icon": "✦",
    "color": "hsl(90.94736842105263, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_48_0",
        "name": "Aerosol Mastery",
        "description": "Advanced aerosol sub-type for chemical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_48_1",
        "name": "Aerosol Expertise",
        "description": "Advanced aerosol sub-type for chemical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_48_2",
        "name": "Aerosol Mastery II",
        "description": "Advanced aerosol sub-type for chemical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_48_3",
        "name": "Aerosol Mastery III",
        "description": "Advanced aerosol sub-type for chemical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_48_4",
        "name": "Aerosol Supremacy",
        "description": "Advanced aerosol sub-type for chemical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_49",
    "family": "Chemical",
    "name": "Gel",
    "description": "Gel-themed abilities within the Chemical family.",
    "icon": "✦",
    "color": "hsl(92.84210526315789, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_49_0",
        "name": "Gel Mastery",
        "description": "Advanced gel sub-type for chemical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_49_1",
        "name": "Gel Expertise",
        "description": "Advanced gel sub-type for chemical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_49_2",
        "name": "Gel Mastery II",
        "description": "Advanced gel sub-type for chemical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_49_3",
        "name": "Gel Mastery III",
        "description": "Advanced gel sub-type for chemical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_49_4",
        "name": "Gel Supremacy",
        "description": "Advanced gel sub-type for chemical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_50",
    "family": "Energy",
    "name": "Thermal",
    "description": "Thermal-themed abilities within the Energy family.",
    "icon": "✦",
    "color": "hsl(94.73684210526315, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_50_0",
        "name": "Thermal Mastery",
        "description": "Advanced thermal sub-type for energy theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_50_1",
        "name": "Thermal Expertise",
        "description": "Advanced thermal sub-type for energy theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_50_2",
        "name": "Thermal Mastery II",
        "description": "Advanced thermal sub-type for energy theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_50_3",
        "name": "Thermal Mastery III",
        "description": "Advanced thermal sub-type for energy theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_50_4",
        "name": "Thermal Supremacy",
        "description": "Advanced thermal sub-type for energy theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_51",
    "family": "Energy",
    "name": "Radiant",
    "description": "Radiant-themed abilities within the Energy family.",
    "icon": "✦",
    "color": "hsl(96.63157894736841, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_51_0",
        "name": "Radiant Mastery",
        "description": "Advanced radiant sub-type for energy theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_51_1",
        "name": "Radiant Expertise",
        "description": "Advanced radiant sub-type for energy theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_51_2",
        "name": "Radiant Mastery II",
        "description": "Advanced radiant sub-type for energy theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_51_3",
        "name": "Radiant Mastery III",
        "description": "Advanced radiant sub-type for energy theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_51_4",
        "name": "Radiant Supremacy",
        "description": "Advanced radiant sub-type for energy theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_52",
    "family": "Energy",
    "name": "Kinetic",
    "description": "Kinetic-themed abilities within the Energy family.",
    "icon": "✦",
    "color": "hsl(98.52631578947368, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_52_0",
        "name": "Kinetic Mastery",
        "description": "Advanced kinetic sub-type for energy theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_52_1",
        "name": "Kinetic Expertise",
        "description": "Advanced kinetic sub-type for energy theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_52_2",
        "name": "Kinetic Mastery II",
        "description": "Advanced kinetic sub-type for energy theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_52_3",
        "name": "Kinetic Mastery III",
        "description": "Advanced kinetic sub-type for energy theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_52_4",
        "name": "Kinetic Supremacy",
        "description": "Advanced kinetic sub-type for energy theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_53",
    "family": "Energy",
    "name": "Potential",
    "description": "Potential-themed abilities within the Energy family.",
    "icon": "✦",
    "color": "hsl(100.42105263157895, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_53_0",
        "name": "Potential Mastery",
        "description": "Advanced potential sub-type for energy theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_53_1",
        "name": "Potential Expertise",
        "description": "Advanced potential sub-type for energy theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_53_2",
        "name": "Potential Mastery II",
        "description": "Advanced potential sub-type for energy theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_53_3",
        "name": "Potential Mastery III",
        "description": "Advanced potential sub-type for energy theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_53_4",
        "name": "Potential Supremacy",
        "description": "Advanced potential sub-type for energy theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_54",
    "family": "Energy",
    "name": "Chemical",
    "description": "Chemical-themed abilities within the Energy family.",
    "icon": "✦",
    "color": "hsl(102.3157894736842, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_54_0",
        "name": "Chemical Mastery",
        "description": "Advanced chemical sub-type for energy theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_54_1",
        "name": "Chemical Expertise",
        "description": "Advanced chemical sub-type for energy theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_54_2",
        "name": "Chemical Mastery II",
        "description": "Advanced chemical sub-type for energy theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_54_3",
        "name": "Chemical Mastery III",
        "description": "Advanced chemical sub-type for energy theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_54_4",
        "name": "Chemical Supremacy",
        "description": "Advanced chemical sub-type for energy theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_55",
    "family": "Energy",
    "name": "Nuclear",
    "description": "Nuclear-themed abilities within the Energy family.",
    "icon": "✦",
    "color": "hsl(104.21052631578947, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_55_0",
        "name": "Nuclear Mastery",
        "description": "Advanced nuclear sub-type for energy theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_55_1",
        "name": "Nuclear Expertise",
        "description": "Advanced nuclear sub-type for energy theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_55_2",
        "name": "Nuclear Mastery II",
        "description": "Advanced nuclear sub-type for energy theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_55_3",
        "name": "Nuclear Mastery III",
        "description": "Advanced nuclear sub-type for energy theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_55_4",
        "name": "Nuclear Supremacy",
        "description": "Advanced nuclear sub-type for energy theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_56",
    "family": "Energy",
    "name": "Electrical",
    "description": "Electrical-themed abilities within the Energy family.",
    "icon": "✦",
    "color": "hsl(106.10526315789473, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_56_0",
        "name": "Electrical Mastery",
        "description": "Advanced electrical sub-type for energy theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_56_1",
        "name": "Electrical Expertise",
        "description": "Advanced electrical sub-type for energy theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_56_2",
        "name": "Electrical Mastery II",
        "description": "Advanced electrical sub-type for energy theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_56_3",
        "name": "Electrical Mastery III",
        "description": "Advanced electrical sub-type for energy theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_56_4",
        "name": "Electrical Supremacy",
        "description": "Advanced electrical sub-type for energy theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_57",
    "family": "Energy",
    "name": "Magnetic",
    "description": "Magnetic-themed abilities within the Energy family.",
    "icon": "✦",
    "color": "hsl(108, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_57_0",
        "name": "Magnetic Mastery",
        "description": "Advanced magnetic sub-type for energy theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_57_1",
        "name": "Magnetic Expertise",
        "description": "Advanced magnetic sub-type for energy theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_57_2",
        "name": "Magnetic Mastery II",
        "description": "Advanced magnetic sub-type for energy theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_57_3",
        "name": "Magnetic Mastery III",
        "description": "Advanced magnetic sub-type for energy theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_57_4",
        "name": "Magnetic Supremacy",
        "description": "Advanced magnetic sub-type for energy theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_58",
    "family": "Energy",
    "name": "Elastic",
    "description": "Elastic-themed abilities within the Energy family.",
    "icon": "✦",
    "color": "hsl(109.89473684210526, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_58_0",
        "name": "Elastic Mastery",
        "description": "Advanced elastic sub-type for energy theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_58_1",
        "name": "Elastic Expertise",
        "description": "Advanced elastic sub-type for energy theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_58_2",
        "name": "Elastic Mastery II",
        "description": "Advanced elastic sub-type for energy theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_58_3",
        "name": "Elastic Mastery III",
        "description": "Advanced elastic sub-type for energy theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_58_4",
        "name": "Elastic Supremacy",
        "description": "Advanced elastic sub-type for energy theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_59",
    "family": "Energy",
    "name": "Surface",
    "description": "Surface-themed abilities within the Energy family.",
    "icon": "✦",
    "color": "hsl(111.78947368421052, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_59_0",
        "name": "Surface Mastery",
        "description": "Advanced surface sub-type for energy theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_59_1",
        "name": "Surface Expertise",
        "description": "Advanced surface sub-type for energy theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_59_2",
        "name": "Surface Mastery II",
        "description": "Advanced surface sub-type for energy theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_59_3",
        "name": "Surface Mastery III",
        "description": "Advanced surface sub-type for energy theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_59_4",
        "name": "Surface Supremacy",
        "description": "Advanced surface sub-type for energy theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_60",
    "family": "Dimensional",
    "name": "Planar",
    "description": "Planar-themed abilities within the Dimensional family.",
    "icon": "✦",
    "color": "hsl(113.68421052631578, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_60_0",
        "name": "Planar Mastery",
        "description": "Advanced planar sub-type for dimensional theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_60_1",
        "name": "Planar Expertise",
        "description": "Advanced planar sub-type for dimensional theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_60_2",
        "name": "Planar Mastery II",
        "description": "Advanced planar sub-type for dimensional theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_60_3",
        "name": "Planar Mastery III",
        "description": "Advanced planar sub-type for dimensional theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_60_4",
        "name": "Planar Supremacy",
        "description": "Advanced planar sub-type for dimensional theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_61",
    "family": "Dimensional",
    "name": "Temporal",
    "description": "Temporal-themed abilities within the Dimensional family.",
    "icon": "✦",
    "color": "hsl(115.57894736842104, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_61_0",
        "name": "Temporal Mastery",
        "description": "Advanced temporal sub-type for dimensional theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_61_1",
        "name": "Temporal Expertise",
        "description": "Advanced temporal sub-type for dimensional theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_61_2",
        "name": "Temporal Mastery II",
        "description": "Advanced temporal sub-type for dimensional theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_61_3",
        "name": "Temporal Mastery III",
        "description": "Advanced temporal sub-type for dimensional theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_61_4",
        "name": "Temporal Supremacy",
        "description": "Advanced temporal sub-type for dimensional theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_62",
    "family": "Dimensional",
    "name": "Spatial",
    "description": "Spatial-themed abilities within the Dimensional family.",
    "icon": "✦",
    "color": "hsl(117.47368421052632, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_62_0",
        "name": "Spatial Mastery",
        "description": "Advanced spatial sub-type for dimensional theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_62_1",
        "name": "Spatial Expertise",
        "description": "Advanced spatial sub-type for dimensional theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_62_2",
        "name": "Spatial Mastery II",
        "description": "Advanced spatial sub-type for dimensional theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_62_3",
        "name": "Spatial Mastery III",
        "description": "Advanced spatial sub-type for dimensional theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_62_4",
        "name": "Spatial Supremacy",
        "description": "Advanced spatial sub-type for dimensional theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_63",
    "family": "Dimensional",
    "name": "Quantum",
    "description": "Quantum-themed abilities within the Dimensional family.",
    "icon": "✦",
    "color": "hsl(119.36842105263158, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_63_0",
        "name": "Quantum Mastery",
        "description": "Advanced quantum sub-type for dimensional theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_63_1",
        "name": "Quantum Expertise",
        "description": "Advanced quantum sub-type for dimensional theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_63_2",
        "name": "Quantum Mastery II",
        "description": "Advanced quantum sub-type for dimensional theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_63_3",
        "name": "Quantum Mastery III",
        "description": "Advanced quantum sub-type for dimensional theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_63_4",
        "name": "Quantum Supremacy",
        "description": "Advanced quantum sub-type for dimensional theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_64",
    "family": "Dimensional",
    "name": "Void",
    "description": "Void-themed abilities within the Dimensional family.",
    "icon": "✦",
    "color": "hsl(121.26315789473684, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_64_0",
        "name": "Void Mastery",
        "description": "Advanced void sub-type for dimensional theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_64_1",
        "name": "Void Expertise",
        "description": "Advanced void sub-type for dimensional theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_64_2",
        "name": "Void Mastery II",
        "description": "Advanced void sub-type for dimensional theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_64_3",
        "name": "Void Mastery III",
        "description": "Advanced void sub-type for dimensional theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_64_4",
        "name": "Void Supremacy",
        "description": "Advanced void sub-type for dimensional theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_65",
    "family": "Dimensional",
    "name": "Mirror",
    "description": "Mirror-themed abilities within the Dimensional family.",
    "icon": "✦",
    "color": "hsl(123.1578947368421, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_65_0",
        "name": "Mirror Mastery",
        "description": "Advanced mirror sub-type for dimensional theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_65_1",
        "name": "Mirror Expertise",
        "description": "Advanced mirror sub-type for dimensional theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_65_2",
        "name": "Mirror Mastery II",
        "description": "Advanced mirror sub-type for dimensional theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_65_3",
        "name": "Mirror Mastery III",
        "description": "Advanced mirror sub-type for dimensional theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_65_4",
        "name": "Mirror Supremacy",
        "description": "Advanced mirror sub-type for dimensional theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_66",
    "family": "Dimensional",
    "name": "Fractal",
    "description": "Fractal-themed abilities within the Dimensional family.",
    "icon": "✦",
    "color": "hsl(125.05263157894736, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_66_0",
        "name": "Fractal Mastery",
        "description": "Advanced fractal sub-type for dimensional theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_66_1",
        "name": "Fractal Expertise",
        "description": "Advanced fractal sub-type for dimensional theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_66_2",
        "name": "Fractal Mastery II",
        "description": "Advanced fractal sub-type for dimensional theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_66_3",
        "name": "Fractal Mastery III",
        "description": "Advanced fractal sub-type for dimensional theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_66_4",
        "name": "Fractal Supremacy",
        "description": "Advanced fractal sub-type for dimensional theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_67",
    "family": "Dimensional",
    "name": "Recursive",
    "description": "Recursive-themed abilities within the Dimensional family.",
    "icon": "✦",
    "color": "hsl(126.94736842105263, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_67_0",
        "name": "Recursive Mastery",
        "description": "Advanced recursive sub-type for dimensional theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_67_1",
        "name": "Recursive Expertise",
        "description": "Advanced recursive sub-type for dimensional theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_67_2",
        "name": "Recursive Mastery II",
        "description": "Advanced recursive sub-type for dimensional theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_67_3",
        "name": "Recursive Mastery III",
        "description": "Advanced recursive sub-type for dimensional theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_67_4",
        "name": "Recursive Supremacy",
        "description": "Advanced recursive sub-type for dimensional theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_68",
    "family": "Dimensional",
    "name": "Infinite",
    "description": "Infinite-themed abilities within the Dimensional family.",
    "icon": "✦",
    "color": "hsl(128.8421052631579, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_68_0",
        "name": "Infinite Mastery",
        "description": "Advanced infinite sub-type for dimensional theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_68_1",
        "name": "Infinite Expertise",
        "description": "Advanced infinite sub-type for dimensional theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_68_2",
        "name": "Infinite Mastery II",
        "description": "Advanced infinite sub-type for dimensional theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_68_3",
        "name": "Infinite Mastery III",
        "description": "Advanced infinite sub-type for dimensional theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_68_4",
        "name": "Infinite Supremacy",
        "description": "Advanced infinite sub-type for dimensional theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_69",
    "family": "Dimensional",
    "name": "Paradox",
    "description": "Paradox-themed abilities within the Dimensional family.",
    "icon": "✦",
    "color": "hsl(130.73684210526315, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_69_0",
        "name": "Paradox Mastery",
        "description": "Advanced paradox sub-type for dimensional theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_69_1",
        "name": "Paradox Expertise",
        "description": "Advanced paradox sub-type for dimensional theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_69_2",
        "name": "Paradox Mastery II",
        "description": "Advanced paradox sub-type for dimensional theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_69_3",
        "name": "Paradox Mastery III",
        "description": "Advanced paradox sub-type for dimensional theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_69_4",
        "name": "Paradox Supremacy",
        "description": "Advanced paradox sub-type for dimensional theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_70",
    "family": "Spectral",
    "name": "Ultraviolet",
    "description": "Ultraviolet-themed abilities within the Spectral family.",
    "icon": "✦",
    "color": "hsl(132.6315789473684, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_70_0",
        "name": "Ultraviolet Mastery",
        "description": "Advanced ultraviolet sub-type for spectral theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_70_1",
        "name": "Ultraviolet Expertise",
        "description": "Advanced ultraviolet sub-type for spectral theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_70_2",
        "name": "Ultraviolet Mastery II",
        "description": "Advanced ultraviolet sub-type for spectral theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_70_3",
        "name": "Ultraviolet Mastery III",
        "description": "Advanced ultraviolet sub-type for spectral theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_70_4",
        "name": "Ultraviolet Supremacy",
        "description": "Advanced ultraviolet sub-type for spectral theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_71",
    "family": "Spectral",
    "name": "Infrared",
    "description": "Infrared-themed abilities within the Spectral family.",
    "icon": "✦",
    "color": "hsl(134.52631578947367, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_71_0",
        "name": "Infrared Mastery",
        "description": "Advanced infrared sub-type for spectral theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_71_1",
        "name": "Infrared Expertise",
        "description": "Advanced infrared sub-type for spectral theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_71_2",
        "name": "Infrared Mastery II",
        "description": "Advanced infrared sub-type for spectral theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_71_3",
        "name": "Infrared Mastery III",
        "description": "Advanced infrared sub-type for spectral theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_71_4",
        "name": "Infrared Supremacy",
        "description": "Advanced infrared sub-type for spectral theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_72",
    "family": "Spectral",
    "name": "X-Ray",
    "description": "X-Ray-themed abilities within the Spectral family.",
    "icon": "✦",
    "color": "hsl(136.42105263157893, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_72_0",
        "name": "X-Ray Mastery",
        "description": "Advanced x-ray sub-type for spectral theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_72_1",
        "name": "X-Ray Expertise",
        "description": "Advanced x-ray sub-type for spectral theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_72_2",
        "name": "X-Ray Mastery II",
        "description": "Advanced x-ray sub-type for spectral theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_72_3",
        "name": "X-Ray Mastery III",
        "description": "Advanced x-ray sub-type for spectral theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_72_4",
        "name": "X-Ray Supremacy",
        "description": "Advanced x-ray sub-type for spectral theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_73",
    "family": "Spectral",
    "name": "Gamma",
    "description": "Gamma-themed abilities within the Spectral family.",
    "icon": "✦",
    "color": "hsl(138.3157894736842, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_73_0",
        "name": "Gamma Mastery",
        "description": "Advanced gamma sub-type for spectral theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_73_1",
        "name": "Gamma Expertise",
        "description": "Advanced gamma sub-type for spectral theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_73_2",
        "name": "Gamma Mastery II",
        "description": "Advanced gamma sub-type for spectral theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_73_3",
        "name": "Gamma Mastery III",
        "description": "Advanced gamma sub-type for spectral theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_73_4",
        "name": "Gamma Supremacy",
        "description": "Advanced gamma sub-type for spectral theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_74",
    "family": "Spectral",
    "name": "Radio",
    "description": "Radio-themed abilities within the Spectral family.",
    "icon": "✦",
    "color": "hsl(140.21052631578948, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_74_0",
        "name": "Radio Mastery",
        "description": "Advanced radio sub-type for spectral theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_74_1",
        "name": "Radio Expertise",
        "description": "Advanced radio sub-type for spectral theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_74_2",
        "name": "Radio Mastery II",
        "description": "Advanced radio sub-type for spectral theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_74_3",
        "name": "Radio Mastery III",
        "description": "Advanced radio sub-type for spectral theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_74_4",
        "name": "Radio Supremacy",
        "description": "Advanced radio sub-type for spectral theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_75",
    "family": "Spectral",
    "name": "Microwave",
    "description": "Microwave-themed abilities within the Spectral family.",
    "icon": "✦",
    "color": "hsl(142.10526315789474, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_75_0",
        "name": "Microwave Mastery",
        "description": "Advanced microwave sub-type for spectral theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_75_1",
        "name": "Microwave Expertise",
        "description": "Advanced microwave sub-type for spectral theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_75_2",
        "name": "Microwave Mastery II",
        "description": "Advanced microwave sub-type for spectral theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_75_3",
        "name": "Microwave Mastery III",
        "description": "Advanced microwave sub-type for spectral theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_75_4",
        "name": "Microwave Supremacy",
        "description": "Advanced microwave sub-type for spectral theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_76",
    "family": "Spectral",
    "name": "Visible",
    "description": "Visible-themed abilities within the Spectral family.",
    "icon": "✦",
    "color": "hsl(144, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_76_0",
        "name": "Visible Mastery",
        "description": "Advanced visible sub-type for spectral theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_76_1",
        "name": "Visible Expertise",
        "description": "Advanced visible sub-type for spectral theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_76_2",
        "name": "Visible Mastery II",
        "description": "Advanced visible sub-type for spectral theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_76_3",
        "name": "Visible Mastery III",
        "description": "Advanced visible sub-type for spectral theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_76_4",
        "name": "Visible Supremacy",
        "description": "Advanced visible sub-type for spectral theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_77",
    "family": "Spectral",
    "name": "Infrared",
    "description": "Infrared-themed abilities within the Spectral family.",
    "icon": "✦",
    "color": "hsl(145.89473684210526, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_77_0",
        "name": "Infrared Mastery",
        "description": "Advanced infrared sub-type for spectral theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_77_1",
        "name": "Infrared Expertise",
        "description": "Advanced infrared sub-type for spectral theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_77_2",
        "name": "Infrared Mastery II",
        "description": "Advanced infrared sub-type for spectral theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_77_3",
        "name": "Infrared Mastery III",
        "description": "Advanced infrared sub-type for spectral theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_77_4",
        "name": "Infrared Supremacy",
        "description": "Advanced infrared sub-type for spectral theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_78",
    "family": "Spectral",
    "name": "Terahertz",
    "description": "Terahertz-themed abilities within the Spectral family.",
    "icon": "✦",
    "color": "hsl(147.78947368421052, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_78_0",
        "name": "Terahertz Mastery",
        "description": "Advanced terahertz sub-type for spectral theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_78_1",
        "name": "Terahertz Expertise",
        "description": "Advanced terahertz sub-type for spectral theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_78_2",
        "name": "Terahertz Mastery II",
        "description": "Advanced terahertz sub-type for spectral theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_78_3",
        "name": "Terahertz Mastery III",
        "description": "Advanced terahertz sub-type for spectral theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_78_4",
        "name": "Terahertz Supremacy",
        "description": "Advanced terahertz sub-type for spectral theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_79",
    "family": "Spectral",
    "name": "Neutrino",
    "description": "Neutrino-themed abilities within the Spectral family.",
    "icon": "✦",
    "color": "hsl(149.68421052631578, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_79_0",
        "name": "Neutrino Mastery",
        "description": "Advanced neutrino sub-type for spectral theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_79_1",
        "name": "Neutrino Expertise",
        "description": "Advanced neutrino sub-type for spectral theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_79_2",
        "name": "Neutrino Mastery II",
        "description": "Advanced neutrino sub-type for spectral theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_79_3",
        "name": "Neutrino Mastery III",
        "description": "Advanced neutrino sub-type for spectral theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_79_4",
        "name": "Neutrino Supremacy",
        "description": "Advanced neutrino sub-type for spectral theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_80",
    "family": "Metaphysical",
    "name": "Spiritual",
    "description": "Spiritual-themed abilities within the Metaphysical family.",
    "icon": "✦",
    "color": "hsl(151.57894736842104, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_80_0",
        "name": "Spiritual Mastery",
        "description": "Advanced spiritual sub-type for metaphysical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_80_1",
        "name": "Spiritual Expertise",
        "description": "Advanced spiritual sub-type for metaphysical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_80_2",
        "name": "Spiritual Mastery II",
        "description": "Advanced spiritual sub-type for metaphysical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_80_3",
        "name": "Spiritual Mastery III",
        "description": "Advanced spiritual sub-type for metaphysical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_80_4",
        "name": "Spiritual Supremacy",
        "description": "Advanced spiritual sub-type for metaphysical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_81",
    "family": "Metaphysical",
    "name": "Psychic",
    "description": "Psychic-themed abilities within the Metaphysical family.",
    "icon": "✦",
    "color": "hsl(153.4736842105263, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_81_0",
        "name": "Psychic Mastery",
        "description": "Advanced psychic sub-type for metaphysical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_81_1",
        "name": "Psychic Expertise",
        "description": "Advanced psychic sub-type for metaphysical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_81_2",
        "name": "Psychic Mastery II",
        "description": "Advanced psychic sub-type for metaphysical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_81_3",
        "name": "Psychic Mastery III",
        "description": "Advanced psychic sub-type for metaphysical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_81_4",
        "name": "Psychic Supremacy",
        "description": "Advanced psychic sub-type for metaphysical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_82",
    "family": "Metaphysical",
    "name": "Telepathic",
    "description": "Telepathic-themed abilities within the Metaphysical family.",
    "icon": "✦",
    "color": "hsl(155.36842105263156, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_82_0",
        "name": "Telepathic Mastery",
        "description": "Advanced telepathic sub-type for metaphysical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_82_1",
        "name": "Telepathic Expertise",
        "description": "Advanced telepathic sub-type for metaphysical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_82_2",
        "name": "Telepathic Mastery II",
        "description": "Advanced telepathic sub-type for metaphysical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_82_3",
        "name": "Telepathic Mastery III",
        "description": "Advanced telepathic sub-type for metaphysical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_82_4",
        "name": "Telepathic Supremacy",
        "description": "Advanced telepathic sub-type for metaphysical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_83",
    "family": "Metaphysical",
    "name": "Empathic",
    "description": "Empathic-themed abilities within the Metaphysical family.",
    "icon": "✦",
    "color": "hsl(157.26315789473682, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_83_0",
        "name": "Empathic Mastery",
        "description": "Advanced empathic sub-type for metaphysical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_83_1",
        "name": "Empathic Expertise",
        "description": "Advanced empathic sub-type for metaphysical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_83_2",
        "name": "Empathic Mastery II",
        "description": "Advanced empathic sub-type for metaphysical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_83_3",
        "name": "Empathic Mastery III",
        "description": "Advanced empathic sub-type for metaphysical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_83_4",
        "name": "Empathic Supremacy",
        "description": "Advanced empathic sub-type for metaphysical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_84",
    "family": "Metaphysical",
    "name": "Clairvoyant",
    "description": "Clairvoyant-themed abilities within the Metaphysical family.",
    "icon": "✦",
    "color": "hsl(159.1578947368421, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_84_0",
        "name": "Clairvoyant Mastery",
        "description": "Advanced clairvoyant sub-type for metaphysical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_84_1",
        "name": "Clairvoyant Expertise",
        "description": "Advanced clairvoyant sub-type for metaphysical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_84_2",
        "name": "Clairvoyant Mastery II",
        "description": "Advanced clairvoyant sub-type for metaphysical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_84_3",
        "name": "Clairvoyant Mastery III",
        "description": "Advanced clairvoyant sub-type for metaphysical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_84_4",
        "name": "Clairvoyant Supremacy",
        "description": "Advanced clairvoyant sub-type for metaphysical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_85",
    "family": "Metaphysical",
    "name": "Precognitive",
    "description": "Precognitive-themed abilities within the Metaphysical family.",
    "icon": "✦",
    "color": "hsl(161.05263157894737, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_85_0",
        "name": "Precognitive Mastery",
        "description": "Advanced precognitive sub-type for metaphysical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_85_1",
        "name": "Precognitive Expertise",
        "description": "Advanced precognitive sub-type for metaphysical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_85_2",
        "name": "Precognitive Mastery II",
        "description": "Advanced precognitive sub-type for metaphysical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_85_3",
        "name": "Precognitive Mastery III",
        "description": "Advanced precognitive sub-type for metaphysical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_85_4",
        "name": "Precognitive Supremacy",
        "description": "Advanced precognitive sub-type for metaphysical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_86",
    "family": "Metaphysical",
    "name": "Telekinetic",
    "description": "Telekinetic-themed abilities within the Metaphysical family.",
    "icon": "✦",
    "color": "hsl(162.94736842105263, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_86_0",
        "name": "Telekinetic Mastery",
        "description": "Advanced telekinetic sub-type for metaphysical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_86_1",
        "name": "Telekinetic Expertise",
        "description": "Advanced telekinetic sub-type for metaphysical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_86_2",
        "name": "Telekinetic Mastery II",
        "description": "Advanced telekinetic sub-type for metaphysical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_86_3",
        "name": "Telekinetic Mastery III",
        "description": "Advanced telekinetic sub-type for metaphysical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_86_4",
        "name": "Telekinetic Supremacy",
        "description": "Advanced telekinetic sub-type for metaphysical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_87",
    "family": "Metaphysical",
    "name": "Astral",
    "description": "Astral-themed abilities within the Metaphysical family.",
    "icon": "✦",
    "color": "hsl(164.8421052631579, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_87_0",
        "name": "Astral Mastery",
        "description": "Advanced astral sub-type for metaphysical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_87_1",
        "name": "Astral Expertise",
        "description": "Advanced astral sub-type for metaphysical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_87_2",
        "name": "Astral Mastery II",
        "description": "Advanced astral sub-type for metaphysical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_87_3",
        "name": "Astral Mastery III",
        "description": "Advanced astral sub-type for metaphysical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_87_4",
        "name": "Astral Supremacy",
        "description": "Advanced astral sub-type for metaphysical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_88",
    "family": "Metaphysical",
    "name": "Ethereal",
    "description": "Ethereal-themed abilities within the Metaphysical family.",
    "icon": "✦",
    "color": "hsl(166.73684210526315, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_88_0",
        "name": "Ethereal Mastery",
        "description": "Advanced ethereal sub-type for metaphysical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_88_1",
        "name": "Ethereal Expertise",
        "description": "Advanced ethereal sub-type for metaphysical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_88_2",
        "name": "Ethereal Mastery II",
        "description": "Advanced ethereal sub-type for metaphysical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_88_3",
        "name": "Ethereal Mastery III",
        "description": "Advanced ethereal sub-type for metaphysical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_88_4",
        "name": "Ethereal Supremacy",
        "description": "Advanced ethereal sub-type for metaphysical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_89",
    "family": "Metaphysical",
    "name": "Arcane",
    "description": "Arcane-themed abilities within the Metaphysical family.",
    "icon": "✦",
    "color": "hsl(168.6315789473684, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_89_0",
        "name": "Arcane Mastery",
        "description": "Advanced arcane sub-type for metaphysical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_89_1",
        "name": "Arcane Expertise",
        "description": "Advanced arcane sub-type for metaphysical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_89_2",
        "name": "Arcane Mastery II",
        "description": "Advanced arcane sub-type for metaphysical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_89_3",
        "name": "Arcane Mastery III",
        "description": "Advanced arcane sub-type for metaphysical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_89_4",
        "name": "Arcane Supremacy",
        "description": "Advanced arcane sub-type for metaphysical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_90",
    "family": "Technological",
    "name": "Nanotech",
    "description": "Nanotech-themed abilities within the Technological family.",
    "icon": "✦",
    "color": "hsl(170.52631578947367, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_90_0",
        "name": "Nanotech Mastery",
        "description": "Advanced nanotech sub-type for technological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_90_1",
        "name": "Nanotech Expertise",
        "description": "Advanced nanotech sub-type for technological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_90_2",
        "name": "Nanotech Mastery II",
        "description": "Advanced nanotech sub-type for technological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_90_3",
        "name": "Nanotech Mastery III",
        "description": "Advanced nanotech sub-type for technological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_90_4",
        "name": "Nanotech Supremacy",
        "description": "Advanced nanotech sub-type for technological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_91",
    "family": "Technological",
    "name": "Cybernetic",
    "description": "Cybernetic-themed abilities within the Technological family.",
    "icon": "✦",
    "color": "hsl(172.42105263157893, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_91_0",
        "name": "Cybernetic Mastery",
        "description": "Advanced cybernetic sub-type for technological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_91_1",
        "name": "Cybernetic Expertise",
        "description": "Advanced cybernetic sub-type for technological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_91_2",
        "name": "Cybernetic Mastery II",
        "description": "Advanced cybernetic sub-type for technological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_91_3",
        "name": "Cybernetic Mastery III",
        "description": "Advanced cybernetic sub-type for technological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_91_4",
        "name": "Cybernetic Supremacy",
        "description": "Advanced cybernetic sub-type for technological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_92",
    "family": "Technological",
    "name": "Holographic",
    "description": "Holographic-themed abilities within the Technological family.",
    "icon": "✦",
    "color": "hsl(174.3157894736842, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_92_0",
        "name": "Holographic Mastery",
        "description": "Advanced holographic sub-type for technological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_92_1",
        "name": "Holographic Expertise",
        "description": "Advanced holographic sub-type for technological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_92_2",
        "name": "Holographic Mastery II",
        "description": "Advanced holographic sub-type for technological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_92_3",
        "name": "Holographic Mastery III",
        "description": "Advanced holographic sub-type for technological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_92_4",
        "name": "Holographic Supremacy",
        "description": "Advanced holographic sub-type for technological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_93",
    "family": "Technological",
    "name": "Photonic",
    "description": "Photonic-themed abilities within the Technological family.",
    "icon": "✦",
    "color": "hsl(176.21052631578945, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_93_0",
        "name": "Photonic Mastery",
        "description": "Advanced photonic sub-type for technological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_93_1",
        "name": "Photonic Expertise",
        "description": "Advanced photonic sub-type for technological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_93_2",
        "name": "Photonic Mastery II",
        "description": "Advanced photonic sub-type for technological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_93_3",
        "name": "Photonic Mastery III",
        "description": "Advanced photonic sub-type for technological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_93_4",
        "name": "Photonic Supremacy",
        "description": "Advanced photonic sub-type for technological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_94",
    "family": "Technological",
    "name": "Quantum Computing",
    "description": "Quantum Computing-themed abilities within the Technological family.",
    "icon": "✦",
    "color": "hsl(178.10526315789474, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_94_0",
        "name": "Quantum Computing Mastery",
        "description": "Advanced quantum computing sub-type for technological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_94_1",
        "name": "Quantum Computing Expertise",
        "description": "Advanced quantum computing sub-type for technological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_94_2",
        "name": "Quantum Computing Mastery II",
        "description": "Advanced quantum computing sub-type for technological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_94_3",
        "name": "Quantum Computing Mastery III",
        "description": "Advanced quantum computing sub-type for technological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_94_4",
        "name": "Quantum Computing Supremacy",
        "description": "Advanced quantum computing sub-type for technological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_95",
    "family": "Technological",
    "name": "AI-Driven",
    "description": "AI-Driven-themed abilities within the Technological family.",
    "icon": "✦",
    "color": "hsl(180, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_95_0",
        "name": "AI-Driven Mastery",
        "description": "Advanced ai-driven sub-type for technological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_95_1",
        "name": "AI-Driven Expertise",
        "description": "Advanced ai-driven sub-type for technological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_95_2",
        "name": "AI-Driven Mastery II",
        "description": "Advanced ai-driven sub-type for technological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_95_3",
        "name": "AI-Driven Mastery III",
        "description": "Advanced ai-driven sub-type for technological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_95_4",
        "name": "AI-Driven Supremacy",
        "description": "Advanced ai-driven sub-type for technological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_96",
    "family": "Technological",
    "name": "Blockchain",
    "description": "Blockchain-themed abilities within the Technological family.",
    "icon": "✦",
    "color": "hsl(181.89473684210526, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_96_0",
        "name": "Blockchain Mastery",
        "description": "Advanced blockchain sub-type for technological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_96_1",
        "name": "Blockchain Expertise",
        "description": "Advanced blockchain sub-type for technological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_96_2",
        "name": "Blockchain Mastery II",
        "description": "Advanced blockchain sub-type for technological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_96_3",
        "name": "Blockchain Mastery III",
        "description": "Advanced blockchain sub-type for technological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_96_4",
        "name": "Blockchain Supremacy",
        "description": "Advanced blockchain sub-type for technological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_97",
    "family": "Technological",
    "name": "Biometric",
    "description": "Biometric-themed abilities within the Technological family.",
    "icon": "✦",
    "color": "hsl(183.78947368421052, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_97_0",
        "name": "Biometric Mastery",
        "description": "Advanced biometric sub-type for technological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_97_1",
        "name": "Biometric Expertise",
        "description": "Advanced biometric sub-type for technological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_97_2",
        "name": "Biometric Mastery II",
        "description": "Advanced biometric sub-type for technological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_97_3",
        "name": "Biometric Mastery III",
        "description": "Advanced biometric sub-type for technological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_97_4",
        "name": "Biometric Supremacy",
        "description": "Advanced biometric sub-type for technological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_98",
    "family": "Technological",
    "name": "Synthetic",
    "description": "Synthetic-themed abilities within the Technological family.",
    "icon": "✦",
    "color": "hsl(185.68421052631578, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_98_0",
        "name": "Synthetic Mastery",
        "description": "Advanced synthetic sub-type for technological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_98_1",
        "name": "Synthetic Expertise",
        "description": "Advanced synthetic sub-type for technological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_98_2",
        "name": "Synthetic Mastery II",
        "description": "Advanced synthetic sub-type for technological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_98_3",
        "name": "Synthetic Mastery III",
        "description": "Advanced synthetic sub-type for technological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_98_4",
        "name": "Synthetic Supremacy",
        "description": "Advanced synthetic sub-type for technological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_99",
    "family": "Technological",
    "name": "Hybrid",
    "description": "Hybrid-themed abilities within the Technological family.",
    "icon": "✦",
    "color": "hsl(187.57894736842104, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_99_0",
        "name": "Hybrid Mastery",
        "description": "Advanced hybrid sub-type for technological theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_99_1",
        "name": "Hybrid Expertise",
        "description": "Advanced hybrid sub-type for technological theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_99_2",
        "name": "Hybrid Mastery II",
        "description": "Advanced hybrid sub-type for technological theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_99_3",
        "name": "Hybrid Mastery III",
        "description": "Advanced hybrid sub-type for technological theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_99_4",
        "name": "Hybrid Supremacy",
        "description": "Advanced hybrid sub-type for technological theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_100",
    "family": "Strategic",
    "name": "Offensive",
    "description": "Offensive-themed abilities within the Strategic family.",
    "icon": "✦",
    "color": "hsl(189.4736842105263, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_100_0",
        "name": "Offensive Mastery",
        "description": "Advanced offensive sub-type for strategic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_100_1",
        "name": "Offensive Expertise",
        "description": "Advanced offensive sub-type for strategic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_100_2",
        "name": "Offensive Mastery II",
        "description": "Advanced offensive sub-type for strategic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_100_3",
        "name": "Offensive Mastery III",
        "description": "Advanced offensive sub-type for strategic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_100_4",
        "name": "Offensive Supremacy",
        "description": "Advanced offensive sub-type for strategic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_101",
    "family": "Strategic",
    "name": "Defensive",
    "description": "Defensive-themed abilities within the Strategic family.",
    "icon": "✦",
    "color": "hsl(191.36842105263156, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_101_0",
        "name": "Defensive Mastery",
        "description": "Advanced defensive sub-type for strategic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_101_1",
        "name": "Defensive Expertise",
        "description": "Advanced defensive sub-type for strategic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_101_2",
        "name": "Defensive Mastery II",
        "description": "Advanced defensive sub-type for strategic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_101_3",
        "name": "Defensive Mastery III",
        "description": "Advanced defensive sub-type for strategic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_101_4",
        "name": "Defensive Supremacy",
        "description": "Advanced defensive sub-type for strategic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_102",
    "family": "Strategic",
    "name": "Balanced",
    "description": "Balanced-themed abilities within the Strategic family.",
    "icon": "✦",
    "color": "hsl(193.26315789473682, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_102_0",
        "name": "Balanced Mastery",
        "description": "Advanced balanced sub-type for strategic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_102_1",
        "name": "Balanced Expertise",
        "description": "Advanced balanced sub-type for strategic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_102_2",
        "name": "Balanced Mastery II",
        "description": "Advanced balanced sub-type for strategic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_102_3",
        "name": "Balanced Mastery III",
        "description": "Advanced balanced sub-type for strategic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_102_4",
        "name": "Balanced Supremacy",
        "description": "Advanced balanced sub-type for strategic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_103",
    "family": "Strategic",
    "name": "Guerrilla",
    "description": "Guerrilla-themed abilities within the Strategic family.",
    "icon": "✦",
    "color": "hsl(195.15789473684208, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_103_0",
        "name": "Guerrilla Mastery",
        "description": "Advanced guerrilla sub-type for strategic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_103_1",
        "name": "Guerrilla Expertise",
        "description": "Advanced guerrilla sub-type for strategic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_103_2",
        "name": "Guerrilla Mastery II",
        "description": "Advanced guerrilla sub-type for strategic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_103_3",
        "name": "Guerrilla Mastery III",
        "description": "Advanced guerrilla sub-type for strategic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_103_4",
        "name": "Guerrilla Supremacy",
        "description": "Advanced guerrilla sub-type for strategic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_104",
    "family": "Strategic",
    "name": "Siege",
    "description": "Siege-themed abilities within the Strategic family.",
    "icon": "✦",
    "color": "hsl(197.05263157894737, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_104_0",
        "name": "Siege Mastery",
        "description": "Advanced siege sub-type for strategic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_104_1",
        "name": "Siege Expertise",
        "description": "Advanced siege sub-type for strategic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_104_2",
        "name": "Siege Mastery II",
        "description": "Advanced siege sub-type for strategic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_104_3",
        "name": "Siege Mastery III",
        "description": "Advanced siege sub-type for strategic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_104_4",
        "name": "Siege Supremacy",
        "description": "Advanced siege sub-type for strategic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_105",
    "family": "Strategic",
    "name": "Hit-and-Run",
    "description": "Hit-and-Run-themed abilities within the Strategic family.",
    "icon": "✦",
    "color": "hsl(198.94736842105263, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_105_0",
        "name": "Hit-and-Run Mastery",
        "description": "Advanced hit-and-run sub-type for strategic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_105_1",
        "name": "Hit-and-Run Expertise",
        "description": "Advanced hit-and-run sub-type for strategic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_105_2",
        "name": "Hit-and-Run Mastery II",
        "description": "Advanced hit-and-run sub-type for strategic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_105_3",
        "name": "Hit-and-Run Mastery III",
        "description": "Advanced hit-and-run sub-type for strategic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_105_4",
        "name": "Hit-and-Run Supremacy",
        "description": "Advanced hit-and-run sub-type for strategic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_106",
    "family": "Strategic",
    "name": "Fortification",
    "description": "Fortification-themed abilities within the Strategic family.",
    "icon": "✦",
    "color": "hsl(200.8421052631579, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_106_0",
        "name": "Fortification Mastery",
        "description": "Advanced fortification sub-type for strategic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_106_1",
        "name": "Fortification Expertise",
        "description": "Advanced fortification sub-type for strategic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_106_2",
        "name": "Fortification Mastery II",
        "description": "Advanced fortification sub-type for strategic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_106_3",
        "name": "Fortification Mastery III",
        "description": "Advanced fortification sub-type for strategic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_106_4",
        "name": "Fortification Supremacy",
        "description": "Advanced fortification sub-type for strategic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_107",
    "family": "Strategic",
    "name": "Ambush",
    "description": "Ambush-themed abilities within the Strategic family.",
    "icon": "✦",
    "color": "hsl(202.73684210526315, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_107_0",
        "name": "Ambush Mastery",
        "description": "Advanced ambush sub-type for strategic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_107_1",
        "name": "Ambush Expertise",
        "description": "Advanced ambush sub-type for strategic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_107_2",
        "name": "Ambush Mastery II",
        "description": "Advanced ambush sub-type for strategic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_107_3",
        "name": "Ambush Mastery III",
        "description": "Advanced ambush sub-type for strategic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_107_4",
        "name": "Ambush Supremacy",
        "description": "Advanced ambush sub-type for strategic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_108",
    "family": "Strategic",
    "name": "Encirclement",
    "description": "Encirclement-themed abilities within the Strategic family.",
    "icon": "✦",
    "color": "hsl(204.6315789473684, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_108_0",
        "name": "Encirclement Mastery",
        "description": "Advanced encirclement sub-type for strategic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_108_1",
        "name": "Encirclement Expertise",
        "description": "Advanced encirclement sub-type for strategic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_108_2",
        "name": "Encirclement Mastery II",
        "description": "Advanced encirclement sub-type for strategic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_108_3",
        "name": "Encirclement Mastery III",
        "description": "Advanced encirclement sub-type for strategic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_108_4",
        "name": "Encirclement Supremacy",
        "description": "Advanced encirclement sub-type for strategic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_109",
    "family": "Strategic",
    "name": "Attrition",
    "description": "Attrition-themed abilities within the Strategic family.",
    "icon": "✦",
    "color": "hsl(206.52631578947367, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_109_0",
        "name": "Attrition Mastery",
        "description": "Advanced attrition sub-type for strategic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_109_1",
        "name": "Attrition Expertise",
        "description": "Advanced attrition sub-type for strategic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_109_2",
        "name": "Attrition Mastery II",
        "description": "Advanced attrition sub-type for strategic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_109_3",
        "name": "Attrition Mastery III",
        "description": "Advanced attrition sub-type for strategic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_109_4",
        "name": "Attrition Supremacy",
        "description": "Advanced attrition sub-type for strategic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_110",
    "family": "Tactical",
    "name": "Flanking",
    "description": "Flanking-themed abilities within the Tactical family.",
    "icon": "✦",
    "color": "hsl(208.42105263157893, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_110_0",
        "name": "Flanking Mastery",
        "description": "Advanced flanking sub-type for tactical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_110_1",
        "name": "Flanking Expertise",
        "description": "Advanced flanking sub-type for tactical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_110_2",
        "name": "Flanking Mastery II",
        "description": "Advanced flanking sub-type for tactical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_110_3",
        "name": "Flanking Mastery III",
        "description": "Advanced flanking sub-type for tactical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_110_4",
        "name": "Flanking Supremacy",
        "description": "Advanced flanking sub-type for tactical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_111",
    "family": "Tactical",
    "name": "Overwatch",
    "description": "Overwatch-themed abilities within the Tactical family.",
    "icon": "✦",
    "color": "hsl(210.3157894736842, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_111_0",
        "name": "Overwatch Mastery",
        "description": "Advanced overwatch sub-type for tactical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_111_1",
        "name": "Overwatch Expertise",
        "description": "Advanced overwatch sub-type for tactical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_111_2",
        "name": "Overwatch Mastery II",
        "description": "Advanced overwatch sub-type for tactical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_111_3",
        "name": "Overwatch Mastery III",
        "description": "Advanced overwatch sub-type for tactical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_111_4",
        "name": "Overwatch Supremacy",
        "description": "Advanced overwatch sub-type for tactical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_112",
    "family": "Tactical",
    "name": "Assault",
    "description": "Assault-themed abilities within the Tactical family.",
    "icon": "✦",
    "color": "hsl(212.21052631578945, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_112_0",
        "name": "Assault Mastery",
        "description": "Advanced assault sub-type for tactical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_112_1",
        "name": "Assault Expertise",
        "description": "Advanced assault sub-type for tactical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_112_2",
        "name": "Assault Mastery II",
        "description": "Advanced assault sub-type for tactical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_112_3",
        "name": "Assault Mastery III",
        "description": "Advanced assault sub-type for tactical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_112_4",
        "name": "Assault Supremacy",
        "description": "Advanced assault sub-type for tactical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_113",
    "family": "Tactical",
    "name": "Recon",
    "description": "Recon-themed abilities within the Tactical family.",
    "icon": "✦",
    "color": "hsl(214.1052631578947, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_113_0",
        "name": "Recon Mastery",
        "description": "Advanced recon sub-type for tactical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_113_1",
        "name": "Recon Expertise",
        "description": "Advanced recon sub-type for tactical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_113_2",
        "name": "Recon Mastery II",
        "description": "Advanced recon sub-type for tactical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_113_3",
        "name": "Recon Mastery III",
        "description": "Advanced recon sub-type for tactical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_113_4",
        "name": "Recon Supremacy",
        "description": "Advanced recon sub-type for tactical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_114",
    "family": "Tactical",
    "name": "Support",
    "description": "Support-themed abilities within the Tactical family.",
    "icon": "✦",
    "color": "hsl(216, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_114_0",
        "name": "Support Mastery",
        "description": "Advanced support sub-type for tactical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_114_1",
        "name": "Support Expertise",
        "description": "Advanced support sub-type for tactical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_114_2",
        "name": "Support Mastery II",
        "description": "Advanced support sub-type for tactical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_114_3",
        "name": "Support Mastery III",
        "description": "Advanced support sub-type for tactical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_114_4",
        "name": "Support Supremacy",
        "description": "Advanced support sub-type for tactical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_115",
    "family": "Tactical",
    "name": "Command",
    "description": "Command-themed abilities within the Tactical family.",
    "icon": "✦",
    "color": "hsl(217.89473684210526, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_115_0",
        "name": "Command Mastery",
        "description": "Advanced command sub-type for tactical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_115_1",
        "name": "Command Expertise",
        "description": "Advanced command sub-type for tactical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_115_2",
        "name": "Command Mastery II",
        "description": "Advanced command sub-type for tactical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_115_3",
        "name": "Command Mastery III",
        "description": "Advanced command sub-type for tactical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_115_4",
        "name": "Command Supremacy",
        "description": "Advanced command sub-type for tactical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_116",
    "family": "Tactical",
    "name": "Logistics",
    "description": "Logistics-themed abilities within the Tactical family.",
    "icon": "✦",
    "color": "hsl(219.78947368421052, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_116_0",
        "name": "Logistics Mastery",
        "description": "Advanced logistics sub-type for tactical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_116_1",
        "name": "Logistics Expertise",
        "description": "Advanced logistics sub-type for tactical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_116_2",
        "name": "Logistics Mastery II",
        "description": "Advanced logistics sub-type for tactical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_116_3",
        "name": "Logistics Mastery III",
        "description": "Advanced logistics sub-type for tactical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_116_4",
        "name": "Logistics Supremacy",
        "description": "Advanced logistics sub-type for tactical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_117",
    "family": "Tactical",
    "name": "Medical",
    "description": "Medical-themed abilities within the Tactical family.",
    "icon": "✦",
    "color": "hsl(221.68421052631578, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_117_0",
        "name": "Medical Mastery",
        "description": "Advanced medical sub-type for tactical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_117_1",
        "name": "Medical Expertise",
        "description": "Advanced medical sub-type for tactical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_117_2",
        "name": "Medical Mastery II",
        "description": "Advanced medical sub-type for tactical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_117_3",
        "name": "Medical Mastery III",
        "description": "Advanced medical sub-type for tactical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_117_4",
        "name": "Medical Supremacy",
        "description": "Advanced medical sub-type for tactical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_118",
    "family": "Tactical",
    "name": "Engineer",
    "description": "Engineer-themed abilities within the Tactical family.",
    "icon": "✦",
    "color": "hsl(223.57894736842104, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_118_0",
        "name": "Engineer Mastery",
        "description": "Advanced engineer sub-type for tactical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_118_1",
        "name": "Engineer Expertise",
        "description": "Advanced engineer sub-type for tactical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_118_2",
        "name": "Engineer Mastery II",
        "description": "Advanced engineer sub-type for tactical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_118_3",
        "name": "Engineer Mastery III",
        "description": "Advanced engineer sub-type for tactical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_118_4",
        "name": "Engineer Supremacy",
        "description": "Advanced engineer sub-type for tactical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_119",
    "family": "Tactical",
    "name": "Special",
    "description": "Special-themed abilities within the Tactical family.",
    "icon": "✦",
    "color": "hsl(225.4736842105263, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_119_0",
        "name": "Special Mastery",
        "description": "Advanced special sub-type for tactical theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_119_1",
        "name": "Special Expertise",
        "description": "Advanced special sub-type for tactical theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_119_2",
        "name": "Special Mastery II",
        "description": "Advanced special sub-type for tactical theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_119_3",
        "name": "Special Mastery III",
        "description": "Advanced special sub-type for tactical theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_119_4",
        "name": "Special Supremacy",
        "description": "Advanced special sub-type for tactical theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_120",
    "family": "Economic",
    "name": "Production",
    "description": "Production-themed abilities within the Economic family.",
    "icon": "✦",
    "color": "hsl(227.36842105263156, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_120_0",
        "name": "Production Mastery",
        "description": "Advanced production sub-type for economic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_120_1",
        "name": "Production Expertise",
        "description": "Advanced production sub-type for economic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_120_2",
        "name": "Production Mastery II",
        "description": "Advanced production sub-type for economic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_120_3",
        "name": "Production Mastery III",
        "description": "Advanced production sub-type for economic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_120_4",
        "name": "Production Supremacy",
        "description": "Advanced production sub-type for economic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_121",
    "family": "Economic",
    "name": "Trade",
    "description": "Trade-themed abilities within the Economic family.",
    "icon": "✦",
    "color": "hsl(229.26315789473682, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_121_0",
        "name": "Trade Mastery",
        "description": "Advanced trade sub-type for economic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_121_1",
        "name": "Trade Expertise",
        "description": "Advanced trade sub-type for economic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_121_2",
        "name": "Trade Mastery II",
        "description": "Advanced trade sub-type for economic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_121_3",
        "name": "Trade Mastery III",
        "description": "Advanced trade sub-type for economic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_121_4",
        "name": "Trade Supremacy",
        "description": "Advanced trade sub-type for economic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_122",
    "family": "Economic",
    "name": "Investment",
    "description": "Investment-themed abilities within the Economic family.",
    "icon": "✦",
    "color": "hsl(231.15789473684208, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_122_0",
        "name": "Investment Mastery",
        "description": "Advanced investment sub-type for economic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_122_1",
        "name": "Investment Expertise",
        "description": "Advanced investment sub-type for economic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_122_2",
        "name": "Investment Mastery II",
        "description": "Advanced investment sub-type for economic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_122_3",
        "name": "Investment Mastery III",
        "description": "Advanced investment sub-type for economic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_122_4",
        "name": "Investment Supremacy",
        "description": "Advanced investment sub-type for economic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_123",
    "family": "Economic",
    "name": "Extraction",
    "description": "Extraction-themed abilities within the Economic family.",
    "icon": "✦",
    "color": "hsl(233.05263157894734, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_123_0",
        "name": "Extraction Mastery",
        "description": "Advanced extraction sub-type for economic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_123_1",
        "name": "Extraction Expertise",
        "description": "Advanced extraction sub-type for economic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_123_2",
        "name": "Extraction Mastery II",
        "description": "Advanced extraction sub-type for economic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_123_3",
        "name": "Extraction Mastery III",
        "description": "Advanced extraction sub-type for economic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_123_4",
        "name": "Extraction Supremacy",
        "description": "Advanced extraction sub-type for economic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_124",
    "family": "Economic",
    "name": "Manufacturing",
    "description": "Manufacturing-themed abilities within the Economic family.",
    "icon": "✦",
    "color": "hsl(234.94736842105263, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_124_0",
        "name": "Manufacturing Mastery",
        "description": "Advanced manufacturing sub-type for economic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_124_1",
        "name": "Manufacturing Expertise",
        "description": "Advanced manufacturing sub-type for economic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_124_2",
        "name": "Manufacturing Mastery II",
        "description": "Advanced manufacturing sub-type for economic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_124_3",
        "name": "Manufacturing Mastery III",
        "description": "Advanced manufacturing sub-type for economic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_124_4",
        "name": "Manufacturing Supremacy",
        "description": "Advanced manufacturing sub-type for economic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_125",
    "family": "Economic",
    "name": "Service",
    "description": "Service-themed abilities within the Economic family.",
    "icon": "✦",
    "color": "hsl(236.8421052631579, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_125_0",
        "name": "Service Mastery",
        "description": "Advanced service sub-type for economic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_125_1",
        "name": "Service Expertise",
        "description": "Advanced service sub-type for economic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_125_2",
        "name": "Service Mastery II",
        "description": "Advanced service sub-type for economic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_125_3",
        "name": "Service Mastery III",
        "description": "Advanced service sub-type for economic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_125_4",
        "name": "Service Supremacy",
        "description": "Advanced service sub-type for economic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_126",
    "family": "Economic",
    "name": "Agriculture",
    "description": "Agriculture-themed abilities within the Economic family.",
    "icon": "✦",
    "color": "hsl(238.73684210526315, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_126_0",
        "name": "Agriculture Mastery",
        "description": "Advanced agriculture sub-type for economic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_126_1",
        "name": "Agriculture Expertise",
        "description": "Advanced agriculture sub-type for economic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_126_2",
        "name": "Agriculture Mastery II",
        "description": "Advanced agriculture sub-type for economic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_126_3",
        "name": "Agriculture Mastery III",
        "description": "Advanced agriculture sub-type for economic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_126_4",
        "name": "Agriculture Supremacy",
        "description": "Advanced agriculture sub-type for economic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_127",
    "family": "Economic",
    "name": "Mining",
    "description": "Mining-themed abilities within the Economic family.",
    "icon": "✦",
    "color": "hsl(240.6315789473684, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_127_0",
        "name": "Mining Mastery",
        "description": "Advanced mining sub-type for economic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_127_1",
        "name": "Mining Expertise",
        "description": "Advanced mining sub-type for economic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_127_2",
        "name": "Mining Mastery II",
        "description": "Advanced mining sub-type for economic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_127_3",
        "name": "Mining Mastery III",
        "description": "Advanced mining sub-type for economic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_127_4",
        "name": "Mining Supremacy",
        "description": "Advanced mining sub-type for economic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_128",
    "family": "Economic",
    "name": "Energy",
    "description": "Energy-themed abilities within the Economic family.",
    "icon": "✦",
    "color": "hsl(242.52631578947367, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_128_0",
        "name": "Energy Mastery",
        "description": "Advanced energy sub-type for economic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_128_1",
        "name": "Energy Expertise",
        "description": "Advanced energy sub-type for economic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_128_2",
        "name": "Energy Mastery II",
        "description": "Advanced energy sub-type for economic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_128_3",
        "name": "Energy Mastery III",
        "description": "Advanced energy sub-type for economic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_128_4",
        "name": "Energy Supremacy",
        "description": "Advanced energy sub-type for economic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_129",
    "family": "Economic",
    "name": "Technology",
    "description": "Technology-themed abilities within the Economic family.",
    "icon": "✦",
    "color": "hsl(244.42105263157893, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_129_0",
        "name": "Technology Mastery",
        "description": "Advanced technology sub-type for economic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_129_1",
        "name": "Technology Expertise",
        "description": "Advanced technology sub-type for economic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_129_2",
        "name": "Technology Mastery II",
        "description": "Advanced technology sub-type for economic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_129_3",
        "name": "Technology Mastery III",
        "description": "Advanced technology sub-type for economic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_129_4",
        "name": "Technology Supremacy",
        "description": "Advanced technology sub-type for economic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_130",
    "family": "Social",
    "name": "Diplomatic",
    "description": "Diplomatic-themed abilities within the Social family.",
    "icon": "✦",
    "color": "hsl(246.3157894736842, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_130_0",
        "name": "Diplomatic Mastery",
        "description": "Advanced diplomatic sub-type for social theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_130_1",
        "name": "Diplomatic Expertise",
        "description": "Advanced diplomatic sub-type for social theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_130_2",
        "name": "Diplomatic Mastery II",
        "description": "Advanced diplomatic sub-type for social theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_130_3",
        "name": "Diplomatic Mastery III",
        "description": "Advanced diplomatic sub-type for social theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_130_4",
        "name": "Diplomatic Supremacy",
        "description": "Advanced diplomatic sub-type for social theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_131",
    "family": "Social",
    "name": "Cultural",
    "description": "Cultural-themed abilities within the Social family.",
    "icon": "✦",
    "color": "hsl(248.21052631578945, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_131_0",
        "name": "Cultural Mastery",
        "description": "Advanced cultural sub-type for social theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_131_1",
        "name": "Cultural Expertise",
        "description": "Advanced cultural sub-type for social theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_131_2",
        "name": "Cultural Mastery II",
        "description": "Advanced cultural sub-type for social theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_131_3",
        "name": "Cultural Mastery III",
        "description": "Advanced cultural sub-type for social theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_131_4",
        "name": "Cultural Supremacy",
        "description": "Advanced cultural sub-type for social theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_132",
    "family": "Social",
    "name": "Religious",
    "description": "Religious-themed abilities within the Social family.",
    "icon": "✦",
    "color": "hsl(250.1052631578947, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_132_0",
        "name": "Religious Mastery",
        "description": "Advanced religious sub-type for social theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_132_1",
        "name": "Religious Expertise",
        "description": "Advanced religious sub-type for social theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_132_2",
        "name": "Religious Mastery II",
        "description": "Advanced religious sub-type for social theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_132_3",
        "name": "Religious Mastery III",
        "description": "Advanced religious sub-type for social theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_132_4",
        "name": "Religious Supremacy",
        "description": "Advanced religious sub-type for social theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_133",
    "family": "Social",
    "name": "Militant",
    "description": "Militant-themed abilities within the Social family.",
    "icon": "✦",
    "color": "hsl(252, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_133_0",
        "name": "Militant Mastery",
        "description": "Advanced militant sub-type for social theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_133_1",
        "name": "Militant Expertise",
        "description": "Advanced militant sub-type for social theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_133_2",
        "name": "Militant Mastery II",
        "description": "Advanced militant sub-type for social theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_133_3",
        "name": "Militant Mastery III",
        "description": "Advanced militant sub-type for social theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_133_4",
        "name": "Militant Supremacy",
        "description": "Advanced militant sub-type for social theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_134",
    "family": "Social",
    "name": "Academic",
    "description": "Academic-themed abilities within the Social family.",
    "icon": "✦",
    "color": "hsl(253.89473684210526, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_134_0",
        "name": "Academic Mastery",
        "description": "Advanced academic sub-type for social theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_134_1",
        "name": "Academic Expertise",
        "description": "Advanced academic sub-type for social theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_134_2",
        "name": "Academic Mastery II",
        "description": "Advanced academic sub-type for social theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_134_3",
        "name": "Academic Mastery III",
        "description": "Advanced academic sub-type for social theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_134_4",
        "name": "Academic Supremacy",
        "description": "Advanced academic sub-type for social theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_135",
    "family": "Social",
    "name": "Artistic",
    "description": "Artistic-themed abilities within the Social family.",
    "icon": "✦",
    "color": "hsl(255.78947368421052, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_135_0",
        "name": "Artistic Mastery",
        "description": "Advanced artistic sub-type for social theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_135_1",
        "name": "Artistic Expertise",
        "description": "Advanced artistic sub-type for social theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_135_2",
        "name": "Artistic Mastery II",
        "description": "Advanced artistic sub-type for social theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_135_3",
        "name": "Artistic Mastery III",
        "description": "Advanced artistic sub-type for social theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_135_4",
        "name": "Artistic Supremacy",
        "description": "Advanced artistic sub-type for social theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_136",
    "family": "Social",
    "name": "Athletic",
    "description": "Athletic-themed abilities within the Social family.",
    "icon": "✦",
    "color": "hsl(257.6842105263158, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_136_0",
        "name": "Athletic Mastery",
        "description": "Advanced athletic sub-type for social theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_136_1",
        "name": "Athletic Expertise",
        "description": "Advanced athletic sub-type for social theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_136_2",
        "name": "Athletic Mastery II",
        "description": "Advanced athletic sub-type for social theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_136_3",
        "name": "Athletic Mastery III",
        "description": "Advanced athletic sub-type for social theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_136_4",
        "name": "Athletic Supremacy",
        "description": "Advanced athletic sub-type for social theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_137",
    "family": "Social",
    "name": "Political",
    "description": "Political-themed abilities within the Social family.",
    "icon": "✦",
    "color": "hsl(259.57894736842104, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_137_0",
        "name": "Political Mastery",
        "description": "Advanced political sub-type for social theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_137_1",
        "name": "Political Expertise",
        "description": "Advanced political sub-type for social theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_137_2",
        "name": "Political Mastery II",
        "description": "Advanced political sub-type for social theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_137_3",
        "name": "Political Mastery III",
        "description": "Advanced political sub-type for social theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_137_4",
        "name": "Political Supremacy",
        "description": "Advanced political sub-type for social theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_138",
    "family": "Social",
    "name": "Legal",
    "description": "Legal-themed abilities within the Social family.",
    "icon": "✦",
    "color": "hsl(261.4736842105263, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_138_0",
        "name": "Legal Mastery",
        "description": "Advanced legal sub-type for social theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_138_1",
        "name": "Legal Expertise",
        "description": "Advanced legal sub-type for social theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_138_2",
        "name": "Legal Mastery II",
        "description": "Advanced legal sub-type for social theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_138_3",
        "name": "Legal Mastery III",
        "description": "Advanced legal sub-type for social theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_138_4",
        "name": "Legal Supremacy",
        "description": "Advanced legal sub-type for social theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_139",
    "family": "Social",
    "name": "Economic",
    "description": "Economic-themed abilities within the Social family.",
    "icon": "✦",
    "color": "hsl(263.36842105263156, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_139_0",
        "name": "Economic Mastery",
        "description": "Advanced economic sub-type for social theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_139_1",
        "name": "Economic Expertise",
        "description": "Advanced economic sub-type for social theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_139_2",
        "name": "Economic Mastery II",
        "description": "Advanced economic sub-type for social theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_139_3",
        "name": "Economic Mastery III",
        "description": "Advanced economic sub-type for social theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_139_4",
        "name": "Economic Supremacy",
        "description": "Advanced economic sub-type for social theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_140",
    "family": "Environmental",
    "name": "Atmospheric",
    "description": "Atmospheric-themed abilities within the Environmental family.",
    "icon": "✦",
    "color": "hsl(265.2631578947368, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_140_0",
        "name": "Atmospheric Mastery",
        "description": "Advanced atmospheric sub-type for environmental theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_140_1",
        "name": "Atmospheric Expertise",
        "description": "Advanced atmospheric sub-type for environmental theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_140_2",
        "name": "Atmospheric Mastery II",
        "description": "Advanced atmospheric sub-type for environmental theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_140_3",
        "name": "Atmospheric Mastery III",
        "description": "Advanced atmospheric sub-type for environmental theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_140_4",
        "name": "Atmospheric Supremacy",
        "description": "Advanced atmospheric sub-type for environmental theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_141",
    "family": "Environmental",
    "name": "Aquatic",
    "description": "Aquatic-themed abilities within the Environmental family.",
    "icon": "✦",
    "color": "hsl(267.1578947368421, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_141_0",
        "name": "Aquatic Mastery",
        "description": "Advanced aquatic sub-type for environmental theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_141_1",
        "name": "Aquatic Expertise",
        "description": "Advanced aquatic sub-type for environmental theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_141_2",
        "name": "Aquatic Mastery II",
        "description": "Advanced aquatic sub-type for environmental theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_141_3",
        "name": "Aquatic Mastery III",
        "description": "Advanced aquatic sub-type for environmental theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_141_4",
        "name": "Aquatic Supremacy",
        "description": "Advanced aquatic sub-type for environmental theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_142",
    "family": "Environmental",
    "name": "Terrestrial",
    "description": "Terrestrial-themed abilities within the Environmental family.",
    "icon": "✦",
    "color": "hsl(269.05263157894734, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_142_0",
        "name": "Terrestrial Mastery",
        "description": "Advanced terrestrial sub-type for environmental theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_142_1",
        "name": "Terrestrial Expertise",
        "description": "Advanced terrestrial sub-type for environmental theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_142_2",
        "name": "Terrestrial Mastery II",
        "description": "Advanced terrestrial sub-type for environmental theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_142_3",
        "name": "Terrestrial Mastery III",
        "description": "Advanced terrestrial sub-type for environmental theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_142_4",
        "name": "Terrestrial Supremacy",
        "description": "Advanced terrestrial sub-type for environmental theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_143",
    "family": "Environmental",
    "name": "Cryogenic",
    "description": "Cryogenic-themed abilities within the Environmental family.",
    "icon": "✦",
    "color": "hsl(270.9473684210526, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_143_0",
        "name": "Cryogenic Mastery",
        "description": "Advanced cryogenic sub-type for environmental theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_143_1",
        "name": "Cryogenic Expertise",
        "description": "Advanced cryogenic sub-type for environmental theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_143_2",
        "name": "Cryogenic Mastery II",
        "description": "Advanced cryogenic sub-type for environmental theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_143_3",
        "name": "Cryogenic Mastery III",
        "description": "Advanced cryogenic sub-type for environmental theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_143_4",
        "name": "Cryogenic Supremacy",
        "description": "Advanced cryogenic sub-type for environmental theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_144",
    "family": "Environmental",
    "name": "Volcanic",
    "description": "Volcanic-themed abilities within the Environmental family.",
    "icon": "✦",
    "color": "hsl(272.84210526315786, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_144_0",
        "name": "Volcanic Mastery",
        "description": "Advanced volcanic sub-type for environmental theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_144_1",
        "name": "Volcanic Expertise",
        "description": "Advanced volcanic sub-type for environmental theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_144_2",
        "name": "Volcanic Mastery II",
        "description": "Advanced volcanic sub-type for environmental theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_144_3",
        "name": "Volcanic Mastery III",
        "description": "Advanced volcanic sub-type for environmental theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_144_4",
        "name": "Volcanic Supremacy",
        "description": "Advanced volcanic sub-type for environmental theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_145",
    "family": "Environmental",
    "name": "Desertic",
    "description": "Desertic-themed abilities within the Environmental family.",
    "icon": "✦",
    "color": "hsl(274.7368421052631, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_145_0",
        "name": "Desertic Mastery",
        "description": "Advanced desertic sub-type for environmental theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_145_1",
        "name": "Desertic Expertise",
        "description": "Advanced desertic sub-type for environmental theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_145_2",
        "name": "Desertic Mastery II",
        "description": "Advanced desertic sub-type for environmental theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_145_3",
        "name": "Desertic Mastery III",
        "description": "Advanced desertic sub-type for environmental theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_145_4",
        "name": "Desertic Supremacy",
        "description": "Advanced desertic sub-type for environmental theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_146",
    "family": "Environmental",
    "name": "Tropical",
    "description": "Tropical-themed abilities within the Environmental family.",
    "icon": "✦",
    "color": "hsl(276.6315789473684, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_146_0",
        "name": "Tropical Mastery",
        "description": "Advanced tropical sub-type for environmental theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_146_1",
        "name": "Tropical Expertise",
        "description": "Advanced tropical sub-type for environmental theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_146_2",
        "name": "Tropical Mastery II",
        "description": "Advanced tropical sub-type for environmental theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_146_3",
        "name": "Tropical Mastery III",
        "description": "Advanced tropical sub-type for environmental theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_146_4",
        "name": "Tropical Supremacy",
        "description": "Advanced tropical sub-type for environmental theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_147",
    "family": "Environmental",
    "name": "Arctic",
    "description": "Arctic-themed abilities within the Environmental family.",
    "icon": "✦",
    "color": "hsl(278.52631578947364, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_147_0",
        "name": "Arctic Mastery",
        "description": "Advanced arctic sub-type for environmental theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_147_1",
        "name": "Arctic Expertise",
        "description": "Advanced arctic sub-type for environmental theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_147_2",
        "name": "Arctic Mastery II",
        "description": "Advanced arctic sub-type for environmental theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_147_3",
        "name": "Arctic Mastery III",
        "description": "Advanced arctic sub-type for environmental theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_147_4",
        "name": "Arctic Supremacy",
        "description": "Advanced arctic sub-type for environmental theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_148",
    "family": "Environmental",
    "name": "Void",
    "description": "Void-themed abilities within the Environmental family.",
    "icon": "✦",
    "color": "hsl(280.42105263157896, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_148_0",
        "name": "Void Mastery",
        "description": "Advanced void sub-type for environmental theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_148_1",
        "name": "Void Expertise",
        "description": "Advanced void sub-type for environmental theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_148_2",
        "name": "Void Mastery II",
        "description": "Advanced void sub-type for environmental theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_148_3",
        "name": "Void Mastery III",
        "description": "Advanced void sub-type for environmental theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_148_4",
        "name": "Void Supremacy",
        "description": "Advanced void sub-type for environmental theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_149",
    "family": "Environmental",
    "name": "Hybrid",
    "description": "Hybrid-themed abilities within the Environmental family.",
    "icon": "✦",
    "color": "hsl(282.3157894736842, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_149_0",
        "name": "Hybrid Mastery",
        "description": "Advanced hybrid sub-type for environmental theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_149_1",
        "name": "Hybrid Expertise",
        "description": "Advanced hybrid sub-type for environmental theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_149_2",
        "name": "Hybrid Mastery II",
        "description": "Advanced hybrid sub-type for environmental theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_149_3",
        "name": "Hybrid Mastery III",
        "description": "Advanced hybrid sub-type for environmental theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_149_4",
        "name": "Hybrid Supremacy",
        "description": "Advanced hybrid sub-type for environmental theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_150",
    "family": "Astral",
    "name": "Celestial",
    "description": "Celestial-themed abilities within the Astral family.",
    "icon": "✦",
    "color": "hsl(284.2105263157895, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_150_0",
        "name": "Celestial Mastery",
        "description": "Advanced celestial sub-type for astral theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_150_1",
        "name": "Celestial Expertise",
        "description": "Advanced celestial sub-type for astral theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_150_2",
        "name": "Celestial Mastery II",
        "description": "Advanced celestial sub-type for astral theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_150_3",
        "name": "Celestial Mastery III",
        "description": "Advanced celestial sub-type for astral theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_150_4",
        "name": "Celestial Supremacy",
        "description": "Advanced celestial sub-type for astral theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_151",
    "family": "Astral",
    "name": "Ethereal",
    "description": "Ethereal-themed abilities within the Astral family.",
    "icon": "✦",
    "color": "hsl(286.10526315789474, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_151_0",
        "name": "Ethereal Mastery",
        "description": "Advanced ethereal sub-type for astral theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_151_1",
        "name": "Ethereal Expertise",
        "description": "Advanced ethereal sub-type for astral theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_151_2",
        "name": "Ethereal Mastery II",
        "description": "Advanced ethereal sub-type for astral theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_151_3",
        "name": "Ethereal Mastery III",
        "description": "Advanced ethereal sub-type for astral theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_151_4",
        "name": "Ethereal Supremacy",
        "description": "Advanced ethereal sub-type for astral theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_152",
    "family": "Astral",
    "name": "Planar",
    "description": "Planar-themed abilities within the Astral family.",
    "icon": "✦",
    "color": "hsl(288, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_152_0",
        "name": "Planar Mastery",
        "description": "Advanced planar sub-type for astral theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_152_1",
        "name": "Planar Expertise",
        "description": "Advanced planar sub-type for astral theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_152_2",
        "name": "Planar Mastery II",
        "description": "Advanced planar sub-type for astral theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_152_3",
        "name": "Planar Mastery III",
        "description": "Advanced planar sub-type for astral theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_152_4",
        "name": "Planar Supremacy",
        "description": "Advanced planar sub-type for astral theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_153",
    "family": "Astral",
    "name": "Void",
    "description": "Void-themed abilities within the Astral family.",
    "icon": "✦",
    "color": "hsl(289.89473684210526, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_153_0",
        "name": "Void Mastery",
        "description": "Advanced void sub-type for astral theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_153_1",
        "name": "Void Expertise",
        "description": "Advanced void sub-type for astral theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_153_2",
        "name": "Void Mastery II",
        "description": "Advanced void sub-type for astral theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_153_3",
        "name": "Void Mastery III",
        "description": "Advanced void sub-type for astral theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_153_4",
        "name": "Void Supremacy",
        "description": "Advanced void sub-type for astral theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_154",
    "family": "Astral",
    "name": "Astral",
    "description": "Astral-themed abilities within the Astral family.",
    "icon": "✦",
    "color": "hsl(291.7894736842105, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_154_0",
        "name": "Astral Mastery",
        "description": "Advanced astral sub-type for astral theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_154_1",
        "name": "Astral Expertise",
        "description": "Advanced astral sub-type for astral theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_154_2",
        "name": "Astral Mastery II",
        "description": "Advanced astral sub-type for astral theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_154_3",
        "name": "Astral Mastery III",
        "description": "Advanced astral sub-type for astral theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_154_4",
        "name": "Astral Supremacy",
        "description": "Advanced astral sub-type for astral theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_155",
    "family": "Astral",
    "name": "Shadow",
    "description": "Shadow-themed abilities within the Astral family.",
    "icon": "✦",
    "color": "hsl(293.6842105263158, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_155_0",
        "name": "Shadow Mastery",
        "description": "Advanced shadow sub-type for astral theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_155_1",
        "name": "Shadow Expertise",
        "description": "Advanced shadow sub-type for astral theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_155_2",
        "name": "Shadow Mastery II",
        "description": "Advanced shadow sub-type for astral theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_155_3",
        "name": "Shadow Mastery III",
        "description": "Advanced shadow sub-type for astral theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_155_4",
        "name": "Shadow Supremacy",
        "description": "Advanced shadow sub-type for astral theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_156",
    "family": "Astral",
    "name": "Light",
    "description": "Light-themed abilities within the Astral family.",
    "icon": "✨",
    "color": "hsl(295.57894736842104, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_156_0",
        "name": "Light Mastery",
        "description": "Advanced light sub-type for astral theme.",
        "modifier": "Power: +5%",
        "icon": "✨"
      },
      {
        "id": "subtype_156_1",
        "name": "Light Expertise",
        "description": "Advanced light sub-type for astral theme.",
        "modifier": "Precision: +10%",
        "icon": "💡"
      },
      {
        "id": "subtype_156_2",
        "name": "Light Mastery II",
        "description": "Advanced light sub-type for astral theme.",
        "modifier": "Duration: +15%",
        "icon": "☀️"
      },
      {
        "id": "subtype_156_3",
        "name": "Light Mastery III",
        "description": "Advanced light sub-type for astral theme.",
        "modifier": "Range: +20%",
        "icon": "🌟"
      },
      {
        "id": "subtype_156_4",
        "name": "Light Supremacy",
        "description": "Advanced light sub-type for astral theme.",
        "modifier": "Potency: +25%",
        "icon": "💫"
      }
    ]
  },
  {
    "id": "theme_157",
    "family": "Astral",
    "name": "Prismatic",
    "description": "Prismatic-themed abilities within the Astral family.",
    "icon": "✦",
    "color": "hsl(297.4736842105263, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_157_0",
        "name": "Prismatic Mastery",
        "description": "Advanced prismatic sub-type for astral theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_157_1",
        "name": "Prismatic Expertise",
        "description": "Advanced prismatic sub-type for astral theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_157_2",
        "name": "Prismatic Mastery II",
        "description": "Advanced prismatic sub-type for astral theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_157_3",
        "name": "Prismatic Mastery III",
        "description": "Advanced prismatic sub-type for astral theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_157_4",
        "name": "Prismatic Supremacy",
        "description": "Advanced prismatic sub-type for astral theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_158",
    "family": "Astral",
    "name": "Radiant",
    "description": "Radiant-themed abilities within the Astral family.",
    "icon": "✦",
    "color": "hsl(299.36842105263156, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_158_0",
        "name": "Radiant Mastery",
        "description": "Advanced radiant sub-type for astral theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_158_1",
        "name": "Radiant Expertise",
        "description": "Advanced radiant sub-type for astral theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_158_2",
        "name": "Radiant Mastery II",
        "description": "Advanced radiant sub-type for astral theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_158_3",
        "name": "Radiant Mastery III",
        "description": "Advanced radiant sub-type for astral theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_158_4",
        "name": "Radiant Supremacy",
        "description": "Advanced radiant sub-type for astral theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_159",
    "family": "Astral",
    "name": "Obscured",
    "description": "Obscured-themed abilities within the Astral family.",
    "icon": "✦",
    "color": "hsl(301.2631578947368, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_159_0",
        "name": "Obscured Mastery",
        "description": "Advanced obscured sub-type for astral theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_159_1",
        "name": "Obscured Expertise",
        "description": "Advanced obscured sub-type for astral theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_159_2",
        "name": "Obscured Mastery II",
        "description": "Advanced obscured sub-type for astral theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_159_3",
        "name": "Obscured Mastery III",
        "description": "Advanced obscured sub-type for astral theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_159_4",
        "name": "Obscured Supremacy",
        "description": "Advanced obscured sub-type for astral theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_160",
    "family": "Arcane",
    "name": "Runic",
    "description": "Runic-themed abilities within the Arcane family.",
    "icon": "✦",
    "color": "hsl(303.1578947368421, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_160_0",
        "name": "Runic Mastery",
        "description": "Advanced runic sub-type for arcane theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_160_1",
        "name": "Runic Expertise",
        "description": "Advanced runic sub-type for arcane theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_160_2",
        "name": "Runic Mastery II",
        "description": "Advanced runic sub-type for arcane theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_160_3",
        "name": "Runic Mastery III",
        "description": "Advanced runic sub-type for arcane theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_160_4",
        "name": "Runic Supremacy",
        "description": "Advanced runic sub-type for arcane theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_161",
    "family": "Arcane",
    "name": "Sigil",
    "description": "Sigil-themed abilities within the Arcane family.",
    "icon": "✦",
    "color": "hsl(305.05263157894734, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_161_0",
        "name": "Sigil Mastery",
        "description": "Advanced sigil sub-type for arcane theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_161_1",
        "name": "Sigil Expertise",
        "description": "Advanced sigil sub-type for arcane theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_161_2",
        "name": "Sigil Mastery II",
        "description": "Advanced sigil sub-type for arcane theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_161_3",
        "name": "Sigil Mastery III",
        "description": "Advanced sigil sub-type for arcane theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_161_4",
        "name": "Sigil Supremacy",
        "description": "Advanced sigil sub-type for arcane theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_162",
    "family": "Arcane",
    "name": "Glyph",
    "description": "Glyph-themed abilities within the Arcane family.",
    "icon": "✦",
    "color": "hsl(306.9473684210526, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_162_0",
        "name": "Glyph Mastery",
        "description": "Advanced glyph sub-type for arcane theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_162_1",
        "name": "Glyph Expertise",
        "description": "Advanced glyph sub-type for arcane theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_162_2",
        "name": "Glyph Mastery II",
        "description": "Advanced glyph sub-type for arcane theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_162_3",
        "name": "Glyph Mastery III",
        "description": "Advanced glyph sub-type for arcane theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_162_4",
        "name": "Glyph Supremacy",
        "description": "Advanced glyph sub-type for arcane theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_163",
    "family": "Arcane",
    "name": "Tome",
    "description": "Tome-themed abilities within the Arcane family.",
    "icon": "✦",
    "color": "hsl(308.84210526315786, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_163_0",
        "name": "Tome Mastery",
        "description": "Advanced tome sub-type for arcane theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_163_1",
        "name": "Tome Expertise",
        "description": "Advanced tome sub-type for arcane theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_163_2",
        "name": "Tome Mastery II",
        "description": "Advanced tome sub-type for arcane theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_163_3",
        "name": "Tome Mastery III",
        "description": "Advanced tome sub-type for arcane theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_163_4",
        "name": "Tome Supremacy",
        "description": "Advanced tome sub-type for arcane theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_164",
    "family": "Arcane",
    "name": "Crystal",
    "description": "Crystal-themed abilities within the Arcane family.",
    "icon": "✦",
    "color": "hsl(310.7368421052631, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_164_0",
        "name": "Crystal Mastery",
        "description": "Advanced crystal sub-type for arcane theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_164_1",
        "name": "Crystal Expertise",
        "description": "Advanced crystal sub-type for arcane theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_164_2",
        "name": "Crystal Mastery II",
        "description": "Advanced crystal sub-type for arcane theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_164_3",
        "name": "Crystal Mastery III",
        "description": "Advanced crystal sub-type for arcane theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_164_4",
        "name": "Crystal Supremacy",
        "description": "Advanced crystal sub-type for arcane theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_165",
    "family": "Arcane",
    "name": "Essence",
    "description": "Essence-themed abilities within the Arcane family.",
    "icon": "✦",
    "color": "hsl(312.6315789473684, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_165_0",
        "name": "Essence Mastery",
        "description": "Advanced essence sub-type for arcane theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_165_1",
        "name": "Essence Expertise",
        "description": "Advanced essence sub-type for arcane theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_165_2",
        "name": "Essence Mastery II",
        "description": "Advanced essence sub-type for arcane theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_165_3",
        "name": "Essence Mastery III",
        "description": "Advanced essence sub-type for arcane theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_165_4",
        "name": "Essence Supremacy",
        "description": "Advanced essence sub-type for arcane theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_166",
    "family": "Arcane",
    "name": "Ritual",
    "description": "Ritual-themed abilities within the Arcane family.",
    "icon": "✦",
    "color": "hsl(314.52631578947364, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_166_0",
        "name": "Ritual Mastery",
        "description": "Advanced ritual sub-type for arcane theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_166_1",
        "name": "Ritual Expertise",
        "description": "Advanced ritual sub-type for arcane theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_166_2",
        "name": "Ritual Mastery II",
        "description": "Advanced ritual sub-type for arcane theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_166_3",
        "name": "Ritual Mastery III",
        "description": "Advanced ritual sub-type for arcane theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_166_4",
        "name": "Ritual Supremacy",
        "description": "Advanced ritual sub-type for arcane theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_167",
    "family": "Arcane",
    "name": "Invocation",
    "description": "Invocation-themed abilities within the Arcane family.",
    "icon": "✦",
    "color": "hsl(316.4210526315789, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_167_0",
        "name": "Invocation Mastery",
        "description": "Advanced invocation sub-type for arcane theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_167_1",
        "name": "Invocation Expertise",
        "description": "Advanced invocation sub-type for arcane theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_167_2",
        "name": "Invocation Mastery II",
        "description": "Advanced invocation sub-type for arcane theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_167_3",
        "name": "Invocation Mastery III",
        "description": "Advanced invocation sub-type for arcane theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_167_4",
        "name": "Invocation Supremacy",
        "description": "Advanced invocation sub-type for arcane theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_168",
    "family": "Arcane",
    "name": "Enchantment",
    "description": "Enchantment-themed abilities within the Arcane family.",
    "icon": "✦",
    "color": "hsl(318.3157894736842, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_168_0",
        "name": "Enchantment Mastery",
        "description": "Advanced enchantment sub-type for arcane theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_168_1",
        "name": "Enchantment Expertise",
        "description": "Advanced enchantment sub-type for arcane theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_168_2",
        "name": "Enchantment Mastery II",
        "description": "Advanced enchantment sub-type for arcane theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_168_3",
        "name": "Enchantment Mastery III",
        "description": "Advanced enchantment sub-type for arcane theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_168_4",
        "name": "Enchantment Supremacy",
        "description": "Advanced enchantment sub-type for arcane theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_169",
    "family": "Arcane",
    "name": "Transmutation",
    "description": "Transmutation-themed abilities within the Arcane family.",
    "icon": "✦",
    "color": "hsl(320.2105263157895, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_169_0",
        "name": "Transmutation Mastery",
        "description": "Advanced transmutation sub-type for arcane theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_169_1",
        "name": "Transmutation Expertise",
        "description": "Advanced transmutation sub-type for arcane theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_169_2",
        "name": "Transmutation Mastery II",
        "description": "Advanced transmutation sub-type for arcane theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_169_3",
        "name": "Transmutation Mastery III",
        "description": "Advanced transmutation sub-type for arcane theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_169_4",
        "name": "Transmutation Supremacy",
        "description": "Advanced transmutation sub-type for arcane theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_170",
    "family": "Martial",
    "name": "Sword",
    "description": "Sword-themed abilities within the Martial family.",
    "icon": "✦",
    "color": "hsl(322.10526315789474, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_170_0",
        "name": "Sword Mastery",
        "description": "Advanced sword sub-type for martial theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_170_1",
        "name": "Sword Expertise",
        "description": "Advanced sword sub-type for martial theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_170_2",
        "name": "Sword Mastery II",
        "description": "Advanced sword sub-type for martial theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_170_3",
        "name": "Sword Mastery III",
        "description": "Advanced sword sub-type for martial theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_170_4",
        "name": "Sword Supremacy",
        "description": "Advanced sword sub-type for martial theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_171",
    "family": "Martial",
    "name": "Shield",
    "description": "Shield-themed abilities within the Martial family.",
    "icon": "✦",
    "color": "hsl(324, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_171_0",
        "name": "Shield Mastery",
        "description": "Advanced shield sub-type for martial theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_171_1",
        "name": "Shield Expertise",
        "description": "Advanced shield sub-type for martial theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_171_2",
        "name": "Shield Mastery II",
        "description": "Advanced shield sub-type for martial theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_171_3",
        "name": "Shield Mastery III",
        "description": "Advanced shield sub-type for martial theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_171_4",
        "name": "Shield Supremacy",
        "description": "Advanced shield sub-type for martial theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_172",
    "family": "Martial",
    "name": "Spear",
    "description": "Spear-themed abilities within the Martial family.",
    "icon": "✦",
    "color": "hsl(325.89473684210526, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_172_0",
        "name": "Spear Mastery",
        "description": "Advanced spear sub-type for martial theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_172_1",
        "name": "Spear Expertise",
        "description": "Advanced spear sub-type for martial theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_172_2",
        "name": "Spear Mastery II",
        "description": "Advanced spear sub-type for martial theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_172_3",
        "name": "Spear Mastery III",
        "description": "Advanced spear sub-type for martial theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_172_4",
        "name": "Spear Supremacy",
        "description": "Advanced spear sub-type for martial theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_173",
    "family": "Martial",
    "name": "Bow",
    "description": "Bow-themed abilities within the Martial family.",
    "icon": "✦",
    "color": "hsl(327.7894736842105, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_173_0",
        "name": "Bow Mastery",
        "description": "Advanced bow sub-type for martial theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_173_1",
        "name": "Bow Expertise",
        "description": "Advanced bow sub-type for martial theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_173_2",
        "name": "Bow Mastery II",
        "description": "Advanced bow sub-type for martial theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_173_3",
        "name": "Bow Mastery III",
        "description": "Advanced bow sub-type for martial theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_173_4",
        "name": "Bow Supremacy",
        "description": "Advanced bow sub-type for martial theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_174",
    "family": "Martial",
    "name": "Gun",
    "description": "Gun-themed abilities within the Martial family.",
    "icon": "✦",
    "color": "hsl(329.6842105263158, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_174_0",
        "name": "Gun Mastery",
        "description": "Advanced gun sub-type for martial theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_174_1",
        "name": "Gun Expertise",
        "description": "Advanced gun sub-type for martial theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_174_2",
        "name": "Gun Mastery II",
        "description": "Advanced gun sub-type for martial theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_174_3",
        "name": "Gun Mastery III",
        "description": "Advanced gun sub-type for martial theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_174_4",
        "name": "Gun Supremacy",
        "description": "Advanced gun sub-type for martial theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_175",
    "family": "Martial",
    "name": "Cannon",
    "description": "Cannon-themed abilities within the Martial family.",
    "icon": "✦",
    "color": "hsl(331.57894736842104, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_175_0",
        "name": "Cannon Mastery",
        "description": "Advanced cannon sub-type for martial theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_175_1",
        "name": "Cannon Expertise",
        "description": "Advanced cannon sub-type for martial theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_175_2",
        "name": "Cannon Mastery II",
        "description": "Advanced cannon sub-type for martial theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_175_3",
        "name": "Cannon Mastery III",
        "description": "Advanced cannon sub-type for martial theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_175_4",
        "name": "Cannon Supremacy",
        "description": "Advanced cannon sub-type for martial theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_176",
    "family": "Martial",
    "name": "Blade",
    "description": "Blade-themed abilities within the Martial family.",
    "icon": "✦",
    "color": "hsl(333.4736842105263, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_176_0",
        "name": "Blade Mastery",
        "description": "Advanced blade sub-type for martial theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_176_1",
        "name": "Blade Expertise",
        "description": "Advanced blade sub-type for martial theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_176_2",
        "name": "Blade Mastery II",
        "description": "Advanced blade sub-type for martial theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_176_3",
        "name": "Blade Mastery III",
        "description": "Advanced blade sub-type for martial theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_176_4",
        "name": "Blade Supremacy",
        "description": "Advanced blade sub-type for martial theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_177",
    "family": "Martial",
    "name": "Fist",
    "description": "Fist-themed abilities within the Martial family.",
    "icon": "✦",
    "color": "hsl(335.36842105263156, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_177_0",
        "name": "Fist Mastery",
        "description": "Advanced fist sub-type for martial theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_177_1",
        "name": "Fist Expertise",
        "description": "Advanced fist sub-type for martial theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_177_2",
        "name": "Fist Mastery II",
        "description": "Advanced fist sub-type for martial theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_177_3",
        "name": "Fist Mastery III",
        "description": "Advanced fist sub-type for martial theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_177_4",
        "name": "Fist Supremacy",
        "description": "Advanced fist sub-type for martial theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_178",
    "family": "Martial",
    "name": "Polearm",
    "description": "Polearm-themed abilities within the Martial family.",
    "icon": "✦",
    "color": "hsl(337.2631578947368, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_178_0",
        "name": "Polearm Mastery",
        "description": "Advanced polearm sub-type for martial theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_178_1",
        "name": "Polearm Expertise",
        "description": "Advanced polearm sub-type for martial theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_178_2",
        "name": "Polearm Mastery II",
        "description": "Advanced polearm sub-type for martial theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_178_3",
        "name": "Polearm Mastery III",
        "description": "Advanced polearm sub-type for martial theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_178_4",
        "name": "Polearm Supremacy",
        "description": "Advanced polearm sub-type for martial theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_179",
    "family": "Martial",
    "name": "Thrown",
    "description": "Thrown-themed abilities within the Martial family.",
    "icon": "✦",
    "color": "hsl(339.1578947368421, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_179_0",
        "name": "Thrown Mastery",
        "description": "Advanced thrown sub-type for martial theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_179_1",
        "name": "Thrown Expertise",
        "description": "Advanced thrown sub-type for martial theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_179_2",
        "name": "Thrown Mastery II",
        "description": "Advanced thrown sub-type for martial theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_179_3",
        "name": "Thrown Mastery III",
        "description": "Advanced thrown sub-type for martial theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_179_4",
        "name": "Thrown Supremacy",
        "description": "Advanced thrown sub-type for martial theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_180",
    "family": "Cybernetic",
    "name": "Neural",
    "description": "Neural-themed abilities within the Cybernetic family.",
    "icon": "✦",
    "color": "hsl(341.05263157894734, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_180_0",
        "name": "Neural Mastery",
        "description": "Advanced neural sub-type for cybernetic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_180_1",
        "name": "Neural Expertise",
        "description": "Advanced neural sub-type for cybernetic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_180_2",
        "name": "Neural Mastery II",
        "description": "Advanced neural sub-type for cybernetic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_180_3",
        "name": "Neural Mastery III",
        "description": "Advanced neural sub-type for cybernetic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_180_4",
        "name": "Neural Supremacy",
        "description": "Advanced neural sub-type for cybernetic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_181",
    "family": "Cybernetic",
    "name": "Ocular",
    "description": "Ocular-themed abilities within the Cybernetic family.",
    "icon": "✦",
    "color": "hsl(342.9473684210526, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_181_0",
        "name": "Ocular Mastery",
        "description": "Advanced ocular sub-type for cybernetic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_181_1",
        "name": "Ocular Expertise",
        "description": "Advanced ocular sub-type for cybernetic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_181_2",
        "name": "Ocular Mastery II",
        "description": "Advanced ocular sub-type for cybernetic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_181_3",
        "name": "Ocular Mastery III",
        "description": "Advanced ocular sub-type for cybernetic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_181_4",
        "name": "Ocular Supremacy",
        "description": "Advanced ocular sub-type for cybernetic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_182",
    "family": "Cybernetic",
    "name": "Skeletal",
    "description": "Skeletal-themed abilities within the Cybernetic family.",
    "icon": "✦",
    "color": "hsl(344.84210526315786, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_182_0",
        "name": "Skeletal Mastery",
        "description": "Advanced skeletal sub-type for cybernetic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_182_1",
        "name": "Skeletal Expertise",
        "description": "Advanced skeletal sub-type for cybernetic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_182_2",
        "name": "Skeletal Mastery II",
        "description": "Advanced skeletal sub-type for cybernetic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_182_3",
        "name": "Skeletal Mastery III",
        "description": "Advanced skeletal sub-type for cybernetic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_182_4",
        "name": "Skeletal Supremacy",
        "description": "Advanced skeletal sub-type for cybernetic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_183",
    "family": "Cybernetic",
    "name": "Muscular",
    "description": "Muscular-themed abilities within the Cybernetic family.",
    "icon": "✦",
    "color": "hsl(346.7368421052631, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_183_0",
        "name": "Muscular Mastery",
        "description": "Advanced muscular sub-type for cybernetic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_183_1",
        "name": "Muscular Expertise",
        "description": "Advanced muscular sub-type for cybernetic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_183_2",
        "name": "Muscular Mastery II",
        "description": "Advanced muscular sub-type for cybernetic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_183_3",
        "name": "Muscular Mastery III",
        "description": "Advanced muscular sub-type for cybernetic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_183_4",
        "name": "Muscular Supremacy",
        "description": "Advanced muscular sub-type for cybernetic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_184",
    "family": "Cybernetic",
    "name": "Dermal",
    "description": "Dermal-themed abilities within the Cybernetic family.",
    "icon": "✦",
    "color": "hsl(348.6315789473684, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_184_0",
        "name": "Dermal Mastery",
        "description": "Advanced dermal sub-type for cybernetic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_184_1",
        "name": "Dermal Expertise",
        "description": "Advanced dermal sub-type for cybernetic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_184_2",
        "name": "Dermal Mastery II",
        "description": "Advanced dermal sub-type for cybernetic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_184_3",
        "name": "Dermal Mastery III",
        "description": "Advanced dermal sub-type for cybernetic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_184_4",
        "name": "Dermal Supremacy",
        "description": "Advanced dermal sub-type for cybernetic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_185",
    "family": "Cybernetic",
    "name": "Visceral",
    "description": "Visceral-themed abilities within the Cybernetic family.",
    "icon": "✦",
    "color": "hsl(350.52631578947364, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_185_0",
        "name": "Visceral Mastery",
        "description": "Advanced visceral sub-type for cybernetic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_185_1",
        "name": "Visceral Expertise",
        "description": "Advanced visceral sub-type for cybernetic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_185_2",
        "name": "Visceral Mastery II",
        "description": "Advanced visceral sub-type for cybernetic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_185_3",
        "name": "Visceral Mastery III",
        "description": "Advanced visceral sub-type for cybernetic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_185_4",
        "name": "Visceral Supremacy",
        "description": "Advanced visceral sub-type for cybernetic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_186",
    "family": "Cybernetic",
    "name": "Sensory",
    "description": "Sensory-themed abilities within the Cybernetic family.",
    "icon": "✦",
    "color": "hsl(352.4210526315789, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_186_0",
        "name": "Sensory Mastery",
        "description": "Advanced sensory sub-type for cybernetic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_186_1",
        "name": "Sensory Expertise",
        "description": "Advanced sensory sub-type for cybernetic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_186_2",
        "name": "Sensory Mastery II",
        "description": "Advanced sensory sub-type for cybernetic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_186_3",
        "name": "Sensory Mastery III",
        "description": "Advanced sensory sub-type for cybernetic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_186_4",
        "name": "Sensory Supremacy",
        "description": "Advanced sensory sub-type for cybernetic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_187",
    "family": "Cybernetic",
    "name": "Motor",
    "description": "Motor-themed abilities within the Cybernetic family.",
    "icon": "✦",
    "color": "hsl(354.31578947368416, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_187_0",
        "name": "Motor Mastery",
        "description": "Advanced motor sub-type for cybernetic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_187_1",
        "name": "Motor Expertise",
        "description": "Advanced motor sub-type for cybernetic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_187_2",
        "name": "Motor Mastery II",
        "description": "Advanced motor sub-type for cybernetic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_187_3",
        "name": "Motor Mastery III",
        "description": "Advanced motor sub-type for cybernetic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_187_4",
        "name": "Motor Supremacy",
        "description": "Advanced motor sub-type for cybernetic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_188",
    "family": "Cybernetic",
    "name": "Synaptic",
    "description": "Synaptic-themed abilities within the Cybernetic family.",
    "icon": "✦",
    "color": "hsl(356.2105263157895, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_188_0",
        "name": "Synaptic Mastery",
        "description": "Advanced synaptic sub-type for cybernetic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_188_1",
        "name": "Synaptic Expertise",
        "description": "Advanced synaptic sub-type for cybernetic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_188_2",
        "name": "Synaptic Mastery II",
        "description": "Advanced synaptic sub-type for cybernetic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_188_3",
        "name": "Synaptic Mastery III",
        "description": "Advanced synaptic sub-type for cybernetic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_188_4",
        "name": "Synaptic Supremacy",
        "description": "Advanced synaptic sub-type for cybernetic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_189",
    "family": "Cybernetic",
    "name": "Interface",
    "description": "Interface-themed abilities within the Cybernetic family.",
    "icon": "✦",
    "color": "hsl(358.10526315789474, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_189_0",
        "name": "Interface Mastery",
        "description": "Advanced interface sub-type for cybernetic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_189_1",
        "name": "Interface Expertise",
        "description": "Advanced interface sub-type for cybernetic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_189_2",
        "name": "Interface Mastery II",
        "description": "Advanced interface sub-type for cybernetic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_189_3",
        "name": "Interface Mastery III",
        "description": "Advanced interface sub-type for cybernetic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_189_4",
        "name": "Interface Supremacy",
        "description": "Advanced interface sub-type for cybernetic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_190",
    "family": "Psionic",
    "name": "Telekinesis",
    "description": "Telekinesis-themed abilities within the Psionic family.",
    "icon": "✦",
    "color": "hsl(360, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_190_0",
        "name": "Telekinesis Mastery",
        "description": "Advanced telekinesis sub-type for psionic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_190_1",
        "name": "Telekinesis Expertise",
        "description": "Advanced telekinesis sub-type for psionic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_190_2",
        "name": "Telekinesis Mastery II",
        "description": "Advanced telekinesis sub-type for psionic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_190_3",
        "name": "Telekinesis Mastery III",
        "description": "Advanced telekinesis sub-type for psionic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_190_4",
        "name": "Telekinesis Supremacy",
        "description": "Advanced telekinesis sub-type for psionic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_191",
    "family": "Psionic",
    "name": "Clairvoyance",
    "description": "Clairvoyance-themed abilities within the Psionic family.",
    "icon": "✦",
    "color": "hsl(361.89473684210526, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_191_0",
        "name": "Clairvoyance Mastery",
        "description": "Advanced clairvoyance sub-type for psionic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_191_1",
        "name": "Clairvoyance Expertise",
        "description": "Advanced clairvoyance sub-type for psionic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_191_2",
        "name": "Clairvoyance Mastery II",
        "description": "Advanced clairvoyance sub-type for psionic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_191_3",
        "name": "Clairvoyance Mastery III",
        "description": "Advanced clairvoyance sub-type for psionic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_191_4",
        "name": "Clairvoyance Supremacy",
        "description": "Advanced clairvoyance sub-type for psionic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_192",
    "family": "Psionic",
    "name": "Telepathy",
    "description": "Telepathy-themed abilities within the Psionic family.",
    "icon": "✦",
    "color": "hsl(363.7894736842105, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_192_0",
        "name": "Telepathy Mastery",
        "description": "Advanced telepathy sub-type for psionic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_192_1",
        "name": "Telepathy Expertise",
        "description": "Advanced telepathy sub-type for psionic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_192_2",
        "name": "Telepathy Mastery II",
        "description": "Advanced telepathy sub-type for psionic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_192_3",
        "name": "Telepathy Mastery III",
        "description": "Advanced telepathy sub-type for psionic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_192_4",
        "name": "Telepathy Supremacy",
        "description": "Advanced telepathy sub-type for psionic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_193",
    "family": "Psionic",
    "name": "Pyrokinesis",
    "description": "Pyrokinesis-themed abilities within the Psionic family.",
    "icon": "✦",
    "color": "hsl(365.6842105263158, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_193_0",
        "name": "Pyrokinesis Mastery",
        "description": "Advanced pyrokinesis sub-type for psionic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_193_1",
        "name": "Pyrokinesis Expertise",
        "description": "Advanced pyrokinesis sub-type for psionic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_193_2",
        "name": "Pyrokinesis Mastery II",
        "description": "Advanced pyrokinesis sub-type for psionic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_193_3",
        "name": "Pyrokinesis Mastery III",
        "description": "Advanced pyrokinesis sub-type for psionic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_193_4",
        "name": "Pyrokinesis Supremacy",
        "description": "Advanced pyrokinesis sub-type for psionic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_194",
    "family": "Psionic",
    "name": "Cryokinesis",
    "description": "Cryokinesis-themed abilities within the Psionic family.",
    "icon": "✦",
    "color": "hsl(367.57894736842104, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_194_0",
        "name": "Cryokinesis Mastery",
        "description": "Advanced cryokinesis sub-type for psionic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_194_1",
        "name": "Cryokinesis Expertise",
        "description": "Advanced cryokinesis sub-type for psionic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_194_2",
        "name": "Cryokinesis Mastery II",
        "description": "Advanced cryokinesis sub-type for psionic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_194_3",
        "name": "Cryokinesis Mastery III",
        "description": "Advanced cryokinesis sub-type for psionic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_194_4",
        "name": "Cryokinesis Supremacy",
        "description": "Advanced cryokinesis sub-type for psionic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_195",
    "family": "Psionic",
    "name": "Electrokinesis",
    "description": "Electrokinesis-themed abilities within the Psionic family.",
    "icon": "✦",
    "color": "hsl(369.4736842105263, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_195_0",
        "name": "Electrokinesis Mastery",
        "description": "Advanced electrokinesis sub-type for psionic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_195_1",
        "name": "Electrokinesis Expertise",
        "description": "Advanced electrokinesis sub-type for psionic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_195_2",
        "name": "Electrokinesis Mastery II",
        "description": "Advanced electrokinesis sub-type for psionic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_195_3",
        "name": "Electrokinesis Mastery III",
        "description": "Advanced electrokinesis sub-type for psionic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_195_4",
        "name": "Electrokinesis Supremacy",
        "description": "Advanced electrokinesis sub-type for psionic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_196",
    "family": "Psionic",
    "name": "Geomancy",
    "description": "Geomancy-themed abilities within the Psionic family.",
    "icon": "✦",
    "color": "hsl(371.36842105263156, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_196_0",
        "name": "Geomancy Mastery",
        "description": "Advanced geomancy sub-type for psionic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_196_1",
        "name": "Geomancy Expertise",
        "description": "Advanced geomancy sub-type for psionic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_196_2",
        "name": "Geomancy Mastery II",
        "description": "Advanced geomancy sub-type for psionic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_196_3",
        "name": "Geomancy Mastery III",
        "description": "Advanced geomancy sub-type for psionic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_196_4",
        "name": "Geomancy Supremacy",
        "description": "Advanced geomancy sub-type for psionic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_197",
    "family": "Psionic",
    "name": "Aeromancy",
    "description": "Aeromancy-themed abilities within the Psionic family.",
    "icon": "✦",
    "color": "hsl(373.2631578947368, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_197_0",
        "name": "Aeromancy Mastery",
        "description": "Advanced aeromancy sub-type for psionic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_197_1",
        "name": "Aeromancy Expertise",
        "description": "Advanced aeromancy sub-type for psionic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_197_2",
        "name": "Aeromancy Mastery II",
        "description": "Advanced aeromancy sub-type for psionic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_197_3",
        "name": "Aeromancy Mastery III",
        "description": "Advanced aeromancy sub-type for psionic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_197_4",
        "name": "Aeromancy Supremacy",
        "description": "Advanced aeromancy sub-type for psionic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_198",
    "family": "Psionic",
    "name": "Hydromancy",
    "description": "Hydromancy-themed abilities within the Psionic family.",
    "icon": "✦",
    "color": "hsl(375.1578947368421, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_198_0",
        "name": "Hydromancy Mastery",
        "description": "Advanced hydromancy sub-type for psionic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_198_1",
        "name": "Hydromancy Expertise",
        "description": "Advanced hydromancy sub-type for psionic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_198_2",
        "name": "Hydromancy Mastery II",
        "description": "Advanced hydromancy sub-type for psionic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_198_3",
        "name": "Hydromancy Mastery III",
        "description": "Advanced hydromancy sub-type for psionic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_198_4",
        "name": "Hydromancy Supremacy",
        "description": "Advanced hydromancy sub-type for psionic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  },
  {
    "id": "theme_199",
    "family": "Psionic",
    "name": "Umbramancy",
    "description": "Umbramancy-themed abilities within the Psionic family.",
    "icon": "✦",
    "color": "hsl(377.05263157894734, 70%, 50%)",
    "subTypes": [
      {
        "id": "subtype_199_0",
        "name": "Umbramancy Mastery",
        "description": "Advanced umbramancy sub-type for psionic theme.",
        "modifier": "Power: +5%",
        "icon": "✦"
      },
      {
        "id": "subtype_199_1",
        "name": "Umbramancy Expertise",
        "description": "Advanced umbramancy sub-type for psionic theme.",
        "modifier": "Precision: +10%",
        "icon": "✦"
      },
      {
        "id": "subtype_199_2",
        "name": "Umbramancy Mastery II",
        "description": "Advanced umbramancy sub-type for psionic theme.",
        "modifier": "Duration: +15%",
        "icon": "✦"
      },
      {
        "id": "subtype_199_3",
        "name": "Umbramancy Mastery III",
        "description": "Advanced umbramancy sub-type for psionic theme.",
        "modifier": "Range: +20%",
        "icon": "✦"
      },
      {
        "id": "subtype_199_4",
        "name": "Umbramancy Supremacy",
        "description": "Advanced umbramancy sub-type for psionic theme.",
        "modifier": "Potency: +25%",
        "icon": "✦"
      }
    ]
  }
];
