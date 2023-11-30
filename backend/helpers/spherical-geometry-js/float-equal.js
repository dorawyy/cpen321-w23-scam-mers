export function floatEqual(a, b) {
  if (a === b) {
    return true;
  }

  const diff = Math.abs(a - b);

  return diff < Number.EPSILON;
}
