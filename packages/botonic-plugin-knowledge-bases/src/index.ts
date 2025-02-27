import type { BotRequest, Plugin, PluginPreRequest } from '@botonic/core'

import { HubtypeApiService } from './hubtype-knowledge-api-service'
import { KnowledgeBaseResponse, PluginKnowledgeBaseOptions } from './types'

const isProd = process.env.NODE_ENV === 'production'

export default class BotonicPluginKnowledgeBases implements Plugin {
  private readonly apiService: HubtypeApiService
  private readonly authToken: string

  constructor(options: PluginKnowledgeBaseOptions) {
    this.apiService = new HubtypeApiService(options.host, options.timeout)
    this.authToken = options.authToken || ''
  }

  async pre(_request: PluginPreRequest): Promise<void> {
    return
  }

  async getInference(
    request: BotRequest,
    sources: string[],
    instructions: string,
    messageId: string,
    memoryLength: number
  ): Promise<KnowledgeBaseResponse> {
    const authToken = isProd ? request.session._access_token : this.authToken

    if (!instructions) {
      return this.getInferenceV1(authToken, request, sources)
    }

    return this.getInferenceV2(
      authToken,
      sources,
      instructions,
      messageId,
      memoryLength
    )
  }

  async getInferenceV1(
    authToken: string,
    request: BotRequest,
    sources: string[]
  ): Promise<KnowledgeBaseResponse> {
    const response = await this.apiService.inferenceV1(
      authToken,
      request.input.data!,
      sources
    )
    return {
      inferenceId: response.data.inference_id,
      answer: response.data.answer,
      hasKnowledge: response.data.has_knowledge,
      isFaithful: response.data.is_faithful,
      chunkIds: response.data.chunk_ids,
    }
  }

  async getInferenceV2(
    authToken: string,
    sources: string[],
    instructions: string,
    messageId: string,
    memoryLength: number
  ): Promise<KnowledgeBaseResponse> {
    const response = await this.apiService.inferenceV2(
      authToken,
      sources,
      instructions,
      messageId,
      memoryLength
    )

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
