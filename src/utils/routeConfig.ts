import { colors } from '../tokens';

// TODO(MVP): Replace with real Mapbox Directions API (cycling profile) response.
// Coordinates: Bicycle Kitchen (4427 Fountain Ave) → Silver Lake Reservoir

export type LngLat = [number, number];

// Route waypoints along Fountain Ave → Virgil → Sunset → Silver Lake Blvd
export const ROUTE_COORDINATES: LngLat[] = [
  [-118.2774, 34.0956], // Start: Bicycle Kitchen
  [-118.2730, 34.0951], // Fountain Ave (protected lane)
  [-118.2680, 34.0942], // Fountain & Heliotrope
  [-118.2640, 34.0931], // Fountain & Virgil
  [-118.2610, 34.0910], // Sunset Blvd crossing (caution)
  [-118.2590, 34.0895], // Silver Lake Blvd
  [-118.2570, 34.0888], // Silver Lake Blvd N
  [-118.2556, 34.0882], // End: Silver Lake Reservoir
];

export const ROUTE_START: LngLat = ROUTE_COORDINATES[0];
export const ROUTE_END: LngLat   = ROUTE_COORDINATES[ROUTE_COORDINATES.length - 1];

// Center of the route for initial camera position
export const ROUTE_CENTER: LngLat = [-118.2665, 34.0919];

// GeoJSON FeatureCollection with per-segment lane color.
// Each feature is a LineString covering one lane-type segment.
// TODO(MVP): Replace segment boundaries with real LA GeoHub lane classification.
export const ROUTE_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { color: colors.safe, laneType: 'safe' },
      geometry: {
        type: 'LineString',
        coordinates: ROUTE_COORDINATES.slice(0, 4), // Fountain Ave protected lane
      },
    },
    {
      type: 'Feature',
      properties: { color: colors.caution, laneType: 'caution' },
      geometry: {
        type: 'LineString',
        coordinates: ROUTE_COORDINATES.slice(3, 6), // Sunset Blvd crossing
      },
    },
    {
      type: 'Feature',
      properties: { color: colors.safe, laneType: 'safe' },
      geometry: {
        type: 'LineString',
        coordinates: ROUTE_COORDINATES.slice(5), // Silver Lake Blvd
      },
    },
  ],
};
