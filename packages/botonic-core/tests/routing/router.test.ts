// @ts-nocheck
import type { Session } from '../../src'
import {
  getComputedRoutes,
  NoMatchingRouteError,
  Router,
} from '../../src/routing'
import { createPathPayload, testSession } from '../helpers/routing'

const textInput = { type: 'text', text: 'hi' }

describe('TEST: Bad router initialization', () => {
  it('empty routes throw TypeError', () => {
    const router = new Router([])
    expect(() => router.processInput(textInput, testSession())).toThrow(
      NoMatchingRouteError
    )
  })
  it('null routes throw TypeError', () => {
    // @ts-expect-error
    const router = new Router()
    expect(() => router.processInput(textInput, testSession())).toThrow(
      TypeError
    )
  })
})

const notFoundRoute = { path: '404', action: '404Action' }

describe('TEST: Router initialization with default 404 route', () => {
  it('Router returns 404', () => {
    const router = new Router([notFoundRoute])
    const { fallbackAction } = router.processInput(textInput, testSession())
    expect(fallbackAction).toBe('404Action')
  })
})

const fallbackRoutes = [
  { path: 'help', payload: 'help', action: 'Help', ignoreRetry: true },
  { path: 'insult', text: 'fuck', action: 'Insult' },
]

const externalRoutes = [
  { path: '', action: 'Flow1.2.emptyAction' },
  { path: 'child', text: 'child', action: 'ChildAction' },
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
        childRoutes: externalRoutes,
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

const routes = [...defaultRoutes, ...fallbackRoutes, notFoundRoute]

describe('TEST: Root Level Accesses (lastRoutePath is null)', () => {
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

describe('TEST: Root Level Accesses (lastRoutePath is not null)', () => {
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

describe('TEST: 1st Level Accesses (lastRoutePath=initial)', () => {
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

describe('TEST: 2nd Level Accesses (lastRoutePath=initial/1)', () => {
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

describe('TEST: 2nd Level Accesses (lastRoutePath=initial/2)', () => {
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

const routesWithRedirects = [
  ...defaultRoutes,
  ...redirectRoutes,
  ...fallbackRoutes,
  notFoundRoute,
]

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

const routesWithRetries = [
  ...defaultRoutes,
  ...retryRoutes,
  ...fallbackRoutes,
  notFoundRoute,
]

describe('TEST: Retries', () => {
  let retriesSession: Session | null
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
    expect(retriesSession.__retries).toEqual(0)
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
    expect(retriesSession.__retries).toEqual(0)
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
const routesWithEmptyActionRetries = [
  ...defaultRoutes,
  ...retryEmptyActionRoutes,
  ...fallbackRoutes,
  notFoundRoute,
]

describe('TEST: Retries (with empty action)', () => {
  let retriesSession: Session | null
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
    expect(retriesSession.__retries).toEqual(0)
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

describe('TEST: Retries (in childRoutes)', () => {
  const retriesSession = testSession()
  const router = new Router(routes)
  it('Test retry flow in childRoutes (3 mistakes, 1 goes to a fallback action which does not break flow)', () => {
    expect(retriesSession.__retries).toEqual(0)
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
    expect(retriesSession.__retries).toEqual(0)
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
    const computedRoutes = await getComputedRoutes(functionalRoutes)
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
    const computedRoutes = await getComputedRoutes(functionalRoutes)
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
