import { MarkersList, MarkersManagerProvider, Sidebar, Toolbar, YmapsContextProvider } from "@/modules/TravelDiary"

export default function MapPage() {
  return (
    <>
      <YmapsContextProvider>
        <MarkersManagerProvider>
          <MarkersList />
          <Toolbar />
          <Sidebar />
        </MarkersManagerProvider>
      </YmapsContextProvider>
    </>
  )
}
