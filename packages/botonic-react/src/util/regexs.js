export const deserializeRegex = regexStr => {
  /* eslint-disable no-useless-escape */
  const fragments = regexStr.match(/\/(.[^\/]+)\/([a-z]{1})?$/i) // https://stackoverflow.com/a/33642463, https://github.com/hubtype/botonic/pull/805#discussion_r437309074
  const deserialized = new RegExp(fragments[1], fragments[2] || '')
  return deserialized
}
/** Serialization of objects containing regexs:
 * Ref.: https://stackoverflow.com/questions/12075927/serialization-of-regexp
 * Ref.: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 */
export const stringifyWithRegexs = object => {
  return JSON.stringify(object, (_, value) => {
    if (value instanceof RegExp) return value.toString()
    return value
  })
}
