import type { BotContext, Plugin, PluginPreRequest } from '@botonic/core'
import type { AxiosResponse } from 'axios'

import {
  type HtApiKnowledgeBaseResponse,
  HubtypeApiService,
} from './hubtype-knowledge-api-service'
import type {
  KnowledgeBasesResponse,
  PluginKnowledgeBaseOptions,
} from './types'

const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'

export default class BotonicPluginKnowledgeBases implements Plugin {
  private readonly apiService: HubtypeApiService
  private readonly authToken: string

  constructor(options: PluginKnowledgeBaseOptions) {
    this.apiService = new HubtypeApiService(
      options.host,
      options.timeout,
      options.verbose
    )
    this.authToken = options.authToken || ''
  }

  async pre(_request: PluginPreRequest): Promise<void> {
    return
  }

  async getInference(
    request: BotContext,
    sources: string[],
    instructions: string,
    messageId: string,
    memoryLength: number
  ): Promise<KnowledgeBasesResponse> {
    const authToken = isProd ? request.session._access_token : this.authToken

    if (isDev) {
      return this.getTestInference(authToken, request, instructions, sources)
    }

    const response = await this.apiService.inferenceV2(
      authToken,
      sources,
      instructions,
      messageId,
      memoryLength
    )

    return this.mapApiResponse(response)
  }

  async getTestInference(
    authToken: string,
    request: BotContext,
    instructions: string,
    sources: string[]
  ): Promise<KnowledgeBasesResponse> {
    const messages = [{ role: 'human', content: request.input.data }]

    const response = await this.apiService.testInference(
      authToken,
      instructions,
      messages,
      sources
    )

    return this.mapApiResponse(response)
  }

  private mapApiResponse(
    response: AxiosResponse<HtApiKnowledgeBaseResponse>
  ): KnowledgeBasesResponse {
    return {
      inferenceId: response.data.inference_id,
      chunkIds: response.data.chunks.map(chunk => chunk.id),
      hasKnowledge: response.data.has_knowledge,
      isFaithful: response.data.is_faithful,
      answer: response.data.answer,
    }
  }
}

export { PluginKnowledgeBaseOptions } from './types'
