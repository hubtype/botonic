export const isBrowser = () => typeof window !== 'undefined'

export const isNode = () => !isBrowser() && typeof process !== 'undefined'

export const params2queryString = params =>
  Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
