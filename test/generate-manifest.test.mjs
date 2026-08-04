import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const SCRIPT = fileURLToPath(
  new URL("../scripts/generate-manifest.mjs", import.meta.url),
);

const DEVICE = JSON.stringify({
  name: "X",
  manufacturer: "Y",
  schemaVersion: 1,
  parameters: [],
});

/** Builds a temp repo containing just a devices/ directory. */
async function fixture(files) {
  const dir = await mkdtemp(join(tmpdir(), "midi-randomiser-manifest-"));
  await mkdir(join(dir, "devices"));

  for (const [name, contents] of Object.entries(files)) {
    await writeFile(join(dir, "devices", name), contents);
  }

  return dir;
}

async function generate(dir) {
  await run("node", [SCRIPT], { cwd: dir });
  return JSON.parse(await readFile(join(dir, "devices", "index.json"), "utf8"));
}

test("device files are listed in sorted order", async () => {
  const dir = await fixture({
    "zzz.json": DEVICE,
    "aaa.json": DEVICE,
    "mmm.json": DEVICE,
  });

  assert.deepEqual(await generate(dir), ["aaa.json", "mmm.json", "zzz.json"]);
});

test("schema.json and an existing index.json are excluded", async () => {
  const dir = await fixture({
    "schema.json": "{}",
    "index.json": '["stale.json"]',
    "korg-volca-fm.json": DEVICE,
  });

  assert.deepEqual(await generate(dir), ["korg-volca-fm.json"]);
});

test("non-json files are ignored", async () => {
  const dir = await fixture({
    "notes.md": "# not a device",
    "korg-volca-fm.json": DEVICE,
  });

  assert.deepEqual(await generate(dir), ["korg-volca-fm.json"]);
});

test("an empty devices directory produces an empty manifest", async () => {
  assert.deepEqual(await generate(await fixture({})), []);
});

test("output is prettier-formatted, so lint stays happy", async () => {
  const dir = await fixture({ "a.json": DEVICE, "b.json": DEVICE });
  await run("node", [SCRIPT], { cwd: dir });

  const written = await readFile(join(dir, "devices", "index.json"), "utf8");
  assert.equal(written, '["a.json", "b.json"]\n');
});
