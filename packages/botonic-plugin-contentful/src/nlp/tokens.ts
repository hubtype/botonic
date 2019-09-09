export const BLANK = ' ';

export function substringIsBlankSeparated(
  haystack: string,
  needle: string
): boolean {
  //not using regex because recompiling them for each keyword might be expensive
  const foundAt = haystack.indexOf(needle);
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

export function countOccurrences(haystack: string, needle: string): number {
  let n = 0;
  let pos = 0;

  while (true) {
    pos = haystack.indexOf(needle, pos);
    if (pos >= 0) {
      ++n;
      pos += needle.length;
    } else break;
  }
  return n;
}
