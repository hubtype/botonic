// @ts-nocheck
import { PROVIDER } from '../src/index'
import { NoMatchingRouteError, Router } from '../src/router'

/** @type Input */
const textInput = { type: 'text', text: 'hi' }
/** @type Input */
const textInputComplex = { type: 'text', text: 'Cömplêx input &% 🚀' }
/** @type Input */
const textPayloadInput = { type: 'text', text: 'hi', payload: 'foo' }
/** @type Input */
const postbackInput = { type: 'postback', payload: 'foo' }

const audioInput = { type: 'audio', src: 'data:audio/mpeg;base64,iVBORw0KG' }
const documentInput = {
  type: 'document',
  src: 'data:application/pdf;base64,iVBORw0KG',
}
const imageInput = { type: 'image', src: 'data:image/png;base64,iVBORw0KG' }
const videoInput = { type: 'video', src: 'data:video/mp4;base64,iVBORw0KG' }

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
    expect(() => router.newprocessInput(textInput, testSession())).toThrow(
      NoMatchingRouteError
    )
  })
  test('null routes throw TypeError', () => {
    // @ts-ignore
    const router = new Router()
    expect(() => router.newprocessInput(textInput, testSession())).toThrow(
      TypeError
    )
  })
})

test('Router returns 404', () => {
  const router = new Router([{ path: '404', action: '404Action' }])
  const { action } = router.newprocessInput(textInput, testSession())
  expect(action).toBe('404Action')
})

describe('Match route by MATCHER <> INPUT', () => {
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

describe('Get route by path', () => {
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

describe('TEST: getting path and params from payload input', () => {
  test.each([
    [undefined, null, undefined],
    ['', null, undefined],
    ['bad_input', null, undefined],
    ['__PATH_PAYLOAD__', null, undefined],
    ['__PATH_PAYLOAD__path1', 'path1', undefined],
    ['__PATH_PAYLOAD__path1?path1', 'path1', 'path1'],
    ['__PATH_PAYLOAD__path1?path1', 'path1', 'path1'],
  ])(
    'getOnFinishParams(%s)=>%s',
    (inputPayload, expectedPath, expectedParams) => {
      const router = new Router([])
      /** @type Input */
      const input = { type: 'postback', payload: inputPayload }
      const { pathPayload, params } = router.getPathAndParamsFromPayloadInput(
        input
      )
      expect(pathPayload).toEqual(expectedPath)
      expect(params).toEqual(expectedParams)
    }
  )
})
