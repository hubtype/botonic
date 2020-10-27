import escapeStringRegexp from 'escape-string-regexp'

export function ltrim(str: string, chars: string): string {
  while (str.length && chars.includes(str[0])) {
    str = str.slice(1)
  }
  return str
}

export function rtrim(str: string, chars: string): string {
  while (str.length && chars.includes(str[str.length - 1])) {
    str = str.slice(0, str.length - 1)
  }
  return str
}

export function trim(str: string, chars: string): string {
  str = rtrim(str, chars)
  return ltrim(str, chars)
}

/**
 * String.replaceAll only available in esnext
 */
export function replaceAll(haystack: string, oldStr: string, newStr: string) {
  oldStr = escapeStringRegexp(oldStr)
  return haystack.replace(new RegExp(oldStr, 'g'), newStr)
}
