import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "client/src");
const allowed = new Set([".tsx", ".ts", ".css", ".html"]);

function collect(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) return collect(target);
    return allowed.has(path.extname(entry.name)) ? [target] : [];
  });
}

const files = collect(root);
const sourceFiles = files.filter((file) => /\.(tsx|ts)$/.test(file));
const styles = files.filter((file) => file.endsWith(".css"));
const findings = [];
const count = (text, regex) => [...text.matchAll(regex)].length;

for (const file of sourceFiles) {
  const text = fs.readFileSync(file, "utf8");
  const relative = path.relative(process.cwd(), file);
  const imagesWithoutAlt = count(text, /<img\b(?:(?!\balt=)[\s\S])*?>/g);
  const clickableNonInteractive = count(text, /<(?:div|span|li)\b[^>]*\bonClick=/g);
  const unlabeledIconButtons = count(text, /<(?:Button|button)\b(?=[^>]*>)(?:(?!aria-label|aria-labelledby)[^>])*?>\s*<(?:[A-Z][A-Za-z0-9]*)\b[^>]*\/?>(?:\s*<\/(?:[A-Z][A-Za-z0-9]*)>)?\s*<\/(?:Button|button)>/g);
  const titleOnlyControls = count(text, /<(?:Button|button)\b[^>]*\btitle=/g);
  if (imagesWithoutAlt) findings.push({ level: "review", rule: "image-alt", file: relative, count: imagesWithoutAlt, message: "Image tags without an explicit alt attribute." });
  if (clickableNonInteractive) findings.push({ level: "review", rule: "noninteractive-click", file: relative, count: clickableNonInteractive, message: "Non-interactive elements with click handlers require keyboard and semantic review." });
  if (unlabeledIconButtons) findings.push({ level: "review", rule: "icon-button-name", file: relative, count: unlabeledIconButtons, message: "Icon-only button candidates without an explicit accessible label." });
  if (titleOnlyControls) findings.push({ level: "review", rule: "title-control", file: relative, count: titleOnlyControls, message: "Title text is not a reliable accessible name by itself." });
}

const styleText = styles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
const focusVisibleRules = count(styleText, /:focus-visible/g);
const focusRules = count(styleText, /:focus(?!-visible)/g);
const reducedMotionRules = count(styleText, /prefers-reduced-motion/g);

const report = {
  generatedAt: new Date().toISOString(),
  scanned: {
    sourceFiles: sourceFiles.length,
    styleFiles: styles.length,
    files: files.length,
  },
  global: {
    focusVisibleRules,
    focusRules,
    reducedMotionRules,
    viewportMeta: fs.readFileSync(path.resolve(process.cwd(), "client/index.html"), "utf8").match(/<meta[^>]+name=["']viewport["'][^>]*>/i)?.[0] ?? null,
  },
  findings,
};

const output = path.resolve(process.cwd(), "docs/WCAG_SOURCE_AUDIT.json");
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ...report.scanned, global: report.global, findingCount: findings.length, output }, null, 2));
