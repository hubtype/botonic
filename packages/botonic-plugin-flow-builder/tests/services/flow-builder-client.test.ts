import type { BotContext } from '@botonic/core'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals'
import axios from 'axios'

import { HUBTYPE_API_URL } from '../../src/constants'
import { FlowBuilderClient } from '../../src/services/flow-builder-client'
import { FlowBuilderJSONVersion } from '../../src/types'
import {
  BotonicPluginFlowBuilder,
  createServiceClientBotContext,
} from '../helpers/service-client-test-context'

jest.mock('axios')
const axiosGetMock = axios.get as jest.MockedFunction<typeof axios.get>

describe('FlowBuilderClient', () => {
  const hubtypeApi = 'https://api.test.hubtype.com'
  const botId = 'flow-bot-1'

  beforeEach(() => {
    axiosGetMock.mockReset()
  })

  test('getFlow uses plugin jsonVersion when not test integration', async () => {
    const plugin = new BotonicPluginFlowBuilder()
    plugin.jsonVersion = FlowBuilderJSONVersion.LATEST
    axiosGetMock.mockResolvedValue({ data: { flows: [] } })

    const botContext = createServiceClientBotContext({
      hubtypeApi,
      botId,
      flowBuilderPlugin: plugin,
    }) as BotContext
    const client = new FlowBuilderClient(botContext)
    await client.getFlow()

    expect(axiosGetMock).toHaveBeenCalledWith(
      `${hubtypeApi}/v1/bot_flows/${botId}/versions/${FlowBuilderJSONVersion.LATEST}/`,
      { headers: { Authorization: 'Bearer test-access-token' } }
    )
  })

  test('getFlow uses draft version when session is test integration', async () => {
    const plugin = new BotonicPluginFlowBuilder()
    plugin.jsonVersion = FlowBuilderJSONVersion.LATEST
    axiosGetMock.mockResolvedValue({ data: { flows: [] } })

    const botContext = createServiceClientBotContext({
      hubtypeApi,
      botId,
      flowBuilderPlugin: plugin,
      isTestIntegration: true,
    }) as BotContext
    const client = new FlowBuilderClient(botContext)
    await client.getFlow()

    expect(axiosGetMock).toHaveBeenCalledWith(
      `${hubtypeApi}/v1/bot_flows/${botId}/versions/${FlowBuilderJSONVersion.DRAFT}/`,
      { headers: { Authorization: 'Bearer test-access-token' } }
    )
  })

  test('updateSessionWithUserInfo mutates session from response', async () => {
    const plugin = new BotonicPluginFlowBuilder()
    axiosGetMock.mockResolvedValue({
      data: {
        organization_id: 'org-from-api',
        bot_id: 'bot-from-api',
      },
    })
    const logSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => undefined)

    const botContext = createServiceClientBotContext({
      hubtypeApi,
      botId: 'before-bot',
      flowBuilderPlugin: plugin,
    }) as BotContext
    const client = new FlowBuilderClient(botContext)

    await client.updateSessionWithUserInfo()

    expect(axiosGetMock).toHaveBeenCalledWith(
      `${hubtypeApi}/v1/flow_builder/user_info/`,
      { headers: { Authorization: 'Bearer test-access-token' } }
    )
    expect(botContext.session.organization_id).toBe('org-from-api')
    expect(botContext.session.bot.id).toBe('bot-from-api')
    expect(logSpy).toHaveBeenCalledWith(
      'updateSessionWithUserInfo:',
      'before-bot'
    )
    logSpy.mockRestore()
  })

  test('getFlow uses HUBTYPE_API_URL when settings omit hubtype API', async () => {
    axiosGetMock.mockResolvedValue({ data: { flows: [] } })
    const botContext = createServiceClientBotContext({
      botId,
    }) as BotContext
    const client = new FlowBuilderClient(botContext)
    await client.getFlow()

    expect(axiosGetMock).toHaveBeenCalledWith(
      `${HUBTYPE_API_URL}/v1/bot_flows/${botId}/versions/${FlowBuilderJSONVersion.LATEST}/`,
      { headers: { Authorization: 'Bearer test-access-token' } }
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
})
