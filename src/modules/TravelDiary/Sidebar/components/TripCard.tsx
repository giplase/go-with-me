"use client"
import { useEffect, useState, useTransition } from "react"
import { useMarkersManagerContext } from "../../MarkersManager"
import { Trip } from "../types/Trip"
import MarkdownViewer from "./MarkdownViewer"
import { addTrip, getTripById, updateTrip } from "../api/sidebarApi"
import TripEditor from "./TripEditor"
import CalendarIcon from "@/shared/icons/CalendarIcon"
import TripCardHeader from "./TripCardHeader"

export default function TripCard() {
  const {
    isEditing,
    focusedMarkerId,
    markers,
    startEditing,
    finishEditing,
    unfocusMarker,
    focusMarker,
    isPendingUpdateLocName,
  } = useMarkersManagerContext()

  const newTrip = {
    description: "Здесь вы можете написать о поездке, впечатлениях, интересных местах.",
    isVisited: true,
    name: "",
    tripEndDate: null,
    tripRating: null,
    tripStartDate: null,
  }
  const [tripData, setTripData] = useState<Omit<Trip, "id" | "latitude" | "longitude">>(newTrip)
  const [isPending, startTransition] = useTransition()

  function formatDate(date: string) {
    return date.split("-").reverse().join(".")
  }

  useEffect(() => {
    if (focusedMarkerId && focusedMarkerId > 0) {
      startTransition(async () => {
        const { data, errorMessage } = await getTripById(focusedMarkerId)
        if (data) {
          setTripData({
            description: data.description,
            isVisited: data.isVisited,
            name: data.name,
            tripEndDate: data.tripEndDate,
            tripRating: data.tripRating,
            tripStartDate: data.tripStartDate,
          })
        }
      })
    }
  }, [focusedMarkerId])

  const currentMarker = markers.find((marker) => marker.id === focusedMarkerId)

  return (
    <div className="bg-background text-text-main w-full">
      <TripCardHeader
        isPendingUpdateLocName={isPendingUpdateLocName}
        locationName={currentMarker?.locationName}
        onClick={() => {
          if (isEditing && finishEditing) finishEditing()
          unfocusMarker()
        }}
      />
      {!isEditing && tripData && (
        <div className="flex w-full flex-col gap-4 text-sm">
          {!isPending && <h1 className="text-xl">{tripData.name}</h1>}
          {isPending && <h1 className="bg-pending h-7 w-100 animate-pulse rounded-md"></h1>}
          <div className="flex w-full justify-between gap-2.5">
            <div className="text-text-sub flex items-center gap-2.5">
              <CalendarIcon />
              {!isPending && (
                <span>
                  {tripData.tripStartDate || tripData.tripEndDate
                    ? `${tripData.tripStartDate ? formatDate(tripData.tripStartDate) : "?"} – ${tripData.tripEndDate ? formatDate(tripData.tripEndDate) : "?"}`
                    : "Даты не указаны"}
                </span>
              )}
              {isPending && <span className="bg-pending h-5 w-45 animate-pulse rounded-md"></span>}
            </div>
          </div>

          {!isPending && (
            <div className="border-border overflow-hidden rounded-md border-2">
              <MarkdownViewer markdown={tripData.description} />
            </div>
          )}
          {isPending && <div className="bg-pending h-[calc(100vh-23rem)] w-full animate-pulse rounded-md"></div>}
          <div className="flex w-full justify-center gap-2.5">
            <button
              type="submit"
              disabled={isPending}
              className="hover:bg-foreground active:bg-border border-border w-fit cursor-pointer rounded-md border-2 px-10 py-2 outline-none disabled:cursor-auto disabled:hover:bg-transparent"
              onClick={() => startEditing(focusedMarkerId)}
            >
              Редактировать
            </button>
          </div>
        </div>
      )}
      {isEditing && tripData && currentMarker && (
        <TripEditor
          tripData={tripData}
          isPending={isPending}
          currentMarker={currentMarker}
          saveData={(tripToSave: Omit<Trip, "id">) => {
            startTransition(async () => {
              if (focusedMarkerId) {
                const { data: savedTrip, errorMessage } =
                  focusedMarkerId < 0
                    ? await addTrip(tripToSave)
                    : await updateTrip({ ...tripToSave, id: focusedMarkerId })

                if (errorMessage || !savedTrip) {
                  console.log(errorMessage)
                  return
                }
                focusMarker(savedTrip.id)
                setTripData(savedTrip)
                if (finishEditing) finishEditing(savedTrip.id)
              }
            })
          }}
        />
      )}
    </div>
  )
}
