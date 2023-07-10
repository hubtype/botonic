const MARKDOWN_BOLD_OPTION_1 = '**'
const MARKDOWN_BOLD_OPTION_2 = '__'
const MARKDOWN_WHATSAPP_BOLD = '*'

const MARKDOWN_ITALIC_OPTION_1 = '*'
const MARKDOWN_WHATSAPP_ITALIC = '_'

const MARKDOWN_NORMALIZED_BOLD_ITALIC_OPEN = '**_'
const MARKDOWN_NORMALIZED_BOLD_ITALIC_CLOSE = '_**'

const MARKDOWN_REGEX = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3/g

export function whatsappMarkdown(text: string) {
  const textNormalized = normalizeMarkdown(text)
  const matches = textNormalized.match(MARKDOWN_REGEX)
  if (matches) {
    const matchesResult = matches.map(match => {
      if (match.startsWith(MARKDOWN_BOLD_OPTION_1)) {
        return match.replaceAll(MARKDOWN_BOLD_OPTION_1, MARKDOWN_WHATSAPP_BOLD)
      }
      if (match.startsWith(MARKDOWN_BOLD_OPTION_2)) {
        return match.replaceAll(MARKDOWN_BOLD_OPTION_2, MARKDOWN_WHATSAPP_BOLD)
      }
      if (match.startsWith(MARKDOWN_ITALIC_OPTION_1)) {
        return match.replaceAll(
          MARKDOWN_ITALIC_OPTION_1,
          MARKDOWN_WHATSAPP_ITALIC
        )
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

function normalizeMarkdown(text: string) {
  text = replaceBoldItalic(text, /(_\*\*)(.*?)(\*\*_)/g)
  console.log('normalized _**text**_', { text })
  text = replaceBoldItalic(text, /(\*__)(.*?)(__\*)/g)
  console.log('normalized *__text__*', { text })
  text = replaceBoldItalic(text, /(__\*)(.*?)(\*__)/g)
  console.log('normalized __*text*__', { text })
  return text
}

function replaceBoldItalic(text: string, regex: RegExp) {
  return text.replace(
    regex,
    (
      match: string,
      markdownOpen: string,
      textInsideMarkdown: string,
      markdownClose: string
    ) => {
      if (match.startsWith(markdownOpen) && match.endsWith(markdownClose)) {
        return `${MARKDOWN_NORMALIZED_BOLD_ITALIC_OPEN}${textInsideMarkdown}${MARKDOWN_NORMALIZED_BOLD_ITALIC_CLOSE}`
      }
      return match
    }
  )
}
