import fs from "node:fs";
import path from "node:path";

function rgb(hex) {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16) / 255);
}

function linear(channel) {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const [r, g, b] = rgb(hex).map(linear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

const pairs = [
  { role: "Primary text on deep panel", foreground: "#e7f8ff", background: "#071d35", level: "AA normal" },
  { role: "Secondary text on deep panel", foreground: "#b7dff0", background: "#071d35", level: "AA normal" },
  { role: "Muted status text on deep panel", foreground: "#9bcbe5", background: "#071d35", level: "AA normal" },
  { role: "Bright cyan interface text on deep panel", foreground: "#55d7ff", background: "#071d35", level: "AA normal" },
  { role: "Signal cyan on deep panel", foreground: "#6ce5ff", background: "#071d35", level: "AA normal" },
  { role: "Teal feature accent on deep panel", foreground: "#42d3c5", background: "#071d35", level: "AA normal" },
  { role: "Indigo logic accent on deep panel", foreground: "#8a9dff", background: "#071d35", level: "AA normal" },
  { role: "Navigation primary text", foreground: "#ddffff", background: "#061c1c", level: "AA normal" },
  { role: "Navigation secondary text", foreground: "#b9e6f5", background: "#061c1c", level: "AA normal" },
  { role: "Focus ring against focus surface", foreground: "#6ce5ff", background: "#020d1c", level: "AA non-text UI" },
  { role: "Cyan button label", foreground: "#ffffff", background: "#197ca9", level: "AA normal" },
  { role: "Hover background against primary text", foreground: "#e7f8ff", background: "#12609a", level: "AA normal" },
];

const results = pairs.map((pair) => {
  const contrast = ratio(pair.foreground, pair.background);
  const minimum = pair.level === "AA non-text UI" ? 3 : 4.5;
  return { ...pair, ratio: Number(contrast.toFixed(2)), minimum, passes: contrast >= minimum };
});

const report = {
  standard: "WCAG 2 contrast ratios for specified opaque token pairs",
  passed: results.filter((result) => result.passes).length,
  failed: results.filter((result) => !result.passes).length,
  results,
};

const output = path.resolve(process.cwd(), "docs/WCAG_INDUSTRIAL_BLUE_CONTRAST.json");
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.table(results.map(({ role, ratio: contrastRatio, minimum, passes }) => ({ role, contrastRatio, minimum, passes })));
console.log(output);
