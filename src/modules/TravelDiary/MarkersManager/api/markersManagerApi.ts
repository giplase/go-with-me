import { createClient } from "@/shared/supabase/client"
import { Database } from "@/shared/supabase/dbSchema"
import { Icon, Marker, MarkerMode } from "../../Markers"

type TripData = Database["public"]["Tables"]["trip_card"]["Row"]
type MarkerData = Pick<TripData, "id" | "name" | "latitude" | "longitude" | "isVisited">

export type ApiResult<T> = {
  data: T
  errorMessage?: string
  errorCode?: string
}

export async function getAllUserMarkers(): Promise<ApiResult<Marker[]>> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { data: [], errorMessage: "Session not found", errorCode: "SESSION_NOT_FOUND" }

  const query = supabase.from("trip_card").select("id, name, latitude, longitude, isVisited").eq("owner", user.id)

  const { data: rawData, error } = await query
  if (error || !rawData) return { data: [], errorMessage: error?.message, errorCode: error?.code }
  const data = rawData.map((marker) => parseMarker(marker))
  return { data }
}

const parseMarker = (data: MarkerData): Marker => {
  return {
    id: data.id,
    title: data.name,
    location: [data.longitude, data.latitude],
    icon: data.isVisited ? Icon.Visited : Icon.Planned,
    color: data.isVisited ? "#FF4A83" : "#FF984A",
    mode: data.isVisited ? MarkerMode.Visited : MarkerMode.Planned,
  }
}
