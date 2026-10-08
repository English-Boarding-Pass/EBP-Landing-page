// Fails when the locale files in messages/ don't share the same key structure.
// en.json is the source of truth; si.json and ta.json must mirror it exactly.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(import.meta.dirname, "..", "messages");
const source = "en.json";

function flatten(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === "object" && !Array.isArray(value)
      ? flatten(value, path)
      : [path];
  });
}

function load(file) {
  try {
    return new Set(flatten(JSON.parse(readFileSync(join(dir, file), "utf8"))));
  } catch (err) {
    console.error(`✖ messages/${file}: ${err.message}`);
    process.exit(1);
  }
}

const expected = load(source);
const others = readdirSync(dir).filter(
  (f) => f.endsWith(".json") && f !== source,
);
let failed = false;

for (const file of others) {
  const keys = load(file);
  const missing = [...expected].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !expected.has(k));
  if (missing.length || extra.length) {
    failed = true;
    console.error(`✖ messages/${file} does not match ${source}`);
    for (const k of missing) console.error(`    missing: ${k}`);
    for (const k of extra) console.error(`    extra:   ${k}`);
  }
}

if (failed) {
  console.error(
    `\nAdd new copy to ${source} first, then mirror the same keys in every locale.`,
  );
  process.exit(1);
}
console.log(`✔ ${others.length + 1} locale files share ${expected.size} keys`);
