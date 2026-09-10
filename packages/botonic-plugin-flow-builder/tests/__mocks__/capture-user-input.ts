import { vi } from 'vitest'

import { CaptureUserInputApi } from '../../src/user-input/capture-user-input-api'

export function mockCaptureUserInputResponse(success: boolean, value?: string) {
  const getAiCaptureResponseSpy = vi.spyOn(
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
