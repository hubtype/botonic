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
