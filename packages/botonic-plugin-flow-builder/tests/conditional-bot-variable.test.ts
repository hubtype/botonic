import { INPUT } from '@botonic/core'
import { describe, test } from '@jest/globals'

import { FlowCustomConditional, FlowText } from '../src/content-fields/index'
import { ProcessEnvNodeEnvs } from '../src/types'
import { basicFlow } from './helpers/flows/basic'
import { createFlowBuilderPluginAndGetContents } from './helpers/utils'

describe('Check the contents returned by the plugin after conditional custom node', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  test.each(['tourist', 'business', 'first class', '', undefined])(
    'The expected content is displayed after using a string variable in the conditional',
    async (bookingType?: string) => {
      const { contents } = await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: basicFlow },
        requestArgs: {
          input: { data: 'stringVariable', type: INPUT.TEXT },
          extraData: { bookingType },
        },
      })

      expect(contents[0]).toBeInstanceOf(FlowCustomConditional)
      expect((contents[1] as FlowText).text).toBe(
        `The booking is ${bookingType || '{bookingType}'}`
      )
    }
  )

  test.each([true, false, undefined])(
    'The expected content is displayed after using a boolean variable in the conditional',
    async (isLogged?: boolean) => {
      const { contents } = await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: basicFlow },
        requestArgs: {
          input: { data: 'booleanVariable', type: INPUT.TEXT },
          extraData: { isLogged },
        },
      })

      expect(contents[0]).toBeInstanceOf(FlowCustomConditional)
      expect((contents[1] as FlowText).text).toBe(
        `User is logged ${isLogged ? 'in' : 'out'}`
      )
    }
  )

  test.each([
    { messageExpected: 'The user has no bags in the booking', bagsAdded: 0 },
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
      const { contents } = await createFlowBuilderPluginAndGetContents({
        flowBuilderOptions: { flow: basicFlow },
        requestArgs: {
          input: { data: 'numberVariable', type: INPUT.TEXT },
          extraData: { bagsAdded },
        },
      })

      expect(contents[0]).toBeInstanceOf(FlowCustomConditional)
      expect((contents[1] as FlowText).text).toBe(messageExpected)
    }
  )
})
