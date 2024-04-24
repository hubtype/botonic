import { Providers } from '@botonic/core'

/**
 *
 * Whatsapp does not support Markdown
 * (its markup syntax is different)
 */
export const MULTICHANNEL_WHATSAPP_PROPS = { markdown: false }

export const WHATSAPP_MAX_BUTTONS = 3
export const WHATSAPP_LIST_MAX_BUTTONS = 10
export const WHATSAPP_MAX_BUTTON_CHARS = 20
export const WHATSAPP_MAX_HEADER_CHARS = 60
export const WHATSAPP_MAX_BODY_CHARS = 1024
export const WHATSAPP_MAX_FOOTER_CHARS = 60
export const DEFAULT_WHATSAPP_MAX_BUTTON_SEPARATOR = 'More options:'
export const MENU_BUTTON_WHATSAPP_BUTTON_LIST = 'Show options'

export function isMultichannelButton(node) {
  return isNodeKind(node, 'MultichannelButton')
}

export function isMultichannelReply(node) {
  return isNodeKind(node, 'MultichannelReply')
}

export function isButton(node) {
  return isNodeKind(node, 'Button')
}

export function isNodeKind(node, kind) {
  return node.type && node.type.name == kind
}
export function elementHasUrl(element) {
  return element.props && element.props.url
}
export function elementHasPostback(element) {
  return (
    (element.props && element.props.payload) ||
    (element.props && element.props.path)
  )
}
export function elementHasWebview(element) {
  return element.props && element.props.webview
}

export const buttonTypes = {
  POSTBACK: 'postback',
  URL: 'url',
  WEBVIEW: 'webview',
}

export function getButtonType(multichannelButton) {
  if (elementHasUrl(multichannelButton)) return buttonTypes.URL
  if (elementHasPostback(multichannelButton)) return buttonTypes.POSTBACK
  if (elementHasWebview(multichannelButton)) return buttonTypes.WEBVIEW

  return undefined
}

export function getFilteredElements(node, filter) {
  const elements = []
  for (const n of node) {
    if (filter(n)) elements.push(n)
  }
  return elements
}

export function getMultichannelButtons(node) {
  return getFilteredElements(node, isMultichannelButton)
}

export function getMultichannelReplies(node) {
  return getFilteredElements(node, isMultichannelReply)
}

export const isWhatsapp = context =>
  context.session &&
  context.session.user &&
  context.session.user.provider == Providers.Messaging.WHATSAPP

export const isFacebook = context =>
  context.session &&
  context.session.user &&
  context.session.user.provider == Providers.Messaging.FACEBOOK
