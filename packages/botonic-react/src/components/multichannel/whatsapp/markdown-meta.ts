const REGEX_MARKDOWN_BOLD = /(\*\*|__)(.*?)\1/g
const REGEX_MARKDOWN_ITALIC = /(\*|_)(.*?)\1/g
const REGEX_MARKDOWN_LINK = /\[([^\]]+)\]\(([^)]+)\)/g

const NORMALIZED_BOLD = '&%BOLD%&'
const REGEX_NORMALIZED_BOLD = new RegExp(
  `${NORMALIZED_BOLD}(.*?)${NORMALIZED_BOLD}`,
  'g'
)
const NORMALIZED_ITALIC = '&%ITALIC%&'
const REGEX_NORMALIZED_ITALIC = new RegExp(
  `${NORMALIZED_ITALIC}(.*?)${NORMALIZED_ITALIC}`,
  'g'
)

const WHATSAPP_BOLD = '*'
const WHATSAPP_ITALIC = '_'

// Convert markdown to WhatsApp and Facebook format
export function convertToMarkdownMeta(text: string): string {
  const textWithBoldAndItalic = replaceBoldAndItalic(text)

  return replaceMarkdownLinks(textWithBoldAndItalic)
}

function replaceBoldAndItalic(text: string) {
  const normalizedText = normalizeBoldAndItalic(text)
  const boldAndItalicText = normalizedToMarkdownMeta(normalizedText)

  return boldAndItalicText
}

function normalizeBoldAndItalic(text: string): string {
  // Normalize bold
  text = text.replace(
    REGEX_MARKDOWN_BOLD,
    `${NORMALIZED_BOLD}$2${NORMALIZED_BOLD}`
  )
  // Normalize italic
  text = text.replace(
    REGEX_MARKDOWN_ITALIC,
    `${NORMALIZED_ITALIC}$2${NORMALIZED_ITALIC}`
  )

  return text
}

function normalizedToMarkdownMeta(text: string): string {
  // convert &%BOLD%&text&%BOLD%& to *text*
  text = text.replace(
    REGEX_NORMALIZED_BOLD,
    `${WHATSAPP_BOLD}$1${WHATSAPP_BOLD}`
  )
  // convert &%ITALIC%&text&%ITALIC%& to _text_
  text = text.replace(
    REGEX_NORMALIZED_ITALIC,
    `${WHATSAPP_ITALIC}$1${WHATSAPP_ITALIC}`
  )

  return text
}

function replaceMarkdownLinks(text: string) {
  // $1 = textUrl, $2 = linkUrl
  return text.replace(REGEX_MARKDOWN_LINK, '$1: $2')
}
