export const BLANK = ' ';

export function substringIsBlankSeparated(
  haystack: string,
  needle: string
): boolean {
  //not using regex because recompiling them for each keyword might be expensive
  let foundAt = haystack.indexOf(needle);
  if (foundAt < 0) {
    return false;
  }
  if (foundAt > 0 && haystack[foundAt - 1] != BLANK) {
    return false;
  }
  if (
    foundAt < haystack.length - needle.length &&
    haystack[foundAt + needle.length] != BLANK
  ) {
    return false;
  }
  return true;
}

class Replacer {
  constructor(readonly from: RegExp, readonly to: string) {}
  static separatorsToBlanks(input: string): string {
    return input.replace(/[^a-zA-Zñ0-9]+/g, BLANK);
  }
  static forLocale(locale: string): Replacer[] {
    if (locale != 'es') {
      return [];
    }
    return [
      new Replacer(/á/g, 'a'),
      new Replacer(/é/g, 'e'),
      new Replacer(/í/g, 'i'),
      new Replacer(/ó/g, 'o'),
      new Replacer(/ú/g, 'u')
    ];
  }
}

export function normalize(inputText: string): string {
  inputText = inputText.toLocaleLowerCase();
  for (let rep of Replacer.forLocale('es')) {
    inputText = inputText.replace(rep.from, rep.to);
  }
  inputText = Replacer.separatorsToBlanks(inputText);
  return inputText.trim();
}
