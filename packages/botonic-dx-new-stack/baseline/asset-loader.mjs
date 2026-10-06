const assetPattern =
  /\.(png|svg|jpe?g|gif|webp|woff2?|ttf|eot|otf|mp4|webm|wav|mp3|m4a|aac|oga)$/i
const stylePattern = /\.(css|less|scss|sass)$/i

export async function load(url, context, nextLoad) {
  const pathname = new URL(url).pathname
  if (assetPattern.test(pathname)) {
    return {
      format: 'module',
      shortCircuit: true,
      source: 'export default "test-file-stub"',
    }
  }
  if (stylePattern.test(pathname)) {
    return {
      format: 'module',
      shortCircuit: true,
      source: 'export default {}',
    }
  }
  return nextLoad(url, context)
}
