/* eslint-disable @typescript-eslint/naming-convention */
import axios, { AxiosResponse } from 'axios'

import { Chunk } from './types'

const DEFAULT_TIMEOUT = 10000

export class HubtypeApiService {
  private host: string
  private timeout: number

  constructor(host: string, timeout?: number) {
    this.host = host
    this.timeout = timeout || DEFAULT_TIMEOUT
  }

  async inference(
    authToken: string,
    sources: string[],
    instructions: string,
    messageId: string,
    memoryLength: number
  ): Promise<
    AxiosResponse<{
      inference_id: string
      query: string
      chunks: Chunk[]
      has_knowledge: boolean
      is_faithful: boolean
      answer: string
    }>
  > {
    return await axios({
      method: 'POST',
      url: `${this.host}/external/v2/ai/knowledge_base/inference/`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        sources,
        instructions,
        message: messageId,
        memory_length: memoryLength,
      },
      timeout: this.timeout,
    })
  }
}
