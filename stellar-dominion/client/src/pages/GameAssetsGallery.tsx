/**
 * Game Assets Gallery Page
 * Showcase all game assets with metadata and placeholder information
 * @component
 */

import React, { useState } from "react";
import {
  Image,
  Grid3x3,
  Palette,
  Filter,
  Download,
  Copy,
  Check,
} from "lucide-react";
import {
  MENU_ASSETS,
  PLANET_ASSETS,
  SHIP_ASSETS,
  TECH_BRANCH_ASSETS,
  BACKGROUND_ASSETS,
  ASSET_SIZES,
} from "@shared/config";

type AssetCategory = "menu" | "planets" | "ships" | "tech_branches" | "backgrounds";

const CATEGORIES: { value: AssetCategory; label: string }[] = [
  { value: "menu", label: "Menu & UI" },
  { value: "planets", label: "Planets" },
  { value: "ships", label: "Ships" },
  { value: "tech_branches", label: "Tech Branches" },
  { value: "backgrounds", label: "Backgrounds" },
];

interface AssetItem {
  id: string;
  name: string;
  path: string;
  size: { width: number; height: number; name: string };
  color?: string;
  bgColor?: string;
  description: string;
}

function getAssetsForCategory(category: AssetCategory): AssetItem[] {
  switch (category) {
    case "menu":
      return [
        ...Object.values(MENU_ASSETS.NAVIGATION),
        ...Object.values(MENU_ASSETS.BUILDINGS),
        ...Object.values(MENU_ASSETS.RESOURCES),
        ...Object.values(MENU_ASSETS.STATUS),
      ];
    case "planets":
      return [
        ...Object.values(PLANET_ASSETS.TERRESTRIAL),
        ...Object.values(PLANET_ASSETS.GAS_GIANTS),
        ...Object.values(PLANET_ASSETS.EXOTIC),
      ];
    case "ships":
      return [
        ...Object.values(SHIP_ASSETS.FIGHTERS),
        ...Object.values(SHIP_ASSETS.CAPITALS),
        ...Object.values(SHIP_ASSETS.SPECIAL),
      ];
    case "tech_branches":
      return Object.values(TECH_BRANCH_ASSETS);
    case "backgrounds":
      return Object.values(BACKGROUND_ASSETS);
    default:
      return [];
  }
}

export default function GameAssetsGallery() {
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>("menu");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const tempThemeImage = "/theme-temp.png";

  const assets = getAssetsForCategory(selectedCategory);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const AssetCard = ({ asset }: { asset: AssetItem }) => {
    const bgColor = asset.bgColor || asset.color || "#34495E";
    const previewScale = Math.min(160 / asset.size.width, 140 / asset.size.height, 1);
    const previewWidth = Math.max(24, Math.round(asset.size.width * previewScale));
    const previewHeight = Math.max(24, Math.round(asset.size.height * previewScale));

    return viewMode === "grid" ? (
      <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition border border-gray-700">
        {/* Asset Preview */}
        <div
          className="w-full h-52 flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: bgColor + "30" }}
        >
          <div className="flex flex-col items-center justify-center w-full h-full gap-2">
            <img
              src={asset.path}
              alt={asset.name}
              style={{ width: `${previewWidth}px`, height: `${previewHeight}px` }}
              className="object-contain rounded border border-gray-700 bg-gray-900/30"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = tempThemeImage;
              }}
            />
            <div className="text-xs text-gray-400">{asset.size.name}</div>
          </div>

          {/* Asset Info Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-75 transition flex flex-col items-center justify-center gap-2 opacity-0 hover:opacity-100">
            <p className="text-xs text-white font-semibold text-center px-2">
              {asset.name}
            </p>
            <button
              onClick={() => copyToClipboard(asset.path, asset.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
            >
              {copiedId === asset.id ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy Path
                </>
              )}
            </button>
          </div>
        </div>

        {/* Asset Details */}
        <div className="p-3 space-y-2">
          <h3 className="font-semibold text-white text-sm">{asset.name}</h3>
          <p className="text-xs text-gray-400">{asset.description}</p>

          <div className="pt-2 border-t border-gray-700 space-y-1">
            <div className="text-xs text-gray-500">
              <span className="inline-block mr-2">📏 {asset.size.name}</span>
            </div>
            <div className="text-xs text-gray-500">
              <code className="bg-gray-900 px-2 py-1 rounded text-gray-300 break-all">
                {asset.path}
              </code>
            </div>
          </div>

          <button
            onClick={() => copyToClipboard(asset.id, asset.id)}
            className="w-full mt-2 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs flex items-center justify-center gap-1 transition"
          >
            {copiedId === asset.id ? (
              <>
                <Check className="w-3 h-3" />
                ID Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy ID
              </>
            )}
          </button>
        </div>
      </div>
    ) : (
      // List View
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-500 transition flex items-start gap-4">
        <div
          className="w-20 h-20 rounded flex-shrink-0 flex items-center justify-center"
          style={{ backgroundColor: bgColor + "30" }}
        >
          <img
            src={asset.path}
            alt={asset.name}
            className="object-contain rounded border border-gray-700 bg-gray-900/30"
            style={{
              width: `${Math.max(20, Math.min(asset.size.width / 2, 64))}px`,
              height: `${Math.max(20, Math.min(asset.size.height / 2, 64))}px`,
            }}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = tempThemeImage;
            }}
          />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-white text-lg">{asset.name}</h3>
          <p className="text-sm text-gray-400 mt-1">{asset.description}</p>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                {asset.size.name}
              </span>
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded font-mono">
                {asset.id}
              </span>
            </div>

            <code className="block bg-gray-900 text-gray-300 px-3 py-2 rounded text-xs overflow-x-auto">
              {asset.path}
            </code>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => copyToClipboard(asset.path, asset.id + "-path")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1 transition"
          >
            <Copy className="w-3 h-3" />
            Path
          </button>
          <button
            onClick={() => copyToClipboard(asset.id, asset.id)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1 transition"
          >
            <Copy className="w-3 h-3" />
            ID
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Image className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Game Assets Gallery</h1>
        </div>
        <p className="text-purple-100">
          Browse all in-game assets with metadata, paths, and sizes. Perfect for
          development reference.
        </p>
      </div>

      {/* Asset Size Reference */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Asset Size Standards
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(ASSET_SIZES).map(([key, size]) => (
            <div
              key={key}
              className="bg-gray-700 rounded p-2 text-center text-xs text-gray-300"
            >
              <div className="font-semibold text-white mb-1">{size.name}</div>
              <div className="text-gray-400 text-xs">
                {size.width}×{size.height}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded font-medium transition ${
                selectedCategory === cat.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <Filter className="w-4 h-4 inline mr-1" />
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded transition ${
              viewMode === "grid"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            title="Grid View"
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded transition ${
              viewMode === "list"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            title="List View"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Asset Count */}
      <div className="text-sm text-gray-400">
        Showing {assets.length} assets in{" "}
        <span className="font-semibold text-white">
          {CATEGORIES.find((c) => c.value === selectedCategory)?.label}
        </span>
      </div>

      {/* Assets Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}

      {/* Developer Reference */}
      <div className="bg-blue-900 border-l-4 border-blue-400 p-4 rounded">
        <h3 className="font-semibold text-blue-100 mb-2">💡 Developer Tips</h3>
        <ul className="text-sm text-blue-200 space-y-1 list-disc list-inside">
          <li>
            Copy asset IDs and paths for use in components and configurations
          </li>
          <li>All sizes follow OGame standard conventions</li>
          <li>Missing images fall back to temporary theme image: /theme-temp.png</li>
          <li>Use `getAssetById()` utility from gameAssetsConfig</li>
          <li>Color values are hex codes suitable for CSS or Canvas</li>
        </ul>
      </div>
    </div>
  );
}
