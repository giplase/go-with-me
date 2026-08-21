"use client"
import { useMarkersManagerContext } from "../../MarkersManager"
import MapMarker from "./MapMarker"

export default function MarkersList() {
  const markersManagerContextValue = useMarkersManagerContext()

  return markersManagerContextValue.markers.map((marker) => <MapMarker marker={marker} key={marker.id}></MapMarker>)
}
