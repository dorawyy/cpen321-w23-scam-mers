/**
 * Check if two floats are almost equal.
 * @param {number} a
 * @param {number} b
 */
export function floatEqual(a, b) {
  if (a === b) {
    return true;
  }

  const diff = Math.abs(a - b);

  return diff < Number.EPSILON;
}
