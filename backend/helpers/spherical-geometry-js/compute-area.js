import computeSignedArea from './compute-signed-area.js';
import { EARTH_RADIUS } from './utils.js';

export default function computeArea(path) {
  return Math.abs(computeSignedArea(path, EARTH_RADIUS));
}
