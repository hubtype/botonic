import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowText } from '../src/index'
import { ProcessEnvNodeEnvs } from '../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockSmartIntent } from './__mocks__/smart-intent'
import { smartIntentsFlow } from './helpers/flows/smart-intents'
import {
  createFlowBuilderPlugin,
  createRequest,
  getContentsAfterPreAndBotonicInit,
} from './helpers/utils'

describe('Check the contents returned by the plugin when match a smart intent', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION
  const flowBuilderPlugin = createFlowBuilderPlugin(smartIntentsFlow)

  beforeEach(() => mockSmartIntent('Add a bag'))

  test('When the smart intent inference returns the intent_name Add a Bag, the contents of the add a bag use case are displayed', async () => {
    const request = createRequest({
      input: {
        data: 'I want to add a bag to my flight booking',
        type: INPUT.TEXT,
      },
      plugins: {
        // @ts-ignore
        flowBuilderPlugin,
      },
    })

    const { contents } = await getContentsAfterPreAndBotonicInit(
      request,
      flowBuilderPlugin
    )

    expect((contents[0] as FlowText).text).toBe(
      'Message explaining how to add a bag'
    )
  })
})
