import { INPUT, InputType } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowBuilderAction, FlowText } from '../src'
import { ProcessEnvNodeEnvs } from '../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockSmartIntent } from './__mocks__/smart-intent'
import { basicFlow } from './helpers/flows/basic'
import {
  createFlowBuilderPlugin,
  createRequest,
  getActionRequest,
} from './helpers/utils'

describe('FlowBuilderAction.executeConversationStart', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => mockSmartIntent('add_a_bag'))

  test.each([
    {
      firstMessage: 'Welcome message',
      isFirstInteraction: true,
    },
    {
      firstMessage: 'Welcome back',
      isFirstInteraction: false,
    },
  ])(
    'executeConversationStart adds match of keywords or smart intents after contents connected to start node in all interactions',
    async ({ firstMessage, isFirstInteraction }) => {
      const flowBuilderPlugin = createFlowBuilderPlugin({ flow: basicFlow })
      const requestArgs = {
        input: { data: 'Hello', type: INPUT.TEXT as InputType },
        isFirstInteraction,
      }
      const request = createRequest({
        ...requestArgs,
        plugins: {
          // @ts-ignore
          flowBuilderPlugin,
        },
      })
      await flowBuilderPlugin.pre(request)
      const actionRequest = getActionRequest(request)
      const { contents } =
        await FlowBuilderAction.executeConversationStart(actionRequest)

      expect((contents[1] as FlowText).text).toBe(firstMessage)
      expect(contents.length).toBe(4)
      expect((contents[3] as FlowText).text).toBe(
        'Message explaining how to add a bag'
      )
    }
  )
})
