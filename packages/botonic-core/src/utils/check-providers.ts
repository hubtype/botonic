import { PROVIDER, type Session } from '../models/legacy-types'

// To check Provider in session
export function isDev(session: Session) {
  return session.user.provider === PROVIDER.DEV
}

export function isWebchat(session: Session) {
  // When the provider is DEV should we return true because it is a webchat?
  return session.user.provider === PROVIDER.WEBCHAT
}

export function isWhatsapp(session: Session) {
  return session.user.provider === PROVIDER.WHATSAPP
}

export function isTelegram(session: Session) {
  return session.user.provider === PROVIDER.TELEGRAM
}

export function isFacebook(session: Session) {
  return session.user.provider === PROVIDER.FACEBOOK
}

export function isInstagram(session: Session) {
  return session.user.provider === PROVIDER.INSTAGRAM
}

export function isTwitter(session: Session) {
  return session.user.provider === PROVIDER.TWITTER
}
