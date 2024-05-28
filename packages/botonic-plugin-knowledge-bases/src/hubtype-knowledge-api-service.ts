/* eslint-disable @typescript-eslint/naming-convention */
import axios, { AxiosResponse } from 'axios'

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
    question: string,
    sources: string[]
  ): Promise<
    AxiosResponse<{
      inference_id: string
      question: string
      answer: string
      has_knowledge: boolean
      is_faithful: boolean
      sources: {
        knowledge_base_id: string
        knowledge_source_id: string
        knowledge_chunk_id: string
      }[]
    }>
  > {
    return await axios({
      method: 'POST',
      url: `${this.host}/external/v1/ai/knowledge_bases/inference/`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        question,
        sources,
      },
      timeout: this.timeout,
    })
  }
}
