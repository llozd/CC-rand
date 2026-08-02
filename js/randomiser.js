/** Picks random values for the enabled parameters of a device. */

/** Inclusive of both bounds. A max below min collapses to min. */
function randomValue({ min, max }) {
  if (max <= min) {
    return min;
  }

  return min + Math.floor(Math.random() * (max - min + 1));
}

export function randomiseParameters(parameters) {
  return parameters
    .filter((parameter) => parameter.enabled)
    .map((parameter) => ({ parameter, value: randomValue(parameter) }));
}
