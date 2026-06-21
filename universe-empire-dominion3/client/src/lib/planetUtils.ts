export type PlanetClass = "M" | "H" | "L" | "K" | "Y" | "D" | "J" | "T";

export interface PlanetDetails {
  class: PlanetClass;
  type: string;
  description: string;
  atmosphere: string;
  gravity: string;
  temperature: string;
  hydrosphere: string;
  features: string[];
  image: string;
}

export const getPlanetDetails = (seed: number): PlanetDetails => {
  // Simple deterministic generation
  const random = (seed * 9301 + 49297) % 233280 / 233280;
  
  if (random > 0.9) {
    return {
      class: "Y",
      type: "Demon Class",
      description: "Surface temperature exceeds 500 Kelvin. Toxic atmosphere saturated with thermionic radiation.",
      atmosphere: "Toxic (Sulfuric Acid)",
      gravity: "1.4 G",
      temperature: "480K - 800K",
      hydrosphere: "0%",
      features: ["Lava Lakes", "Ionic Storms", "Crystalline Formations"],
      image: "https://images.unsplash.com/photo-1614730341194-75c6074065db?q=80&w=2000"
    };
  } else if (random > 0.8) {
    return {
      class: "J",
      type: "Gas Giant",
      description: "Massive planet composed primarily of hydrogen and helium. Turbulent atmosphere with high-velocity winds.",
      atmosphere: "Hydrogen/Helium",
      gravity: "2.5 G",
      temperature: "120K",
      hydrosphere: "N/A",
      features: ["Ring System", "Great Red Spot", "Multiple Moons"],
      image: "https://images.unsplash.com/photo-1614730341194-75c6074065db?q=80&w=2000"
    };
  } else if (random > 0.65) {
    return {
      class: "L",
      type: "Marginally Habitable",
      description: "Vegetation is present, but no animal life. Atmosphere requires breathing apparatus for prolonged exposure.",
      atmosphere: "High CO2",
      gravity: "0.9 G",
      temperature: "260K - 300K",
      hydrosphere: "40%",
      features: ["Dense Forests", "Swamps", "High Humidity"],
      image: "https://images.unsplash.com/photo-1614730341194-75c6074065db?q=80&w=2000"
    };
  } else if (random > 0.45) {
    return {
      class: "K",
      type: "Adaptable",
      description: "Mars-like terrestrial planet. Thin atmosphere and low temperatures, but adaptable for colonization with domes.",
      atmosphere: "Thin (CO2)",
      gravity: "0.6 G",
      temperature: "180K - 240K",
      hydrosphere: "5% (Ice)",
      features: ["Craters", "Dust Storms", "Subterranean Ice"],
      image: "https://images.unsplash.com/photo-1614730341194-75c6074065db?q=80&w=2000"
    };
  } else if (random > 0.32) {
     return {
      class: "H",
      type: "Desert",
      description: "Hot and arid surface. Water is scarce and usually found in underground aquifers or polar caps.",
      atmosphere: "Nitrogen-Oxygen (Dry)",
      gravity: "0.95 G",
      temperature: "310K - 350K",
      hydrosphere: "10%",
      features: ["Dunes", "Oases", "Salt Flats"],
      image: "https://images.unsplash.com/photo-1614730341194-75c6074065db?q=80&w=2000"
    };
  } else if (random > 0.20) {
    return {
      class: "T",
      type: "Frozen",
      description: "Ice-covered world in the outer system. Frozen methane oceans and nitrogen ice geysers characterise the surface.",
      atmosphere: "Thin (Nitrogen/Methane)",
      gravity: "0.7 G",
      temperature: "60K - 120K",
      hydrosphere: "80% (Ice)",
      features: ["Ice Plains", "Nitrogen Geysers", "Methane Lakes"],
      image: "https://images.unsplash.com/photo-1614730341194-75c6074065db?q=80&w=2000"
    };
  } else if (random > 0.10) {
    return {
      class: "D",
      type: "Barren",
      description: "Completely barren world with no atmosphere or liquid water. Mineral-rich crust suitable for deep-core mining.",
      atmosphere: "None",
      gravity: "0.3 G",
      temperature: "90K - 400K",
      hydrosphere: "0%",
      features: ["Craters", "Exposed Rock", "Dust Plains"],
      image: "https://images.unsplash.com/photo-1614730341194-75c6074065db?q=80&w=2000"
    };
  } else {
    return {
      class: "M",
      type: "Minshara (Earth-like)",
      description: "Ideal for humanoid life. Nitrogen-oxygen atmosphere with abundant liquid water and diverse biosphere.",
      atmosphere: "Nitrogen-Oxygen",
      gravity: "1.0 G",
      temperature: "280K - 310K",
      hydrosphere: "71%",
      features: ["Oceans", "Continents", "Diverse Flora/Fauna"],
      image: "https://images.unsplash.com/photo-1614730341194-75c6074065db?q=80&w=2000"
    };
  }
};
