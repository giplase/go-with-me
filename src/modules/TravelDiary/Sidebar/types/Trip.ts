import { Database } from "@/shared/supabase/dbSchema"

export type TripData = Database["public"]["Tables"]["trip_card"]["Row"]
export type Trip = Omit<TripData, "owner">
