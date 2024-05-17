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

describe('Check the contents returned by the plugin after conditional custom node', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION
  const flowBuilderPlugin = createFlowBuilderPlugin(basicFlow)

  test.each(['tourist', 'business', 'first class', '', undefined])(
    'The expected content is displayed after using a string variable in the conditional',
    async (bookingType?: string) => {
      const request = createRequest({
        input: { data: 'stringVariable', type: INPUT.TEXT },
        plugins: {
          // @ts-ignore
          flowBuilderPlugin,
        },
        extraData: { bookingType },
      })

      const { contents } = await getContentsAfterPreAndBotonicInit(
        request,
        flowBuilderPlugin
      )
      const contentFlowText = contents[0] as FlowText
      expect(contentFlowText.text).toBe(
        `The booking is ${bookingType || '{bookingType}'}`
      )
    }
  )

  test.each([true, false, undefined])(
    'The expected content is displayed after using a boolean variable in the conditional',
    async (isLogged?: boolean) => {
      const request = createRequest({
        input: { data: 'booleanVariable', type: INPUT.TEXT },
        plugins: {
          // @ts-ignore
          flowBuilderPlugin,
        },
        extraData: { isLogged },
      })

      const { contents } = await getContentsAfterPreAndBotonicInit(
        request,
        flowBuilderPlugin
      )
      const contentFlowText = contents[0] as FlowText
      expect(contentFlowText.text).toBe(
        `User is logged ${isLogged ? 'in' : 'out'}`
      )
    }
  )

  test.each([
    //{ messageExpected: 'The user has no bags in the booking', bagsAdded: 0 }, // REVIEW: If pass a 0 to conditioanl bot variable return default result becasue 0 is saved as '0' in backend
    { messageExpected: 'The user has 1 bag in the booking', bagsAdded: 1 },
    { messageExpected: 'The user has 2 bags in the booking', bagsAdded: 2 },
    {
      messageExpected:
        'This is the message that is displayed if the value is not defined or is none of the others',
      bagsAdded: 4,
    },
    {
      messageExpected:
        'This is the message that is displayed if the value is not defined or is none of the others',
      bagsAdded: undefined,
    },
  ])(
    'The expected content is displayed after using a number variable with value $bagsAdded in the conditional',
    async ({ messageExpected, bagsAdded }) => {
      const request = createRequest({
        input: { data: 'numberVariable', type: INPUT.TEXT },
        plugins: {
          // @ts-ignore
          flowBuilderPlugin,
        },
        extraData: { bagsAdded },
      })

      const { contents } = await getContentsAfterPreAndBotonicInit(
        request,
        flowBuilderPlugin
      )
      const contentFlowText = contents[0] as FlowText
      expect(contentFlowText.text).toBe(messageExpected)
    }
  )
})
