export const truncateText = (
  text: string,
  maxLength: number,
  ellipsis = '...'
) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - ellipsis.length) + ellipsis
  }
  return text
}
