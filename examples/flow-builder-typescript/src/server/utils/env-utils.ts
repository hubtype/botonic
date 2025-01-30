import { PROVIDER, Session } from '@botonic/core'

export enum ENVIRONMENT {
  PRODUCTION = 'production',
  LOCAL = 'local',
}
export enum NODE_ENV {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
}

const isExpectedEnvironemnt = (
  env: ENVIRONMENT,
  expected: ENVIRONMENT
): boolean => env === expected

export function isNodeDev(): boolean {
  return process.env.NODE_ENV === NODE_ENV.DEVELOPMENT
}

export function isNodeProd(): boolean {
  return process.env.NODE_ENV === NODE_ENV.PRODUCTION
}

export function isNodeTest(): boolean {
  return process.env.NODE_ENV === NODE_ENV.TEST
}

export const getEnvironment = (): ENVIRONMENT => {
  return process.env.ENVIRONMENT as ENVIRONMENT
}

export const isLocal = (env?: ENVIRONMENT): boolean =>
  isExpectedEnvironemnt(env || getEnvironment(), ENVIRONMENT.LOCAL)

export const isStaging = (env?: ENVIRONMENT): boolean =>
  isExpectedEnvironemnt(env || getEnvironment(), ENVIRONMENT.STAGING)

export const isProduction = (env?: ENVIRONMENT): boolean =>
  isExpectedEnvironemnt(env || getEnvironment(), ENVIRONMENT.PRODUCTION)

export const isWhatsApp = (session: Session): boolean => {
  return session.user.provider === PROVIDER.WHATSAPP
}

export const isWebchat = (session: Session): boolean => {
  return session.user.provider === PROVIDER.WEBCHAT
}

export const isFacebook = (session: Session): boolean => {
  return session.user.provider === PROVIDER.FACEBOOK
}

export const isTelegram = (session: Session): boolean => {
  return session.user.provider === PROVIDER.TELEGRAM
}

export const isTwitter = (session: Session): boolean => {
  return session.user.provider === PROVIDER.TWITTER
}

export function isBrowser() {
  return typeof window !== 'undefined'
}
