import { jest } from '@jest/globals'

import { SmartIntentsApi } from '../../src/user-input/smart-intent'

export function mockSmartIntent(intentName?: string) {
  // Spy on the private function getInference
  const getInferenceSpy = jest.spyOn(
    SmartIntentsApi.prototype as any,
    'getInference'
  )

  // Change the implementation of getInference
  getInferenceSpy.mockImplementation(async () => {
    return intentName ? { data: { smart_intent_title: intentName } } : undefined
  })
}
