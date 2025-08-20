import type { BotContext, Plugin, PluginPreRequest } from '@botonic/core'
import { AxiosResponse } from 'axios'

import {
  HtApiKnowledgeBaseResponse,
  HubtypeApiService,
} from './hubtype-knowledge-api-service'
import { KnowledgeBasesResponse, PluginKnowledgeBaseOptions } from './types'

const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'

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

  async getInferenceV1(
    authToken: string,
    request: BotContext,
    sources: string[]
  ): Promise<KnowledgeBasesResponse> {
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
  ): Promise<KnowledgeBasesResponse> {
    const response = await this.apiService.inferenceV2(
      authToken,
      sources,
      instructions,
      messageId,
      memoryLength
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
