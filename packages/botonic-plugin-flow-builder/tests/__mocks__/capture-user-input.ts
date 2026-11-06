import { jest } from '@jest/globals'

import { CaptureUserInputClient } from '../../src/services/capture-user-input-client'

export function mockCaptureUserInputResponse(success: boolean, value?: string) {
  const getAiCaptureResponseSpy = jest.spyOn(
    CaptureUserInputClient.prototype as any,
    'getAiCaptureResponse'
  )

  getAiCaptureResponseSpy.mockImplementation(async () => {
    return success
      ? {
          success,
          value,
        }
      : {
          success: false,
        }
  })
}
