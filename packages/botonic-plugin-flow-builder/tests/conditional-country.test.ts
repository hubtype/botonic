import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowText } from '../src/index'
import { ProcessEnvNodeEnvs } from '../src/types'
import { basicFlow } from './helpers/flows/basic'
import {
  createFlowBuilderPlugin,
  createRequest,
  getContentsAfterPreAndBotonicInit,
} from './helpers/utils'

describe('Check the contents returned by the plugin after conditional country node', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION
  const flowBuilderPlugin = createFlowBuilderPlugin({ flow: basicFlow })

  test.each([
    ['ES', 'Message only for Spain'],
    ['FR', 'Message only for France'],
    ['GB', 'Message only for United Kingdom'],
    ['DE', 'Message for other countries'],
  ])(
    'The content of the country %s is displayed',
    async (countryISO: string, messageExpected: string) => {
      const request = createRequest({
        input: { data: 'countryConditional', type: INPUT.TEXT },
        plugins: {
          // @ts-ignore
          flowBuilderPlugin,
        },
        extraData: {
          language: 'en',
          country: countryISO,
        },
      })

      const { contents } = await getContentsAfterPreAndBotonicInit(
        request,
        flowBuilderPlugin
      )

      expect((contents[0] as FlowText).text).toBe(messageExpected)
    }
  )
})
