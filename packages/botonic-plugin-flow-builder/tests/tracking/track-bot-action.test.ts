import { EventAction, INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowBotAction, FlowText } from '../../src/content-fields/index'
import { ProcessEnvNodeEnvs } from '../../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { trackEventMock } from '../__mocks__/track-event'
import { botActionFlow } from '../helpers/flows/bot-action'
import { createFlowBuilderPluginAndGetContents } from '../helpers/utils'

describe('Track bot action', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    trackEventMock.mockClear()
  })

  test('should track bot action', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: botActionFlow, trackEvent: trackEventMock },
      requestArgs: {
        isFirstInteraction: true,
        input: {
          type: INPUT.TEXT,
          data: 'Hello',
        },
      },
    })

    expect(contents[0]).toBeInstanceOf(FlowText)
    expect(contents[1]).toBeInstanceOf(FlowBotAction)

    expect((contents[0] as FlowText).text).toEqual('Welcome')

    expect(trackEventMock).toHaveBeenCalledTimes(2)
    expect(trackEventMock).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      EventAction.BotAction,
      {
        flowId: '8d527e7d-ea6d-5422-b810-5b4c8be7657b',
        flowName: 'Main',
        flowNodeContentId: 'BOT_ACTION',
        flowNodeId: '019ab4fb-96a1-75fb-83ff-84e9d82eed4b',
        flowNodeIsMeaningful: false,
        flowThreadId: expect.anything(),
        payload: 'WELCOME_PAYLOAD|{}',
      }
    )
  })
})
