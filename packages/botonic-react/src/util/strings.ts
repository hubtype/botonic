export const truncateText = (text, maxLength, ellipsis = '...') => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - ellipsis.length) + ellipsis
  }
  return text
}
