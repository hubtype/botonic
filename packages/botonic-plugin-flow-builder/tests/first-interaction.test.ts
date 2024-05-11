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

describe('Check the contents returned by the plugin', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION
  const flowBuilderPlugin = createFlowBuilderPlugin(testFlow)

  test('The starting content is displayed on the first interaction', async () => {
    const request = createRequest({
      input: { data: 'Hola', type: INPUT.TEXT },
      isFirstInteraction: true,
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
  })
})
