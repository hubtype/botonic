import {
  getPathParamsFromPathPayload,
  PATH_PAYLOAD_IDENTIFIER,
  pathParamsToParams,
  Router,
} from '../../src'
import { testSession } from '../helpers/routing'

describe('TEST: getting path and params from path payload input', () => {
  test.each([
    [undefined, null, undefined],
    ['', null, undefined],
    ['bad_input', null, undefined],
    [PATH_PAYLOAD_IDENTIFIER, null, undefined],
    [`${PATH_PAYLOAD_IDENTIFIER}path1`, 'path1', undefined],
    [`${PATH_PAYLOAD_IDENTIFIER}path1?path1`, 'path1', 'path1'],
  ])(
    'getOnFinishParams(%s)=>%s',
    (inputPayload, expectedPath, expectedParams) => {
      const input = { type: 'postback', payload: inputPayload }
      const { path, params } = getPathParamsFromPathPayload(input.payload)
      expect(path).toEqual(expectedPath)
      expect(params).toEqual(expectedParams)
    }
  )
})

describe('TEST: convert pathParams to params', () => {
  it('converts valid pathParams', () => {
    let res = pathParamsToParams(
      getPathParamsFromPathPayload(`${PATH_PAYLOAD_IDENTIFIER}path1?path1`)
        .params
    )
    expect(res).toEqual({ path1: '' })
    res = pathParamsToParams(
      getPathParamsFromPathPayload(
        `${PATH_PAYLOAD_IDENTIFIER}path1?param1=value1&param2=value2`
      ).params
    )
    expect(res).toEqual({ param1: 'value1', param2: 'value2' })
    res = pathParamsToParams(
      getPathParamsFromPathPayload(
        `${PATH_PAYLOAD_IDENTIFIER}path1?param1=false&param2=5`
      ).params
    )
    expect(res).toEqual({ param1: 'false', param2: '5' })
    res = pathParamsToParams(getPathParamsFromPathPayload(undefined).params)
    expect(res).toEqual({})
  })
})

describe('TEST: Named Group Regex', () => {
  const router = new Router([
    {
      path: 'namedGroup',
      text: /order (?<orderNumber>\w+)/,
      action: 'hello',
    },
    {
      path: 'noNamedGroup',
      text: /hi/,
      action: 'hello',
    },
  ])
  it('matches named groups', () => {
    const routeParams = router.getRoute(
      { type: 'text', text: 'order 12345' },
      router.routes,
      testSession(),
      null
    )
    expect(routeParams?.params).toEqual({ orderNumber: '12345' })
  })
  it('no named groups', () => {
    const routeParams = router.getRoute(
      { type: 'text', text: 'hi' },
      router.routes,
      testSession(),
      null
    )
    expect(routeParams?.params).toEqual({})
  })
})
