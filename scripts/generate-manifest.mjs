/**
 * Rebuilds devices/index.json from the files in devices/. Static hosts can't
 * list a directory, so the app discovers devices through this manifest.
 *
 * Run `npm run manifest` after adding or removing a device file. `npm run lint`
 * fails if the manifest and the directory disagree.
 */

import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { format } from "prettier";

const DEVICES_DIR = "devices";
const MANIFEST = join(DEVICES_DIR, "index.json");
const NOT_DEVICES = new Set(["schema.json", "index.json"]);

const files = (await readdir(DEVICES_DIR))
  .filter((file) => file.endsWith(".json") && !NOT_DEVICES.has(file))
  .sort();

// Formatted through prettier so the result matches what `npm run lint` expects.
await writeFile(MANIFEST, await format(JSON.stringify(files), { parser: "json" }));

console.log(`Wrote ${MANIFEST} with ${files.length} device file(s).`);
