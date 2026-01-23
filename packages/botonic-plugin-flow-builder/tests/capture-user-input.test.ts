import { INPUT } from '@botonic/core'

import { FlowText } from '../src/content-fields/index'
import { ProcessEnvNodeEnvs } from '../src/types'
// eslint-disable-next-line jest/no-mocks-import
import { mockCaptureUserInputResponse } from './__mocks__/capture-user-input'
import { captureUserInputFlow } from './helpers/flows/capture-user-input'
import { createFlowBuilderPluginAndGetContents } from './helpers/utils'

const bookingNumber = 'ASD1234'
const captureUserInputNodeId = '019bbd18-1b72-71a1-9197-c3a20d58f7f1'

describe('capture user input success', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    mockCaptureUserInputResponse(true, bookingNumber)
  })

  test('should capture user input when session has capture_user_input_id and input is of type TEXT', async () => {
    const { contents, request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: captureUserInputFlow },
      requestArgs: {
        input: {
          type: INPUT.TEXT,
          data: `My booking number is ${bookingNumber}`,
        },
        captureUserInputId: captureUserInputNodeId,
      },
    })

    expect(request.session.capture_user_input?.node_id).toBe(undefined)
    expect(request.session.user.extra_data.booking_number).toBe(bookingNumber)
    expect((contents[0] as FlowText).text).toBe(`capture success`)
  })
})

describe('capture user input fail', () => {
  process.env.NODE_ENV = ProcessEnvNodeEnvs.PRODUCTION

  beforeEach(() => {
    mockCaptureUserInputResponse(false)
  })

  test('should not capture user input when capture user input response is false and input is of type TEXT', async () => {
    const { contents, request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: captureUserInputFlow },
      requestArgs: {
        input: {
          type: INPUT.TEXT,
          data: `My booking number is ${bookingNumber}`,
        },
        captureUserInputId: captureUserInputNodeId,
      },
    })

    expect(request.session.capture_user_input?.node_id).toBe(undefined)
    expect(request.session.user.extra_data.booking_number).toBe(undefined)
    expect((contents[0] as FlowText).text).toBe(`capture fail`)
  })

  test('should not capture user input when session has capture_user_input_id but input has a payload', async () => {
    const { contents, request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: captureUserInputFlow },
      requestArgs: {
        input: {
          type: INPUT.POSTBACK,
          payload: 'welcome',
        },
      },
    })

    expect(request.session.flow_builder?.capture_user_input_id).toBe(undefined)
    expect(request.session.user.extra_data.booking_number).toBe(undefined)
    expect((contents[0] as FlowText).text).toBe(`Fallback`)
  })
  test('not run capture user input logic if session has no capture_user_input_id', async () => {
    const { contents, request } = await createFlowBuilderPluginAndGetContents({
      flowBuilderOptions: { flow: captureUserInputFlow },
      requestArgs: {
        input: {
          type: INPUT.TEXT,
          data: `My booking number is ${bookingNumber}`,
        },
      },
    })

    expect(request.session.flow_builder?.capture_user_input_id).toBe(undefined)
    expect(request.session.user.extra_data.booking_number).toBe(undefined)
    expect((contents[0] as FlowText).text).toBe(`Fallback`)
  })
})
