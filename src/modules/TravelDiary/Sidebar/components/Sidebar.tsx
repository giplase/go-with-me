"use client"

import { Drawer } from "@base-ui/react"
import { useMarkersManagerContext } from "../../MarkersManager"
import TripCard from "./TripCard"

export default function Sidebar() {
  const { focusedMarkerId, isEditing, unFocusMarker, finishEditing } = useMarkersManagerContext()

  return (
    <Drawer.Root
      open={!!focusedMarkerId}
      onOpenChange={(open) => {
        if (!open) {
          unFocusMarker()
          if (isEditing && finishEditing) finishEditing()
        }
      }}
      swipeDirection="right"
      modal={false}
      disablePointerDismissal
    >
      <Drawer.Portal className="z-1000">
        <Drawer.Viewport className="pointer-events-none fixed inset-0 flex items-stretch justify-end [--viewport-padding:0px] supports-[-webkit-touch-callout:none]:[--viewport-padding:0.625rem]">
          <Drawer.Popup className="bg-background pointer-events-auto h-full w-190 [transform:translateX(var(--drawer-swipe-movement-x))] touch-auto overflow-y-auto overscroll-contain p-6 text-neutral-950 shadow-[0.25rem_0.25rem_0] shadow-black/12 transition-[transform,box-shadow] duration-[600ms] ease-in-out outline-none [--bleed:3rem] data-ending-style:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-ending-style:shadow-[0.25rem_0.25rem_0] data-ending-style:shadow-black/0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*550ms)] data-starting-style:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-starting-style:shadow-[0.25rem_0.25rem_0] data-starting-style:shadow-black/0 data-swiping:select-none supports-[-webkit-touch-callout:none]:mr-0 supports-[-webkit-touch-callout:none]:w-[20rem] supports-[-webkit-touch-callout:none]:max-w-[calc(100vw-3rem)] supports-[-webkit-touch-callout:none]:border supports-[-webkit-touch-callout:none]:pr-6 supports-[-webkit-touch-callout:none]:[--bleed:0px]">
            <Drawer.Content className="mx-auto w-full p-5">
              <TripCard />
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
