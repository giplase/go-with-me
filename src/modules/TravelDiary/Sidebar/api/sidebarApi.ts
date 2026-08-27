import { createClient } from "@/shared/supabase/client"
import { Trip, TripData } from "../types/Trip"

export type ApiResult<T> = {
  data: T
  errorMessage?: string
  errorCode?: string
}

const parseTrip = (data: TripData): Trip => {
  return {
    description: data.description,
    id: data.id,
    isVisited: data.isVisited,
    latitude: data.latitude,
    longitude: data.longitude,
    name: data.name,
    tripEndDate: data.tripEndDate,
    tripRating: data.tripRating,
    tripStartDate: data.tripStartDate,
  }
}

export async function getTripById(tripId: number): Promise<ApiResult<Trip | undefined>> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { data: undefined, errorMessage: "Session not found", errorCode: "SESSION_NOT_FOUND" }

  const query = supabase.from("trip_card").select("*").eq("id", tripId).eq("owner", user.id).maybeSingle()

  const { data: rawData, error } = await query
  if (error || !rawData) return { data: undefined, errorMessage: error?.message, errorCode: error?.code }

  return { data: parseTrip(rawData) }
}

export async function addTrip(trip: Omit<Trip, "id">): Promise<ApiResult<Trip | null>> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { data: null, errorMessage: "Session not found", errorCode: "SESSION_NOT_FOUND" }
  const { data, error } = await supabase
    .from("trip_card")
    .insert({ ...trip, owner: user.id })
    .select("*")
    .single()
  if (error || !data) return { data: null, errorMessage: error?.message, errorCode: error?.code }
  return { data: parseTrip(data) }
}

export async function updateTrip(trip: Trip): Promise<ApiResult<Trip | null>> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { data: null, errorMessage: "Session not found", errorCode: "SESSION_NOT_FOUND" }
  const { data, error } = await supabase
    .from("trip_card")
    .update({ ...trip, owner: user.id })
    .eq("id", trip.id)
    .select("*")
    .single()
  if (error || !data) return { data: null, errorMessage: error?.message, errorCode: error?.code }
  return { data: parseTrip(data) }
}
