import { Button } from '../button'
import { Carousel } from '../carousel'
import { Pic } from '../pic'
import { Reply } from '../reply'
import { Subtitle } from '../subtitle'
import { Text } from '../text'
import { Title } from '../title'
import { MultichannelButton } from './multichannel-button'
import { MultichannelReply } from './multichannel-reply'

function isNodeKind(node, kind) {
  return node?.type?.name === kind
}

export function isMultichannelButton(node) {
  return isNodeKind(node, MultichannelButton.name)
}

export function isMultichannelReply(node) {
  return isNodeKind(node, MultichannelReply.name)
}

export function isNodeText(node) {
  return isNodeKind(node, Text.name)
}

export function isNodeButton(node) {
  return isNodeKind(node, Button.name)
}

export function isNodeCarousel(node) {
  return isNodeKind(node, Carousel.name)
}

export function isNodeReply(node) {
  return isNodeKind(node, Reply.name)
}

export function isNodePic(node) {
  return isNodeKind(node, Pic.name)
}

export function isNodeTitle(node) {
  return isNodeKind(node, Title.name)
}

export function isNodeSubtitle(node) {
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
