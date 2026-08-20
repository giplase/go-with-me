"use client"
import { createContext, ReactNode, useContext, useEffect, useRef, useState, useTransition } from "react"
import { Icon, Marker, MarkerMode } from "../../Markers"
import { useYmapsContext } from "../../YandexMap"
import { LngLat } from "ymaps3"
import { getLocationTitleByLngLat } from "../../YandexMap"
import { getAllUserMarkers } from "../api/markersManagerApi"

export enum DisplayMode {
  Planned,
  Visited,
  All,
}

export interface MarkersManagerContextInterface {
  markers: Marker[]
  isEditing: boolean
  focusedMarkerId?: number
  updateDisplayMode: (mode: DisplayMode) => void
  focusMarker: (id: number) => void
  unFocusMarker: () => void
  startEditing: (id?: number) => number
  finishEditing?: () => void
  updateMarkerData?: (id: number, newData: Partial<Omit<Marker, "id">>) => void
  isLoading: boolean
}

const ZOOM = 9

export const MarkersManagerContext = createContext<MarkersManagerContextInterface | null>(null)

export default function MarkersManagerProvider({ children }: { children: ReactNode }) {
  const ymapsContextValue = useYmapsContext()
  const [isPending, startTransition] = useTransition()
  const [isPendingUpdateLocName, startUpdateLocNameTransition] = useTransition()

  const [internalMarkers, setInternalMarkers] = useState<Marker[]>([]) // All user markers
  const [markers, setMarkers] = useState<Marker[]>([]) // Visible user markers

  const [focusedMarkerId, setFocusedMarkerId] = useState<number | undefined>(undefined)
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.All)

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const tempIdRef = useRef(0)

  const startEditing = (id?: number) => {
    // const currentId = id ?? -Date.now()
    const currentId = id ?? --tempIdRef.current
    if (!id && ymapsContextValue?.mapRef.current) {
      const [lng, lat] = ymapsContextValue.mapRef.current.center
      setMarkers([
        {
          id: currentId,
          title: "",
          location: [lng, lat],
          icon: Icon.Visited,
          color: "#FF4A83",
          mode: MarkerMode.Visited,
        },
      ])
      startTransition(async () => {
        const { data } = await getLocationTitleByLngLat([lng, lat])
        if (data) updateMarkerData(currentId, { locationName: data })
      })
    } else {
      const currentMarker = markers.find((marker) => marker.id === currentId)
      if (currentMarker) setMarkers([{ ...currentMarker }])
      console.log(currentMarker)
    }
    setIsEditing(true)
    setFocusedMarkerId(currentId)
    return currentId
  }

  const finishEditing = () => {
    setIsEditing(false)
    startTransition(async () => {
      const { data, errorMessage } = await getAllUserMarkers()
      if (errorMessage || !data) {
        console.log(errorMessage)
        return
      }
      setInternalMarkers(data)
      setMarkers(setMarkersByMode(data, displayMode))
      if (focusedMarkerId && data) {
        const currentMarker = data.find((marker) => marker.id === focusedMarkerId)
        if (currentMarker) updateMarkerData(focusedMarkerId, { location: currentMarker.location })
      }
    })
  }

  const updateDisplayMode = (displayMode: DisplayMode) => {
    setDisplayMode(displayMode)
    setMarkers(setMarkersByMode(internalMarkers, displayMode))
  }

  const setMarkersByMode = (markersList: Marker[], displayMode: DisplayMode) => {
    switch (displayMode) {
      case DisplayMode.All:
        return markersList
      case DisplayMode.Planned:
        return markersList.filter((marker) => marker.mode === MarkerMode.Planned)
      case DisplayMode.Visited:
        return markersList.filter((marker) => marker.mode === MarkerMode.Visited)
    }
  }

  const focusMarker = (id: number) => {
    setFocusedMarkerId(id)
    const currentMarker = markers.find((marker) => marker.id === id)
    if (!currentMarker) return
    ymapsContextValue?.focusLocation(currentMarker?.location)
    if (!currentMarker.locationName) {
      startUpdateLocNameTransition(async () => {
        const { data } = await getLocationTitleByLngLat(currentMarker.location)
        if (data) updateMarkerData(id, { locationName: data })
      })
    }
  }

  const unFocusMarker = () => {
    setFocusedMarkerId(undefined)
    ymapsContextValue?.unFocusLocation()
  }

  const updateMarkerData = (id: number, newData: Partial<Omit<Marker, "id">>) => {
    setMarkers((prev) => prev.map((marker) => (marker.id === id ? { ...marker, ...newData } : marker)))

    startUpdateLocNameTransition(async () => {
      if (!newData.location) return
      const { data } = await getLocationTitleByLngLat(newData.location)
      if (data) updateMarkerData(id, { locationName: data })
    })
  }

  const updateInternalMarkers = () => {
    startTransition(async () => {
      const { data, errorMessage } = await getAllUserMarkers()
      if (errorMessage || !data) {
        console.log(errorMessage)
        return
      }
      setInternalMarkers(data)
      setMarkers(data)
    })
  }

  useEffect(() => {
    updateInternalMarkers()
  }, [])
  return (
    <MarkersManagerContext
      value={{
        markers,
        isEditing,
        focusedMarkerId,
        updateDisplayMode,
        focusMarker,
        unFocusMarker,
        startEditing,
        updateMarkerData: isEditing ? updateMarkerData : undefined,
        finishEditing: isEditing ? finishEditing : undefined,
        isLoading,
      }}
    >
      {children}
    </MarkersManagerContext>
  )
}

export function useMarkersManagerContext() {
  const markersManagerContextValue = useContext(MarkersManagerContext)
  if (markersManagerContextValue === null) throw new Error("YmapsContext is null")
  return {
    markers: markersManagerContextValue.markers,
    isEditing: markersManagerContextValue.isEditing,
    focusedMarkerId: markersManagerContextValue.focusedMarkerId,
    updateDisplayMode: markersManagerContextValue.updateDisplayMode,
    focusMarker: markersManagerContextValue.focusMarker,
    unFocusMarker: markersManagerContextValue.unFocusMarker,
    startEditing: markersManagerContextValue.startEditing,
    updateMarkerData: markersManagerContextValue.updateMarkerData,
    finishEditing: markersManagerContextValue.finishEditing,
    isLoading: markersManagerContextValue.isLoading,
  }
}
