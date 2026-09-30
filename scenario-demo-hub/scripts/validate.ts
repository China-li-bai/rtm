/**
 * 配置校验 CLI：npm run validate / 构建前置（fail-loud）。
 * 任一 error 即 exit 1，warn 仅提示。
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { formatIssues, validateConfig } from "../src/schema/rules";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "scenarios");

if (!existsSync(dir)) {
  console.error("✘ scenarios/ 目录不存在");
  process.exit(1);
}

const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
if (files.length === 0) {
  console.error("✘ scenarios/ 下没有任何场景配置");
  process.exit(1);
}

let errors = 0;
let warns = 0;
const seenIds = new Map<string, string>();

for (const file of files.sort()) {
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(join(dir, file), "utf8"));
  } catch (e) {
    console.error(`  [ERROR] ${file}：JSON 解析失败 — ${(e as Error).message}`);
    errors++;
    continue;
  }
  const issues = validateConfig(raw, file);
  const id = (raw as { id?: string }).id;
  if (id) {
    const dup = seenIds.get(id);
    if (dup) {
      issues.push({ level: "error", where: "(根)", message: `场景 id "${id}" 与 ${dup} 重复` });
    } else {
      seenIds.set(id, file);
    }
  }
  if (issues.length > 0) console.log(formatIssues(file, issues));
  errors += issues.filter((i) => i.level === "error").length;
  warns += issues.filter((i) => i.level === "warn").length;
}

if (errors > 0) {
  console.error(`\n✘ 校验失败：${errors} 个错误，${warns} 个警告（${files.length} 份配置）`);
  process.exit(1);
}
console.log(`✓ 校验通过：${files.length} 份场景配置${warns > 0 ? `，${warns} 个警告` : ""}`);
