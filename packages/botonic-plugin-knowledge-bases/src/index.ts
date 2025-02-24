import type { Plugin, PluginPreRequest, Session } from '@botonic/core'

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
    session: Session,
    sources: string[],
    instructions: string,
    messageId: string,
    memoryLength: number
  ): Promise<KnowledgeBaseResponse> {
    const authToken = isProd ? session._access_token : this.authToken

    const response = await this.apiService.inference(
      authToken,
      sources,
      instructions,
      messageId,
      memoryLength
    )

    return {
      inferenceId: response.data.inference_id,
      chunks: response.data.chunks,
      hasKnowledge: response.data.has_knowledge,
      isFaithful: response.data.is_faithful,
      answer: response.data.answer,
    }
  }
}

export { PluginKnowledgeBaseOptions } from './types'
