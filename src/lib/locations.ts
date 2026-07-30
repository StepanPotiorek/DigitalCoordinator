export interface Location {
  city: string
  address: string
  lat: number
  lng: number
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}

export function distanceKm(a: Location, b: { lat: number; lng: number }) {
  const R = 6371
  const dLat = deg2rad(b.lat - a.lat)
  const dLng = deg2rad(b.lng - a.lng)
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(a.lat)) * Math.cos(deg2rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))
}

export function findNearest(
  locations: Location[],
  coords: { lat: number; lng: number },
): Location | null {
  if (locations.length === 0) return null
  let nearest = locations[0]
  let minDist = distanceKm(nearest, coords)
  for (let i = 1; i < locations.length; i++) {
    const d = distanceKm(locations[i], coords)
    if (d < minDist) {
      minDist = d
      nearest = locations[i]
    }
  }
  return nearest
}

export function mapsUrl(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address + ", Czech Republic")}`
}

export function nearbySearchUrl(query: string) {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}/`
}

export const oampLocations: Location[] = [
  { city: "Praha (Chodov)", address: "Cigánkova 1861/2, Praha 4", lat: 50.033, lng: 14.518 },
  { city: "Praha (Dejvice)", address: "Žukovského 888/2, Praha 6", lat: 50.098, lng: 14.392 },
  { city: "Brno", address: "Koperníkova 803/2, Brno", lat: 49.2023, lng: 16.6387 },
  { city: "Ostrava", address: "Výstavní 55/117, Ostrava", lat: 49.812, lng: 18.275 },
  { city: "Plzeň", address: "Kaplířova 2726/9, Plzeň", lat: 49.7265, lng: 13.3616 },
  { city: "České Budějovice", address: "Nemanická 428/11, České Budějovice", lat: 48.9998, lng: 14.478 },
]

export const foreignPoliceLocations: Location[] = [
  { city: "Praha", address: "Olšanská 2176/2, Praha 3", lat: 50.0831, lng: 14.4644 },
  { city: "Brno", address: "Svatoplukova 2687/84, Brno", lat: 49.195, lng: 16.646 },
  { city: "Ostrava", address: "Výstavní 55/117, Ostrava", lat: 49.812, lng: 18.275 },
  { city: "Plzeň", address: "Slovanská alej 26, Plzeň", lat: 49.731, lng: 13.350 },
]
