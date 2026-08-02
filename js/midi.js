/** Web MIDI access and output-port enumeration. */

let access = null;

export const isSupported = () =>
  typeof navigator !== "undefined" && "requestMIDIAccess" in navigator;

export async function requestAccess() {
  if (!isSupported()) {
    throw new Error("Web MIDI is not supported in this browser.");
  }

  access = await navigator.requestMIDIAccess();
  return access;
}

export function getOutputs() {
  return access ? [...access.outputs.values()] : [];
}

/** Fires when a port is connected or disconnected. */
export function onPortsChanged(listener) {
  access?.addEventListener("statechange", listener);
}
