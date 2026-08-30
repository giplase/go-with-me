"use client"

import { Tooltip } from "@base-ui/react"
import { ReactNode } from "react"

export default function TooltipPortal({ payload }: { payload: ReactNode }) {
  return (
    <Tooltip.Portal>
      <Tooltip.Positioner
        sideOffset={11}
        className="h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom,transform] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-instant:transition-none"
      >
        <Tooltip.Popup className="border-warning bg-background text-text-main relative h-(--popup-height,auto) w-(--popup-width,auto) max-w-125 origin-(--transform-origin) rounded-md border-2 text-sm shadow-[0.25rem_0.25rem_0] shadow-black/12 transition-[width,height,opacity,transform] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:transform-[scale(0.9)] data-ending-style:opacity-0 data-instant:transition-none data-starting-style:transform-[scale(0.9)] data-starting-style:opacity-0">
          <Tooltip.Arrow className={arrowClass} />
          <Tooltip.Viewport className="relative h-full w-full overflow-clip px-(--viewport-inline-padding) py-1 [--viewport-inline-padding:0.5rem] **:data-current:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding))] **:data-current:translate-x-0 **:data-current:opacity-100 **:data-current:transition-[translate,opacity] **:data-current:duration-[350ms,175ms] **:data-current:ease-[cubic-bezier(0.22,1,0.36,1)] **:data-previous:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding))] **:data-previous:translate-x-0 **:data-previous:opacity-100 **:data-previous:transition-[translate,opacity] **:data-previous:duration-[350ms,175ms] **:data-previous:ease-[cubic-bezier(0.22,1,0.36,1)] data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:-translate-x-1/2 data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:opacity-0 data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:translate-x-1/2 data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:opacity-0 data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:translate-x-1/2 data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:opacity-0 data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:-translate-x-1/2 data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:opacity-0 [[data-instant]_&_[data-current]]:transition-none [[data-instant]_&_[data-previous]]:transition-none">
            {payload}
          </Tooltip.Viewport>
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  )
}

const arrowClass =
  "relative block w-3 h-1.5 overflow-clip transition-[left] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-instant:transition-none data-[side=bottom]:top-[-6px] data-[side=left]:right-[-9px] data-[side=left]:rotate-90 data-[side=right]:left-[-9px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-6px] data-[side=top]:rotate-180 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:w-[calc(6px*sqrt(2))] before:h-[calc(6px*sqrt(2))] before:bg-background  before:border-2 before:border-warning before:[transform:translate(-50%,50%)_rotate(45deg)]"
