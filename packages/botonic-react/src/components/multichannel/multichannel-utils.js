import { Button } from '../button'
import { Pic } from '../pic'
import { Subtitle } from '../subtitle'
import { Title } from '../title'
import { MultichannelButton } from './multichannel-button'
import { MultichannelReply } from './multichannel-reply'

function isNodeKind(node, kind) {
  return node.type && node.type.name === kind
}

export function isMultichannelButton(node) {
  return isNodeKind(node, MultichannelButton.name)
}

export function isMultichannelReply(node) {
  return isNodeKind(node, MultichannelReply.name)
}

export function isButton(node) {
  return isNodeKind(node, Button.name)
}

export function isPic(node) {
  return isNodeKind(node, Pic.name)
}

export function isTitle(node) {
  return isNodeKind(node, Title.name)
}

export function isSubtitle(node) {
  return isNodeKind(node, Subtitle.name)
}

export function elementHasUrl(element) {
  return element?.props?.url
}

export function elementHasPostback(element) {
  return element?.props?.payload || element?.props?.path
}

export function elementHasWebview(element) {
  return element?.props?.webview
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
