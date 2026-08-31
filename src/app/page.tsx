import { MarkersList, MarkersManagerProvider, Sidebar, Toolbar, YmapsContextProvider } from "@/modules/TravelDiary"
import { createClient } from "@/shared/supabase/server"
import { redirect } from "next/navigation"

export default async function MapPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <YmapsContextProvider>
      <MarkersManagerProvider>
        <MarkersList />
        <Toolbar />
        <Sidebar />
      </MarkersManagerProvider>
    </YmapsContextProvider>
  )
}
