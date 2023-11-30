import { floatEqual } from './float-equal.js';
import LatLng, { LAT, LNG } from './latlng.js';

// export function convert(like) {
//   if (like instanceof LatLng) {
//     return new LatLng(like[LAT], like[LNG]);
//   } else if ('lat' in like && 'lng' in like) {
//     if (typeof like.lat == 'function' && typeof like.lng == 'function') {
//       return new LatLng(like.lat(), like.lng());
//     } else {
//       return new LatLng(parseFloat(like.lat), parseFloat(like.lng));
//     }
//   } else if ('lat' in like && 'long' in like) {
//     return new LatLng(parseFloat(like.lat), parseFloat(like.long));
//   } else if ('lat' in like && 'lon' in like) {
//     return new LatLng(parseFloat(like.lat), parseFloat(like.lon));
//   } else if ('latitude' in like && 'longitude' in like) {
//     return new LatLng(parseFloat(like.latitude), parseFloat(like.longitude));
//   } else if (typeof like[0] === 'number' && typeof like[1] === 'number') {
//     return new LatLng(like[1], like[0]);
//   } else if ('x' in like && 'y' in like) {
//     return new LatLng(parseFloat(like.y), parseFloat(like.x));
//   } else {
//     throw new TypeError(`Cannot convert ${like} to LatLng`);
//   }
// }

// export function convertLiteral(literal) {
//   return new LatLng(literal.lat, literal.lng);
// }

export function equals(one, two) {
  one = convert(one);
  two = convert(two);
  return floatEqual(one[LAT], two[LAT]) && floatEqual(one[LNG], two[LNG]);
}

export function convert(like) {
  return new LatLng(parseFloat(like.latitude), parseFloat(like.longitude));
}
