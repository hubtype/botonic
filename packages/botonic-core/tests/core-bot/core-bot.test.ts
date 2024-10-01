// @ts-nocheck
import { BotonicAction } from '../../src/models'
import {
  developerLocales,
  developerRoutes,
  initCoreBotWithDeveloperConfig,
  LOCALE_EN,
} from '../helpers/core-bot'

describe('CoreBot', () => {
  it('inits the class correctly with minimum required values', () => {
    // Arrange & Act
    const coreBot = initCoreBotWithDeveloperConfig()

    // Assert
    expect(coreBot).toBeDefined()
    expect(coreBot.renderer).toBeDefined()
    expect(coreBot.routes).toEqual(developerRoutes)
    expect(coreBot.locales).toEqual(developerLocales)
    expect(coreBot.defaultRoutes).toEqual([])
    expect(coreBot.router).toBeDefined()
    expect(coreBot.inspector).toBeDefined()
    expect(coreBot.defaultTyping).toEqual(0.6)
    expect(coreBot.defaultDelay).toEqual(0.4)
    expect(coreBot.appId).toBeUndefined()
    expect(coreBot.rootElement).toBeNull()
    expect(coreBot.plugins).toEqual({})
    expect(coreBot.theme).toEqual({})
  })

  it('inits the class correctly with minimum required values + appId', () => {
    // Arrange & Act
    const coreBot = initCoreBotWithDeveloperConfig({ appId: '1234' })

    // Assert
    expect(coreBot).toBeDefined()
    expect(coreBot.renderer).toBeDefined()
    expect(coreBot.routes).toEqual(developerRoutes)
    expect(coreBot.locales).toEqual(developerLocales)
    expect(coreBot.defaultRoutes).toEqual([])
    expect(coreBot.router).toBeDefined()
    expect(coreBot.inspector).toBeDefined()
    expect(coreBot.defaultTyping).toEqual(0.6)
    expect(coreBot.defaultDelay).toEqual(0.4)
    expect(coreBot.appId).toEqual('1234')
    expect(coreBot.rootElement).toBeNull()
    expect(coreBot.plugins).toEqual({})
    expect(coreBot.theme).toEqual({})
  })

  it('setLocale to define locale in session', () => {
    // Arrange
    const coreBot = initCoreBotWithDeveloperConfig()
    const session = {}

    // Act
    coreBot.setLocale(LOCALE_EN, session)

    // Assert
    expect(session).toEqual({ __locale: LOCALE_EN })
  })

  it('getString to return expected locale', () => {
    // Arrange
    const coreBot = initCoreBotWithDeveloperConfig()
    const session = { __locale: LOCALE_EN }

    // Act
    const resolvedLocaleText = coreBot.getString('text1', session)

    // Assert
    expect(coreBot.locales.en.text1).toContain(resolvedLocaleText)
  })

  it('input processes a chatevent (e.g: sent when enduser is typing', async () => {
    // Arrange
    const coreBot = initCoreBotWithDeveloperConfig()
    const session = {}

    // Act
    const botResponse = await coreBot.input({
      input: { type: 'chatevent', data: 'typing_on' },
      session,
      lastRoutePath: '',
    })

    // Assert
    expect(botResponse).toEqual({
      input: { data: 'typing_on', type: 'chatevent' },
      lastRoutePath: '',
      response: [],
      session: { __locale: 'en' },
    })
  })

  it('processes events if routes are defined as a function', async () => {
    // Arrange
    const coreBot = initCoreBotWithDeveloperConfig({
      routes: async () => developerRoutes,
    })
    const session = {}

    // Act
    const botResponse = await coreBot.input({
      input: { type: 'text', data: 'hello' },
      session,
      lastRoutePath: '',
    })

    // Assert
    expect(botResponse).toEqual({
      input: { data: 'hello', type: 'text' },
      lastRoutePath: '',
      response: [
        {
          actions: [null, 'Hi user!', null],
          request: {
            defaultDelay: 0.4,
            defaultTyping: 0.6,
            getString: expect.any(Function),
            input: { data: 'hello', type: 'text' },
            lastRoutePath: '',
            params: {},
            plugins: {},
            session: {
              __locale: 'en',
              __retries: 0,
              is_first_interaction: false,
            },
            setLocale: expect.any(Function),
          },
        },
      ],
      session: { __locale: 'en', __retries: 0, is_first_interaction: false },
    })
  })

  it('input returns a response', async () => {
    // Arrange
    const coreBot = initCoreBotWithDeveloperConfig()
    const args = {
      input: { type: 'text', data: 'hello' },
      session: { is_first_interaction: true },
      lastRoutePath: '',
    }

    // Act
    const botResponse = await coreBot.input(args)

    // Assert
    expect(botResponse).toBeDefined()
    expect(botResponse.input).toEqual({ type: 'text', data: 'hello' })
    expect(botResponse.session).toEqual({
      __locale: 'en',
      __retries: 0,
      is_first_interaction: false,
    })
    expect(botResponse.lastRoutePath).toEqual('')
    expect(botResponse.response[0]).toBeDefined()
    expect(botResponse.response[0].request).toEqual({
      defaultDelay: 0.4,
      defaultTyping: 0.6,
      getString: expect.any(Function),
      input: { data: 'hello', type: 'text' },
      lastRoutePath: '',
      params: {},
      plugins: {},
      session: { __locale: 'en', __retries: 0, is_first_interaction: false },
      setLocale: expect.any(Function),
    })
    expect(botResponse.response[0].actions).toEqual([null, 'Hi user!', null])
  })

  it('input returns a response if test integration without _botonic_action', async () => {
    // Arrange

    // Act
    const coreBot = initCoreBotWithDeveloperConfig()
    const botResponse = await coreBot.input({
      input: { type: 'text', data: 'hello' },
      session: {
        is_test_integration: true,
        _botonic_action: undefined,
      },
      lastRoutePath: '',
    })

    // Assert
    expect(botResponse).toBeDefined()
    expect(botResponse.input).toEqual({ type: 'text', data: 'hello' })
    expect(botResponse.session).toEqual({
      __locale: 'en',
      __retries: 0,
      is_first_interaction: false,
      is_test_integration: true,
      _botonic_action: undefined,
    })
    expect(botResponse.lastRoutePath).toEqual('')
    expect(botResponse.response[0]).toBeDefined()
    expect(botResponse.response[0].request).toEqual({
      defaultDelay: 0.4,
      defaultTyping: 0.6,
      getString: expect.any(Function),
      input: { data: 'hello', type: 'text' },
      lastRoutePath: '',
      params: {},
      plugins: {},
      session: {
        __locale: 'en',
        __retries: 0,
        is_first_interaction: false,
        is_test_integration: true,
        _botonic_action: undefined,
      },
      setLocale: expect.any(Function),
    })
    expect(botResponse.response[0].actions).toEqual([null, 'Hi user!', null])
  })
})

it('input returns the follow up when a handoff is done in a test integration', async () => {
  // Arrange
  const session = {
    is_test_integration: true,
    _botonic_action: `${BotonicAction.CreateTestCase}:payload1`,
  }

  const coreBot = initCoreBotWithDeveloperConfig({
    routes: [
      {
        path: '',
        text: 'hello',
        action: 'Hi user!',
      },
      {
        path: 'follow-up',
        payload: 'payload1',
        action: 'Follow up action',
      },
    ],
  })

  // Act
  const botResponse = await coreBot.input({
    input: { type: 'text', data: 'hello' },
    session,
    lastRoutePath: '',
  })

  // Assert
  expect(botResponse.input).toEqual({
    type: 'postback',
    data: undefined,
    payload: 'payload1',
    text: undefined,
  })
  expect(botResponse.session).toEqual({
    is_test_integration: true,
    _botonic_action: undefined,
    __locale: 'en',
    __retries: 0,
    is_first_interaction: false,
  })
  expect(botResponse.lastRoutePath).toEqual('follow-up')
  expect(botResponse.response[0].actions).toEqual([null, 'Hi user!', null])
  expect(botResponse.response[1].actions).toEqual([
    null,
    'Follow up action',
    null,
  ])
})

it('input returns two actions when first returen a _botonic_action redirect', async () => {
  // Arrange
  const session = {
    _botonic_action: `${BotonicAction.Redirect}:after-rating|'{"value:":5}'`,
  }

  const coreBot = initCoreBotWithDeveloperConfig({
    routes: [
      {
        path: 'rating-action',
        text: 'rating',
        action: 'Can you rate the agent?',
      },
      {
        path: 'after-rating-action',
        payload: /^after-rating.*/,
        action: 'Thanks for your rating',
      },
    ],
  })

  // Act
  const botResponse = await coreBot.input({
    input: { type: 'text', data: 'rating' },
    session,
    lastRoutePath: 'rating-action',
  })
  console.log({ botResponse })
  // Assert
  expect(botResponse.input).toEqual({
    type: 'postback',
    data: undefined,
    payload: `after-rating|'{"value:":5}'`,
    text: undefined,
  })
  expect(botResponse.session).toEqual({
    _botonic_action: undefined,
    __locale: 'en',
    __retries: 0,
    is_first_interaction: false,
  })
  expect(botResponse.lastRoutePath).toEqual('after-rating-action')
  expect(botResponse.response[0].actions).toEqual([
    null,
    'Can you rate the agent?',
    null,
  ])
  expect(botResponse.response[1].actions).toEqual([
    null,
    'Thanks for your rating',
    null,
  ])
})

it('core throws an error after maximum number of redirects are executed', async () => {
  const redirect = `${BotonicAction.Redirect}:after-rating|'{"value:":5}'`
  // Arrange
  const session = {
    _botonic_action: redirect,
  }

  const coreBot = initCoreBotWithDeveloperConfig({
    routes: request => {
      request.session._botonic_action = redirect
      return [
        {
          path: 'rating-action',
          text: 'rating',
          action: 'Can you rate the agent?',
        },
        {
          path: 'after-rating-action',
          payload: /^after-rating.*/,
          action: 'Thanks for your rating',
        },
      ]
    },
  })

  // Act
  const botResponse = coreBot.input({
    input: { type: 'text', data: 'rating' },
    session,
    lastRoutePath: 'rating-action',
  })

  // Assert
  await expect(botResponse).rejects.toThrow(
    'Maximum BotAction recursive calls reached (10)'
  )
})
