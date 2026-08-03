/** Builds MIDI byte sequences. Pure - nothing here touches Web MIDI. */

const CONTROL_CHANGE = 0xb0;

const CC_NRPN_MSB = 99;
const CC_NRPN_LSB = 98;
const CC_DATA_ENTRY_MSB = 6;
const CC_DATA_ENTRY_LSB = 38;
const CC_RPN_MSB = 101;
const CC_RPN_LSB = 100;

const CC_MAX = 127;
const NRPN_MAX = 16383;

const clamp = (value, max) => Math.min(Math.max(value, 0), max);

/** Channel is 1-16. Value is clamped to 0-127. */
export function ccMessage(channel, number, value) {
  return [
    CONTROL_CHANGE | ((channel - 1) & 0x0f),
    number & 0x7f,
    clamp(value, CC_MAX),
  ];
}

/**
 * Selects the parameter on CC 99/98, sends the 14-bit value on CC 6/38, then
 * nulls the parameter number on CC 101/100 so a later data-entry message can't
 * land on it by accident.
 */
export function nrpnMessages(channel, number, value) {
  const target = clamp(value, NRPN_MAX);

  return [
    ccMessage(channel, CC_NRPN_MSB, (number >> 7) & 0x7f),
    ccMessage(channel, CC_NRPN_LSB, number & 0x7f),
    ccMessage(channel, CC_DATA_ENTRY_MSB, (target >> 7) & 0x7f),
    ccMessage(channel, CC_DATA_ENTRY_LSB, target & 0x7f),
    ccMessage(channel, CC_RPN_MSB, CC_MAX),
    ccMessage(channel, CC_RPN_LSB, CC_MAX),
  ];
}
