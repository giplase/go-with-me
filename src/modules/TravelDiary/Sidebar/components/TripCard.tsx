"use client"
import { useEffect, useState, useTransition } from "react"
import { useMarkersManagerContext } from "../../MarkersManager"
import { Trip } from "../types/Trip"
import MarkdownViewer from "./MarkdownViewer"
import { addTrip, getTripById, updateTrip } from "../api/sidebarApi"
import TripEditor from "./TripEditor"

export default function TripCard() {
  const {
    isEditing,
    focusedMarkerId,
    markers,
    startEditing,
    finishEditing,
    unFocusMarker,
    focusMarker,
    updateMarkerData,
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
      {!isEditing && tripData && (
        <div className="flex w-full flex-col gap-4 text-sm">
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
          <h1 className="text-xl">{tripData.name}</h1>
          <div className="flex w-full justify-between gap-2.5">
            <div className="text-text-sub flex items-center gap-2.5">
              <CalendarIcon />
              <span>
                {tripData.tripStartDate || tripData.tripEndDate
                  ? `${tripData.tripStartDate ? tripData.tripStartDate.split("-").reverse().join(".") : "?"} – ${tripData.tripEndDate ? tripData.tripEndDate.split("-").reverse().join(".") : "?"}`
                  : "Даты не указаны"}
              </span>
            </div>
          </div>

          <div className="border-border overflow-hidden rounded-md border-2">
            <MarkdownViewer markdown={tripData.description} />
          </div>
          <div className="flex w-full justify-center gap-2.5">
            <button
              type="submit"
              className="hover:bg-foreground active:bg-border border-border w-fit cursor-pointer rounded-md border-2 px-10 py-2 outline-none"
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

function CalendarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 2V5"
        stroke="white"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 2V5"
        stroke="white"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.4"
        d="M3.5 9.08984H20.5"
        stroke="white"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
        stroke="white"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.4"
        d="M15.6946 13.7002H15.705"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.4"
        d="M15.6946 16.7002H15.705"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.4"
        d="M11.9956 13.7002H12.0061"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.4"
        d="M11.9956 16.7002H12.0061"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.4"
        d="M8.29419 13.7002H8.30463"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.4"
        d="M8.29395 16.7002H8.30439"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
