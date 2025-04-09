import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowText } from '../src/index'
import { ProcessEnvNodeEnvs } from '../src/types'
import { basicFlow } from './helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from './helpers/utils'

describe('Check the contents returned by the plugin using keywords', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  test.each([
    { keyword: 'reset', inputData: 'reset' },
    { keyword: 'hola', inputData: 'hola que tal?' },
    { keyword: 'HOLA', inputData: 'HOLA' },
  ])(
    'The initial content is displayed when the user sends the %s text',
    async ({ inputData, keyword }) => {
      const { contents, request, flowBuilderPluginPost } =
        await createFlowBuilderPluginAndGetContents({
          flowBuilderOptions: { flow: basicFlow },
          requestArgs: {
            input: { data: inputData, type: INPUT.TEXT },
          },
        })

      expect((contents[0] as FlowText).text).toBe('Welcome message')
      expect(request.input.nluResolution?.type).toEqual('keyword')
      expect(request.input.nluResolution?.matchedValue).toEqual(keyword)

      flowBuilderPluginPost({
        ...request,
        response: (contents[0] as FlowText).text,
      })
      expect(request.input.nluResolution).toEqual(undefined)
    }
  )

  test('Keywords are not allowed by default when user is in handoff with shadowing', async () => {
    const { contents, request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: basicFlow,
      },
      requestArgs: {
        input: { data: 'hola', type: INPUT.TEXT },
        shadowing: true,
      },
    })

    expect((contents[0] as FlowText).text).toBe('fallback 1st message')
    expect(request.input.nluResolution?.matchedValue).toEqual(undefined)
  })

  test('Keywords are allowed if inShadowing.allowKeywords is true when user is in handoff with shadowing', async () => {
    const { contents, request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: {
        flow: basicFlow,
        inShadowing: { allowKeywords: true },
      },
      requestArgs: {
        input: { data: 'hola', type: INPUT.TEXT },
        shadowing: true,
      },
    })

    expect((contents[0] as FlowText).text).toBe('Welcome message')
    expect(request.input.nluResolution?.type).toEqual('keyword')
    expect(request.input.nluResolution?.matchedValue).toEqual('hola')
  })
})
