import { inflate } from 'pako'

/**
 *
 * @param compressedData a string representing gzipped data previously encoded to base64 for very large contents
 * @returns a string representing the information of a very large content
 * Ref: https://stackoverflow.com/questions/4875020/javascript-decompress-inflate-unzip-ungzip-strings (check jsfiddle proposal)
 */
export function decompressData(compressedData: string): string {
  const strData = atob(compressedData) // Decode base64 (convert ascii to binary)
  const charData = strData.split('').map(x => x.charCodeAt(0)) // Convert binary string to character-number array
  const binData = new Uint8Array(charData) // Turn number array into byte-array
  const data = inflate(binData)
  // @ts-ignore
  return String.fromCharCode.apply(null, new Uint8Array(data)) // Convert gunzipped byteArray back to ascii string
}
