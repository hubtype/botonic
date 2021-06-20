import { NoMatchingRouteError } from './errors'
import { PROVIDER } from './index'
import { Router } from './router'

/** @type Input */
const textInput = { type: 'text', data: 'hi' }
/** @type Input */
const textInputComplex = { type: 'text', data: 'Cömplêx input &% 🚀' }
/** @type Input */
const textPayloadInput = { type: 'text', data: 'hi', payload: 'foo' }
/** @type Input */
const postbackInput = { type: 'postback', payload: 'foo' }

const requestInput = {
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

describe('Bad router initialization', () => {
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
  const { action } = router.processInput(textInput, testSession())
  expect(action).toBe('404Action')
})

describe('Match route by MATCHER <> INPUT', () => {
  const router = new Router([])
  const matchTextProp = (matcher, textInput) =>
    router.matchRoute(testRoute(), 'text', matcher, textInput, testSession())
  const matchPayloadProp = (matcher, payload) =>
    router.matchRoute(testRoute(), 'payload', matcher, payload, testSession())
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
        i => i.data.startsWith('hi'),
        textInput,
        testSession()
      )
    ).toBeTruthy()
    expect(
      router.matchRoute(
        testRoute(),
        'input',
        i => !i.data.startsWith('hi'),
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
          request.input.data === 'hi' &&
          request.session.organization === 'myOrg' &&
          request.lastRoutePath === 'initial',
        requestInput
      )
    ).toBeTruthy()
    expect(
      matchRequestProp(
        request =>
          request.input.data === 'hello' &&
          request.session.organization === 'myOrg' &&
          request.lastRoutePath === 'initial',
        requestInput
      )
    ).toBeFalsy()
  })
})

describe('Get route by path', () => {
  const externalRoutes = [
    { path: '', action: 'DefaultAction' },
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
        { path: '2', action: 'Flow1.2', childRoutes: externalRoutes },
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
  function getRouteActionByPath(path) {
    // @ts-ignore
    return router.getRouteByPath(path).action
  }
  test('path exists', () => {
    expect(getRouteActionByPath('initial')).toBe('Initial')
    expect(getRouteActionByPath('flow-1/1')).toBe('Flow1.1')
    expect(getRouteActionByPath('flow-1/3/2')).toBe('Flow1.3.2')
  })
  test('path exists in composed child routes', () => {
    expect(getRouteActionByPath('flow-1/2')).toBe('Flow1.2')
    expect(getRouteActionByPath('flow-1/2/child')).toBe('ChildAction')
  })
  test('path does not exist', () => {
    expect(router.getRouteByPath('')).toBeNull()
    expect(router.getRouteByPath('foo')).toBeNull()
    expect(router.getRouteByPath('flow-1/3/2/6')).toBeNull()
  })
})

describe('Process input (v<0.9)', () => {
  const externalRoutes = [
    { path: '', action: 'DefaultAction' },
    { path: 'child', action: 'ChildAction' },
  ]
  const router = new Router([
    { path: 'help', payload: 'help', action: 'Help' },
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
          ],
        },
        {
          path: '2',
          payload: '2',
          action: 'Flow1.2',
          childRoutes: externalRoutes,
        },
        {
          path: '3',
          payload: '3',
          action: 'Flow1.3',
          childRoutes: [
            { path: '1', payload: '1', action: 'Flow1.3.1' },
            { path: '2', payload: '2', action: 'Flow1.3.2' },
            { path: '3', payload: '3', action: 'Flow1.3.3' },
          ],
        },
      ],
    },
    { path: '404', action: '404Action' },
  ])
  test('text input, root level route', () => {
    /** @type Input */
    const input = { type: 'text', data: 'hi', intent: 'greeting' }
    const lastRoutePath = null
    expect(
      router.processInput(input, testSession(), lastRoutePath).action
    ).toBe('Flow1')
  })
  test('payload input, 2nd level route', () => {
    /** @type Input */
    const input = { type: 'postback', payload: '2' }
    const lastRoutePath = 'initial'
    expect(
      router.processInput(input, testSession(), lastRoutePath).action
    ).toBe('Flow1.2')
  })
  test('old protocol:path payload input, root level route', () => {
    /** @type Input */
    const input = { type: 'postback', payload: '__PATH_PAYLOAD__initial' }
    const lastRoutePath = ''
    expect(
      router.processInput(input, testSession(), lastRoutePath).action
    ).toBe('Flow1')
  })
  test('old protocol:path payload input, root level route with composed path', () => {
    /** @type Input */
    const input = { type: 'postback', path: 'initial/2' }
    const lastRoutePath = ''
    expect(
      router.processInput(input, testSession(), lastRoutePath).action
    ).toBe('Flow1.2')
  })
  test('old protocol: path payload input, 2nd level route with lastRoutePath', () => {
    /** @type Input */
    const input = { type: 'postback', payload: '__PATH_PAYLOAD__2' }
    const lastRoutePath = 'initial'
    expect(
      router.processInput(input, testSession(), lastRoutePath).action
    ).toBe('Flow1.2')
  })
  test('path payload input with deprecated protocol, root level route', () => {
    /** @type Input */
    const input = { type: 'postback', payload: '__PATH_PAYLOAD__initial/2' }
    const lastRoutePath = ''
    expect(
      router.processInput(input, testSession(), lastRoutePath).action
    ).toBe('Flow1.2')
  })
  test('old protocol:path payload input with deprecated protocol, 2nd level route', () => {
    /** @type Input */
    const input = { type: 'postback', payload: '__PATH_PAYLOAD__initial/2' }
    const lastRoutePath = 'initial'
    expect(
      router.processInput(input, testSession(), lastRoutePath).action
    ).toBe('Flow1.2')
  })
})

test.each([
  [undefined, undefined, undefined],
  ['', undefined, undefined],
  ['bad_input', undefined, undefined],
  ['__PATH_PAYLOAD__', '', undefined],
  ['xx__PATH_PAYLOAD__path1', 'path1', undefined],
  ['xx__PATH_PAYLOAD__path1?path1', 'path1', 'path1'],
])(
  'getOnFinishParams(%s)=>%s',
  (inputPayload, expectedPath, expectedParams) => {
    const router = new Router([])
    /** @type Input */
    const input = { type: 'postback', payload: inputPayload }
    expect(router.getOnFinishParams(input)).toEqual(expectedParams)
    expect(input.path).toEqual(expectedPath)
    if (input.path) {
      expect(input.payload).toBeUndefined()
    }
  }
)
