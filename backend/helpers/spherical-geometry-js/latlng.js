import { equals } from './convert.js';

export const LAT = 'latitude';
export const LNG = 'longitude';

export default class LatLng {
  /**
   * @param {number} lat
   * @param {number} lng
   * @param {boolean} noWrap
   */
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

  /**
   * Comparison function
   * @param {LatLng} other
   * @returns {boolean}
   */
  equals(other) {
    return equals(this, other);
  }

  /**
   * Returns the latitude in degrees.
   * (I'd rather use getters but this is for consistency)
   * @returns {number}
   */
  lat() {
    return this[LAT];
  }

  /**
   * Returns the longitude in degrees.
   * (I'd rather use getters but this is for consistency)
   * @returns {number}
   */
  lng() {
    return this[LNG];
  }

  /** @type {number} alias for lng */
  get x() {
    return this[LNG];
  }
  /** @type {number} alias for lat */
  get y() {
    return this[LAT];
  }
  /** @type {number} alias for lng */
  get 0() {
    return this[LNG];
  }
  /** @type {number} alias for lat */
  get 1() {
    return this[LAT];
  }
  /** @type {number} alias for lng */
  get long() {
    return this[LNG];
  }
  /** @type {number} alias for lng */
  get lon() {
    return this[LNG];
  }

  /**
   * Converts to JSON representation. This function is intended to be used via
   * JSON.stringify.
   * @returns {LatLngLiteral}
   */
  toJSON() {
    return { lat: this[LAT], lng: this[LNG] };
  }

  /**
   * Converts to string representation.
   * @returns {string}
   */
  toString() {
    return `(${this[LAT]}, ${this[LNG]})`;
  }

  /**
   * Returns a string of the form "lat,lng" for this LatLng. We round the
   * lat/lng values to 6 decimal places by default.
   * @param {number} [precision=6]
   * @returns {string}
   */
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
