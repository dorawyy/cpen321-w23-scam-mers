// Function to compute distance between two points using Haversine formula
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6378.137; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }
  
  // Function to compute the area of a spherical polygon
  export function sphericalPolygonArea(coords) {
    const R = 6378.137; // Radius of the Earth in kilometers
  
    const radians = coords.map(coord => ({
      latitude: coord.latitude * (Math.PI / 180),
      longitude: coord.longitude * (Math.PI / 180),
    }));
  
    let totalArea = 0;
  
    for (let i = 0; i < radians.length; i++) {
      const j = (i + 1) % radians.length;
  
      const xi = radians[i].longitude;
      const yi = radians[i].latitude;
      const xj = radians[j].longitude;
      const yj = radians[j].latitude;
  
      totalArea += ((xj - xi) * Math.sin(yi) + (xi - xj) * Math.sin(yj)) * R * R;
    }
  
    return Math.abs(totalArea / 2); // Return the absolute value of the total area
  }
  
  // Example usage
//   const polygonCoords = [
//     { latitude: 37.7749, longitude: -122.4194 },
//     { latitude: 34.0522, longitude: -118.2437 },
//     { latitude: 41.8781, longitude: -87.6298 },
//     // Add more coordinates as needed
//   ];

  export function sphericalPolygonLength(coords) {
    let totalLength = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      totalLength += haversine(
        coords[i].latitude,
        coords[i].longitude,
        coords[i + 1].latitude,
        coords[i + 1].longitude
      );
    }
  }
  
  // Compute the area of the polygon
//   const polygonArea = sphericalPolygonArea(polygonCoords);
  
//   console.log('Total Length:', totalLength.toFixed(2), 'km');
//   console.log('Total Area:', polygonArea.toFixed(2), 'sq km');
  