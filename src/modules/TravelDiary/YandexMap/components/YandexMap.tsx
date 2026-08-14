"use client"

import { createContext, ReactNode, RefObject, useContext, useEffect, useRef, useState } from "react"
import { ReactifiedModule, Reactify } from "@yandex/ymaps3-types/reactify"
import { YMapReactContainer } from "@yandex/ymaps3-types/imperative/YMapReactContainer"
import { LngLat, YMap, YMapCenterZoomLocation } from "ymaps3"
import React from "react"
import ReactDOM from "react-dom"
import { MAP_CUSTOMIZATION } from "../lib/map-customization"
const ZOOM = 9

const LOCATION: YMapCenterZoomLocation = {
  center: [37.61556, 55.7522],
  zoom: 5,
}

export interface YmapsInterface {
  reactify?: Reactify
  reactified?: ReactifiedModule<
    Record<string | symbol, unknown> & {
      __implReactifyOverride?: (reactify: Reactify) => object
    } & typeof import("ymaps3") & {
        YMapReactContainer: typeof YMapReactContainer
      }
  >
}

export interface YmapsContextInterface extends YmapsInterface {
  mapRef: RefObject<YMap | null>
  focusLocation: (coords: LngLat) => void
  unFocusLocation: () => void
}

const YmapsContext = createContext<YmapsContextInterface | null>(null)

export default function YmapsContextProvider({ children }: { children: ReactNode }) {
  const [ymapsModules, setYmapsModules] = useState<YmapsInterface>({})
  const mapRef = useRef<YMap>(null)

  const focusLocation = (coords: LngLat) => {
    if (mapRef.current) {
      const width = mapRef.current.size.x
      const dLng = (360 * width) / (256 * 2 ** ZOOM * Math.cos((coords[1] * Math.PI) / 180))
      const center: LngLat = [coords[0] + dLng / 12, coords[1]]
      mapRef.current?.update({
        location: { center: center, zoom: ZOOM, duration: 600, easing: "ease-in-out" },
      })
    }
  }

  const unFocusLocation = () => {
    if (mapRef.current) {
      const [centerLng, centerLat] = mapRef.current.center
      const width = mapRef.current.size.x
      const zoom = mapRef.current.zoom
      const dLng = (360 * width) / (256 * 2 ** zoom * Math.cos((centerLat * Math.PI) / 180))
      const newCenter: LngLat = [centerLng - dLng / 12, centerLat]
      mapRef.current.update({
        location: { center: newCenter, zoom: zoom, duration: 600, easing: "ease-in-out" },
      })
    }
  }

  useEffect(() => {
    Promise.all([ymaps3.import("@yandex/ymaps3-reactify"), ymaps3.ready]).then(([ymaps3React]) => {
      const reactify = ymaps3React.reactify.bindTo(React, ReactDOM)
      const YmapModule = reactify.module(ymaps3)
      setYmapsModules({
        reactify: reactify,
        reactified: YmapModule,
      })
    })
  }, [])

  return (
    <YmapsContext
      value={{
        ...ymapsModules,
        mapRef,
        focusLocation,
        unFocusLocation,
      }}
    >
      {ymapsModules.reactified && ymapsModules.reactify && (
        <div className="h-screen w-screen">
          <ymapsModules.reactified.YMap
            ref={mapRef}
            location={ymapsModules.reactify.useDefault(LOCATION)}
            theme="dark"
            distribution={false}
          >
            <ymapsModules.reactified.YMapDefaultSchemeLayer
              customization={ymapsModules.reactify.useDefault(MAP_CUSTOMIZATION)}
            />
            <ymapsModules.reactified.YMapDefaultFeaturesLayer />
            {children}
          </ymapsModules.reactified.YMap>
        </div>
      )}
    </YmapsContext>
  )
}

export function useYmapsContext() {
  const ymapsContextValue = useContext(YmapsContext)
  if (ymapsContextValue === null) throw new Error("YmapsContext is null")
  if (!ymapsContextValue.reactify || !ymapsContextValue.reactified) return null
  return {
    reactify: ymapsContextValue.reactify,
    YMap: ymapsContextValue.reactified.YMap,
    YMapMarker: ymapsContextValue.reactified.YMapMarker,
    mapRef: ymapsContextValue.mapRef,
    focusLocation: ymapsContextValue.focusLocation,
    unFocusLocation: ymapsContextValue.unFocusLocation,
  }
}
