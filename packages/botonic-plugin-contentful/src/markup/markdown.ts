export const WHATSAPP_MARKDOWN = {
  BOLD: '*',
}
export const CONTENTFUL_MARKDOWN = {
  BOLD: '__',
}
/**
 * Converts markdown from contentful flavour to whatsapp one
 */
export function contentfulToWhatsApp(txt: string): string {
  console.log(
    'contentfulToWhatsApp',
    txt,
    txt.replace(
      new RegExp(CONTENTFUL_MARKDOWN.BOLD, 'g'),
      WHATSAPP_MARKDOWN.BOLD
    )
  )
  return txt.replace(
    new RegExp(CONTENTFUL_MARKDOWN.BOLD, 'g'),
    WHATSAPP_MARKDOWN.BOLD
  )
}

export function findContentfulBold(txt: string): string[] {
  const mark = `\\${WHATSAPP_MARKDOWN.BOLD}`
  let matches = txt.match(new RegExp(`${mark}.*${mark}`))
  if (!matches) {
    const mark = CONTENTFUL_MARKDOWN.BOLD
    matches = txt.match(new RegExp(`${mark}.*${mark}`))
    if (!matches) {
      return []
    }
    console.error('NOOOOOOOOOOOOOO replacing ' + txt + '..')
  }
  const len = (txt: string) => {
    for (const sep of [WHATSAPP_MARKDOWN.BOLD, CONTENTFUL_MARKDOWN.BOLD]) {
      if (txt.startsWith(sep)) {
        return sep.length
      }
    }
    return 0
  }

  return matches.map(m => {
    const length = len(m)
    return m.substr(length, m.length - 2 * length)
  })
}
