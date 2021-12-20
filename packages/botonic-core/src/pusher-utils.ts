import { inflate } from 'pako/dist/pako_inflate.js'

/**
 *
 * @param compressedData a string representing gzipped data previously encoded to base64 for very large contents
 * @returns a string representing the information of a very large content
 * Ref: https://stackoverflow.com/questions/4875020/javascript-decompress-inflate-unzip-ungzip-strings
 */
export function decompressData(compressedData) {
  const strData = atob(compressedData)
  const charData = strData.split('').map(x => x.charCodeAt(0))
  const binData = new Uint8Array(charData)
  const data = inflate(binData)
  // @ts-ignore
  return String.fromCharCode.apply(null, new Uint8Array(data))
}
