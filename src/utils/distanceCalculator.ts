/**
 * Convert degree to radian
 * @param deg The degree value
 * @returns The radian value of the degree
 */
function degreToRad(deg: number): number {
  return deg * (Math.PI / 180);
}


/**
 * Calculate the distance between two points on earth in km using the haversine formula
 * @param start [Lat, Lng] of one point
 * @param destination [Lat, Lng] of the other point
 * @returns distance in km
 */
export function haversineDistance(start: [number, number], destination: [number, number]): number {
  const [startLat, startLng] = start.map(degreToRad);
  const [destLat, destLng] = destination.map(degreToRad);

  const distanceLat = destLat - startLat;
  const distanceLng = destLng - startLng;

  const earthRadius = 6371;

  const a =
    Math.sin(distanceLat/2) ** 2 + 
    Math.cos(startLat) * Math.cos(destLat) * Math.sin(distanceLng/2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  const distance = earthRadius * c;

  return distance;
}


