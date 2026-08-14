type GeocoderPos = string

type GeocoderPoint = {
  pos: GeocoderPos
}

type GeocoderAddressComponent = {
  kind: string
  name: string
}

type GeocoderAddress = {
  country_code: string
  postal_code?: string
  formatted: string
  Components: GeocoderAddressComponent[]
}

type GeocoderPostalCode = {
  PostalCodeNumber: string
}

type GeocoderPremise = {
  PremiseNumber: string
  PostalCode?: GeocoderPostalCode
}

type GeocoderThoroughfare = {
  ThoroughfareName: string
  Premise?: GeocoderPremise
}

type GeocoderLocality = {
  LocalityName: string
  Thoroughfare?: GeocoderThoroughfare
}

type GeocoderAdministrativeArea = {
  AdministrativeAreaName: string
  Locality?: GeocoderLocality
  SubAdministrativeArea?: {
    Locality?: GeocoderLocality
  }
}

type GeocoderCountry = {
  AddressLine: string
  CountryNameCode: string
  CountryName: string
  AdministrativeArea?: GeocoderAdministrativeArea
}

type GeocoderAddressDetails = {
  Country: GeocoderCountry
}

type GeocoderMetaData = {
  kind:
    | "house"
    | "street"
    | "metro"
    | "district"
    | "locality"
    | "area"
    | "province"
    | "country"
    | "hydro"
    | "vegetation"
    | "airport"
    | "other"
    | string
  text: string
  precision: "exact" | "number" | "near" | "range" | "street" | "other" | string
  Address: GeocoderAddress
  /** @deprecated — вместо него используется Address */
  AddressDetails?: GeocoderAddressDetails
}

type GeocoderGeoObjectMetaDataProperty = {
  GeocoderMetaData: GeocoderMetaData
}

type GeocoderBoundedBy = {
  Envelope: {
    lowerCorner: GeocoderPos
    upperCorner: GeocoderPos
  }
}

type GeocoderGeoObject = {
  metaDataProperty: GeocoderGeoObjectMetaDataProperty
  description: string
  name: string
  boundedBy: GeocoderBoundedBy
  uri?: string
  Point: GeocoderPoint
}

type GeocoderFeatureMember = {
  GeoObject: GeocoderGeoObject
}

type GeocoderResponseMetaData = {
  request: string
  found: string
  results: string
  skip?: string
  suggest?: string
  fix?: string
  Point?: GeocoderPoint
}

type GeocoderCollectionMetaDataProperty = {
  GeocoderResponseMetaData: GeocoderResponseMetaData
}

type GeocoderGeoObjectCollection = {
  metaDataProperty: GeocoderCollectionMetaDataProperty
  featureMember: GeocoderFeatureMember[]
}

export type GeocoderV1SuccessResponse = {
  response: {
    GeoObjectCollection: GeocoderGeoObjectCollection
  }
}

export type GeocoderV1ErrorResponse = {
  statusCode: 400 | 403 | 429 | number
  error: string
  message: string
}

export type GeocoderV1Response = GeocoderV1SuccessResponse | GeocoderV1ErrorResponse

export function isGeocoderV1Error(json: GeocoderV1Response): json is GeocoderV1ErrorResponse {
  return "statusCode" in json
}
