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
    userInput: string,
    sources: string[]
  ): Promise<KnowledgeBaseResponse> {
    const authToken = isProd ? session._access_token : this.authToken

    const response = await this.apiService.inference(
      authToken,
      userInput,
      sources
    )

    const responseSources = response.data.sources.map(source => {
      return {
        knowledgeBaseId: source.knowledge_base_id,
        knowledgeSourceId: source.knowledge_source_id,
        knowledgeChunkId: source.knowledge_chunk_id,
      }
    })

    return {
      inferenceId: response.data.inference_id,
      question: response.data.question,
      answer: response.data.answer,
      hasKnowledge: response.data.has_knowledge,
      isFaithuful: response.data.is_faithful,
      sources: responseSources,
    }
  }
}

export { PluginKnowledgeBaseOptions } from './types'
