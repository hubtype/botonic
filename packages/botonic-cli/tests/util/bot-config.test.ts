import { jest } from '@jest/globals'
import { BotConfig } from '../../src/util/bot-config.js'

describe('BotConfig.loadBotConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(BotConfig as any, 'deleteBotConfig').mockResolvedValue(undefined)
  })

  it('returns variables: [] when bot config has no variables field', async () => {
    jest.spyOn(BotConfig as any, 'getBotConfig').mockResolvedValue({
      tools: [],
      payloads: [],
      webviews: [],
    })

    const result = await BotConfig.loadBotConfig('/any')

    expect(result.variables).toEqual([])
  })

  it('returns variables: [] when bot config has variables: undefined', async () => {
    jest.spyOn(BotConfig as any, 'getBotConfig').mockResolvedValue({
      tools: [],
      payloads: [],
      webviews: [],
      variables: undefined,
    })

    const result = await BotConfig.loadBotConfig('/any')

    expect(result.variables).toEqual([])
  })

  it('returns declared variables intact when present', async () => {
    const variables = [
      { keyPath: 'session.user.locale', type: 'string' as const },
      {
        keyPath: 'session.user.extra_data.isPremium',
        type: 'boolean' as const,
      },
      { keyPath: 'session.user.extra_data.score' },
    ]
    jest.spyOn(BotConfig as any, 'getBotConfig').mockResolvedValue({
      tools: [],
      payloads: [],
      webviews: [],
      variables,
    })

    const result = await BotConfig.loadBotConfig('/any')

    expect(result.variables).toEqual(variables)
  })

  it('returns variables: [] when loadBotConfig throws', async () => {
    jest
      .spyOn(BotConfig as any, 'getBotConfig')
      .mockRejectedValue(new Error('dist/bot-config.js not found'))

    const result = await BotConfig.loadBotConfig('/any')

    expect(result.variables).toEqual([])
  })
})
