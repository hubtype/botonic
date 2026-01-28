import { COMPONENT_DISPLAY_NAMES } from '../constants'

interface ReactElementWithDisplayName {
  type?: {
    displayName?: string
  }
}

interface ElementWithProps {
  props?: {
    url?: string
    payload?: string
    path?: string
    webview?: unknown
  }
}

export function isMultichannelButton(
  node?: ReactElementWithDisplayName
): boolean {
  return node?.type?.displayName === COMPONENT_DISPLAY_NAMES.MultichannelButton
}

export function isMultichannelReply(
  node?: ReactElementWithDisplayName
): boolean {
  return node?.type?.displayName === COMPONENT_DISPLAY_NAMES.MultichannelReply
}

export function isNodeText(node?: ReactElementWithDisplayName): boolean {
  return node?.type?.displayName === COMPONENT_DISPLAY_NAMES.Text
}

export function isNodeButton(node?: ReactElementWithDisplayName): boolean {
  return node?.type?.displayName === COMPONENT_DISPLAY_NAMES.Button
}

export function isNodeCarousel(node?: ReactElementWithDisplayName): boolean {
  return node?.type?.displayName === COMPONENT_DISPLAY_NAMES.Carousel
}

export function isNodeReply(node?: ReactElementWithDisplayName): boolean {
  return node?.type?.displayName === COMPONENT_DISPLAY_NAMES.Reply
}

export function isNodePic(node?: ReactElementWithDisplayName): boolean {
  return node?.type?.displayName === COMPONENT_DISPLAY_NAMES.Pic
}

export function isNodeTitle(node?: ReactElementWithDisplayName): boolean {
  return node?.type?.displayName === COMPONENT_DISPLAY_NAMES.Title
}

export function isNodeSubtitle(node?: ReactElementWithDisplayName): boolean {
  return node?.type?.displayName === COMPONENT_DISPLAY_NAMES.Subtitle
}

export function elementHasUrl(element?: ElementWithProps): string | undefined {
  return element?.props?.url
}

export function elementHasPostback(
  element?: ElementWithProps
): string | undefined {
  return element?.props?.payload || element?.props?.path
}

export function elementHasWebview(element?: ElementWithProps): unknown {
  return element?.props?.webview
}

export const buttonTypes = {
  POSTBACK: 'postback',
  URL: 'url',
  WEBVIEW: 'webview',
} as const

export type ButtonType = (typeof buttonTypes)[keyof typeof buttonTypes]

export function getButtonType(
  multichannelButton?: ElementWithProps
): ButtonType | undefined {
  if (elementHasUrl(multichannelButton)) return buttonTypes.URL
  if (elementHasPostback(multichannelButton)) return buttonTypes.POSTBACK
  if (elementHasWebview(multichannelButton)) return buttonTypes.WEBVIEW

  return undefined
}

export function getFilteredElements<T extends ReactElementWithDisplayName>(
  node: Iterable<T>,
  filter: (n: T) => boolean
): T[] {
  const elements: T[] = []
  for (const n of node) {
    if (filter(n)) elements.push(n)
  }
  return elements
}

export function getMultichannelButtons(
  node: Iterable<ReactElementWithDisplayName>
): ReactElementWithDisplayName[] {
  return getFilteredElements(node, isMultichannelButton)
}

export function getMultichannelReplies(
  node: Iterable<ReactElementWithDisplayName>
): ReactElementWithDisplayName[] {
  return getFilteredElements(node, isMultichannelReply)
}
