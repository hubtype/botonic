import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowText } from '../src/index'
import { ProcessEnvNodeEnvs } from '../src/types'
import { testFlow } from './helpers/flows'
import {
  createFlowBuilderPlugin,
  createRequest,
  getContentsAfterPreAndBotonicInit,
} from './helpers/utils'

describe('Check the contents returned by the plugin using keywords', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION
  const flowBuilderPlugin = createFlowBuilderPlugin(testFlow)

  test.each(['reset', 'hola', 'HOLA'])(
    'The initial content is displayed when the user sends the %s text',
    async (inputData: string) => {
      const request = createRequest({
        input: { data: inputData, type: INPUT.TEXT },
        plugins: {
          // @ts-ignore
          flowBuilderPlugin,
        },
      })

      const { contents } = await getContentsAfterPreAndBotonicInit(
        request,
        flowBuilderPlugin
      )

      expect((contents[0] as FlowText).text).toBe('Welcome message')
    }
  )
})
