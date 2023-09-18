/* eslint-disable @typescript-eslint/naming-convention */
import axios, { AxiosResponse } from 'axios'

const DEFAULT_TIMEOUT = 10000

export class HubtypeApiService {
  private knowledgeBaseId: string
  private host: string
  private timeout: number

  constructor(knowledgeBaseId: string, host: string, timeout?: number) {
    this.knowledgeBaseId = knowledgeBaseId
    this.host = host
    this.timeout = timeout || DEFAULT_TIMEOUT
  }

  async inference(
    authToken: string,
    chatId: string
  ): Promise<
    AxiosResponse<{
      ai: string
      has_knowledge: boolean
      sources: {
        knowledge_source_id: string
        page?: number
      }[]
    }>
  > {
    return await axios({
      method: 'POST',
      url: `${this.host}v1/ai/knowledge_bases/${this.knowledgeBaseId}/inference/`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { chat_id: chatId },
      timeout: this.timeout,
    })
  }
}
