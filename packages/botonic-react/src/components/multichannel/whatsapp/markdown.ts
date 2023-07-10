const MARKDOWN_BOLD_OPTION_1 = '**'
const MARKDOWN_BOLD_OPTION_2 = '__'
const MARKDOWN_WHATSAPP_BOLD = '*'

const MARKDOWN_ITALIC_OPTION_1 = '*'
const MARKDOWN_WHATSAPP_ITALIC = '_'

const MARKDOWN_BOLD_OR_ITALIC_REGEX = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3/g

const MARKDOWN_NORMALIZED_BOLD_ITALIC_OPEN = '**_'
const MARKDOWN_NORMALIZED_BOLD_ITALIC_CLOSE = '_**'

const MARKDOWN_BOLD_AND_ITALIC_OPTION1 = /(_\*\*)(.*?)(\*\*_)/g
const MARKDOWN_BOLD_AND_ITALIC_OPTION2 = /(\*__)(.*?)(__\*)/g
const MARKDOWN_BOLD_AND_ITALIC_OPTION3 = /(__\*)(.*?)(\*__)/g

export function whatsappMarkdown(text: string) {
  const textNormalized = normalizeMarkdown(text)
  const matches = textNormalized.match(MARKDOWN_BOLD_OR_ITALIC_REGEX)
  if (matches) {
    const matchesResult = matches.map(match => {
      if (match.startsWith(MARKDOWN_BOLD_OPTION_1)) {
        return replaceAllOccurrences(
          match,
          MARKDOWN_BOLD_OPTION_1,
          MARKDOWN_WHATSAPP_BOLD
        )
      }
      if (match.startsWith(MARKDOWN_BOLD_OPTION_2)) {
        return replaceAllOccurrences(
          match,
          MARKDOWN_BOLD_OPTION_2,
          MARKDOWN_WHATSAPP_BOLD
        )
      }
      if (match.startsWith(MARKDOWN_ITALIC_OPTION_1)) {
        return replaceAllOccurrences(
          match,
          MARKDOWN_ITALIC_OPTION_1,
          MARKDOWN_WHATSAPP_ITALIC
        )
      }
      return match
    })
    let textWhatsapp = textNormalized
    for (let i = 0; i < matches.length; i++) {
      textWhatsapp = replaceAllOccurrences(
        textWhatsapp,
        matches[i],
        matchesResult[i]
      )
    }
    return textWhatsapp
  }
  return text
}

function normalizeMarkdown(text: string) {
  text = replaceBoldItalic(text, MARKDOWN_BOLD_AND_ITALIC_OPTION1)
  text = replaceBoldItalic(text, MARKDOWN_BOLD_AND_ITALIC_OPTION2)
  text = replaceBoldItalic(text, MARKDOWN_BOLD_AND_ITALIC_OPTION3)
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

function replaceAllOccurrences(
  text: string,
  searchValue: string,
  replaceValue: string
) {
  return text.split(searchValue).join(replaceValue)
}
