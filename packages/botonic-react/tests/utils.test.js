/**
 * @jest-environment jsdom
 */
import { isURL, staticAsset } from '../src/util/environment'
import { toSnakeCaseKeys } from '../src/util/functional'
import { deserializeRegex, stringifyWithRegexs } from '../src/util/regexs'
describe('Regex serialization / deserialization', () => {
  const regexsItems = [
    { regex: /regex/i, string: '"/regex/i"', samples: ['Regex', 'regex'] },
    {
      regex: /another_regex/g,
      string: '"/another_regex/g"',
      samples: ['another_regex and another_regex'],
    },
  ]
  it('serializes json applying filter', () => {
    regexsItems.forEach(item => {
      const sut = stringifyWithRegexs(item.regex)
      expect(sut).toEqual(item.string)
    })
  })
  it('deserializes regexs correctly', () => {
    regexsItems.forEach(item => {
      const deserializedStringRegex = JSON.parse(item.string)
      const deserializedRegex = deserializeRegex(deserializedStringRegex)
      item.samples.forEach(sample => {
        const match = deserializedRegex.test(sample)
        expect(match).toBe(true)
      })
    })
  })
})

jest.mock('../src/util/environment', () => ({
  ...jest.requireActual('../src/util/environment'),
  isURL: jest.fn(),
  normalize: jest.fn(),
}))

const createScript = src => {
  const script = document.createElement('script')
  script.src = src
  document.head.appendChild(script)
  return script
}

const removeScript = script => {
  document.head.removeChild(script)
}

describe('staticAsset function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return the path if it is a URL', () => {
    //arrange
    isURL.mockReturnValue(true)
    const url = 'https://example.com/asset.png'

    //act
    const result = staticAsset(url)

    //assert
    expect(result).toBe(url)
  })

  test('should resolve the static asset path if it is not a URL and file name is webchat.botonic.js', () => {
    //arrange
    isURL.mockReturnValue(false)

    const assetPath = 'asset.svg'
    const basePath = 'http://localhost/'
    const scriptBaseURL = `${basePath}webchat.botonic.js`
    const script = createScript(scriptBaseURL)

    //act
    const result = staticAsset(assetPath)

    //assert
    expect(result).toBe(basePath + assetPath)

    removeScript(script)
  })

  test('should resolve static asset path if filename is different than webchat.botonic.js', () => {
    //arrange
    isURL.mockReturnValue(false)

    const assetPath = 'asset.svg'
    const basePath = 'http://localhost/'
    const scriptBaseURL = `${basePath}webchat.botonic.js?version=1.0.1`
    const script = createScript(scriptBaseURL)

    //act
    const result = staticAsset(assetPath)

    //assert
    expect(result).toBe(basePath + assetPath)

    removeScript(script)
  })

  test('should log an error and return normalized path if script element is not found', () => {
    //arrange
    isURL.mockReturnValue(false)

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    const path = 'asset.svg'
    const basePath = 'http://localhost/'
    const scriptBaseURL = `${basePath}webchat.js?version=1.0.1`
    const script = createScript(scriptBaseURL)

    //act
    const result = staticAsset(path)

    //assert
    expect(result).toBe(path)
    expect(console.error).toHaveBeenCalledWith(
      `Could not resolve path: '${path}'`
    )

    consoleErrorSpy.mockRestore()
    removeScript(script)
  })
})

test('toSnakeCase function converts object keys from camelCase to snake_case', () => {
  const obj = {
    camelCase: 'value',
    anotherCamelCase: 'anotherValue',
  }
  const expected = {
    camel_case: 'value',
    another_camel_case: 'anotherValue',
  }
  expect(toSnakeCaseKeys(obj)).toEqual(expected)
})

test('toSnakeCase function converts array of objects keys from camelCase to snake_case', () => {
  const obj = {
    arrayCamelCase: [
      { camelCase: 'value', anotherCamelCase: 'anotherValue', numberValue: 5 },
      {
        camelCase2: 'value',
        anotherCamelCase2: 'anotherValue',
        anotherArray: [{ camelCase3: 'value' }],
      },
    ],
  }
  const expected = {
    array_camel_case: [
      {
        camel_case: 'value',
        another_camel_case: 'anotherValue',
        number_value: 5,
      },
      {
        camel_case_2: 'value',
        another_camel_case_2: 'anotherValue',
        another_array: [{ camel_case_3: 'value' }],
      },
    ],
  }
  expect(toSnakeCaseKeys(obj)).toEqual(expected)
})

test('toSnakeCase function returns undefined when object is undefined', () => {
  const obj = undefined
  const expected = undefined
  expect(toSnakeCaseKeys(obj)).toEqual(expected)
})
