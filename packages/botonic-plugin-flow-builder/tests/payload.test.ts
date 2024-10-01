import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowText } from '../src/index'
import { ProcessEnvNodeEnvs } from '../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockSmartIntent } from './__mocks__/smart-intent'
import { basicFlow } from './helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from './helpers/utils'

describe('Check the contents returned by the plugin when user clicks a button', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => mockSmartIntent('Other'))
  test('When button exist in flow the following contents are displayed', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: {
          payload: 'eb877738-3cf4-4a57-9f46-3122e18f1cc7',
          type: INPUT.POSTBACK,
        },
      },
    })

    expect((contents[0] as FlowText).text).toBe('Message after button text 1')
    expect(contents.length).toBe(2)
  })

  test('When button no exist in flow the fallback contents are displayed', async () => {
    const { contents } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: basicFlow },
      requestArgs: {
        input: {
          payload: 'fake-id-that-does-not-exist',
          type: INPUT.POSTBACK,
        },
      },
    })

    expect((contents[0] as FlowText).text).toBe('fallback 1st message')
    expect(contents.length).toBe(1)
  })
})
