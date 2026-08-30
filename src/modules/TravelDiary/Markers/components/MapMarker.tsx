"use client"
import { useState } from "react"
import { useMarkersManagerContext } from "../../MarkersManager"
import { useYmapsContext } from "../../YandexMap"
import { Icon, Marker } from "../types/Marker"
import { LngLat } from "ymaps3"

const createMarkerTitleFromCoords = (coordinates: LngLat) => {
  return `${coordinates[0].toFixed(4)}; ${coordinates[1].toFixed(4)}`
}

export default function MapMarker({ marker }: { marker: Marker }) {
  const { isEditing, focusMarker, updateMarkerData } = useMarkersManagerContext()
  const ymapsContextValue = useYmapsContext()

  const [markerCoordTitle, setMarkerCoordTitle] = useState(createMarkerTitleFromCoords(marker.location))

  return (
    ymapsContextValue && (
      <ymapsContextValue.YMapMarker
        coordinates={marker.location}
        onClick={() => {
          if (isEditing) return
          focusMarker(marker.id)
        }}
        draggable={isEditing}
        onDragMove={(coordinates) => {
          setMarkerCoordTitle(createMarkerTitleFromCoords(coordinates))
        }}
        onDragEnd={(coordinates) => {
          if (updateMarkerData) {
            updateMarkerData(marker.id, { location: coordinates })
          }
        }}
      >
        <div className="bg-background text-text-main absolute max-w-40 translate-x-3.75 translate-y-[calc(-100%-12px)] truncate rounded-sm px-2 py-1 text-sm">
          {isEditing ? markerCoordTitle : marker.title}
        </div>

        <div className="absolute -translate-x-1/2 translate-y-[calc(-100%+2.65px)] cursor-pointer">
          {marker.icon === Icon.Planned && <PlannedPlaceIcon></PlannedPlaceIcon>}
          {marker.icon === Icon.Visited && <VisitedPlaceIcon></VisitedPlaceIcon>}
        </div>
      </ymapsContextValue.YMapMarker>
    )
  )
}

function PlannedPlaceIcon() {
  return (
    <svg width="40" height="49" viewBox="0 0 40 49" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="39.7297" height="39.7297" rx="19.8649" fill="#FF984A" />
      <g clipPath="url(#clip0_102_2)">
        <path
          d="M29.8155 17.5381C29.7085 17.2089 29.424 16.969 29.0815 16.9192L23.2731 16.0753L20.6754 10.8116C20.5222 10.5012 20.2061 10.3047 19.8601 10.3047C19.514 10.3047 19.1978 10.5012 19.0447 10.8116L16.4472 16.0753L10.6386 16.9192C10.2961 16.969 10.0116 17.2089 9.90463 17.538C9.7977 17.8672 9.88687 18.2286 10.1347 18.4701L14.3378 22.5667L13.3452 28.3523C13.2867 28.6935 13.4269 29.0382 13.7069 29.2417C13.8653 29.3568 14.0529 29.4153 14.2414 29.4153C14.3861 29.4153 14.5314 29.3808 14.6645 29.3109L19.86 26.5795L25.0555 29.3109C25.1893 29.3813 25.3359 29.4148 25.4811 29.4153C25.9827 29.4146 26.389 29.0078 26.389 28.5061C26.389 28.4362 26.3812 28.3682 26.3662 28.3029L25.3823 22.5668L29.5854 18.4701C29.8333 18.2286 29.9224 17.8672 29.8155 17.5381Z"
          fill="white"
        />
      </g>
      <circle cx="19.865" cy="46.3514" r="2.64865" fill="#FF984A" />
      <defs>
        <clipPath id="clip0_102_2">
          <rect width="20" height="20" fill="white" transform="translate(9.86011 9.85999)" />
        </clipPath>
      </defs>
    </svg>
  )
}

function VisitedPlaceIcon() {
  return (
    <svg width="40" height="49" viewBox="0 0 40 49" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="39.7297" height="39.7297" rx="19.8649" fill="#FF4A83" />
      <path
        d="M11.3501 18.5143L17.4701 24.3L28.3501 15.3"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="19.8647" cy="46.3514" r="2.64865" fill="#FF4A83" />
    </svg>
  )
}
