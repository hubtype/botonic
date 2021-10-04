// @ts-nocheck
import { PROVIDER } from '../../src/index'
import { Router } from '../../src/router'

const testSession = () => ({
  user: { id: 'userid', provider: PROVIDER.DEV },
  bot: { id: 'bot_id' },
  is_first_interaction: true,
})

const redirectRoutes = [
  {
    path: 'redirectToChildRoute',
    text: 'redirectToChildRoute',
    redirect: 'initial/3/2',
  },
  {
    path: 'redirectToDefaultAction',
    text: 'redirectToDefaultAction',
    redirect: 'initial/2',
  },
  {
    path: 'redirectToDefaultActionChildRoute',
    text: 'redirectToDefaultActionChildRoute',
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
          // { path: '', action: 'EmptyAction' },
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

const retryDefaultActionRoutes = [
  {
    path: 'retryFlowDA',
    payload: 'final',
    retry: 1,
    childRoutes: [
      { path: '', action: 'RetryFlowDefaultAction' },
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

const routesWithDefaultActionRetries = [
  ...defaultRoutes,
  ...retryDefaultActionRoutes,
  ...fallbackRoutes,
  notFoundRoute,
]

describe('Retries (in childRoutes)', () => {
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

describe('Retries (in childRoutes, ignoreRetry)', () => {
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

describe('Retries (in default action)', () => {
  let retriesSession
  beforeEach(() => {
    retriesSession = testSession()
  })
  afterEach(() => {
    retriesSession = null
  })
  const router = new Router(routesWithDefaultActionRetries)

  it('Test retry action in retryRoutes (with default action)', () => {
    expect(
      router.processInput(
        { type: 'postback', payload: 'final' },
        testSession(),
        'final'
      )
    ).toEqual({
      action: null,
      emptyAction: 'RetryFlowDefaultAction',
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
      emptyAction: 'RetryFlowDefaultAction',
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

describe('Retries', () => {
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

describe('Redirects', () => {
  const router = new Router(routesWithRedirects)
  it('should redirect to default action', () => {
    expect(
      router.processInput(
        { type: 'text', text: 'redirectToDefaultAction' },
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
  it('should redirect to default action child route', () => {
    expect(
      router.processInput(
        { type: 'text', text: 'redirectToDefaultActionChildRoute' },
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
describe('Accesses in Flow1.3', () => {
  const router = new Router(routes)
  it('1. Flow1.3 Payload', () => {
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
  it('2. Flow1.3 Unexisting Payload', () => {
    expect(
      router.processInput(
        { type: 'postback', payload: 'wont-match' },
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
  it('3. Flow1.3 (childRoutes)', () => {
    expect(
      router.processInput(
        { type: 'postback', payload: '1' },
        testSession(),
        'initial/3'
      )
    ).toEqual({
      action: 'Flow1.3.1',
      emptyAction: null,
      fallbackAction: null,
      lastRoutePath: 'initial/3/1',
      params: {},
    })
    expect(
      router.processInput(
        { type: 'postback', payload: '2' },
        testSession(),
        'initial/3'
      )
    ).toEqual({
      action: 'Flow1.3.2',
      emptyAction: null,
      fallbackAction: null,
      lastRoutePath: 'initial/3/2',
      params: {},
    })
    expect(
      router.processInput(
        { type: 'postback', payload: '3' },
        testSession(),
        'initial/3'
      )
    ).toEqual({
      action: 'Flow1.3.3',
      emptyAction: null,
      fallbackAction: null,
      lastRoutePath: 'initial/3/3',
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
          { type: 'postback', payload: '__PATH_PAYLOAD__1' },
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
          { type: 'postback', payload: '__PATH_PAYLOAD__initial/1/1' },
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
          { type: 'postback', payload: '__PATH_PAYLOAD__unexisting' },
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
          { type: 'postback', payload: '__PATH_PAYLOAD__child' },
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
          { type: 'postback', payload: '__PATH_PAYLOAD__initial/2/child' },
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
        { type: 'postback', payload: '__PATH_PAYLOAD__unexisting' },
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
          { type: 'postback', payload: '__PATH_PAYLOAD__1' },
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
            payload: '__PATH_PAYLOAD__initial/1',
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
          { type: 'postback', payload: '__PATH_PAYLOAD__2' },
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
          { type: 'postback', payload: '__PATH_PAYLOAD__initial/2' },
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
          { type: 'postback', payload: '__PATH_PAYLOAD__3' },
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
          { type: 'postback', payload: '__PATH_PAYLOAD__initial/3' },
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
          { type: 'postback', payload: '__PATH_PAYLOAD__help' },
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
          { type: 'postback', payload: '__PATH_PAYLOAD__unexisting' },
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
            payload: '__PATH_PAYLOAD__2/child',
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
            payload: '__PATH_PAYLOAD__initial/2/child',
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
          { type: 'postback', payload: '__PATH_PAYLOAD__initial' },
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
          { type: 'postback', payload: '__PATH_PAYLOAD__initial' },
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
          { type: 'postback', payload: '__PATH_PAYLOAD__help' },
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
          { type: 'postback', payload: '__PATH_PAYLOAD__help' },
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
          { type: 'postback', payload: '__PATH_PAYLOAD__404' },
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
          { type: 'postback', payload: '__PATH_PAYLOAD__404' },
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
            payload: '__PATH_PAYLOAD__initial',
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
          { type: 'postback', payload: '__PATH_PAYLOAD__help' },
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
          { type: 'postback', payload: '__PATH_PAYLOAD__404' },
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
