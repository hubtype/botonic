import { Locale } from '@botonic/nlp/dist/types'

import { ASSETS_DIR, MODELS_DIR, NER_DIR } from '../constants'

export enum ENVIRONMENT {
  PRODUCTION,
  LOCAL,
}

export function getEnvironment(): ENVIRONMENT {
  if (process.env.STATIC_URL !== undefined) {
    return ENVIRONMENT.PRODUCTION
  } else {
    return ENVIRONMENT.LOCAL
  }
}

export function getDomain(): string {
  if (getEnvironment() == ENVIRONMENT.PRODUCTION) {
    return process.env.STATIC_URL
  } else {
    return window.location.href
  }
}

export function getUri(locale: Locale): string {
  const domain = getDomain()
  if (getEnvironment() === ENVIRONMENT.PRODUCTION) {
    return `${domain}/${ASSETS_DIR}/${MODELS_DIR}/${NER_DIR}/${locale}`
  } else {
    return `${domain}/${NER_DIR}/${MODELS_DIR}/${locale}`
  }
}
