import { useRef, useState } from "react"
import { Trip } from "../types/Trip"
import { ForwardRefEditor } from "./ForwardRefEditor"
import { MDXEditorMethods } from "@mdxeditor/editor"
import { useMarkersManagerContext } from "../../MarkersManager"
import { Icon, Marker, MarkerMode } from "../../Markers"
import { Checkbox, Tooltip } from "@base-ui/react"

const tooltipHandle = Tooltip.createHandle<React.ReactNode>()

export default function TripEditor({
  tripData,
  currentMarker,
  saveData,
}: {
  tripData: Omit<Trip, "id" | "latitude" | "longitude">
  currentMarker: Marker
  saveData: (tripToSave: Omit<Trip, "id">) => void
}) {
  const markdownRef = useRef<MDXEditorMethods>(null)
  const { isEditing, focusedMarkerId, finishEditing, unFocusMarker, updateMarkerData } = useMarkersManagerContext()
  const [nameError, setNameError] = useState(false)
  const [dateError, setDateError] = useState(false)

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        const name = formData.get("name") as string
        const nameInvalid = !name
        setNameError(nameInvalid)
        const isPlanned = !!(formData.get("isPlanned") as string)
        const tripStartDate = formData.get("tripStartDate") as string
        const tripEndDate = formData.get("tripEndDate") as string
        const datesInvalid = !!tripEndDate && !!tripStartDate && new Date(tripStartDate) > new Date(tripEndDate)
        setDateError(datesInvalid)

        if (nameInvalid || datesInvalid) {
          return
        }

        const trip: Omit<Trip, "id"> = {
          name,
          description: markdownRef.current?.getMarkdown() ?? "",
          tripStartDate: tripStartDate,
          tripEndDate: tripEndDate,
          latitude: currentMarker.location[1],
          longitude: currentMarker.location[0],
          isVisited: !isPlanned,
          tripRating: null,
        }

        saveData(trip)
      }}
      className="flex w-full flex-col gap-4 text-sm"
    >
      <div className="flex w-full items-center justify-between gap-2.5">
        <span className="text-text-sub truncate">{currentMarker?.locationName}</span>
        <button
          className="w-fit cursor-pointer"
          onClick={() => {
            if (isEditing && finishEditing) finishEditing()
            unFocusMarker()
          }}
        >
          <CloseIcon />
        </button>
      </div>
      <Tooltip.Provider>
        <div className="w-full">
          <label className="relative flex flex-col gap-0.5">
            Название
            {nameError && (
              <Tooltip.Trigger
                className="absolute top-0 right-0 flex items-center justify-center border-0 bg-transparent select-none"
                payload="Введите название поездки"
                handle={tooltipHandle}
                delay={200}
              >
                <InfoIcon />
              </Tooltip.Trigger>
            )}
            <input
              className={`bg-foreground border-border w-full rounded-md border-2 p-2 outline-none ${nameError ? "border-warning" : ""}`}
              type="text"
              placeholder="Название поездки"
              name="name"
              autoComplete="off"
              defaultValue={tripData.name}
            />
          </label>
        </div>

        <div>
          <div className="flex w-full items-end justify-between gap-2.5">
            <label className="relative flex flex-col gap-0.5">
              Дата начала
              {dateError && (
                <Tooltip.Trigger
                  className="absolute top-0 right-0 flex items-center justify-center border-0 bg-transparent select-none"
                  payload="Дата окончания не может быть раньше даты начала"
                  handle={tooltipHandle}
                  delay={200}
                >
                  <InfoIcon />
                </Tooltip.Trigger>
              )}
              <input
                className={`bg-foreground border-border w-55 rounded-md border-2 p-2 uppercase scheme-dark outline-none ${dateError ? "border-warning" : ""}`}
                type="date"
                name="tripStartDate"
                defaultValue={tripData.tripStartDate?.toString()}
              />
            </label>
            <label className="relative flex flex-col gap-0.5">
              Дата окончания
              {dateError && (
                <Tooltip.Trigger
                  className="absolute top-0 right-0 flex items-center justify-center border-0 bg-transparent select-none"
                  payload="Дата окончания не может быть раньше даты начала"
                  handle={tooltipHandle}
                  delay={200}
                >
                  <InfoIcon />
                </Tooltip.Trigger>
              )}
              <input
                className={`bg-foreground border-border w-55 rounded-md border-2 p-2 uppercase scheme-dark outline-none ${dateError ? "border-warning" : ""}`}
                type="date"
                name="tripEndDate"
                defaultValue={tripData.tripEndDate?.toString()}
              />
            </label>
            <label className="flex cursor-pointer items-center gap-2 pb-2.5 text-sm font-normal">
              <Checkbox.Root
                name="isPlanned"
                defaultChecked={!tripData.isVisited}
                onCheckedChange={(checked) => {
                  if (checked && focusedMarkerId && updateMarkerData)
                    updateMarkerData(focusedMarkerId, { icon: Icon.Planned, color: "FF984A", mode: MarkerMode.Planned })
                  if (!checked && focusedMarkerId && updateMarkerData)
                    updateMarkerData(focusedMarkerId, { icon: Icon.Visited, color: "FF4A83", mode: MarkerMode.Visited })
                }}
                className="border-border bg-foreground data-checked:bg-border flex size-4 shrink-0 items-center justify-center rounded-sm border-2 p-2"
              >
                <Checkbox.Indicator className="flex data-unchecked:hidden">
                  <CheckIcon className="text-text-main" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              Планируется
            </label>
          </div>
        </div>
        <Tooltip.Root handle={tooltipHandle}>
          {({ payload }) => (
            <Tooltip.Portal>
              <Tooltip.Positioner
                sideOffset={11}
                className="h-[var(--positioner-height)] w-[var(--positioner-width)] max-w-[var(--available-width)] transition-[top,left,right,bottom,transform] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-instant:transition-none"
              >
                <Tooltip.Popup className="border-warning bg-background text-text-main relative h-[var(--popup-height,auto)] w-[var(--popup-width,auto)] max-w-[500px] origin-[var(--transform-origin)] rounded-md border-2 text-sm shadow-[0.25rem_0.25rem_0] shadow-black/12 transition-[width,height,opacity,transform] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:[transform:scale(0.9)] data-ending-style:opacity-0 data-instant:transition-none data-starting-style:[transform:scale(0.9)] data-starting-style:opacity-0">
                  <Tooltip.Arrow className={arrowClass} />

                  <Tooltip.Viewport className="relative h-full w-full overflow-clip px-[var(--viewport-inline-padding)] py-1 [--viewport-inline-padding:0.5rem] [&_[data-current]]:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding))] [&_[data-current]]:translate-x-0 [&_[data-current]]:opacity-100 [&_[data-current]]:transition-[translate,opacity] [&_[data-current]]:duration-[350ms,175ms] [&_[data-current]]:ease-[cubic-bezier(0.22,1,0.36,1)] data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:-translate-x-1/2 data-[activation-direction~='left']:[&_[data-current][data-starting-style]]:opacity-0 data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:translate-x-1/2 data-[activation-direction~='right']:[&_[data-current][data-starting-style]]:opacity-0 [&_[data-previous]]:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding))] [&_[data-previous]]:translate-x-0 [&_[data-previous]]:opacity-100 [&_[data-previous]]:transition-[translate,opacity] [&_[data-previous]]:duration-[350ms,175ms] [&_[data-previous]]:ease-[cubic-bezier(0.22,1,0.36,1)] data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:translate-x-1/2 data-[activation-direction~='left']:[&_[data-previous][data-ending-style]]:opacity-0 data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:-translate-x-1/2 data-[activation-direction~='right']:[&_[data-previous][data-ending-style]]:opacity-0 [[data-instant]_&_[data-current]]:transition-none [[data-instant]_&_[data-previous]]:transition-none">
                    {payload}
                  </Tooltip.Viewport>
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          )}
        </Tooltip.Root>
      </Tooltip.Provider>

      <div className="border-border overflow-hidden rounded-md border-2">
        <ForwardRefEditor markdown={tripData.description} ref={markdownRef} className="dark-theme text-text-main" />
      </div>

      <div className="flex w-full justify-center">
        <button
          type="submit"
          className="hover:bg-foreground active:bg-border border-border w-fit cursor-pointer rounded-md border-2 px-10 py-2 outline-none"
        >
          Сохранить
        </button>
      </div>
    </form>
  )
}
const arrowClass =
  "relative block w-3 h-1.5 overflow-clip transition-[left] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-instant:transition-none data-[side=bottom]:top-[-6px] data-[side=left]:right-[-9px] data-[side=left]:rotate-90 data-[side=right]:left-[-9px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-6px] data-[side=top]:rotate-180 before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:w-[calc(6px*sqrt(2))] before:h-[calc(6px*sqrt(2))] before:bg-background  before:border-2 before:border-warning before:[transform:translate(-50%,50%)_rotate(45deg)]"

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
      style={{ display: "block", ...props.style }}
    >
      <path d="m2.5 8.5 4 4 7-9" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
        fill="#ffffff80"
      />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg
      className="text-warning"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 8V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9941 16H12.004" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
