export interface Country {
  code: string
  name: string
  states: State[]
}

export interface State {
  code: string
  name: string
  lgas: string[]
}

export const COUNTRIES: Country[] = [
  {
    code: "NG",
    name: "Nigeria",
    states: [
      {
        code: "OND",
        name: "Ondo",
        lgas: [
          "AKOKO NORTH EAST",
          "AKOKO NORTH WEST",
          "AKOKO SOUTH EAST",
          "AKOKO SOUTH WEST",
          "AKURE NORTH",
          "AKURE SOUTH",
          "ESE-ODO",
          "IDANRE",
          "IFEDORE",
          "ILAJE",
          "ILE-OLUJI OKEIGBO",
          "IRELE",
          "ODIGBO",
          "OKITIPUPA",
          "ONDO EAST",
          "ONDO WEST",
          "OSE",
          "OWO",
        ],
      },
      {
        code: "CRS",
        name: "Cross River",
        lgas: [
          "AKAMKPA",
          "ABI",
          "AKPABUYO",
          "BAKASSI",
          "BEKWARRA",
          "BIASE",
          "BOKI",
          "CALABAR MUNICIPAL",
          "CALABAR SOUTH",
          "ETUNG",
          "IKOM",
          "OBUDU",
          "OBANLIKU",
          "OBUBRA",
          "ODUKPANI",
          "OGOJA",
          "YALA",
          "YAKURR",
        ],
      },
      {
        code: "LAG",
        name: "Lagos",
        lgas: [
          "AGEGE",
          "AJEROMI-IFELODUN",
          "ALIMOSHO",
          "AMUWO-ODOFIN",
          "APAPA",
          "BADAGRY",
          "EPE",
          "ETI-OSA",
          "IBEJU-LEKKI",
          "IFAKO-IJAIYE",
          "IKEJA",
          "IKORODU",
          "KOSOFE",
          "LAGOS ISLAND",
          "LAGOS MAINLAND",
          "MUSHIN",
          "OJO",
          "OSHODI-ISOLO",
          "SHOMOLU",
          "SURULERE",
        ],
      },
    ],
  },
  {
    code: "GH",
    name: "Ghana",
    states: [
      {
        code: "AA",
        name: "Greater Accra",
        lgas: ["Accra Metropolitan", "Tema Metropolitan", "Ga East", "Ga West", "Ga South"],
      },
    ],
  },
]

export function getCountries(): Country[] {
  return COUNTRIES
}

export function getStatesByCountry(countryCode: string): State[] {
  const country = COUNTRIES.find((c) => c.code === countryCode)
  return country?.states || []
}

export function getLGAsByState(countryCode: string, stateCode: string): string[] {
  const country = COUNTRIES.find((c) => c.code === countryCode)
  const state = country?.states.find((s) => s.code === stateCode)
  return state?.lgas || []
}
