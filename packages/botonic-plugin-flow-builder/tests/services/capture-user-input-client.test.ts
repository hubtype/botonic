import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals'
import axios from 'axios'

import { CaptureUserInputClient } from '../../src/services/capture-user-input-client'
import { createServiceClientBotContext } from '../helpers/service-client-test-context'

jest.mock('axios')
const axiosPostMock = axios.post as jest.MockedFunction<typeof axios.post>

describe('CaptureUserInputClient', () => {
  const hubtypeApi = 'https://api.test.hubtype.com'

  beforeEach(() => {
    axiosPostMock.mockReset()
  })

  test('posts capture request with validation_instructions when provided', async () => {
    const responseData = { success: true as const, value: 'parsed' }
    axiosPostMock.mockResolvedValue({ data: responseData })

    const client = new CaptureUserInputClient(
      createServiceClientBotContext({ hubtypeApi })
    )
    const result = await client.getAiCaptureResponse(
      'user text',
      'email',
      'Must be valid'
    )

    expect(axiosPostMock).toHaveBeenCalledWith(
      `${hubtypeApi}/external/v1/capture_user_input/`,
      {
        field_name: 'email',
        validation_instructions: 'Must be valid',
        user_input: 'user text',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-access-token',
        },
      }
    )
    expect(result).toEqual(responseData)
  })

  test('posts capture request with validation_instructions key when instruction is undefined', async () => {
    axiosPostMock.mockResolvedValue({
      data: { success: true as const, value: 'x' },
    })

    const client = new CaptureUserInputClient(
      createServiceClientBotContext({ hubtypeApi })
    )
    await client.getAiCaptureResponse('hi', 'name', undefined)

    expect(axiosPostMock).toHaveBeenCalledWith(
      `${hubtypeApi}/external/v1/capture_user_input/`,
      {
        field_name: 'name',
        validation_instructions: undefined,
        user_input: 'hi',
      },
      expect.any(Object)
    )
  })

  test('returns success false and warns when axios.post fails', async () => {
    const err = new Error('network')
    axiosPostMock.mockRejectedValue(err)
    const warnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined)

    const client = new CaptureUserInputClient(
      createServiceClientBotContext({ hubtypeApi })
    )
    const result = await client.getAiCaptureResponse('x', 'f')

    expect(result).toEqual({ success: false })
    expect(warnSpy).toHaveBeenCalledWith(
      'Error getting ai/capture_user_input',
      err
    )
    warnSpy.mockRestore()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
})
