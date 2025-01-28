function camelCaseToSnake(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/([A-Za-z])(\d)/g, '$1_$2')
    .replace(/(\d)([A-Za-z])/g, '$1_$2')
    .toLowerCase()
}
type Input = Record<string, any> | Record<string, any>[] | undefined

export function toSnakeCaseKeys(input: Input): Input {
  if (Array.isArray(input)) {
    return input.map(item => toSnakeCaseKeys(item))
  }

  if (typeof input === 'object' && input !== null) {
    const result = Object.keys(input).reduce((acc, key) => {
      const snakeKey = camelCaseToSnake(key)
      const value = input[key]
      acc[snakeKey] =
        typeof value === 'object' && value !== null
          ? toSnakeCaseKeys(value)
          : value

      return acc
    }, {})

    return result
  }

  return input
}
