"use client"
import { Autocomplete } from "@base-ui/react"
import { Fragment, useState, useTransition } from "react"
import { SuggestResponseItem } from "ymaps3"
import { getLocationByUri, useYmapsContext } from "../../YandexMap"
const ZOOM = 9

export default function Search() {
  const ymapsContextValue = useYmapsContext()
  const [searchValue, setSearchValue] = useState("")
  const [suggestions, setSuggestions] = useState<SuggestResponseItem[]>([])
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const getStatus: () => React.ReactNode | null = () => {
    if (isPending) {
      return (
        <Fragment>
          <span
            className="inline-block size-3 animate-spin rounded-full border border-current border-r-transparent rtl:border-r-current rtl:border-l-transparent"
            aria-hidden
          />
          Поиск…
        </Fragment>
      )
    }
    if (error) {
      return error
    }
    if (suggestions.length === 0) {
      return `По запросу "${searchValue}" ничего не найдено`
    }
    return null
  }
  const status = getStatus()

  return (
    <div className="bg-background flex w-2xs flex-col gap-1.5 rounded-lg p-1.25">
      <Autocomplete.Root
        items={suggestions}
        value={searchValue}
        onValueChange={(nextSearchValue) => {
          setSearchValue(nextSearchValue)

          if (nextSearchValue === "") {
            setSuggestions([])
            setError(null)
            return
          }

          startTransition(async () => {
            try {
              const result = await ymaps3.suggest({
                text: nextSearchValue,
                limit: 5,
              })
              setSuggestions(result)
              setError(null)
            } catch {
              setSuggestions([])
              setError("Ошибка при поиске")
            }
          })
        }}
        filter={null}
      >
        <Autocomplete.Input
          placeholder="Поиск"
          className="border-border text-text-main box-border rounded-lg border-3 p-1.25 outline-none"
        />

        <Autocomplete.Portal hidden={!status && searchValue === ""}>
          <Autocomplete.Positioner className="outline-hidden" sideOffset={10} align="center">
            <Autocomplete.Popup className="bg-background w-2xs rounded-lg p-1.25" aria-busy={isPending || undefined}>
              <div className="max-h-[min(var(--available-height),22.5rem)] scroll-pt-1 scroll-pb-1 overflow-y-auto overscroll-contain">
                <Autocomplete.Status>
                  {status && (
                    <div className="text-text-sub flex items-center gap-2 py-1 pr-8 pl-2 text-sm">{status}</div>
                  )}
                </Autocomplete.Status>
                <Autocomplete.List>
                  {(suggest: SuggestResponseItem, index) => (
                    <Autocomplete.Item
                      key={index}
                      className="hover:bg-hover flex cursor-pointer flex-col rounded-md p-1"
                      value={suggest}
                      onClick={async () => {
                        if (suggest.uri && ymapsContextValue) {
                          const locationRes = await getLocationByUri(suggest.uri)
                          const location = locationRes.data
                          if (!location) {
                            console.log(locationRes.errorMessage)
                            return
                          }
                          ymapsContextValue.mapRef.current?.update({
                            location: { center: location, zoom: ZOOM, duration: 600, easing: "ease-in-out" },
                          })
                        }
                      }}
                    >
                      <span className="text-text-main overflow-hidden text-nowrap text-ellipsis">
                        {suggest.title.text}
                      </span>
                      <span className="text-text-sub overflow-hidden text-sm text-nowrap text-ellipsis">
                        {suggest.subtitle?.text}
                      </span>
                    </Autocomplete.Item>
                  )}
                </Autocomplete.List>
              </div>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    </div>
  )
}
