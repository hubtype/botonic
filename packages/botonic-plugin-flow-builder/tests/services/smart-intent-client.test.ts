import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import axios from 'axios'

import { SmartIntentsClient } from '../../src/services/smart-intent-client'
import { createServiceClientBotContext } from '../helpers/service-client-test-context'

jest.mock('axios', () => jest.fn())
const axiosMock = axios as jest.MockedFunction<typeof axios>

describe('SmartIntentsClient', () => {
  const hubtypeApi = 'https://api.test.hubtype.com'

  beforeEach(() => {
    axiosMock.mockReset()
  })

  test('posts inference with timeout and returns axios response', async () => {
    const inferenceParams = {
      bot_id: 'bid1',
      text: 'hello',
      use_latest: true,
      disabled_smart_intent_titles: [] as string[],
    }
    const axiosResponse = { data: { smart: true } }
    axiosMock.mockResolvedValue(axiosResponse as never)

    const client = new SmartIntentsClient(
      createServiceClientBotContext({ hubtypeApi })
    )
    const result = await client.getInference(inferenceParams)

    expect(axiosMock).toHaveBeenCalledWith({
      method: 'POST',
      url: `${hubtypeApi}/external/v2/ai/smart_intents/inference/`,
      headers: {
        Authorization: 'Bearer test-access-token',
        'Content-Type': 'application/json',
      },
      data: inferenceParams,
      timeout: 10000,
    })
    expect(result).toBe(axiosResponse)
  })
})
