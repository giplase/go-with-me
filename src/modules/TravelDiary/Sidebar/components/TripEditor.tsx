import { useRef, useState } from "react"
import { Trip } from "../types/Trip"
import { ForwardRefEditor } from "./ForwardRefEditor"
import { MDXEditorMethods } from "@mdxeditor/editor"
import { useMarkersManagerContext } from "../../MarkersManager"
import { Icon, Marker, MarkerMode } from "../../Markers"
import { Checkbox } from "@base-ui/react"

export default function TripEditor({
  tripData,
  currentMarker,
  saveData,
}: {
  tripData: Omit<Trip, "id" | "latitude" | "longitude">
  currentMarker: Marker
  saveData: (tripToSave: Omit<Trip, "id">) => void
}) {
  const [error, setError] = useState<string | undefined>(undefined)
  const markdownRef = useRef<MDXEditorMethods>(null)
  const { isEditing, focusedMarkerId, finishEditing, unFocusMarker, updateMarkerData } = useMarkersManagerContext()

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        const name = formData.get("name") as string
        if (!name) {
          setError("Введите название")
          return
        }
        const isPlanned = !!(formData.get("isPlanned") as string)
        const tripStartDate = formData.get("tripStartDate") as string
        const tripEndDate = formData.get("tripEndDate") as string
        if (tripEndDate && tripStartDate && new Date(tripStartDate) > new Date(tripEndDate)) {
          setError("Дата начала не может быть раньше даты окончания.")
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
      <input
        className="bg-foreground border-border rounded-md border-2 p-2 outline-none"
        type="text"
        placeholder="Название поездки"
        name="name"
        autoComplete="off"
        defaultValue={tripData.name}
      />
      <div className="flex w-full justify-between gap-2.5">
        <input
          className="bg-foreground border-border placeholder:text-text-sub w-55 rounded-md border-2 p-2 scheme-dark outline-none"
          type="date"
          placeholder="Дата начала"
          name="tripStartDate"
          defaultValue={tripData.tripStartDate?.toString()}
        />
        <input
          className="bg-foreground border-border placeholder:text-text-sub w-55 rounded-md border-2 p-2 scheme-dark outline-none"
          type="date"
          placeholder="Дата окончания"
          name="tripEndDate"
          defaultValue={tripData.tripEndDate?.toString()}
        />
        <label className="flex cursor-pointer items-center gap-2 text-sm font-normal">
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
      {error && <p className="">{error}</p>}
    </form>
  )
}

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
