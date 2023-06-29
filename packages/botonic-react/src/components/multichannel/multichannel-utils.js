import { Providers } from '@botonic/core'

/**
 *
 * Whatsapp does not support Markdown
 * (its markup syntax is different)
 */
export const MULTICHANNEL_WHATSAPP_PROPS = { markdown: false }

export const WHATSAPP_MAX_BUTTONS = 3
export const WHATSAPP_MAX_BUTTON_CHARS = 20
export const DEFAULT_WHATSAPP_MAX_BUTTON_SEPARATOR = 'More options:'

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

const MARKDOWN_BOLD_OPTION_1 = '**'
const MARKDOWN_BOLD_OPTION_2 = '__'
const MARKDOWN_WHATSAPP_BOLD = '*'

const MARKDOWN_ITALIC = '*'
const MARKDOWN_WHATSAPP_ITALIC = '_'

const MARKDOWN_BOLD_ITALIC_OPEN = '__*'
const MARKDOWN_BOLD_ITALIC_CLOSE = '*__'
const MARKDOWN_NORMALIZED_BOLD_ITALIC_OPEN = '**_'
const MARKDOWN_NORMALIZED_BOLD_ITALIC_CLOSE = '_**'

export function whatsappMarkdown(text) {
  const markdownRegex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3/g
  const textNormalized = normalizeMarkdownWhatsApp(text)
  const matches = textNormalized.match(markdownRegex)
  if (matches) {
    const matchesResult = matches.map(match => {
      if (match.startsWith(MARKDOWN_BOLD_OPTION_1)) {
        return match.replaceAll(MARKDOWN_BOLD_OPTION_1, MARKDOWN_WHATSAPP_BOLD)
      }
      if (match.startsWith(MARKDOWN_BOLD_OPTION_2)) {
        return match.replaceAll(MARKDOWN_BOLD_OPTION_2, MARKDOWN_WHATSAPP_BOLD)
      }
      if (match.startsWith(MARKDOWN_ITALIC)) {
        return match.replaceAll(MARKDOWN_ITALIC, MARKDOWN_WHATSAPP_ITALIC)
      }
      return match
    })
    let textWhatsapp = textNormalized
    for (let i = 0; i < matches.length; i++) {
      textWhatsapp = textWhatsapp.replaceAll(matches[i], matchesResult[i])
    }
    return textWhatsapp
  }
  return text
}

function normalizeMarkdownWhatsApp(text) {
  return text
    .replaceAll(MARKDOWN_BOLD_ITALIC_OPEN, MARKDOWN_NORMALIZED_BOLD_ITALIC_OPEN)
    .replaceAll(
      MARKDOWN_BOLD_ITALIC_CLOSE,
      MARKDOWN_NORMALIZED_BOLD_ITALIC_CLOSE
    )
}
