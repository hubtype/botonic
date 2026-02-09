/* eslint-disable @typescript-eslint/naming-convention */
import axios, { type AxiosResponse } from 'axios'

import type { Chunk } from './types'

const DEFAULT_TIMEOUT = 20000

export interface HtApiKnowledgeBaseResponse {
  inference_id: string
  query: string
  chunks: Chunk[]
  has_knowledge: boolean
  is_faithful: boolean
  answer: string
}
export class HubtypeApiService {
  private host: string
  private timeout: number
  private verbose: boolean

  constructor(host: string, timeout?: number, verbose?: boolean) {
    this.host = host
    this.timeout = timeout || DEFAULT_TIMEOUT
    this.verbose = verbose || false
  }

  async inferenceV2(
    authToken: string,
    sources: string[],
    instructions: string,
    messageId: string,
    memoryLength: number
  ): Promise<AxiosResponse<HtApiKnowledgeBaseResponse>> {
    const url = `${this.host}/external/v2/ai/knowledge_base/inference/`
    const data = {
      sources,
      instructions,
      message: messageId,
      memory_length: memoryLength,
    }
    const response = await axios({
      method: 'POST',
      url,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data,
      timeout: this.timeout,
    })

    if (this.verbose) {
      console.log('Data and response', {
        url,
        data,
        timeout: this.timeout,
        response,
      })
    }

    return response
  }

  async testInference(
    authToken: string,
    instructions: string,
    messages: any[],
    sources: string[]
  ): Promise<AxiosResponse<HtApiKnowledgeBaseResponse>> {
    return await axios({
      method: 'POST',
      url: `${this.host}/external/v1/ai/knowledge_base/test_inference/`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        sources,
        instructions,
        messages,
      },
      timeout: this.timeout,
    })
  }
}
