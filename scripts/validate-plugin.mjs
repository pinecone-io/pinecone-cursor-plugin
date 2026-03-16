#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const errors = [];
const warnings = [];

const pluginNamePattern = /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/;

function addError(msg) { errors.push(msg); }
function addWarning(msg) { warnings.push(msg); }

async function pathExists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function readJsonFile(filePath, context) {
  let raw;
  try { raw = await fs.readFile(filePath, "utf8"); } catch {
    addError(`${context} is missing: ${filePath}`);
    return null;
  }
  try { return JSON.parse(raw); } catch (e) {
    addError(`${context} contains invalid JSON (${filePath}): ${e.message}`);
    return null;
  }
}

function parseFrontmatter(content) {
  const normalized = content.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) return null;
  const closingIndex = normalized.indexOf("\n---\n", 4);
  if (closingIndex === -1) return null;

  const fields = {};
  for (const line of normalized.slice(4, closingIndex).split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const sep = line.indexOf(":");
    if (sep === -1) continue;
    fields[line.slice(0, sep).trim()] = line.slice(sep + 1).trim();
  }
  return fields;
}

async function walkFiles(dirPath) {
  const files = [];
  const stack = [dirPath];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const p = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(p);
      else if (entry.isFile()) files.push(p);
    }
  }
  return files;
}

function isSafeRelativePath(value) {
  if (typeof value !== "string" || value.length === 0) return false;
  if (value.startsWith("http://") || value.startsWith("https://")) return true;
  if (path.isAbsolute(value)) return false;
  const normalized = path.posix.normalize(value.replace(/\\/g, "/"));
  return !normalized.startsWith("../") && normalized !== "..";
}

function extractPathValues(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(extractPathValues);
  if (value && typeof value === "object") {
    const out = [];
    if (typeof value.path === "string") out.push(value.path);
    if (typeof value.file === "string") out.push(value.file);
    return out;
  }
  return [];
}

async function validateFrontmatter(filePath, component, requiredKeys) {
  const content = await fs.readFile(filePath, "utf8");
  const parsed = parseFrontmatter(content);
  const rel = path.relative(repoRoot, filePath);

  if (!parsed) {
    addError(`${component} missing YAML frontmatter: ${rel}`);
    return;
  }
  for (const key of requiredKeys) {
    if (!parsed[key] || parsed[key].length === 0) {
      addError(`${component} missing "${key}" in frontmatter: ${rel}`);
    }
  }
}

async function main() {
  // 1. Validate plugin.json
  const manifestPath = path.join(repoRoot, ".cursor-plugin", "plugin.json");
  const manifest = await readJsonFile(manifestPath, "Plugin manifest");
  if (!manifest) return summarize();

  if (typeof manifest.name !== "string" || !pluginNamePattern.test(manifest.name)) {
    addError(`plugin.json "name" must be lowercase kebab-case: got "${manifest.name}"`);
  }

  if (!manifest.description || manifest.description.length === 0) {
    addWarning(`plugin.json missing "description"`);
  }

  // 2. Validate manifest path references
  const pathFields = ["logo", "rules", "skills", "agents", "commands", "hooks", "mcpServers"];
  for (const field of pathFields) {
    for (const value of extractPathValues(manifest[field])) {
      if (!isSafeRelativePath(value)) {
        addError(`plugin.json "${field}" has unsafe path: "${value}"`);
      } else if (!value.startsWith("http")) {
        const resolved = path.resolve(repoRoot, value);
        if (!(await pathExists(resolved))) {
          addError(`plugin.json "${field}" references missing path: "${value}"`);
        }
      }
    }
  }

  // 3. Validate skills
  const skillsDir = path.join(repoRoot, "skills");
  if (await pathExists(skillsDir)) {
    const files = await walkFiles(skillsDir);
    const skillMds = files.filter((f) => path.basename(f) === "SKILL.md");
    if (skillMds.length === 0) {
      addWarning("skills/ directory exists but contains no SKILL.md files");
    }
    for (const file of skillMds) {
      await validateFrontmatter(file, "Skill", ["name", "description"]);

      // Check name matches folder
      const content = await fs.readFile(file, "utf8");
      const parsed = parseFrontmatter(content);
      if (parsed?.name) {
        const folderName = path.basename(path.dirname(file));
        if (parsed.name !== folderName) {
          addError(`Skill name "${parsed.name}" doesn't match folder "${folderName}": ${path.relative(repoRoot, file)}`);
        }
      }
    }
  }

  // 4. Validate rules
  const rulesDir = path.join(repoRoot, "rules");
  if (await pathExists(rulesDir)) {
    const files = await walkFiles(rulesDir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if ([".md", ".mdc", ".markdown"].includes(ext)) {
        await validateFrontmatter(file, "Rule", ["description"]);
      }
    }
  }

  // 5. Validate agents
  const agentsDir = path.join(repoRoot, "agents");
  if (await pathExists(agentsDir)) {
    const files = await walkFiles(agentsDir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if ([".md", ".mdc", ".markdown"].includes(ext)) {
        await validateFrontmatter(file, "Agent", ["name", "description"]);
      }
    }
  }

  // 6. Validate commands
  const commandsDir = path.join(repoRoot, "commands");
  if (await pathExists(commandsDir)) {
    const files = await walkFiles(commandsDir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if ([".md", ".mdc", ".markdown", ".txt"].includes(ext)) {
        await validateFrontmatter(file, "Command", ["name", "description"]);
      }
    }
  }

  // 7. Check MCP config
  const mcpPath = path.join(repoRoot, ".mcp.json");
  if (await pathExists(mcpPath)) {
    const mcp = await readJsonFile(mcpPath, "MCP config");
    if (mcp && !mcp.mcpServers) {
      addError('.mcp.json missing "mcpServers" key');
    }
  } else {
    addWarning("No .mcp.json found");
  }

  // 8. Check hooks
  const hooksPath = path.join(repoRoot, "hooks", "hooks.json");
  if (await pathExists(hooksPath)) {
    await readJsonFile(hooksPath, "Hooks config");
  }

  // 9. Check README
  if (!(await pathExists(path.join(repoRoot, "README.md")))) {
    addWarning("No README.md found");
  }

  summarize();
}

function summarize() {
  if (warnings.length > 0) {
    console.log("Warnings:");
    for (const w of warnings) console.log(`  - ${w}`);
    console.log();
  }
  if (errors.length > 0) {
    console.error("Validation failed:");
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log("Validation passed.");
}

await main();
