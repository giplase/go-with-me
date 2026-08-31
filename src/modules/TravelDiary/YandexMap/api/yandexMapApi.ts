import { LngLat } from "ymaps3"
import { GeocoderV1Response, isGeocoderV1Error } from "../types/geocoderApi"

type ApiResult<T> = {
  data: T
  errorMessage?: string
  errorCode?: string
}

export async function getLocationTitleByLngLat([lng, lat]: LngLat): Promise<ApiResult<string | undefined>> {
  const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_GEOCODE_API_KEY
  const src = `https://geocode-maps.yandex.ru/v1?apikey=${apiKey}&lang=ru_RU&geocode=${lng},${lat}&format=json`
  try {
    const res = await fetch(src)
    const jsonRes = (await res.json()) as GeocoderV1Response
    if (isGeocoderV1Error(jsonRes)) {
      return {
        data: undefined,
        errorMessage: jsonRes.message,
        errorCode: String(jsonRes.statusCode),
      }
    }
    const geoObject = jsonRes.response.GeoObjectCollection.featureMember[0]?.GeoObject
    if (!geoObject) {
      return {
        data: undefined,
        errorMessage: "Address not found for these coordinates",
        errorCode: "NOT_FOUND",
      }
    }
    return { data: geoObject.description }
  } catch (error) {
    return {
      data: undefined,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      errorCode: "FETCH_FAILED",
    }
  }
}

export async function getLocationByUri(uri: string): Promise<ApiResult<LngLat | undefined>> {
  const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_GEOCODE_API_KEY
  const src = `https://geocode-maps.yandex.ru/v1?apikey=${apiKey}&lang=ru_RU&uri=${uri}&format=json`
  try {
    const res = await fetch(src)
    const jsonRes = (await res.json()) as GeocoderV1Response
    if (isGeocoderV1Error(jsonRes)) {
      return {
        data: undefined,
        errorMessage: jsonRes.message,
        errorCode: String(jsonRes.statusCode),
      }
    }
    const geoObject = jsonRes.response.GeoObjectCollection.featureMember[0]?.GeoObject
    if (!geoObject) {
      return {
        data: undefined,
        errorMessage: "Coordinates not found for this address",
        errorCode: "NOT_FOUND",
      }
    }
    return { data: geoObject.Point.pos.split(" ").map((num) => parseFloat(num)) as LngLat }
  } catch (error) {
    return {
      data: undefined,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      errorCode: "FETCH_FAILED",
    }
  }
}
