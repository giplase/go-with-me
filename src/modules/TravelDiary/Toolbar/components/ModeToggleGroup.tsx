"use client"
import { Toggle, ToggleGroup, Toolbar } from "@base-ui/react"
import { DisplayMode, useMarkersManagerContext } from "../../MarkersManager"
import { useYmapsContext } from "../../YandexMap"
import { LngLat } from "ymaps3"

export default function ModeToggleGroup() {
  const markersManagerContextValue = useMarkersManagerContext()
  const ymapsContextValue = useYmapsContext()

  return (
    <Toolbar.Root className="bg-background flex h-fit items-center gap-1.25 rounded-lg p-1.25">
      <ToggleGroup
        className="border-border flex items-center rounded-lg border-3"
        onValueChange={(groupValue) => {
          const mode = groupValue[0] ?? null
          switch (mode) {
            case null:
              markersManagerContextValue.updateDisplayMode(DisplayMode.All)
              break
            case "Planned":
              markersManagerContextValue.updateDisplayMode(DisplayMode.Planned)
              break
            case "Visited":
              markersManagerContextValue.updateDisplayMode(DisplayMode.Visited)
              break
          }
        }}
      >
        <Toolbar.Button
          render={<Toggle />}
          disabled={markersManagerContextValue.isLoading}
          value={"Planned"}
          className={`data-pressed:bg-border hover:bg-hover flex items-center justify-center rounded-tl-sm rounded-bl-sm p-1.5 ${markersManagerContextValue.isLoading ? "cursor-auto hover:bg-transparent" : "active:bg-border cursor-pointer"}`}
        >
          <PlannedPlaceIcon />
        </Toolbar.Button>
        <Toolbar.Button
          render={<Toggle />}
          disabled={markersManagerContextValue.isLoading}
          value={"Visited"}
          className={`data-pressed:bg-border hover:bg-hover flex items-center justify-center rounded-tr-sm rounded-br-sm p-1.5 ${markersManagerContextValue.isLoading ? "cursor-auto hover:bg-transparent" : "active:bg-border cursor-pointer"}`}
        >
          <VisitedPlaceIcon />
        </Toolbar.Button>
      </ToggleGroup>
      <ToggleGroup className="border-border flex items-center rounded-lg border-3">
        <Toolbar.Button
          disabled={markersManagerContextValue.isLoading}
          className={`data-pressed:bg-border hover:bg-hover flex items-center justify-center rounded-sm p-1.5 ${markersManagerContextValue.isLoading ? "cursor-auto hover:bg-transparent" : "active:bg-border cursor-pointer"}`}
          onClick={() => {
            markersManagerContextValue.startEditing()
            ymapsContextValue?.focusLocation(ymapsContextValue.mapRef.current?.center as LngLat)
          }}
        >
          <AddPlaceIcon />
        </Toolbar.Button>
      </ToggleGroup>
    </Toolbar.Root>
  )
}

function AddPlaceIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 11H8.52941L13.2647 11L18 11.0001"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11 18V13.4706V8.73529V4" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlannedPlaceIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.9622 9.05602C19.8712 8.78039 19.6294 8.57952 19.3383 8.53791L14.4011 7.83136L12.1931 3.42437C12.0629 3.16453 11.7942 3 11.5 3C11.2058 3 10.9371 3.16453 10.8069 3.42437L8.59907 7.83131L3.66175 8.53786C3.37064 8.57952 3.12873 8.78039 3.03784 9.05596C2.94695 9.33159 3.02274 9.63411 3.23343 9.83635L6.80608 13.2661L5.96237 18.11C5.91264 18.3957 6.03182 18.6843 6.26981 18.8546C6.40444 18.951 6.56391 19 6.72415 19C6.84714 19 6.97065 18.9711 7.08374 18.9126L11.4999 16.6258L15.9161 18.9126C16.0299 18.9715 16.1545 18.9995 16.2779 19C16.7042 18.9994 17.0496 18.6588 17.0496 18.2387C17.0496 18.1803 17.0429 18.1233 17.0303 18.0686L16.1939 13.2662L19.7665 9.83635C19.9773 9.63411 20.053 9.33159 19.9622 9.05602Z"
        fill="white"
      />
    </svg>
  )
}

function VisitedPlaceIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 10.2143L9.12 16L20 7" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
