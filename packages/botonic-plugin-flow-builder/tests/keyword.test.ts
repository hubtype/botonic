import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowText } from '../src/index'
import { ProcessEnvNodeEnvs } from '../src/types'
import { basicFlow } from './helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from './helpers/utils'

describe('Check the contents returned by the plugin using keywords', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  test.each(['reset', 'hola', 'HOLA'])(
    'The initial content is displayed when the user sends the %s text',
    async (inputData: string) => {
      const { contents } = await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: basicFlow },
        requestArgs: {
          input: { data: inputData, type: INPUT.TEXT },
        },
      })

      expect((contents[0] as FlowText).text).toBe('Welcome message')
    }
  )
})
