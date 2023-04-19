export type GA4Options = {
  apiSecret: string
  measurementId: string
  getUserId: () => string
  getClientId?: () => string
}

export type GA4Event = {
  name: string
  params?: GA4Params
}

export type GA4Params = Record<string, string | number>
