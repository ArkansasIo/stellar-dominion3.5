#!/usr/bin/env python3
"""
Generate placeholder sci-fi game images for Universe Empire Dominion
This script creates SVG-based placeholder images for all game assets
"""

import os
import json
from pathlib import Path

# Image categories and their assets
IMAGE_ASSETS = {
    "buildings": [
        "metal_mine", "crystal_mine", "deuterium_synthesizer", "solar_plant",
        "fusion_reactor", "robotics_factory", "shipyard", "research_lab",
        "alliance_depot", "missile_silo", "nanite_factory", "terraformer",
        "space_dock", "lunar_base", "sensor_phalanx", "jump_gate"
    ],
    "ships": [
        "light_fighter", "heavy_fighter", "cruiser", "battleship",
        "battlecruiser", "bomber", "destroyer", "deathstar",
        "small_cargo", "large_cargo", "colony_ship", "recycler",
        "espionage_probe", "solar_satellite", "crawler", "reaper",
        "pathfinder", "interceptor", "corvette", "frigate",
        "dreadnought", "titan", "carrier", "mothership"
    ],
    "defense": [
        "rocket_launcher", "light_laser", "heavy_laser", "gauss_cannon",
        "ion_cannon", "plasma_turret", "small_shield_dome", "large_shield_dome",
        "anti_ballistic_missile", "interplanetary_missile", "defense_platform",
        "orbital_defense_grid"
    ],
    "resources": [
        "metal", "crystal", "deuterium", "energy", "dark_matter",
        "antimatter", "exotic_matter", "credits", "food", "water"
    ],
    "planets": [
        "desert", "jungle", "ice", "volcanic", "terran",
        "ocean", "gas_giant", "barren", "toxic", "lava"
    ],
    "research": [
        "energy_tech", "laser_tech", "ion_tech", "hyperspace_tech",
        "plasma_tech", "combustion_drive", "impulse_drive", "hyperspace_drive",
        "espionage_tech", "computer_tech", "astrophysics", "research_network",
        "graviton_tech", "weapons_tech", "shielding_tech", "armor_tech"
    ],
    "ui": [
        "background_space", "background_nebula", "background_galaxy",
        "button_normal", "button_hover", "button_pressed",
        "panel_dark", "panel_light", "icon_attack", "icon_defend",
        "icon_transport", "icon_colonize", "icon_spy", "icon_recycle"
    ]
}

def create_svg_image(name, category, width=256, height=256):
    """Create an SVG placeholder image"""
    
    # Color schemes for different categories
    color_schemes = {
        "buildings": {"primary": "#4A90E2", "secondary": "#2E5C8A", "accent": "#7FB3D5"},
        "ships": {"primary": "#E74C3C", "secondary": "#C0392B", "accent": "#EC7063"},
        "defense": {"primary": "#F39C12", "secondary": "#D68910", "accent": "#F8C471"},
        "resources": {"primary": "#27AE60", "secondary": "#1E8449", "accent": "#58D68D"},
        "planets": {"primary": "#8E44AD", "secondary": "#6C3483", "accent": "#A569BD"},
        "research": {"primary": "#16A085", "secondary": "#117A65", "accent": "#48C9B0"},
        "ui": {"primary": "#34495E", "secondary": "#2C3E50", "accent": "#5D6D7E"}
    }
    
    colors = color_schemes.get(category, color_schemes["ui"])
    
    # Create SVG content
    svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad_{name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{colors['primary']};stop-opacity:1" />
      <stop offset="100%" style="stop-color:{colors['secondary']};stop-opacity:1" />
    </linearGradient>
    <filter id="glow_{name}">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="{width}" height="{height}" fill="url(#grad_{name})" rx="10"/>
  
  <!-- Sci-fi geometric pattern -->
  <g opacity="0.3">
    <circle cx="{width//4}" cy="{height//4}" r="30" fill="{colors['accent']}" filter="url(#glow_{name})"/>
    <circle cx="{3*width//4}" cy="{3*height//4}" r="25" fill="{colors['accent']}" filter="url(#glow_{name})"/>
    <polygon points="{width//2},{height//4} {3*width//4},{3*height//4} {width//4},{3*height//4}" 
             fill="none" stroke="{colors['accent']}" stroke-width="2" opacity="0.5"/>
  </g>
  
  <!-- Icon representation -->
  <g transform="translate({width//2}, {height//2})">
    <circle r="50" fill="none" stroke="{colors['accent']}" stroke-width="3" opacity="0.8"/>
    <circle r="35" fill="{colors['accent']}" opacity="0.6"/>
  </g>
  
  <!-- Label -->
  <text x="{width//2}" y="{height-20}" 
        font-family="Arial, sans-serif" font-size="14" font-weight="bold"
        fill="white" text-anchor="middle" opacity="0.9">
    {name.replace('_', ' ').title()}
  </text>
  
  <!-- Category badge -->
  <rect x="5" y="5" width="60" height="20" rx="3" fill="{colors['secondary']}" opacity="0.8"/>
  <text x="35" y="18" font-family="Arial, sans-serif" font-size="10" 
        fill="white" text-anchor="middle" font-weight="bold">
    {category.upper()}
  </text>
</svg>'''
    
    return svg_content

def generate_all_images(output_dir="Universe-Empire-Dominion/public/assets"):
    """Generate all game images"""
    base_path = Path(output_dir)
    
    print(f"[*] Generating game images in {output_dir}")
    print("=" * 60)
    
    total_images = 0
    
    for category, assets in IMAGE_ASSETS.items():
        category_path = base_path / category
        category_path.mkdir(parents=True, exist_ok=True)
        
        print(f"\n[+] {category.upper()}: {len(assets)} images")
        
        for asset_name in assets:
            svg_content = create_svg_image(asset_name, category)
            
            # Save as SVG
            svg_file = category_path / f"{asset_name}.svg"
            with open(svg_file, 'w') as f:
                f.write(svg_content)
            
            total_images += 1
            print(f"  [OK] {asset_name}.svg")
    
    print("\n" + "=" * 60)
    print(f"[SUCCESS] Generated {total_images} images successfully!")
    print(f"[INFO] Location: {output_dir}")
    
    # Create an index file
    index_data = {
        "generated": True,
        "total_images": total_images,
        "categories": {cat: len(assets) for cat, assets in IMAGE_ASSETS.items()},
        "assets": IMAGE_ASSETS
    }
    
    index_file = base_path / "image_index.json"
    with open(index_file, 'w') as f:
        json.dump(index_data, f, indent=2)
    
    print(f"[INFO] Created image index: {index_file}")

if __name__ == "__main__":
    generate_all_images()
    print("\n[COMPLETE] Image generation complete!")

# Made with Bob
