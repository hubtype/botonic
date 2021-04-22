import { Locale } from '@botonic/nlp/lib/types'

import { ASSETS_DIR, MODELS_DIR, TEXT_CLASSIFICATION_DIR } from '../constants'

export enum Environment {
  DEPLOYED,
  LOCAL,
}

export function getEnvironment(): Environment {
  if (process.env.STATIC_URL !== undefined) {
    return Environment.DEPLOYED
  } else {
    return Environment.LOCAL
  }
}

export function getDomain(): string {
  if (getEnvironment() == Environment.DEPLOYED) {
    return process.env.STATIC_URL
  } else {
    return window.location.href
  }
}

export function getUri(locale: Locale): string {
  const domain = getDomain()
  if (getEnvironment() === Environment.DEPLOYED) {
    return `${domain}/${ASSETS_DIR}/${MODELS_DIR}/${TEXT_CLASSIFICATION_DIR}/${locale}`
  } else {
    return `${domain}/${TEXT_CLASSIFICATION_DIR}/${MODELS_DIR}/${locale}`
  }
}
