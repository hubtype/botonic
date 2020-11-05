export const serializeRegex = (_, value) => {
  // To be used as a 2nd argument (replacer) of JSON.stringify
  // Ref. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
  if (value instanceof RegExp) return value.toString()
  return value
}

export const deserializeRegex = regexStr => {
  /* eslint-disable no-useless-escape */
  const fragments = regexStr.match(/\/(.[^\/]+)\/([a-z]{1})?$/i) // https://stackoverflow.com/a/33642463, https://github.com/hubtype/botonic/pull/805#discussion_r437309074
  const deserialized = new RegExp(fragments[1], fragments[2] || '')
  return deserialized
}

export const stringifyWithRegexs = object => {
  // Serialization of regexs: https://stackoverflow.com/questions/12075927/serialization-of-regexp
  return JSON.stringify(object, serializeRegex)
}
