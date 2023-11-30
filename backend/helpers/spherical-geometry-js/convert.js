import { floatEqual } from './float-equal.js';
import LatLng, { LAT, LNG } from './latlng.js';

/**
 * Converts an object into a LatLng. Tries a few different methods:
 * 1. If instanceof LatLng, clone and return the object
 * 2. If it has 'lat' and 'lng' properties...
 *    2a. if the properties are functions (like Google LatLngs),
 *        use the lat() and lng() values as lat and lng
 *    2b. otherwise get lat and lng, parse them as floats and try them
 * 3. If it has 'lat' and *'long'* properties,
 *    parse them as floats and return a LatLng
 * 4. If it has 'lat' and *'lon'* properties,
 *    parse them as floats and return a LatLng
 * 5. If it has 'latitude' and 'longitude' properties,
 *    parse them as floats and return a LatLng
 * 6. If it has number values for 0 and 1, use 1 as latitude and 0
 *    as longitude.
 * 7. If it has x and y properties, try using y as latitude and x and
 *    longitude.
 * @param {LatLngLike} like
 * @returns {LatLng}
 */
export function convert(like) {
  if (like instanceof LatLng) {
    return new LatLng(like[LAT], like[LNG]);
  } else if ('lat' in like && 'lng' in like) {
    if (typeof like.lat == 'function' && typeof like.lng == 'function') {
      return new LatLng(like.lat(), like.lng());
    } else {
      return new LatLng(parseFloat(like.lat), parseFloat(like.lng));
    }
  } else if ('lat' in like && 'long' in like) {
    return new LatLng(parseFloat(like.lat), parseFloat(like.long));
  } else if ('lat' in like && 'lon' in like) {
    return new LatLng(parseFloat(like.lat), parseFloat(like.lon));
  } else if ('latitude' in like && 'longitude' in like) {
    return new LatLng(parseFloat(like.latitude), parseFloat(like.longitude));
  } else if (typeof like[0] === 'number' && typeof like[1] === 'number') {
    return new LatLng(like[1], like[0]);
  } else if ('x' in like && 'y' in like) {
    return new LatLng(parseFloat(like.y), parseFloat(like.x));
  } else {
    throw new TypeError(`Cannot convert ${like} to LatLng`);
  }
}

/**
 * Converts a LatLngLiteral into a LatLng.
 * @param {LatLngLiteral} literal
 */
export function convertLiteral(literal) {
  return new LatLng(literal.lat, literal.lng);
}

/**
 * Comparison function
 * @param {LatLng} one
 * @param {LatLng} two
 * @returns {boolean}
 */
export function equals(one, two) {
  one = convert(one);
  two = convert(two);
  return floatEqual(one[LAT], two[LAT]) && floatEqual(one[LNG], two[LNG]);
}
