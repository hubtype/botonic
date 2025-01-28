import { ENVIRONMENT } from '../server/utils/env-utils'

const FACEBOOK_NUMBER: Record<string, string> = {
  local: 'TODO:FACEBOOK_NUMBER_LOCAL',
  staging: 'TODO:FACEBOOK_NUMBER_STAGING',
  production: 'TODO:FACEBOOK_NUMBER_PRODUCTION',
}

const WHATSAPP_NUMBER: Record<string, string> = {
  local: 'TODO:WHATSAPP_NUMBER_LOCAL',
  staging: 'TODO:WHATSAPP_NUMBER_STAGING',
  production: 'TODO:WHATSAPP_NUMBER_PRODUCTION',
}
export interface ClientConfig {
  triggerButtonUrls: { facebook: string; whatsapp: string }
}

export const clientConfig: Record<ENVIRONMENT, ClientConfig> = {
  [ENVIRONMENT.LOCAL]: {
    triggerButtonUrls: {
      facebook: `https://m.me/${FACEBOOK_NUMBER[ENVIRONMENT.LOCAL]}`,
      whatsapp: `https://wa.me/${WHATSAPP_NUMBER[ENVIRONMENT.LOCAL]}`,
    },
  },
  [ENVIRONMENT.STAGING]: {
    triggerButtonUrls: {
      facebook: `https://m.me/${FACEBOOK_NUMBER[ENVIRONMENT.STAGING]}`,
      whatsapp: `https://wa.me/${WHATSAPP_NUMBER[ENVIRONMENT.STAGING]}`,
    },
  },
  [ENVIRONMENT.PRODUCTION]: {
    triggerButtonUrls: {
      facebook: `https://m.me/${FACEBOOK_NUMBER[ENVIRONMENT.PRODUCTION]}`,
      whatsapp: `https://wa.me/${WHATSAPP_NUMBER[ENVIRONMENT.PRODUCTION]}`,
    },
  },
}
