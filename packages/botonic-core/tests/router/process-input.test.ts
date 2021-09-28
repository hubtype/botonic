// @ts-nocheck
import { PROVIDER } from '../../src/index'
import { Router } from '../../src/router'

const testSession = {
  user: { id: 'userid', provider: PROVIDER.DEV },
  bot: { id: 'bot_id' },
  is_first_interaction: true,
}

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

const defaultRoutes = [
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
          { path: 'fallback', text: /.*/, action: 'ChildRouteFallback' },
        ],
      },
      {
        path: '2',
        payload: '2',
        childRoutes: [
          // External Routes
          { path: '', action: 'Flow1.2' },
          { path: 'child', action: 'ChildAction' },
        ],
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
]

const retryRoutes = [
  {
    path: 'final',
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

const routes = [...defaultRoutes, notFoundRoute]
const routesWithRedirects = [...defaultRoutes, ...redirectRoutes, notFoundRoute]
const routesWithRetries = [...defaultRoutes, ...retryRoutes, notFoundRoute]

describe('Retries', () => {
  let retriesSession
  beforeEach(() => {
    retriesSession = testSession
  })
  afterEach(() => {
    retriesSession = null
  })
  const router = new Router(routesWithRetries)

  it('Test retry action in retryRoutes', () => {
    expect(
      router.newprocessInput(
        { type: 'postback', payload: 'final' },
        testSession,
        null
      )
    ).toEqual({
      action: 'RetryFlow',
      params: undefined,
      lastRoutePath: 'final',
    })
  })
  it('Test retry flow in retryRoutes (2 mistakes)', () => {
    expect(retriesSession.__retries).toEqual(0)
    expect(
      router.newprocessInput(
        { type: 'postback', payload: 'kk' },
        retriesSession,
        'final'
      )
    ).toEqual({
      action: 'RetryFlow',
      params: undefined,
      lastRoutePath: 'final',
    })
    expect(retriesSession.__retries).toEqual(1)
    expect(
      router.newprocessInput(
        { type: 'postback', payload: 'kk' },
        retriesSession,
        'final'
      )
    ).toEqual({
      action: 'RetryFlow',
      params: undefined,
      lastRoutePath: 'final',
    })
    expect(retriesSession.__retries).toEqual(2)
    expect(
      router.newprocessInput(
        { type: 'postback', payload: 'kk' },
        retriesSession,
        'final'
      )
    ).toEqual({
      action: '404Action',
      params: undefined,
      lastRoutePath: null,
    })
    expect(retriesSession.__retries).toEqual(0)
  })
  it('Test retry flow in retryRoutes (with success)', () => {
    expect(retriesSession.__retries).toEqual(0)
    expect(
      router.newprocessInput(
        { type: 'postback', payload: 'kk' },
        retriesSession,
        'final'
      )
    ).toEqual({
      action: 'RetryFlow',
      params: undefined,
      lastRoutePath: 'final',
    })
    expect(retriesSession.__retries).toEqual(1)
    expect(
      router.newprocessInput(
        { type: 'postback', payload: '1' },
        retriesSession,
        'final'
      )
    ).toEqual({
      action: 'FlowFinal1',
      params: undefined,
      lastRoutePath: 'final/1',
    })
    expect(retriesSession.__retries).toEqual(0)
  })
})

describe('Redirects', () => {
  const router = new Router(routesWithRedirects)
  it('should redirect to default action', () => {
    expect(
      router.newprocessInput(
        { type: 'text', text: 'redirectToDefaultAction' },
        testSession,
        null
      )
    ).toEqual({
      action: 'Flow1.2',
      params: undefined,
      lastRoutePath: 'initial/2',
    })
  })
  it('should redirect to default action child route', () => {
    expect(
      router.newprocessInput(
        { type: 'text', text: 'redirectToDefaultActionChildRoute' },
        testSession,
        null
      )
    ).toEqual({
      action: 'ChildAction',
      params: undefined,
      lastRoutePath: 'initial/2/child',
    })
  })
  it('should redirect', () => {
    expect(
      router.newprocessInput(
        { type: 'text', text: 'redirectToChildRoute' },
        testSession,
        null
      )
    ).toEqual({
      action: 'Flow1.3.2',
      params: undefined,
      lastRoutePath: 'initial/3/2',
    })
  })
  it('redirect is not found', () => {
    expect(
      router.newprocessInput(
        { type: 'text', text: 'wontBeResolved' },
        testSession,
        null
      )
    ).toEqual({
      action: '404Action',
      params: undefined,
      lastRoutePath: null,
    })
  })
})
describe('Accesses in Flow1.3', () => {
  const router = new Router(routes)
  it('1. Flow1.3 Payload', () => {
    expect(
      router.newprocessInput(
        { type: 'postback', payload: '3' },
        testSession,
        'initial'
      )
    ).toEqual({
      action: 'Flow1.3',
      lastRoutePath: 'initial/3',
      params: undefined,
    })
  })
  it('2. Flow1.3 Unexisting Payload', () => {
    expect(
      router.newprocessInput(
        { type: 'postback', payload: 'wont-match' },
        testSession,
        'initial'
      )
    ).toEqual({ action: '404Action', lastRoutePath: null, params: undefined })
  })
  it('3. Flow1.3 (childRoutes)', () => {
    expect(
      router.newprocessInput(
        { type: 'postback', payload: '1' },
        testSession,
        'initial/3'
      )
    ).toEqual({
      action: 'Flow1.3.1',
      lastRoutePath: 'initial/3/1',
      params: undefined,
    })
    expect(
      router.newprocessInput(
        { type: 'postback', payload: '2' },
        testSession,
        'initial/3'
      )
    ).toEqual({
      action: 'Flow1.3.2',
      lastRoutePath: 'initial/3/2',
      params: undefined,
    })
    expect(
      router.newprocessInput(
        { type: 'postback', payload: '3' },
        testSession,
        'initial/3'
      )
    ).toEqual({
      action: 'Flow1.3.3',
      lastRoutePath: 'initial/3/3',
      params: undefined,
    })
  })
})
describe('Accesses to routes (1st level, lastRoutePath=initial)', () => {
  const router = new Router(routes)
  const processInputLRPInitial = input =>
    router.newprocessInput(input, testSession, 'initial')
  it('1. should access subflows', () => {
    expect(
      processInputLRPInitial({ type: 'postback', payload: '__PATH_PAYLOAD__1' })
    ).toEqual({
      action: 'Flow1.1',
      params: undefined,
      lastRoutePath: 'initial/1',
    })
  })
  it('1.1. should access subflows', () => {
    expect(
      router.newprocessInput(
        { type: 'text', payload: 'whatever' },
        testSession,
        'initial/1'
      )
    ).toEqual({
      action: 'ChildRouteFallback',
      params: undefined,
      lastRoutePath: 'initial/1/fallback',
    })
  })
  it('2. should access subflows', () => {
    expect(
      processInputLRPInitial({
        type: 'postback',
        payload: '__PATH_PAYLOAD__initial/1',
      })
    ).toEqual({
      action: 'Flow1.1',
      params: undefined,
      lastRoutePath: 'initial/1',
    })
  })
  it('3. should access subflows', () => {
    expect(processInputLRPInitial({ type: 'postback', payload: '1' })).toEqual({
      action: 'Flow1.1',
      params: undefined,
      lastRoutePath: 'initial/1',
    })
  })
  it('4. should access subflows (modularized childRoutes)', () => {
    expect(processInputLRPInitial({ type: 'postback', payload: '2' })).toEqual({
      action: 'Flow1.2',
      lastRoutePath: 'initial/2',
      params: undefined,
    })
    expect(
      processInputLRPInitial({ type: 'postback', payload: '__PATH_PAYLOAD__2' })
    ).toEqual({
      action: 'Flow1.2',
      lastRoutePath: 'initial/2',
      params: undefined,
    })
    expect(
      processInputLRPInitial({ type: 'postback', payload: '__PATH_PAYLOAD__2' })
    ).toEqual({
      action: 'Flow1.2',
      lastRoutePath: 'initial/2',
      params: undefined,
    })
    expect(
      processInputLRPInitial({
        type: 'postback',
        payload: '__PATH_PAYLOAD__initial/2/child',
      })
    ).toEqual({
      action: 'ChildAction',
      lastRoutePath: 'initial/2/child',
      params: undefined,
    })
    expect(
      processInputLRPInitial({
        type: 'postback',
        payload: '__PATH_PAYLOAD__2/child',
      })
    ).toEqual({
      action: 'ChildAction',
      lastRoutePath: 'initial/2/child',
      params: undefined,
    })
  })
  it('mistake on subflow', () => {
    expect(
      router.newprocessInput(
        { type: 'postback', payload: 'mistake' },
        testSession,
        'initial/2'
      )
    ).toEqual({
      action: '404Action',
      lastRoutePath: null,
      params: undefined,
    })
  })
  it('5. should access subflows', () => {
    expect(processInputLRPInitial({ type: 'postback', payload: '3' })).toEqual({
      action: 'Flow1.3',
      params: undefined,
      lastRoutePath: 'initial/3',
    })
    expect(
      processInputLRPInitial({ type: 'postback', payload: '__PATH_PAYLOAD__3' })
    ).toEqual({
      action: 'Flow1.3',
      params: undefined,
      lastRoutePath: 'initial/3',
    })
  })
})

describe('All routes accessible from 1st level routes', () => {
  const router = new Router(routes)
  it('0. all routes accessible from 1st level routes', () => {
    expect(
      router.newprocessInput(
        { type: 'postback', payload: 'help' },
        testSession,
        'initial'
      )
    ).toEqual({ action: 'Help', lastRoutePath: 'help', params: undefined })
  })
  it('1. all routes accessible from 1st level routes', () => {
    expect(
      router.newprocessInput(
        { type: 'postback', payload: '__PATH_PAYLOAD__help' },
        testSession,
        'initial'
      )
    ).toEqual({ action: 'Help', lastRoutePath: 'help', params: undefined })
  })

  it('2. all routes accessible from 1st level routes', () => {
    expect(
      router.newprocessInput(
        { type: 'text', text: 'hi', intent: 'greeting' },
        testSession,
        'initial'
      )
    ).toEqual({
      action: 'Flow1',
      lastRoutePath: 'initial',
      params: undefined,
    })
  })

  it('3. all routes accessible from 1st level routes', () => {
    expect(
      router.newprocessInput(
        { type: 'text', text: 'hi', intent: 'greeting' },
        testSession,
        'help'
      )
    ).toEqual({
      action: 'Flow1',
      lastRoutePath: 'initial',
      params: undefined,
    })
  })

  it('4. all routes accessible from 1st level routes', () => {
    expect(
      router.newprocessInput(
        { type: 'postback', payload: '__PATH_PAYLOAD__initial' },
        testSession,
        'help'
      )
    ).toEqual({
      action: 'Flow1',
      lastRoutePath: 'initial',
      params: undefined,
    })
  })

  it('5. all routes accessible from 1st level routes', () => {
    expect(
      router.newprocessInput(
        { type: 'postback', payload: 'kk' },
        testSession,
        'initial'
      )
    ).toEqual({
      action: '404Action',
      lastRoutePath: null,
      params: undefined,
    })
  })

  it('6. all routes accessible from 1st level routes', () => {
    expect(
      router.newprocessInput(
        { type: 'postback', payload: 'kk' },
        testSession,
        'help'
      )
    ).toEqual({
      action: '404Action',
      lastRoutePath: null,
      params: undefined,
    })
  })

  it('7. all routes accessible from 1st level routes', () => {
    expect(
      router.newprocessInput(
        { type: 'postback', payload: '__PATH_PAYLOAD__404' },
        testSession,
        'initial'
      )
    ).toEqual({
      action: '404Action',
      lastRoutePath: null,
      params: undefined,
    })
  })

  it('8. all routes accessible from 1st level routes', () => {
    expect(
      router.newprocessInput(
        { type: 'postback', payload: '__PATH_PAYLOAD__404' },
        testSession,
        'help'
      )
    ).toEqual({
      action: '404Action',
      lastRoutePath: null,
      params: undefined,
    })
  })
})

describe('Accesses to routes (root level)', () => {
  const router = new Router(routes)
  const processInputNoLRP = input =>
    router.newprocessInput(input, testSession, null)

  it('should retrieve routes at root level (help path)', () => {
    expect(processInputNoLRP({ type: 'postback', payload: 'help' })).toEqual({
      action: 'Help',
      lastRoutePath: 'help',
      params: undefined,
    })
    expect(
      processInputNoLRP({ type: 'postback', payload: '__PATH_PAYLOAD__help' })
    ).toEqual({
      action: 'Help',
      lastRoutePath: 'help',
      params: undefined,
    })
  })
  it('should retrieve routes at root level (initial path)', () => {
    const finalResult = {
      action: 'Flow1',
      lastRoutePath: 'initial',
      params: undefined,
    }
    expect(
      processInputNoLRP({ type: 'text', text: 'hi', intent: 'greeting' })
    ).toEqual(finalResult)
    expect(
      processInputNoLRP({
        type: 'postback',
        payload: '__PATH_PAYLOAD__initial',
      })
    ).toEqual(finalResult)
  })
  it('should retrieve routes at root level (404 path)', () => {
    expect(processInputNoLRP({ type: 'text', text: 'not_found' })).toEqual({
      action: '404Action',
      lastRoutePath: null,
      params: undefined,
    })
  })
  it('should retrieve routes at root level (404 path payload)', () => {
    expect(
      processInputNoLRP({ type: 'postback', payload: '__PATH_PAYLOAD__404' })
    ).toEqual({
      action: '404Action',
      lastRoutePath: null,
      params: undefined,
    })
  })
})
