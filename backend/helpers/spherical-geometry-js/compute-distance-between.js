import { EARTH_RADIUS, toRadians } from './utils.js';
import LatLng from './latlng.js';
import { convert } from './convert.js';

export function computeDistanceBetweenHelper(from, to) {
  const radFromLat = toRadians(from.lat());
  const radFromLng = toRadians(from.lng());
  const radToLat = toRadians(to.lat());
  const radToLng = toRadians(to.lng());
  return (
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin((radFromLat - radToLat) / 2), 2) +
          Math.cos(radFromLat) *
            Math.cos(radToLat) *
            Math.pow(Math.sin((radFromLng - radToLng) / 2), 2)
      )
    )
  );
}

export default function computeDistanceBetween(
  from,
  to,
  radius = EARTH_RADIUS
) {
  from = convert(from);
  to = convert(to);
  return computeDistanceBetweenHelper(from, to) * radius;
}
