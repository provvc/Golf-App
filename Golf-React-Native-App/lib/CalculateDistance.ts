type Point = {
    latitude: number,
    longitude: number
};

export default function haversineDistance(a: Point, b: Point): number {
  const R = 6371000; // radius of earth in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180; // degree to latitude converter
  const dLat = toRad(b.latitude - a.latitude); // the lat distance between pA and pB in rads
  const dLon = toRad(b.longitude - a.longitude); // the lon distance between pA and pB in rads
  
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  
    return R * 2 * Math.asin(Math.sqrt(h)) * 1.09361;
}