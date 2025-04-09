// @ts-nocheck
import { BotonicAction } from '../../src/models'
import {
  COUNTRY_GB,
  createSessionWithUser,
  developerLocales,
  developerRoutes,
  initCoreBotWithDeveloperConfig,
  LOCALE_EN,
  SYSTEM_LOCALE_EN_GB,
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

  it('setUserLocale to define user.locale in session', () => {
    // Arrange
    const coreBot = initCoreBotWithDeveloperConfig()
    const session = createSessionWithUser()

    // Act
    coreBot.setUserLocale(LOCALE_EN, session)

    // Assert
    expect(session.user.locale).toEqual(LOCALE_EN)
  })

  it('setUserCountry to define user.country in session', () => {
    // Arrange
    const coreBot = initCoreBotWithDeveloperConfig()
    const session = createSessionWithUser()

    // Act
    coreBot.setUserCountry(COUNTRY_GB, session)

    // Assert
    expect(session.user.country).toEqual(COUNTRY_GB)
  })

  it('setSystemLocale to define user.system_locale in session', () => {
    // Arrange
    const coreBot = initCoreBotWithDeveloperConfig()
    const session = createSessionWithUser()

    // Act
    coreBot.setSystemLocale(SYSTEM_LOCALE_EN_GB, session)

    // Assert
    expect(session.user.system_locale).toEqual(SYSTEM_LOCALE_EN_GB)
  })

  it('getString to return expected locale', () => {
    // Arrange
    const coreBot = initCoreBotWithDeveloperConfig()
    const session = { user: { system_locale: LOCALE_EN } }

    // Act
    const resolvedLocaleText = coreBot.getString('text1', session)

    // Assert
    expect(coreBot.locales.en.text1).toContain(resolvedLocaleText)
  })

  it('input processes a chatevent (e.g: sent when enduser is typing', async () => {
    // Arrange
    const coreBot = initCoreBotWithDeveloperConfig()
    const session = createSessionWithUser()

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
      session: {
        user: {
          locale: LOCALE_EN,
          country: COUNTRY_GB,
          system_locale: LOCALE_EN,
        },
      },
    })
  })

  it('processes events if routes are defined as a function', async () => {
    // Arrange
    const coreBot = initCoreBotWithDeveloperConfig({
      routes: async () => developerRoutes,
    })
    const session = createSessionWithUser()

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
              __retries: 0,
              user: {
                locale: LOCALE_EN,
                country: COUNTRY_GB,
                system_locale: LOCALE_EN,
              },
              is_first_interaction: false,
            },
            setUserLocale: expect.any(Function),
            setUserCountry: expect.any(Function),
            setSystemLocale: expect.any(Function),
          },
        },
      ],
      session: {
        __retries: 0,
        user: {
          locale: LOCALE_EN,
          country: COUNTRY_GB,
          system_locale: LOCALE_EN,
        },
        is_first_interaction: false,
      },
    })
  })

  it('input returns a response', async () => {
    // Arrange
    const coreBot = initCoreBotWithDeveloperConfig()
    const args = {
      input: { type: 'text', data: 'hello' },
      session: createSessionWithUser({
        is_first_interaction: true,
      }),
      lastRoutePath: '',
    }

    // Act
    const botResponse = await coreBot.input(args)

    // Assert
    expect(botResponse).toBeDefined()
    expect(botResponse.input).toEqual({ type: 'text', data: 'hello' })
    expect(botResponse.session).toEqual({
      __retries: 0,
      user: {
        locale: LOCALE_EN,
        country: COUNTRY_GB,
        system_locale: LOCALE_EN,
      },
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
      session: {
        __retries: 0,
        user: {
          locale: LOCALE_EN,
          country: COUNTRY_GB,
          system_locale: LOCALE_EN,
        },
        is_first_interaction: false,
      },
      setUserLocale: expect.any(Function),
      setUserCountry: expect.any(Function),
      setSystemLocale: expect.any(Function),
    })
    expect(botResponse.response[0].actions).toEqual([null, 'Hi user!', null])
  })
})

it('input returns two actions when first return a _botonic_action redirect', async () => {
  // Arrange
  const session = createSessionWithUser({
    _botonic_action: `${BotonicAction.Redirect}:after-rating|'{"value:":5}'`,
  })

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

  // Assert
  expect(botResponse.input).toEqual({
    type: 'postback',
    data: undefined,
    payload: `after-rating|'{"value:":5}'`,
    text: undefined,
  })
  expect(botResponse.session).toEqual({
    _botonic_action: undefined,
    __retries: 0,
    is_first_interaction: false,
    user: {
      locale: LOCALE_EN,
      country: COUNTRY_GB,
      system_locale: LOCALE_EN,
    },
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
  const session = createSessionWithUser({
    _botonic_action: redirect,
  })

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

describe('updateSession', () => {
  it('When session arrives with only values in user.extra_data, user.country and user.locale are updated from user.extra_data', () => {
    // Arrange
    const coreBot = initCoreBotWithDeveloperConfig()
    const session = {
      user: {
        extra_data: {
          country: 'US',
          language: 'en',
        },
      },
    }

    // Act
    coreBot.updateSession(session)

    // Assert
    expect(session.user.country).toEqual('US')
    expect(session.user.locale).toEqual('en')
    expect(session.user.system_locale).toEqual('en')
  })

  it('Session arrives with user locale, country', () => {
    // Arrange
    const coreBot = initCoreBotWithDeveloperConfig()
    const session = {
      user: {
        locale: 'en',
        country: 'GB',
      },
    }

    // Act
    coreBot.updateSession(session)

    // Assert
    expect(session.user.country).toEqual('GB')
    expect(session.user.locale).toEqual('en')
    expect(session.user.system_locale).toEqual('en')
  })

  it('When session arrives with user locale, country, system_locale and extra_data with language and country, extra_data is ignored', () => {
    // Arrange
    const coreBot = initCoreBotWithDeveloperConfig()
    const session = {
      user: {
        locale: 'es-ES',
        country: 'ES',
        system_locale: 'es',
        extra_data: {
          language: 'en',
          country: 'GB',
        },
      },
    }

    // Act
    coreBot.updateSession(session)

    // Assert
    expect(session.user.country).toEqual('ES')
    expect(session.user.locale).toEqual('es-ES')
    expect(session.user.system_locale).toEqual('es')
  })
})
