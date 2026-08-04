/** User-created devices, persisted in localStorage. Keyed by device name. */

const KEY = "midi-randomiser.devices";

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const devices = raw ? JSON.parse(raw) : [];
    return Array.isArray(devices) ? devices : [];
  } catch {
    // Corrupt or unreadable storage shouldn't take the app down.
    return [];
  }
}

function write(devices) {
  localStorage.setItem(KEY, JSON.stringify(devices));
}

export function getUserDevices() {
  return read();
}

export function hasUserDevice(name) {
  return read().some((device) => device.name === name);
}

export function saveUserDevice(device) {
  const devices = read().filter((saved) => saved.name !== device.name);
  devices.push(device);
  write(devices);
}

export function deleteUserDevice(name) {
  write(read().filter((device) => device.name !== name));
}
