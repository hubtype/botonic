import { Locale } from '@botonic/nlp/lib/types'

import { ASSETS_DIR, INTENT_CLASSIFICATION_DIR, MODELS_DIR } from '../constants'

enum Environment {
  DEPLOYED,
  LOCAL,
}

export function getModelUri(locale: Locale): string {
  const domain = getEnvironmentDomain()
  if (getEnvironment() === Environment.DEPLOYED) {
    return `${domain}/${ASSETS_DIR}/${MODELS_DIR}/${INTENT_CLASSIFICATION_DIR}/${locale}`
  } else {
    return `${domain}/${INTENT_CLASSIFICATION_DIR}/${MODELS_DIR}/${locale}`
  }
}

function getEnvironmentDomain(): string {
  if (getEnvironment() == Environment.DEPLOYED) {
    return typeof process !== 'undefined' && process.env.STATIC_URL
  } else {
    return window.location.href
  }
}

function getEnvironment(): Environment {
  if (typeof process !== 'undefined' && process.env.STATIC_URL !== undefined) {
    return Environment.DEPLOYED
  } else {
    return Environment.LOCAL
  }
}
