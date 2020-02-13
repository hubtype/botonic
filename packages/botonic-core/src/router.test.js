const { Router } = require('./router')

const textInput = { type: 'text', data: 'hi' }
const textInputComplex = { type: 'text', data: 'Cömplêx input &% 🚀' }
const textPayloadInput = { type: 'text', data: 'hi', payload: 'foo' }
const postbackInput = { type: 'postback', payload: 'foo' }

describe('Bad router initialization', () => {
  test('empty routes throw TypeError', () => {
    const router = new Router([])
    expect(() => router.processInput(textInput)).toThrow(TypeError)
  })
  test('null routes throw TypeError', () => {
    const router = new Router()
    expect(() => router.processInput(textInput)).toThrow(TypeError)
  })
})

test('Router returns 404', () => {
  const router = new Router([{ path: '404', action: '404Action' }])
  const { action } = router.processInput(textInput)
  expect(action).toBe('404Action')
})

describe('Match route by MATCHER <> INPUT', () => {
  const router = new Router()
  test('text <> text', () => {
    expect(router.matchRoute('text', 'hi', textInput)).toBeTruthy()
    expect(router.matchRoute('text', 'hii', textInput)).toBeFalsy()
    expect(router.matchRoute('text', 'bye', textInput)).toBeFalsy()
    expect(router.matchRoute('text', '', textInput)).toBeFalsy()
    expect(router.matchRoute('text', null, textInput)).toBeFalsy()
    expect(
      router.matchRoute('text', 'Cömplêx input &% 🚀', textInputComplex)
    ).toBeTruthy()
    expect(
      router.matchRoute('text', ' Cömplêx input &% 🚀', textInputComplex)
    ).toBeFalsy() // has a space at the beginning
  })
  test('regex <> text', () => {
    expect(router.matchRoute('text', /hi/, textInput)).toBeTruthy()
    expect(router.matchRoute('text', /bye/, textInput)).toBeFalsy()
    expect(router.matchRoute('text', /🚀/, textInputComplex)).toBeTruthy()
    expect(router.matchRoute('text', /complex/, textInputComplex)).toBeFalsy()
  })
  test('function <> text', () => {
    expect(
      router.matchRoute('text', v => v.startsWith('hi'), textInput)
    ).toBeTruthy()
    expect(
      router.matchRoute('text', v => !v.startsWith('hi'), textInput)
    ).toBeFalsy()
  })
  test('input <> text', () => {
    expect(
      router.matchRoute('input', i => i.data.startsWith('hi'), textInput)
    ).toBeTruthy()
    expect(
      router.matchRoute('input', i => !i.data.startsWith('hi'), textInput)
    ).toBeFalsy()
  })
  test('text <> text payload', () => {
    expect(router.matchRoute('payload', 'foo', textPayloadInput)).toBeTruthy()
    expect(router.matchRoute('payload', 'fooo', textPayloadInput)).toBeFalsy()
    expect(router.matchRoute('payload', 'bar', textPayloadInput)).toBeFalsy()
    expect(router.matchRoute('payload', '', textPayloadInput)).toBeFalsy()
    expect(router.matchRoute('payload', null, textPayloadInput)).toBeFalsy()
  })
  test('regex <> text payload', () => {
    expect(router.matchRoute('payload', /foo/, textPayloadInput)).toBeTruthy()
    expect(router.matchRoute('payload', /bar/, textPayloadInput)).toBeFalsy()
  })
  test('function <> text payload', () => {
    expect(
      router.matchRoute('payload', v => v.startsWith('fo'), textPayloadInput)
    ).toBeTruthy()
    expect(
      router.matchRoute('payload', v => !v.startsWith('fo'), textPayloadInput)
    ).toBeFalsy()
  })
  test('text <> postback', () => {
    expect(router.matchRoute('payload', 'foo', postbackInput)).toBeTruthy()
    expect(router.matchRoute('payload', 'fooo', postbackInput)).toBeFalsy()
    expect(router.matchRoute('payload', 'bar', postbackInput)).toBeFalsy()
    expect(router.matchRoute('payload', '', postbackInput)).toBeFalsy()
    expect(router.matchRoute('payload', null, postbackInput)).toBeFalsy()
  })
  test('regex <> postback', () => {
    expect(router.matchRoute('payload', /foo/, postbackInput)).toBeTruthy()
    expect(router.matchRoute('payload', /bar/, postbackInput)).toBeFalsy()
  })
  test('function <> postback', () => {
    expect(
      router.matchRoute('payload', v => v.startsWith('fo'), postbackInput)
    ).toBeTruthy()
    expect(
      router.matchRoute('payload', v => !v.startsWith('fo'), postbackInput)
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
  test('path exists', () => {
    expect(router.getRouteByPath('initial').action).toBe('Initial')
    expect(router.getRouteByPath('flow-1/1').action).toBe('Flow1.1')
    expect(router.getRouteByPath('flow-1/3/2').action).toBe('Flow1.3.2')
  })
  test('path exists in composed child routes', () => {
    expect(router.getRouteByPath('flow-1/2').action).toBe('Flow1.2')
    expect(router.getRouteByPath('flow-1/2/child').action).toBe('ChildAction')
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
    const input = { type: 'text', data: 'hi', intent: 'greeting' }
    const session = {}
    const lastRoutePath = null
    expect(router.processInput(input, session, lastRoutePath).action).toBe(
      'Flow1'
    )
  })
  test('payload input, 2nd level route', () => {
    const input = { type: 'postback', payload: '2' }
    const session = {}
    const lastRoutePath = 'initial'
    expect(router.processInput(input, session, lastRoutePath).action).toBe(
      'Flow1.2'
    )
  })
  test('old protocol:path payload input, root level route', () => {
    const input = { type: 'postback', payload: '__PATH_PAYLOAD__initial' }
    const session = {}
    const lastRoutePath = ''
    expect(router.processInput(input, session, lastRoutePath).action).toBe(
      'Flow1'
    )
  })
  test.skip('old protocol:path payload input, root level route (should be ignored)', () => {
    const input = { type: 'postback', path: 'initial/2' }
    const session = {}
    const lastRoutePath = ''
    expect(router.processInput(input, session, lastRoutePath).action).toBe(
      'Flow1.2'
    )
  })
  test.skip('path payload input with deprecated protocol, root level route (should be ignored)', () => {
    const input = { type: 'postback', payload: '__PATH_PAYLOAD__initial/2' }
    const session = {}
    const lastRoutePath = ''
    expect(router.processInput(input, session, lastRoutePath).action).toBe(
      'Flow1.2'
    )
  })
  test.skip('old protocol:path payload input with deprecated protocol, 2nd level route (should be ignored)', () => {
    const input = { type: 'postback', payload: '__PATH_PAYLOAD__initial/2' }
    const session = {}
    const lastRoutePath = 'initial'
    expect(router.processInput(input, session, lastRoutePath).action).toBe(
      'Flow1.2'
    )
  })
})
