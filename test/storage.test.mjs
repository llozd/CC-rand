import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

// storage.js talks to localStorage, which Node doesn't have.
const store = new Map();
globalThis.localStorage = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
};

const { deleteUserDevice, getUserDevices, hasUserDevice, saveUserDevice } =
  await import("../js/storage.js");

const device = (name, extra = {}) => ({
  name,
  manufacturer: "Acme",
  schemaVersion: 1,
  parameters: [],
  ...extra,
});

beforeEach(() => store.clear());

test("empty storage yields no devices", () => {
  assert.deepEqual(getUserDevices(), []);
  assert.equal(hasUserDevice("Anything"), false);
});

test("a saved device can be read back", () => {
  saveUserDevice(device("Test Rig"));

  assert.deepEqual(
    getUserDevices().map((saved) => saved.name),
    ["Test Rig"],
  );
  assert.equal(hasUserDevice("Test Rig"), true);
});

test("saving the same name replaces rather than duplicates", () => {
  saveUserDevice(device("Test Rig", { manufacturer: "First" }));
  saveUserDevice(device("Test Rig", { manufacturer: "Second" }));

  const saved = getUserDevices();
  assert.equal(saved.length, 1);
  assert.equal(saved[0].manufacturer, "Second");
});

test("deleting removes only the named device", () => {
  saveUserDevice(device("Keep"));
  saveUserDevice(device("Drop"));
  deleteUserDevice("Drop");

  assert.deepEqual(
    getUserDevices().map((saved) => saved.name),
    ["Keep"],
  );
});

test("corrupt storage is treated as empty rather than throwing", () => {
  store.set("midi-randomiser.devices", "{not json");
  assert.deepEqual(getUserDevices(), []);

  store.set("midi-randomiser.devices", '{"not":"an array"}');
  assert.deepEqual(getUserDevices(), []);
});
