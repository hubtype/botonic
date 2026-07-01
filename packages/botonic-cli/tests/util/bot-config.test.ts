import { jest } from '@jest/globals'
import { BotConfig } from '../../src/util/bot-config.js'

describe('BotConfig.loadBotConfig', () => {
  let botConfig: BotConfig

  beforeEach(() => {
    jest.clearAllMocks()
    botConfig = new BotConfig()
    jest.spyOn(botConfig as any, 'deleteBotConfig').mockResolvedValue(undefined)
  })

  it('returns variables: [] when bot config has no variables field', async () => {
    jest.spyOn(botConfig as any, 'getBotConfig').mockResolvedValue({
      tools: [],
      payloads: [],
      webviews: [],
    })

    const result = await botConfig.loadBotConfig('/any')

    expect(result.variables).toEqual([])
  })

  it('returns variables: [] when bot config has variables: undefined', async () => {
    jest.spyOn(botConfig as any, 'getBotConfig').mockResolvedValue({
      tools: [],
      payloads: [],
      webviews: [],
      variables: undefined,
    })

    const result = await botConfig.loadBotConfig('/any')

    expect(result.variables).toEqual([])
  })

  it('returns declared variables intact when present', async () => {
    const variables = [
      { key_path: 'session.user.locale', type: 'string' as const },
      {
        key_path: 'session.user.extra_data.isPremium',
        type: 'boolean' as const,
      },
      { key_path: 'session.user.extra_data.score', type: 'number' as const },
    ]
    jest.spyOn(botConfig as any, 'getBotConfig').mockResolvedValue({
      tools: [],
      payloads: [],
      webviews: [],
      variables,
    })

    const result = await botConfig.loadBotConfig('/any')

    expect(result.variables[0].key_path).toEqual('session.user.locale')
    expect(result.variables[0].type).toEqual('string')
    expect(result.variables[1].key_path).toEqual(
      'session.user.extra_data.isPremium'
    )
    expect(result.variables[1].type).toEqual('boolean')
    expect(result.variables[2].key_path).toEqual(
      'session.user.extra_data.score'
    )
    expect(result.variables[2].type).toEqual('number')
  })

  it('returns variables: [] when loadBotConfig throws', async () => {
    jest
      .spyOn(botConfig as any, 'getBotConfig')
      .mockRejectedValue(new Error('dist/bot-config.js not found'))

    const result = await botConfig.loadBotConfig('/any')

    expect(result.variables).toEqual([])
  })
})
