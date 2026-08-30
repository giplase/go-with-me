import { useRef, useState } from "react"
import { Trip } from "../types/Trip"
import { ForwardRefEditor } from "./ForwardRefEditor"
import { MDXEditorMethods } from "@mdxeditor/editor"
import { useMarkersManagerContext } from "../../MarkersManager"
import { Icon, Marker, MarkerMode } from "../../Markers"
import StyledInput from "@/components/StyledInput"
import StyledCheckbox from "@/components/StyledCheckbox"

export default function TripEditor({
  tripData,
  currentMarker,
  isPending,
  saveData,
}: {
  tripData: Omit<Trip, "id" | "latitude" | "longitude">
  currentMarker: Marker
  isPending: boolean
  saveData: (tripToSave: Omit<Trip, "id">) => void
}) {
  const markdownRef = useRef<MDXEditorMethods>(null)
  const { focusedMarkerId, updateMarkerData } = useMarkersManagerContext()
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
          tripStartDate: tripStartDate ? tripStartDate : null,
          tripEndDate: tripEndDate ? tripEndDate : null,
          latitude: currentMarker.location[1],
          longitude: currentMarker.location[0],
          isVisited: !isPlanned,
          tripRating: null,
        }
        saveData(trip)
      }}
      className="flex w-full flex-col gap-4 text-sm"
    >
      <div className="w-full">
        <StyledInput
          label="Название"
          type="text"
          defaultValue={tripData.name}
          name="name"
          error={nameError}
          errorPayload="Введите название поездки"
          placeholder="Название поездки"
        />
      </div>

      <div>
        <div className="flex w-full items-end justify-between gap-2.5">
          <div className="w-55">
            <StyledInput
              label="Дата начала"
              type="date"
              defaultValue={tripData.tripStartDate?.toString()}
              name="tripStartDate"
              error={dateError}
              errorPayload="Дата окончания не может быть раньше даты начала"
            />
          </div>
          <div className="w-55">
            <StyledInput
              label="Дата окончания"
              type="date"
              defaultValue={tripData.tripEndDate?.toString()}
              name="tripEndDate"
              error={dateError}
              errorPayload="Дата окончания не может быть раньше даты начала"
            />
          </div>
          <StyledCheckbox
            name="isPlanned"
            label="Планируется"
            defaultChecked={!tripData.isVisited}
            onCheckedChange={(checked) => {
              if (checked && focusedMarkerId && updateMarkerData)
                updateMarkerData(focusedMarkerId, { icon: Icon.Planned, color: "FF984A", mode: MarkerMode.Planned })
              if (!checked && focusedMarkerId && updateMarkerData)
                updateMarkerData(focusedMarkerId, { icon: Icon.Visited, color: "FF4A83", mode: MarkerMode.Visited })
            }}
          />
        </div>
      </div>

      <div className="border-border overflow-hidden rounded-md border-2">
        <ForwardRefEditor markdown={tripData.description} ref={markdownRef} className="dark-theme text-text-main" />
      </div>

      <div className="flex w-full justify-center">
        <button
          type="submit"
          disabled={isPending}
          className={` ${!isPending ? "hover:bg-foreground" : ""} active:bg-border border-border disabled:bg-pending focus:outline-border w-fit cursor-pointer rounded-md border-2 px-10 py-2 focus:outline-2 disabled:animate-pulse disabled:cursor-auto`}
        >
          Сохранить
        </button>
      </div>
    </form>
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
