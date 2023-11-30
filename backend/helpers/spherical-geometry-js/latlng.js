import { equals } from './convert.js';

export const LAT = 'latitude';
export const LNG = 'longitude';

export default class LatLng {
  constructor(lat, lng, noWrap = false) {
    lat = parseFloat(lat);
    lng = parseFloat(lng);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      throw TypeError('lat or lng are not numbers');
    }

    if (!noWrap) {
      //Constrain lat to -90, 90
      lat = Math.min(Math.max(lat, -90), 90);
      //Wrap lng using modulo
      lng = lng == 180 ? lng : ((((lng + 180) % 360) + 360) % 360) - 180;
    }

    Object.defineProperty(this, LAT, { value: lat });
    Object.defineProperty(this, LNG, { value: lng });
    this.length = 2;

    Object.freeze(this);
  }

  equals(other) {
    return equals(this, other);
  }

  lat() {
    return this[LAT];
  }

  lng() {
    return this[LNG];
  }

  get x() {
    return this[LNG];
  }

  get y() {
    return this[LAT];
  }

  get 0() {
    return this[LNG];
  }

  get 1() {
    return this[LAT];
  }

  get long() {
    return this[LNG];
  }

  get lon() {
    return this[LNG];
  }

  toJSON() {
    return { lat: this[LAT], lng: this[LNG] };
  }

  toString() {
    return `(${this[LAT]}, ${this[LNG]})`;
  }

  toUrlValue(precision = 6) {
    precision = parseInt(precision);
    return (
      parseFloat(this[LAT].toFixed(precision)) +
      ',' +
      parseFloat(this[LNG].toFixed(precision))
    );
  }

  [Symbol.iterator]() {
    /** @type {0 | 1} */
    let i = 0;
    return {
      next: () => {
        if (i < this.length) {
          return { value: this[i++], done: false };
        } else {
          return { done: true };
        }
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
}
