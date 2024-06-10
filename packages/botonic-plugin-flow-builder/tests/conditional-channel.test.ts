import { INPUT, PROVIDER, ProviderType } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowText } from '../src/index'
import { ProcessEnvNodeEnvs } from '../src/types'
import { basicFlow } from './helpers/flows/basic'
import {
  createFlowBuilderPlugin,
  createRequest,
  getContentsAfterPreAndBotonicInit,
} from './helpers/utils'

describe('Check the contents returned by the plugin after conditional channel node', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION
  const flowBuilderPlugin = createFlowBuilderPlugin({ flow: basicFlow })

  test.each([
    [PROVIDER.WHATSAPP, 'Message only for WhatsApp'],
    [PROVIDER.TELEGRAM, 'Message only for Telegram'],
    [PROVIDER.WEBCHAT, 'Message for other channels'],
  ])(
    'The content of the channel %s is displayed',
    async (provider: PROVIDER, messageExpected: string) => {
      const request = createRequest({
        input: { data: 'channelConditional', type: INPUT.TEXT },
        plugins: {
          // @ts-ignore
          flowBuilderPlugin,
        },
        provider: provider as ProviderType,
      })

      const { contents } = await getContentsAfterPreAndBotonicInit(
        request,
        flowBuilderPlugin
      )

      expect((contents[0] as FlowText).text).toBe(messageExpected)
    }
  )
})
