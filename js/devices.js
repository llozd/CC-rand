/**
 * Loads the devices shipped in the repo. Static hosts can't list a directory,
 * so the files are discovered through the devices/index.json manifest.
 */

const DEVICES_PATH = "devices/";

async function fetchJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }

  return response.json();
}

export async function loadShippedDevices() {
  const manifest = await fetchJson(`${DEVICES_PATH}index.json`);
  return Promise.all(manifest.map((file) => fetchJson(DEVICES_PATH + file)));
}
