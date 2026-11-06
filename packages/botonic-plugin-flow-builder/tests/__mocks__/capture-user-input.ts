import { jest } from '@jest/globals'

import { CaptureUserInputApi } from '../../src/services/capture-user-input-api'

export function mockCaptureUserInputResponse(success: boolean, value?: string) {
  const getAiCaptureResponseSpy = jest.spyOn(
    CaptureUserInputApi.prototype as any,
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
