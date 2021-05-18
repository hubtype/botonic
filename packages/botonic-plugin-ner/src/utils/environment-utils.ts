import { Locale } from '@botonic/nlp/lib/types'

import { ASSETS_DIR, MODELS_DIR, NER_DIR } from '../constants'

export enum ENVIRONMENT {
  DEPLOYED,
  LOCAL,
}

export function getEnvironment(): ENVIRONMENT {
  if (typeof process !== 'undefined' && process.env.STATIC_URL !== undefined) {
    return ENVIRONMENT.DEPLOYED
  } else {
    return ENVIRONMENT.LOCAL
  }
}

export function getDomain(): string {
  if (getEnvironment() == ENVIRONMENT.DEPLOYED) {
    return typeof process !== 'undefined' && process.env.STATIC_URL
  } else {
    return window.location.href
  }
}

export function getUri(locale: Locale): string {
  const domain = getDomain()
  if (getEnvironment() === ENVIRONMENT.DEPLOYED) {
    return `${domain}/${ASSETS_DIR}/${MODELS_DIR}/${NER_DIR}/${locale}`
  } else {
    return `${domain}/${NER_DIR}/${MODELS_DIR}/${locale}`
  }
}
