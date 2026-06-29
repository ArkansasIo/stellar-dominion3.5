#!/usr/bin/env python3
"""
Bulk OGameX PHP -> TypeScript rewrite helper.

This script is designed for large-scale migration work. It does not pretend
to perfectly translate Laravel/PHP into idiomatic TypeScript, but it can:

1. Scan large PHP trees quickly.
2. Classify files by domain (enum, constants, service, controller, model, etc.).
3. Emit TypeScript ports for low-risk shapes (enums/constants).
4. Emit migration-ready TypeScript scaffolds for complex classes.
5. Generate a machine-readable manifest so the migration can be resumed safely.

Example usage:
  python script/ogamex_mass_rewrite.py --write
  python script/ogamex_mass_rewrite.py --source ogamex-source/app --dest generated/ogamex-ts --write
  python script/ogamex_mass_rewrite.py --write --only Enums GameConstants
"""

from __future__ import annotations

import argparse
import dataclasses
import json
import re
from collections import Counter
from pathlib import Path
from typing import Iterable


PHP_EXTENSION = ".php"
DEFAULT_SOURCE = Path("ogamex-source") / "app"
DEFAULT_DEST = Path("generated") / "ogamex-ts"
DEFAULT_MANIFEST = "_rewrite_manifest.json"
DEFAULT_REPORT = "_rewrite_report.md"


PHP_TYPE_MAP = {
    "int": "number",
    "float": "number",
    "string": "string",
    "bool": "boolean",
    "boolean": "boolean",
    "array": "unknown[]",
    "mixed": "unknown",
    "void": "void",
    "object": "Record<string, unknown>",
    "callable": "(...args: unknown[]) => unknown",
}


@dataclasses.dataclass
class PhpMethod:
    name: str
    visibility: str
    is_static: bool
    parameters: str
    return_type: str | None


@dataclasses.dataclass
class PhpEnumCase:
    name: str
    value: str | None


@dataclasses.dataclass
class PhpFileInfo:
    source_path: Path
    relative_path: Path
    namespace: str | None
    symbol_type: str | None
    symbol_name: str | None
    category: str
    constants: list[tuple[str, str]]
    enum_cases: list[PhpEnumCase]
    methods: list[PhpMethod]
    extends: str | None
    implements: list[str]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Bulk OGameX PHP -> TypeScript rewrite helper")
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE, help="Source PHP root to rewrite")
    parser.add_argument("--dest", type=Path, default=DEFAULT_DEST, help="Destination folder for generated TypeScript")
    parser.add_argument("--manifest-name", default=DEFAULT_MANIFEST, help="Manifest file name inside destination")
    parser.add_argument("--report-name", default=DEFAULT_REPORT, help="Markdown report file name inside destination")
    parser.add_argument("--write", action="store_true", help="Write generated TypeScript files")
    parser.add_argument("--force", action="store_true", help="Overwrite existing TypeScript files")
    parser.add_argument(
        "--only",
        nargs="*",
        default=[],
        help="Restrict rewrite to categories such as Enums GameConstants Services Controllers Models",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Process only the first N PHP files after filtering (0 = all)",
    )
    return parser.parse_args()


def php_files(root: Path) -> list[Path]:
    if not root.exists():
        raise FileNotFoundError(f"Source path not found: {root}")
    return sorted(path for path in root.rglob(f"*{PHP_EXTENSION}") if path.is_file())


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def find_namespace(text: str) -> str | None:
    match = re.search(r"namespace\s+([^;]+);", text)
    return match.group(1).strip() if match else None


def find_symbol(text: str) -> tuple[str | None, str | None]:
    match = re.search(
        r"(?:final\s+|abstract\s+)?(class|enum|interface|trait)\s+([A-Za-z_][A-Za-z0-9_]*)",
        text,
    )
    if not match:
        return None, None
    return match.group(1), match.group(2)


def find_extends(text: str) -> str | None:
    match = re.search(r"\bextends\s+([A-Za-z_\\][A-Za-z0-9_\\]*)", text)
    return match.group(1).strip() if match else None


def find_implements(text: str) -> list[str]:
    match = re.search(r"\bimplements\s+([A-Za-z0-9_,\\\s]+)", text)
    if not match:
        return []
    return [part.strip() for part in match.group(1).split(",") if part.strip()]


def categorize(relative_path: Path) -> str:
    parts = relative_path.parts
    if len(parts) >= 2:
        return parts[0]
    return "Root"


def find_constants(text: str) -> list[tuple[str, str]]:
    matches = re.findall(
        r"public\s+const(?:\s+[A-Za-z_\\][A-Za-z0-9_\\?]*)?\s+([A-Z0-9_]+)\s*=\s*(.+?);",
        text,
        flags=re.DOTALL,
    )
    return [(name.strip(), sanitize_php_value(value.strip())) for name, value in matches]


def find_enum_cases(text: str) -> list[PhpEnumCase]:
    cases: list[PhpEnumCase] = []
    for name, value in re.findall(r"case\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:=\s*(.+?))?;", text):
        cases.append(PhpEnumCase(name=name, value=sanitize_php_value(value.strip()) if value else None))
    return cases


def normalize_php_type(raw_type: str | None) -> str:
    if not raw_type:
        return "unknown"

    cleaned = raw_type.strip().lstrip("?")
    if "|" in cleaned:
      parts = [normalize_php_type(part) for part in cleaned.split("|")]
      unique = []
      for part in parts:
          if part not in unique:
              unique.append(part)
      return " | ".join(unique)

    if cleaned in PHP_TYPE_MAP:
        return PHP_TYPE_MAP[cleaned]

    if cleaned.endswith("[]"):
        inner = normalize_php_type(cleaned[:-2])
        return f"{inner}[]"

    short_name = cleaned.split("\\")[-1]
    return short_name if short_name else "unknown"


def sanitize_php_value(value: str) -> str:
    cleaned = value.strip()
    cleaned = cleaned.replace("::class", "")
    cleaned = re.sub(r"\btrue\b", "true", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\bfalse\b", "false", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\bnull\b", "null", cleaned, flags=re.IGNORECASE)
    return cleaned


def parse_methods(text: str) -> list[PhpMethod]:
    pattern = re.compile(
        r"(public|protected|private)\s+"
        r"(static\s+)?"
        r"function\s+([A-Za-z_][A-Za-z0-9_]*)\s*"
        r"\((.*?)\)\s*"
        r"(?::\s*([A-Za-z0-9_\\|?\[\]]+))?",
        flags=re.DOTALL,
    )
    methods: list[PhpMethod] = []
    for visibility, static_keyword, name, parameters, return_type in pattern.findall(text):
        methods.append(
            PhpMethod(
                name=name,
                visibility=visibility,
                is_static=bool(static_keyword.strip()) if static_keyword else False,
                parameters=convert_php_parameters(parameters),
                return_type=normalize_php_type(return_type) if return_type else None,
            )
        )
    return methods


def split_parameters(raw: str) -> list[str]:
    parts: list[str] = []
    current: list[str] = []
    depth = 0
    for char in raw:
        if char == "," and depth == 0:
            chunk = "".join(current).strip()
            if chunk:
                parts.append(chunk)
            current = []
            continue
        if char in "([{" :
            depth += 1
        elif char in ")]}":
            depth = max(0, depth - 1)
        current.append(char)
    chunk = "".join(current).strip()
    if chunk:
        parts.append(chunk)
    return parts


def convert_php_parameters(raw: str) -> str:
    if not raw.strip():
        return ""

    converted: list[str] = []
    for index, param in enumerate(split_parameters(raw), start=1):
        cleaned = re.sub(r"=\s*.+$", "", param.strip())
        cleaned = cleaned.replace("&", "").replace("...", "")

        match = re.match(
            r"(?:(?P<type>[A-Za-z0-9_\\|?\[\]]+)\s+)?\$(?P<name>[A-Za-z_][A-Za-z0-9_]*)",
            cleaned,
        )
        if not match:
            converted.append(f"arg{index}: unknown")
            continue

        param_type = normalize_php_type(match.group("type"))
        param_name = match.group("name")
        converted.append(f"{param_name}: {param_type}")
    return ", ".join(converted)


def parse_php_file(path: Path, source_root: Path) -> PhpFileInfo:
    text = read_text(path)
    relative_path = path.relative_to(source_root)
    namespace = find_namespace(text)
    symbol_type, symbol_name = find_symbol(text)

    return PhpFileInfo(
        source_path=path,
        relative_path=relative_path,
        namespace=namespace,
        symbol_type=symbol_type,
        symbol_name=symbol_name,
        category=categorize(relative_path),
        constants=find_constants(text),
        enum_cases=find_enum_cases(text),
        methods=parse_methods(text),
        extends=find_extends(text),
        implements=find_implements(text),
    )


def relative_module_path(relative_path: Path) -> Path:
    return relative_path.with_suffix(".ts")


def render_header(info: PhpFileInfo) -> list[str]:
    return [
        "/*",
        " * AUTO-GENERATED BY script/ogamex_mass_rewrite.py",
        f" * SOURCE: {info.source_path.as_posix()}",
        " *",
        " * This file is a migration scaffold. Review manually before treating it",
        " * as a finished port.",
        " */",
        "",
    ]


def render_enum_module(info: PhpFileInfo) -> str:
    symbol_name = info.symbol_name or info.relative_path.stem
    lines = render_header(info)
    lines.append(f"export const {symbol_name} = {{")
    for enum_case in info.enum_cases:
        value = enum_case.value if enum_case.value is not None else f'"{enum_case.name}"'
        lines.append(f"  {enum_case.name}: {value},")
    lines.append("} as const;")
    lines.append("")
    lines.append(f"export type {symbol_name} = typeof {symbol_name}[keyof typeof {symbol_name}];")
    lines.append("")
    lines.append(f"export const {symbol_name}Values = Object.values({symbol_name});")
    lines.append("")
    return "\n".join(lines)


def render_constants_module(info: PhpFileInfo) -> str:
    symbol_name = info.symbol_name or info.relative_path.stem
    lines = render_header(info)
    lines.append(f"export const {symbol_name} = {{")
    for name, value in info.constants:
        lines.append(f"  {name}: {value},")
    lines.append("} as const;")
    lines.append("")
    lines.append(f"export type {symbol_name} = typeof {symbol_name};")
    lines.append("")
    return "\n".join(lines)


def render_class_scaffold(info: PhpFileInfo) -> str:
    symbol_name = info.symbol_name or info.relative_path.stem
    exported_name = symbol_name
    kind = info.symbol_type or "class"
    lines = render_header(info)

    lines.append(f"// Namespace: {info.namespace or 'global'}")
    lines.append(f"// Original kind: {kind}")
    if info.extends:
        lines.append(f"// Original extends: {info.extends}")
    if info.implements:
        lines.append(f"// Original implements: {', '.join(info.implements)}")
    lines.append("")

    if kind == "interface":
        lines.append(f"export interface {exported_name} {{")
        for method in info.methods:
            return_type = method.return_type or "unknown"
            lines.append(f"  {method.name}({method.parameters}): {return_type};")
        lines.append("}")
        lines.append("")
        return "\n".join(lines)

    if kind == "trait":
        lines.append(f"export interface {exported_name}Trait {{")
        for method in info.methods:
            return_type = method.return_type or "unknown"
            lines.append(f"  {method.name}({method.parameters}): {return_type};")
        lines.append("}")
        lines.append("")
        return "\n".join(lines)

    lines.append(f"export class {exported_name} {{")
    for name, value in info.constants:
        lines.append(f"  static readonly {name} = {value};")

    if info.constants and info.methods:
        lines.append("")

    if not info.methods and not info.constants:
        lines.append("  // TODO: Port PHP implementation.")
    else:
        for method in info.methods:
            return_type = method.return_type or "unknown"
            static_prefix = "static " if method.is_static else ""
            lines.append(f"  {static_prefix}{method.name}({method.parameters}): {return_type} {{")
            lines.append("    throw new Error(\"TODO: Port PHP implementation.\");")
            lines.append("  }")
            lines.append("")
        if lines[-1] == "":
            lines.pop()

    lines.append("}")
    lines.append("")
    return "\n".join(lines)


def render_module(info: PhpFileInfo) -> str:
    if info.category == "Enums" and info.enum_cases:
        return render_enum_module(info)
    if info.category == "GameConstants" and info.constants:
        return render_constants_module(info)
    return render_class_scaffold(info)


def manifest_entry(info: PhpFileInfo, destination_root: Path) -> dict[str, object]:
    destination = destination_root / relative_module_path(info.relative_path)
    strategy = (
        "enum-port"
        if info.category == "Enums" and info.enum_cases
        else "constants-port"
        if info.category == "GameConstants" and info.constants
        else "class-scaffold"
    )
    return {
        "source": info.source_path.as_posix(),
        "relativeSource": info.relative_path.as_posix(),
        "destination": destination.as_posix(),
        "category": info.category,
        "symbolType": info.symbol_type,
        "symbolName": info.symbol_name,
        "strategy": strategy,
        "methodCount": len(info.methods),
        "constantCount": len(info.constants),
        "enumCaseCount": len(info.enum_cases),
    }


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def write_module(destination_root: Path, info: PhpFileInfo, content: str, force: bool) -> Path | None:
    destination = destination_root / relative_module_path(info.relative_path)
    if destination.exists() and not force:
        return None
    ensure_parent(destination)
    destination.write_text(content, encoding="utf-8")
    return destination


def render_report(entries: list[dict[str, object]], counts: Counter[str]) -> str:
    total = len(entries)
    lines = [
        "# OGameX Mass Rewrite Report",
        "",
        f"- Total processed files: {total}",
        "",
        "## Categories",
        "",
    ]

    for category, count in sorted(counts.items()):
        lines.append(f"- {category}: {count}")

    lines.extend(
        [
            "",
            "## Strategies",
            "",
        ]
    )

    strategy_counts = Counter(str(entry["strategy"]) for entry in entries)
    for strategy, count in sorted(strategy_counts.items()):
        lines.append(f"- {strategy}: {count}")

    lines.extend(
        [
            "",
            "## Notes",
            "",
            "- `enum-port` means the script emitted concrete TypeScript enum-like constants.",
            "- `constants-port` means the script emitted a concrete TypeScript constant object.",
            "- `class-scaffold` means the script emitted a migration scaffold and TODO stubs.",
            "",
        ]
    )
    return "\n".join(lines)


def filter_files(paths: Iterable[Path], source_root: Path, only_categories: set[str]) -> list[Path]:
    if not only_categories:
        return list(paths)
    filtered: list[Path] = []
    for path in paths:
        relative = path.relative_to(source_root)
        if categorize(relative) in only_categories:
            filtered.append(path)
    return filtered


def main() -> int:
    args = parse_args()
    source_root = args.source
    destination_root = args.dest
    only_categories = set(args.only)

    files = php_files(source_root)
    files = filter_files(files, source_root, only_categories)
    if args.limit and args.limit > 0:
        files = files[: args.limit]

    entries: list[dict[str, object]] = []
    counts: Counter[str] = Counter()
    written = 0
    skipped = 0

    for path in files:
        info = parse_php_file(path, source_root)
        counts[info.category] += 1
        content = render_module(info)
        entries.append(manifest_entry(info, destination_root))

        if args.write:
            result = write_module(destination_root, info, content, force=args.force)
            if result is None:
                skipped += 1
            else:
                written += 1

    destination_root.mkdir(parents=True, exist_ok=True)
    manifest_path = destination_root / args.manifest_name
    report_path = destination_root / args.report_name

    manifest = {
        "sourceRoot": source_root.as_posix(),
        "destinationRoot": destination_root.as_posix(),
        "totalProcessed": len(entries),
        "written": written,
        "skippedExisting": skipped,
        "categories": dict(counts),
        "entries": entries,
    }

    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    report_path.write_text(render_report(entries, counts), encoding="utf-8")

    print(json.dumps(
        {
            "processed": len(entries),
            "written": written,
            "skipped": skipped,
            "manifest": manifest_path.as_posix(),
            "report": report_path.as_posix(),
        },
        indent=2,
    ))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
