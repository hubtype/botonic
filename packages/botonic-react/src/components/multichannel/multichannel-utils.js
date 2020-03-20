import { Providers } from '@botonic/core'

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
