/** Web MIDI access, output-port enumeration, and sending CC and NRPN. */

const CONTROL_CHANGE = 0xb0;

const CC_NRPN_MSB = 99;
const CC_NRPN_LSB = 98;
const CC_DATA_ENTRY_MSB = 6;
const CC_DATA_ENTRY_LSB = 38;
const CC_RPN_MSB = 101;
const CC_RPN_LSB = 100;

const CC_MAX = 127;
const NRPN_MAX = 16383;

let access = null;
let outputId = null;
let channel = 1;

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

export function setOutput(id) {
  outputId = id;
}

export function setChannel(value) {
  channel = value;
}

const clamp = (value, max) => Math.min(Math.max(value, 0), max);

function ccMessage(number, value) {
  return [
    CONTROL_CHANGE | ((channel - 1) & 0x0f),
    number & 0x7f,
    clamp(value, CC_MAX),
  ];
}

function send(messages) {
  const output = outputId ? access?.outputs.get(outputId) : null;

  if (!output) {
    throw new Error("No MIDI output selected.");
  }

  for (const message of messages) {
    output.send(message);
  }
}

export function sendCC(number, value) {
  send([ccMessage(number, value)]);
}

/**
 * Selects the parameter on CC 99/98, sends the 14-bit value on CC 6/38, then
 * nulls the parameter number on CC 101/100 so a later data-entry message can't
 * land on it by accident.
 */
export function sendNRPN(number, value) {
  const target = clamp(value, NRPN_MAX);

  send([
    ccMessage(CC_NRPN_MSB, (number >> 7) & 0x7f),
    ccMessage(CC_NRPN_LSB, number & 0x7f),
    ccMessage(CC_DATA_ENTRY_MSB, (target >> 7) & 0x7f),
    ccMessage(CC_DATA_ENTRY_LSB, target & 0x7f),
    ccMessage(CC_RPN_MSB, CC_MAX),
    ccMessage(CC_RPN_LSB, CC_MAX),
  ]);
}
