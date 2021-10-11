// @ts-nocheck
import { Input, PATH_PAYLOAD_IDENTIFIER, PROVIDER } from '../../src'
import {
  getComputedRoutes,
  getPathParamsFromPathPayload,
  NoMatchingRouteError,
  pathParamsToParams,
  Router,
} from '../../src/routing'

const createPathPayload = (pathWithParams: string) =>
  `${PATH_PAYLOAD_IDENTIFIER}${pathWithParams}`

const textInput: Input = { type: 'text', text: 'hi' }
const textInputComplex: Input = { type: 'text', text: 'Cömplêx input &% 🚀' }
const textPayloadInput: Input = { type: 'text', text: 'hi', payload: 'foo' }
const postbackInput: Input = { type: 'postback', payload: 'foo' }

const audioInput: Input = {
  type: 'audio',
  src: 'data:audio/mpeg;base64,iVBORw0KG',
}
const documentInput: Input = {
  type: 'document',
  src: 'data:application/pdf;base64,iVBORw0KG',
}
const imageInput: Input = {
  type: 'image',
  src: 'data:image/png;base64,iVBORw0KG',
}
const videoInput: Input = {
  type: 'video',
  src: 'data:video/mp4;base64,iVBORw0KG',
}

const requestInput: Input = {
  input: textInput,
  session: { organization: 'myOrg' },
  lastRoutePath: 'initial',
}

/**
 * @return {Route}
 */
function testRoute() {
  return {}
}

/**
 * @return {Session}
 */
function testSession() {
  return {
    user: { id: 'userid', provider: PROVIDER.DEV },
    bot: { id: 'bot_id' },
    is_first_interaction: true,
  }
}

describe('TEST: Bad router initialization', () => {
  test('empty routes throw TypeError', () => {
    const router = new Router([])
    expect(() => router.processInput(textInput, testSession())).toThrow(
      NoMatchingRouteError
    )
  })
  test('null routes throw TypeError', () => {
    // @ts-ignore
    const router = new Router()
    expect(() => router.processInput(textInput, testSession())).toThrow(
      TypeError
    )
  })
})

test('Router returns 404', () => {
  const router = new Router([{ path: '404', action: '404Action' }])
  const { fallbackAction } = router.processInput(textInput, testSession())
  expect(fallbackAction).toBe('404Action')
})

describe('TEST: Match route by MATCHER <> INPUT', () => {
  const router = new Router([])
  const matchTextProp = (matcher, textInput) =>
    router.matchRoute(testRoute(), 'text', matcher, textInput, testSession())
  const matchPayloadProp = (matcher, payload) =>
    router.matchRoute(testRoute(), 'payload', matcher, payload, testSession())
  const matchTypeProp = (type, input) =>
    router.matchRoute(testRoute(), 'type', type, input, testSession())
  const matchRequestProp = (matcher, request) =>
    router.matchRoute(
      testRoute(),
      'request',
      matcher,
      request.input,
      request.session,
      request.lastRoutePath
    )
  test('text <> text', () => {
    expect(matchTextProp('hi', textInput)).toBeTruthy()
    expect(matchTextProp('hii', textInput)).toBeFalsy()
    expect(matchTextProp('bye', textInput)).toBeFalsy()
    expect(matchTextProp('', textInput)).toBeFalsy()
    expect(matchTextProp(null, textInput)).toBeFalsy()
    expect(matchTextProp('Cömplêx input &% 🚀', textInputComplex)).toBeTruthy()
    expect(matchTextProp(' Cömplêx input &% 🚀', textInputComplex)).toBeFalsy() // has a space at the beginning
  })
  test('regex <> text', () => {
    expect(matchTextProp(/hi/, textInput)).toBeTruthy()
    expect(matchTextProp(/bye/, textInput)).toBeFalsy()
    expect(matchTextProp(/🚀/, textInputComplex)).toBeTruthy()
    expect(matchTextProp(/complex/, textInputComplex)).toBeFalsy()
  })
  test('function <> text', () => {
    expect(matchTextProp(v => v.startsWith('hi'), textInput)).toBeTruthy()
    expect(matchTextProp(v => !v.startsWith('hi'), textInput)).toBeFalsy()
  })
  test('input <> text', () => {
    expect(
      router.matchRoute(
        testRoute(),
        'input',
        i => i.text.startsWith('hi'),
        textInput,
        testSession()
      )
    ).toBeTruthy()
    expect(
      router.matchRoute(
        testRoute(),
        'input',
        i => !i.text.startsWith('hi'),
        textInput,
        testSession()
      )
    ).toBeFalsy()
  })
  test('text <> text payload', () => {
    expect(matchPayloadProp('foo', textPayloadInput)).toBeTruthy()
    expect(matchPayloadProp('fooo', textPayloadInput)).toBeFalsy()
    expect(matchPayloadProp('bar', textPayloadInput)).toBeFalsy()
    expect(matchPayloadProp('', textPayloadInput)).toBeFalsy()
    expect(matchPayloadProp(null, textPayloadInput)).toBeFalsy()
  })
  test('regex <> text payload', () => {
    expect(matchPayloadProp(/foo/, textPayloadInput)).toBeTruthy()
    expect(matchPayloadProp(/bar/, textPayloadInput)).toBeFalsy()
  })
  test('function <> text payload', () => {
    expect(
      matchPayloadProp(v => v.startsWith('fo'), textPayloadInput)
    ).toBeTruthy()
    expect(
      matchPayloadProp(v => !v.startsWith('fo'), textPayloadInput)
    ).toBeFalsy()
  })
  test('text <> postback', () => {
    expect(matchPayloadProp('foo', postbackInput)).toBeTruthy()
    expect(matchPayloadProp('fooo', postbackInput)).toBeFalsy()
    expect(matchPayloadProp('bar', postbackInput)).toBeFalsy()
    expect(matchPayloadProp('', postbackInput)).toBeFalsy()
    expect(matchPayloadProp(null, postbackInput)).toBeFalsy()
  })
  test('regex <> postback', () => {
    expect(matchPayloadProp(/foo/, postbackInput)).toBeTruthy()
    expect(matchPayloadProp(/bar/, postbackInput)).toBeFalsy()
  })
  test('function <> postback', () => {
    expect(
      matchPayloadProp(v => v.startsWith('fo'), postbackInput)
    ).toBeTruthy()
    expect(
      matchPayloadProp(v => !v.startsWith('fo'), postbackInput)
    ).toBeFalsy()
  })
  test('function <> request', () => {
    expect(
      matchRequestProp(
        request =>
          request.input.text === 'hi' &&
          request.session.organization === 'myOrg' &&
          request.lastRoutePath === 'initial',
        requestInput
      )
    ).toBeTruthy()
    expect(
      matchRequestProp(
        request =>
          request.input.text === 'hello' &&
          request.session.organization === 'myOrg' &&
          request.lastRoutePath === 'initial',
        requestInput
      )
    ).toBeFalsy()
  })
  test('type <> audio, document, image, video', () => {
    expect(matchTypeProp('audio', audioInput)).toBeTruthy()
    expect(matchTypeProp('document', documentInput)).toBeTruthy()
    expect(matchTypeProp('image', imageInput)).toBeTruthy()
    expect(matchTypeProp('video', videoInput)).toBeTruthy()
  })
  test('type <> other inputs', () => {
    expect(matchTypeProp(/.*/, { type: 'anyOtherInput' })).toBeTruthy()
  })
})

describe('TEST: Get route by path', () => {
  const externalRoutes = [
    { path: '', action: 'Flow1.2' },
    { path: 'child', action: 'ChildAction' },
  ]
  const router = new Router([
    { path: 'initial', action: 'Initial' },
    {
      path: 'flow-1',
      action: 'Flow1',
      childRoutes: [
        {
          path: '1',
          action: 'Flow1.1',
          childRoutes: [
            { path: '1', action: 'Flow1.1.1' },
            { path: '2', action: 'Flow1.1.2' },
            { path: '3', action: 'Flow1.1.3' },
          ],
        },
        { path: '2', childRoutes: externalRoutes },
        {
          path: '3',
          action: 'Flow1.3',
          childRoutes: [
            { path: '1', action: 'Flow1.3.1' },
            { path: '2', action: 'Flow1.3.2' },
            { path: '3', action: 'Flow1.3.3' },
          ],
        },
      ],
    },
    { path: '404', action: '404Action' },
  ])

  test('path exists', () => {
    expect(router.getRouteByPath('initial')).toEqual({
      path: 'initial',
      action: 'Initial',
    })
    expect(router.getRouteByPath('flow-1/1')).toEqual({
      path: '1',
      action: 'Flow1.1',
      childRoutes: [
        { path: '1', action: 'Flow1.1.1' },
        { path: '2', action: 'Flow1.1.2' },
        { path: '3', action: 'Flow1.1.3' },
      ],
    })
    expect(router.getRouteByPath('flow-1/3/2')).toEqual({
      action: 'Flow1.3.2',
      path: '2',
    })
  })
  test('path exists in composed child routes', () => {
    expect(router.getRouteByPath('flow-1/2')).toEqual({
      path: '2',
      childRoutes: [
        { action: 'Flow1.2', path: '' },
        { action: 'ChildAction', path: 'child' },
      ],
    })
    expect(router.getRouteByPath('flow-1/2/child')).toEqual({
      path: 'child',
      action: 'ChildAction',
    })
  })
  test('path does not exist', () => {
    expect(router.getRouteByPath('')).toBeNull()
    expect(router.getRouteByPath('foo')).toBeNull()
    expect(router.getRouteByPath('flow-1/3/2/6')).toBeNull()
  })
})

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
    expect(routeParams.params).toEqual({ orderNumber: '12345' })
  })
  it('no named groups', () => {
    const routeParams = router.getRoute(
      { type: 'text', text: 'hi' },
      router.routes,
      testSession(),
      null
    )
    expect(routeParams.params).toEqual({})
  })
})

const redirectRoutes = [
  {
    path: 'redirectToChildRoute',
    text: 'redirectToChildRoute',
    redirect: 'initial/3/2',
  },
  {
    path: 'redirectToEmptyAction',
    text: 'redirectToEmptyAction',
    redirect: 'initial/2',
  },
  {
    path: 'redirectToEmptyActionChildRoute',
    text: 'redirectToEmptyActionChildRoute',
    redirect: 'initial/2/child',
  },
  {
    path: 'unexistingRedirect',
    text: 'wontBeResolved',
    redirect: 'initial/2/rndN',
  },
]
const notFoundRoute = { path: '404', action: '404Action' }

const fallbackRoutes = [
  { path: 'help', payload: 'help', action: 'Help', ignoreRetry: true },
  { path: 'insult', text: 'fuck', action: 'Insult' },
]

const defaultRoutes = [
  {
    path: 'initial',
    intent: /greeting/,
    action: 'Flow1',
    childRoutes: [
      {
        path: '1',
        payload: '1',
        action: 'Flow1.1',
        childRoutes: [
          { path: '1', payload: '1', action: 'Flow1.1.1' },
          { path: '2', payload: '2', action: 'Flow1.1.2' },
          { path: '3', payload: '3', action: 'Flow1.1.3' },
          { path: 'fallback', text: /.*/, action: 'ChildRouteFallback' },
        ],
      },
      {
        path: '2',
        payload: '2',
        action: 'Flow1.2',
        childRoutes: [
          // External Routes
          { path: '', action: 'Flow1.2.emptyAction' },
          { path: 'child', text: 'child', action: 'ChildAction' },
        ],
      },
      {
        path: '3',
        payload: '3',
        action: 'Flow1.3',
        retry: 3,
        childRoutes: [
          { path: '1', payload: '1', action: 'Flow1.3.1' },
          { path: '2', payload: '2', action: 'Flow1.3.2' },
          { path: '3', payload: '3', action: 'Flow1.3.3' },
        ],
      },
    ],
  },
]

const retryRoutes = [
  {
    path: 'retryFlow',
    payload: 'final',
    action: 'RetryFlow',
    retry: 2,
    childRoutes: [
      { path: '1', payload: '1', action: 'FlowFinal1' },
      { path: '2', payload: '2', action: 'FlowFinal2' },
      { path: '3', payload: '3', action: 'FlowFinal3' },
    ],
  },
  { path: 'text', text: 'bye', action: 'Bye' },
]

const retryEmptyActionRoutes = [
  {
    path: 'retryFlowDA',
    payload: 'final',
    retry: 1,
    childRoutes: [
      { path: '', action: 'RetryFlowEmptyAction' },
      { path: 'child', payload: '2', action: 'RetryFlowChildAction' },
    ],
  },
  { path: 'text', text: 'bye', action: 'Bye' },
]

const routes = [...defaultRoutes, ...fallbackRoutes, notFoundRoute]
const routesWithRedirects = [
  ...defaultRoutes,
  ...redirectRoutes,
  ...fallbackRoutes,
  notFoundRoute,
]
const routesWithRetries = [
  ...defaultRoutes,
  ...retryRoutes,
  ...fallbackRoutes,
  notFoundRoute,
]

const routesWithEmptyActionRetries = [
  ...defaultRoutes,
  ...retryEmptyActionRoutes,
  ...fallbackRoutes,
  notFoundRoute,
]

describe('TEST: Retries (in childRoutes)', () => {
  const retriesSession = testSession()

  const router = new Router(routes)
  it('Test retry flow in childRoutes (3 mistakes, 1 goes to a fallback action which does not break flow)', () => {
    expect(retriesSession.__retries).toEqual(undefined)
    expect(
      router.processInput(
        { type: 'postback', payload: 'fail' },
        retriesSession,
        'initial/3'
      )
    ).toEqual({
      action: 'Flow1.3',
      emptyAction: null,
      fallbackAction: '404Action',
      lastRoutePath: 'initial/3',
      params: {},
    })
    expect(retriesSession.__retries).toEqual(1)
    expect(
      router.processInput(
        { type: 'text', text: 'fuck' },
        retriesSession,
        'initial/3'
      )
    ).toEqual({
      action: 'Flow1.3',
      emptyAction: null,
      fallbackAction: 'Insult',
      lastRoutePath: 'initial/3',
      params: {},
    })
    expect(retriesSession.__retries).toEqual(2)
    expect(
      router.processInput(
        { type: 'postback', payload: 'fail' },
        retriesSession,
        'initial/3'
      )
    ).toEqual({
      action: 'Flow1.3',
      emptyAction: null,
      fallbackAction: '404Action',
      lastRoutePath: 'initial/3',
      params: {},
    })
    expect(retriesSession.__retries).toEqual(3)
    expect(
      router.processInput(
        { type: 'postback', payload: 'kk' },
        retriesSession,
        'initial/3'
      )
    ).toEqual({
      action: null,
      emptyAction: null,
      fallbackAction: '404Action',
      lastRoutePath: 'initial/3',
      params: {},
    })
    expect(retriesSession.__retries).toEqual(0)
  })
})

describe('TEST: Retries (in childRoutes, ignoreRetry)', () => {
  const retriesSession = testSession()

  const router = new Router(routes)
  it('Test retry flow in childRoutes (1 mistake and go to an action which break flow)', () => {
    expect(retriesSession.__retries).toEqual(undefined)
    expect(
      router.processInput(
        { type: 'postback', payload: 'fail' },
        retriesSession,
        'initial/3'
      )
    ).toEqual({
      action: 'Flow1.3',
      emptyAction: null,
      fallbackAction: '404Action',
      lastRoutePath: 'initial/3',
      params: {},
    })
    expect(retriesSession.__retries).toEqual(1)
    expect(
      router.processInput(
        { type: 'text', payload: 'help' },
        retriesSession,
        'initial/3'
      )
    ).toEqual({
      action: 'Help',
      emptyAction: null,
      fallbackAction: null,
      lastRoutePath: 'help',
      params: {},
    })
    expect(retriesSession.__retries).toEqual(0)
  })
})

describe('Retries (with empty action)', () => {
  let retriesSession
  beforeEach(() => {
    retriesSession = testSession()
  })
  afterEach(() => {
    retriesSession = null
  })
  const router = new Router(routesWithEmptyActionRetries)

  it('Test retry action in retryRoutes (with empty action)', () => {
    expect(
      router.processInput(
        { type: 'postback', payload: 'final' },
        testSession(),
        'final'
      )
    ).toEqual({
      action: null,
      emptyAction: 'RetryFlowEmptyAction',
      fallbackAction: null,
      lastRoutePath: 'retryFlowDA',
      params: {},
    })
  })
  it('Test retry flow in retryRoutes (1 mistakes)', () => {
    expect(retriesSession.__retries).toEqual(undefined)
    expect(
      router.processInput(
        { type: 'postback', payload: 'fail' },
        retriesSession,
        'retryFlowDA'
      )
    ).toEqual({
      action: null,
      emptyAction: 'RetryFlowEmptyAction',
      fallbackAction: '404Action',
      lastRoutePath: 'retryFlowDA',
      params: {},
    })
    expect(retriesSession.__retries).toEqual(1)
    expect(
      router.processInput(
        { type: 'postback', payload: 'fail' },
        retriesSession,
        'retryFlowDA'
      )
    ).toEqual({
      action: null,
      emptyAction: null,
      fallbackAction: '404Action',
      lastRoutePath: 'retryFlowDA',
      params: {},
    })
    expect(retriesSession.__retries).toEqual(0)
  })
})

describe('TEST: Retries', () => {
  let retriesSession
  beforeEach(() => {
    retriesSession = testSession()
  })
  afterEach(() => {
    retriesSession = null
  })
  const router = new Router(routesWithRetries)

  it('Test retry action in retryRoutes', () => {
    expect(
      router.processInput(
        { type: 'postback', payload: 'final' },
        retriesSession,
        null
      )
    ).toEqual({
      action: 'RetryFlow',
      emptyAction: null,
      fallbackAction: null,
      lastRoutePath: 'retryFlow',
      params: {},
    })
  })
  it('Test retry flow in retryRoutes (2 mistakes)', () => {
    expect(retriesSession.__retries).toEqual(undefined)
    expect(
      router.processInput(
        { type: 'postback', payload: 'fail' },
        retriesSession,
        'retryFlow'
      )
    ).toEqual({
      action: 'RetryFlow',
      emptyAction: null,
      fallbackAction: '404Action',
      lastRoutePath: 'retryFlow',
      params: {},
    })
    expect(retriesSession.__retries).toEqual(1)
    expect(
      router.processInput(
        { type: 'postback', payload: 'fail' },
        retriesSession,
        'retryFlow'
      )
    ).toEqual({
      action: 'RetryFlow',
      emptyAction: null,
      fallbackAction: '404Action',
      lastRoutePath: 'retryFlow',
      params: {},
    })
    expect(retriesSession.__retries).toEqual(2)
    expect(
      router.processInput(
        { type: 'postback', payload: 'fail' },
        retriesSession,
        'retryFlow'
      )
    ).toEqual({
      action: null,
      emptyAction: null,
      fallbackAction: '404Action',
      lastRoutePath: 'retryFlow',
      params: {},
    })
    expect(retriesSession.__retries).toEqual(0)
  })
  it('Test retry flow in retryRoutes (with success)', () => {
    expect(retriesSession.__retries).toEqual(undefined)
    expect(
      router.processInput(
        { type: 'postback', payload: 'fail' },
        retriesSession,
        'retryFlow'
      )
    ).toEqual({
      action: 'RetryFlow',
      emptyAction: null,
      fallbackAction: '404Action',
      lastRoutePath: 'retryFlow',
      params: {},
    })
    expect(retriesSession.__retries).toEqual(1)
    expect(
      router.processInput(
        { type: 'postback', payload: '1' },
        retriesSession,
        'retryFlow'
      )
    ).toEqual({
      action: 'FlowFinal1',
      emptyAction: null,
      fallbackAction: null,
      lastRoutePath: 'retryFlow/1',
      params: {},
    })
    expect(retriesSession.__retries).toEqual(0)
  })
})

describe('TEST: Redirects', () => {
  const router = new Router(routesWithRedirects)
  it('should redirect to empty action', () => {
    expect(
      router.processInput(
        { type: 'text', text: 'redirectToEmptyAction' },
        testSession(),
        null
      )
    ).toEqual({
      action: 'Flow1.2',
      emptyAction: 'Flow1.2.emptyAction',
      fallbackAction: null,
      lastRoutePath: 'initial/2',
      params: {},
    })
  })
  it('should redirect to empty action child route', () => {
    expect(
      router.processInput(
        { type: 'text', text: 'redirectToEmptyActionChildRoute' },
        testSession(),
        null
      )
    ).toEqual({
      action: 'ChildAction',
      emptyAction: null,
      fallbackAction: null,
      lastRoutePath: 'initial/2/child',
      params: {},
    })
  })
  it('should redirect', () => {
    expect(
      router.processInput(
        { type: 'text', text: 'redirectToChildRoute' },
        testSession(),
        null
      )
    ).toEqual({
      action: 'Flow1.3.2',
      emptyAction: null,
      fallbackAction: null,
      lastRoutePath: 'initial/3/2',
      params: {},
    })
  })
  it('redirect is not found', () => {
    expect(
      router.processInput(
        { type: 'text', text: 'wontBeResolved' },
        testSession(),
        null
      )
    ).toEqual({
      action: null,
      emptyAction: null,
      fallbackAction: '404Action',
      lastRoutePath: null,
      params: {},
    })
  })
})

describe('TEST: 2nd LEVEL ACCESSES (lastRoutePath=initial/1)', () => {
  const router = new Router(routes)
  describe('normal input', () => {
    it('1 Accessible from initial/1', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: '1' },
          testSession(),
          'initial/1'
        )
      ).toEqual({
        action: 'Flow1.1.1',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial/1/1',
        params: {},
      })
    })
    it('Fallback Accessible from initial/1', () => {
      expect(
        router.processInput(
          { type: 'text', text: 'whatever' },
          testSession(),
          'initial/1'
        )
      ).toEqual({
        action: 'ChildRouteFallback',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial/1/fallback',
        params: {},
      })
    })
    it('unexisting childRoute', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: 'unexisting' },
          testSession(),
          'initial/1'
        )
      ).toEqual({
        action: null,
        emptyAction: null,
        fallbackAction: '404Action',
        lastRoutePath: 'initial/1',
        params: {},
      })
    })
  })
  describe('path payload input', () => {
    it('1 Accessible from initial/1', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('1') },
          testSession(),
          'initial/1'
        )
      ).toEqual({
        action: 'Flow1.1.1',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial/1/1',
        params: {},
      })
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('initial/1/1') },
          testSession(),
          'initial/1'
        )
      ).toEqual({
        action: 'Flow1.1.1',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial/1/1',
        params: {},
      })
    })
    it('unexisting childRoute', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('unexisting') },
          testSession(),
          'initial/1'
        )
      ).toEqual({
        action: null,
        emptyAction: null,
        fallbackAction: '404Action',
        lastRoutePath: 'initial/1',
        params: {},
      })
    })
  })
})

describe('TEST: 2nd LEVEL ACCESSES (lastRoutePath=initial/2)', () => {
  const router = new Router(routes)
  describe('normal input', () => {
    it('child Accessible from initial/2', () => {
      expect(
        router.processInput(
          { type: 'text', text: 'child' },
          testSession(),
          'initial/2'
        )
      ).toEqual({
        action: 'ChildAction',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial/2/child',
        params: {},
      })
    })
    it('unexisting childRoute', () => {
      expect(
        router.processInput(
          { type: 'text', text: 'unexisting' },
          testSession(),
          'initial/2'
        )
      ).toEqual({
        action: null,
        emptyAction: null,
        fallbackAction: '404Action',
        lastRoutePath: 'initial/2',
        params: {},
      })
    })
  })
  describe('path payload input', () => {
    it('child Accessible from initial/2', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('child') },
          testSession(),
          'initial/2'
        )
      ).toEqual({
        action: 'ChildAction',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial/2/child',
        params: {},
      })
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('initial/2/child') },
          testSession(),
          'initial/2'
        )
      ).toEqual({
        action: 'ChildAction',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial/2/child',
        params: {},
      })
    })
  })
  it('unexisting childRoute', () => {
    expect(
      router.processInput(
        { type: 'postback', payload: createPathPayload('unexisting') },
        testSession(),
        'initial/2'
      )
    ).toEqual({
      action: null,
      emptyAction: null,
      fallbackAction: '404Action',
      lastRoutePath: 'initial/2',
      params: {},
    })
  })
})

describe('TEST: 1st LEVEL ACCESSES (lastRoutePath=initial)', () => {
  const router = new Router(routes)
  describe('normal input', () => {
    it('1. initial/1 accessible from initial', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: '1' },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: 'Flow1.1',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial/1',
        params: {},
      })
    })
    it('2. initial/2 accessible from initial', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: '2' },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: 'Flow1.2',
        emptyAction: 'Flow1.2.emptyAction',
        fallbackAction: null,
        lastRoutePath: 'initial/2',
        params: {},
      })
    })
    it('3. initial/3 accessible from initial', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: '3' },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: 'Flow1.3',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial/3',
        params: {},
      })
    })
    it('4. help accessible from initial', () => {
      // NVS
      expect(
        router.processInput(
          { type: 'postback', payload: 'help' },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: 'Help',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'help',
        params: {},
      })
    })
    it('5. not found accessible from initial', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: 'unexisting' },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: null,
        emptyAction: null,
        fallbackAction: '404Action',
        lastRoutePath: 'initial',
        params: {},
      })
    })
  })

  describe('path payload input', () => {
    it('1. initial/1 accessible from initial', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('1') },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: 'Flow1.1',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial/1',
        params: {},
      })
      expect(
        router.processInput(
          {
            type: 'postback',
            payload: createPathPayload('initial/1'),
          },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: 'Flow1.1',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial/1',
        params: {},
      })
    })

    it('2. initial/2 accessible from initial', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('2') },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: 'Flow1.2',
        emptyAction: 'Flow1.2.emptyAction',
        fallbackAction: null,
        lastRoutePath: 'initial/2',
        params: {},
      })
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('initial/2') },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: 'Flow1.2',
        emptyAction: 'Flow1.2.emptyAction',
        fallbackAction: null,
        lastRoutePath: 'initial/2',
        params: {},
      })
    })

    it('3. initial/3 accessible from initial', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('3') },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: 'Flow1.3',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial/3',
        params: {},
      })
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('initial/3') },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: 'Flow1.3',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial/3',
        params: {},
      })
    })

    // HEHEHEHE
    it('4. help accessible from initial', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('help') },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: 'Help',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'help',
        params: {},
      })
    })

    it('5. not found accessible from initial', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('unexisting') },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: null,
        fallbackAction: '404Action',
        emptyAction: null,
        lastRoutePath: 'initial',
        params: {},
      })
    })
  })

  describe('nested path payload', () => {
    it('initial/2/child accessible from initial', () => {
      expect(
        router.processInput(
          {
            type: 'postback',
            payload: createPathPayload('2/child'),
          },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: 'ChildAction',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial/2/child',
        params: {},
      })
      expect(
        router.processInput(
          {
            type: 'postback',
            payload: createPathPayload('initial/2/child'),
          },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: 'ChildAction',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial/2/child',
        params: {},
      })
    })
  })
})

describe('TEST: ROOT LEVEL ACCESSES (lastRoutePath is not null)', () => {
  const router = new Router(routes)

  describe('normal input', () => {
    it('1. initial accessible from initial', () => {
      expect(
        router.processInput(
          { type: 'text', text: 'hi', intent: 'greeting' },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: 'Flow1',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial',
        params: {},
      })
    })

    it('2. initial accessible from help', () => {
      expect(
        router.processInput(
          { type: 'text', text: 'hi', intent: 'greeting' },
          testSession(),
          'help'
        )
      ).toEqual({
        action: 'Flow1',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial',
        params: {},
      })
    })

    it('3. help accessible from initial', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: 'help' },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: 'Help',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'help',
        params: {},
      })
    })

    it('4. help accessible from help', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: 'help' },
          testSession(),
          'help'
        )
      ).toEqual({
        action: 'Help',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'help',
        params: {},
      })
    })

    it('5. not found accessible from initial', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: 'unexisting' },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: null,
        emptyAction: null,
        fallbackAction: '404Action',
        lastRoutePath: 'initial',
        params: {},
      })
    })

    it('6. not found accessible from help', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: 'unexisting' },
          testSession(),
          'help'
        )
      ).toEqual({
        action: null,
        emptyAction: null,
        fallbackAction: '404Action',
        lastRoutePath: 'help',
        params: {},
      })
    })
  })

  describe('path payload input', () => {
    it('1. initial accessible from initial', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('initial') },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: 'Flow1',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial',
        params: {},
      })
    })

    it('2. initial accessible from help', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('initial') },
          testSession(),
          'help'
        )
      ).toEqual({
        action: 'Flow1',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial',
        params: {},
      })
    })

    it('3. help accessible from initial', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('help') },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: 'Help',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'help',
        params: {},
      })
    })

    it('4. help accessible from help', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('help') },
          testSession(),
          'help'
        )
      ).toEqual({
        action: 'Help',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'help',
        params: {},
      })
    })

    it('5. not found accessible from initial', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('404') },
          testSession(),
          'initial'
        )
      ).toEqual({
        action: null,
        emptyAction: null,
        fallbackAction: '404Action',
        lastRoutePath: 'initial',
        params: {},
      })
    })

    it('6. not found accessible from help', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('404') },
          testSession(),
          'help'
        )
      ).toEqual({
        action: null,
        emptyAction: null,
        fallbackAction: '404Action',
        lastRoutePath: 'help',
        params: {},
      })
    })
  })
})

describe('TEST: ROOT LEVEL ACCESSES (lastRoutePath is null)', () => {
  const router = new Router(routes)

  describe('normal input', () => {
    it('1. should retrieve routes at root level (initial path)', () => {
      expect(
        router.processInput(
          { type: 'text', text: 'hi', intent: 'greeting' },
          testSession(),
          null
        )
      ).toEqual({
        action: 'Flow1',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial',
        params: {},
      })
    })

    it('2. should retrieve routes at root level (help path)', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: 'help' },
          testSession(),
          null
        )
      ).toEqual({
        action: 'Help',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'help',
        params: {},
      })
    })

    it('3. should retrieve routes at root level (404 path)', () => {
      expect(
        router.processInput(
          { type: 'text', text: 'not_found' },
          testSession(),
          null
        )
      ).toEqual({
        action: null,
        emptyAction: null,
        fallbackAction: '404Action',
        lastRoutePath: null,
        params: {},
      })
    })
  })

  describe('path payload input', () => {
    it('1. should retrieve routes at root level (initial path)', () => {
      expect(
        router.processInput(
          {
            type: 'postback',
            payload: createPathPayload('initial'),
          },
          testSession(),
          null
        )
      ).toEqual({
        action: 'Flow1',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'initial',
        params: {},
      })
    })

    it('2. should retrieve routes at root level (help path)', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('help') },
          testSession(),
          null
        )
      ).toEqual({
        action: 'Help',
        emptyAction: null,
        fallbackAction: null,
        lastRoutePath: 'help',
        params: {},
      })
    })

    it('3. should retrieve routes at root level (404 path payload)', () => {
      expect(
        router.processInput(
          { type: 'postback', payload: createPathPayload('404') },
          testSession(),
          null
        )
      ).toEqual({
        action: null,
        emptyAction: null,
        fallbackAction: '404Action',
        lastRoutePath: null,
        params: {},
      })
    })
  })
})

describe('TEST: Converting Functional Routes to Routes', () => {
  const routes = [
    {
      path: '1',
      childRoutes: [
        {
          path: '1.1',
          childRoutes: [],
        },
        {
          path: '1.2',
          childRoutes: [],
        },
      ],
    },
  ]

  it('get expected routes given functional routes', async () => {
    const functionalRoutes = async () => routes
    const computedRoutes = await getComputedRoutes(await functionalRoutes())
    expect(computedRoutes).toEqual(routes)
  })
  it('get expected routes given functional routes with functional childRoutes', async () => {
    const functionalRoutes = async args => [
      {
        path: '1',
        childRoutes: () => [
          {
            path: '1.1',
            childRoutes: async () => [],
          },
          {
            path: '1.2',
            childRoutes: () => [],
          },
        ],
      },
    ]
    const computedRoutes = await getComputedRoutes(await functionalRoutes())
    expect(computedRoutes).toEqual(routes)
  })
})

// eslint-disable-next-line jest/valid-describe
describe('TEST: Functional Router process input', () => {
  it('Resolves correctly the dynamic routes and incoming input', async () => {
    const routes = async ({ input, session }) => {
      if (session.is_first_interaction) {
        return [{ text: /.*/, action: 'Hi' }]
      } else {
        return [
          { path: 'help', text: 'help', action: 'Help' },
          { path: '404', action: 'NotFound' },
        ]
      }
    }
    const args = {
      input: { type: 'text', text: 'hi' },
      session: testSession(),
    }
    let computedRoutes = await getComputedRoutes(routes, args)
    let router = new Router(computedRoutes)
    expect(computedRoutes).toEqual([{ text: /.*/, action: 'Hi' }])
    expect(router.processInput(args.input, args.session, null)).toEqual({
      action: 'Hi',
      emptyAction: null,
      fallbackAction: null,
      lastRoutePath: null,
      params: {},
    })
    // Now modifying args to process an input when is not first interaction
    args.session.is_first_interaction = false
    args.input.text = 'help'
    computedRoutes = await getComputedRoutes(routes, args)
    router = new Router(computedRoutes)
    expect(computedRoutes).toEqual([
      { path: 'help', text: 'help', action: 'Help' },
      { path: '404', action: 'NotFound' },
    ])
    expect(router.processInput(args.input, args.session, null)).toEqual({
      action: 'Help',
      emptyAction: null,
      fallbackAction: null,
      lastRoutePath: 'help',
      params: {},
    })
  })
})
