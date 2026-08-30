"use client"
import { createContext, ReactNode, useContext, useEffect, useRef, useState, useTransition } from "react"
import { Icon, Marker, MarkerMode } from "../../Markers"
import { useYmapsContext } from "../../YandexMap"
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
  unfocusMarker: () => void
  startEditing: (id?: number) => number
  finishEditing?: (focusedId?: number) => void
  updateMarkerData?: (id: number, newData: Partial<Omit<Marker, "id">>) => void
  isLoading: boolean
  isPendingUpdateLocName: boolean
}

export const MarkersManagerContext = createContext<MarkersManagerContextInterface | null>(null)

export default function MarkersManagerProvider({ children }: { children: ReactNode }) {
  const ymapsContextValue = useYmapsContext()
  const [isLoading, startTransition] = useTransition()
  const [isPendingUpdateLocName, startUpdateLocNameTransition] = useTransition()

  const [internalMarkers, setInternalMarkers] = useState<Marker[]>([]) // All user markers
  const [markers, setMarkers] = useState<Marker[]>([]) // Visible user markers

  const [focusedMarkerId, setFocusedMarkerId] = useState<number | undefined>(undefined)
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.All)

  const [isEditing, setIsEditing] = useState(false)
  const tempIdRef = useRef(0)

  const startEditing = (id?: number) => {
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
      startUpdateLocNameTransition(async () => {
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

  const finishEditing = (focusedId?: number) => {
    setIsEditing(false)
    setMarkers(filterMarkersByMode(internalMarkers, displayMode))
    startTransition(async () => {
      const { data, errorMessage } = await getAllUserMarkers()
      if (errorMessage || !data) {
        console.log(errorMessage)
        return
      }
      setInternalMarkers(data)
      setMarkers(filterMarkersByMode(data, displayMode))
      if (focusedId && data) {
        const currentMarker = data.find((marker) => marker.id === focusedId)
        if (currentMarker) updateMarkerData(focusedId, { location: currentMarker.location })
      }
    })
  }

  const updateDisplayMode = (displayMode: DisplayMode) => {
    setDisplayMode(displayMode)
    setMarkers(filterMarkersByMode(internalMarkers, displayMode))
  }

  const filterMarkersByMode = (markersList: Marker[], displayMode: DisplayMode) => {
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

  const unfocusMarker = () => {
    setFocusedMarkerId(undefined)
    ymapsContextValue?.unfocusLocation()
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
        unfocusMarker,
        startEditing,
        updateMarkerData: isEditing ? updateMarkerData : undefined,
        finishEditing: isEditing ? finishEditing : undefined,
        isLoading,
        isPendingUpdateLocName,
      }}
    >
      {children}
    </MarkersManagerContext>
  )
}

export function useMarkersManagerContext() {
  const markersManagerContextValue = useContext(MarkersManagerContext)
  if (markersManagerContextValue === null)
    throw new Error("MarkersManagerContext is null because the function was called outside the context")
  return {
    markers: markersManagerContextValue.markers,
    isEditing: markersManagerContextValue.isEditing,
    focusedMarkerId: markersManagerContextValue.focusedMarkerId,
    updateDisplayMode: markersManagerContextValue.updateDisplayMode,
    focusMarker: markersManagerContextValue.focusMarker,
    unfocusMarker: markersManagerContextValue.unfocusMarker,
    startEditing: markersManagerContextValue.startEditing,
    updateMarkerData: markersManagerContextValue.updateMarkerData,
    finishEditing: markersManagerContextValue.finishEditing,
    isLoading: markersManagerContextValue.isLoading,
    isPendingUpdateLocName: markersManagerContextValue.isPendingUpdateLocName,
  }
}
