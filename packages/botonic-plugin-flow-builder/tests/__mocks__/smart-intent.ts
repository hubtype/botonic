import type { MockInstance } from 'vitest'
import { vi } from 'vitest'

import { SmartIntentsApi } from '../../src/user-input/smart-intent'

export let smartIntentInferenceSpy: MockInstance<
  (inferenceParams: unknown) => Promise<unknown>
>

export function mockSmartIntent(intentName?: string) {
  smartIntentInferenceSpy = vi.spyOn(
    SmartIntentsApi.prototype as any,
    'getInference'
  )

  smartIntentInferenceSpy.mockImplementation(async () => {
    return intentName
      ? {
          data: {
            smart_intent_title: intentName,
            smart_intents_used: [
              {
                title: intentName,
                description: 'DescriptionTest',
              },
              {
                title: 'Other',
                description: 'OtherDescriptionTest',
              },
            ],
          },
        }
      : undefined
  })
}
