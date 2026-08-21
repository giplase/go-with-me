import { LngLat } from "ymaps3"

export interface Marker {
  id: number
  title: string
  location: LngLat
  icon: Icon
  color: string
  mode: MarkerMode
  locationName?: string
}

export enum MarkerMode {
  Planned,
  Visited,
}

// Separate type for expansion capability
export enum Icon {
  Planned,
  Visited,
}
