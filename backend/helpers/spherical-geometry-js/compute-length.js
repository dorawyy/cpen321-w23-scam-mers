import { EARTH_RADIUS } from './utils.js';
import computeDistanceBetween from './compute-distance-between.js';

export default function computeLength(path, radius = EARTH_RADIUS) {
  let length = 0;
  for (let i = 0; i < path.length - 1; i++)
    length += computeDistanceBetween(path[i], path[i + 1], radius);
  return length;
}
