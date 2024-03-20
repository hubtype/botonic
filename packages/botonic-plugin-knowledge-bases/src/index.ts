import { HubtypeSession, Plugin, PluginPreRequest } from '@botonic/core'

import { HubtypeApiService } from './hubtype-knowledge-api-service'
import { KnowledgeBaseResponse, PluginKnowledgeBaseOptions } from './types'

const isProd = process.env.NODE_ENV === 'production'

export default class BotonicPluginKnowledgeBases implements Plugin {
  private readonly apiService: HubtypeApiService
  private readonly authToken: string

  constructor(options: PluginKnowledgeBaseOptions) {
    this.apiService = new HubtypeApiService(
      options.host,
      options.knowledgeBaseId,
      options.timeout
    )
    this.authToken = options.authToken || ''
  }

  async pre(_request: PluginPreRequest): Promise<void> {
    return
  }

  async getInference(session: HubtypeSession): Promise<KnowledgeBaseResponse> {
    const authToken = isProd ? session._access_token : this.authToken

    const response = await this.apiService.inference(authToken, session.user.id)

    const sources = response.data.sources.map(source => {
      return {
        knowledgeSourceId: source.knowledge_source_id,
        page: source.page,
      }
    })

    return {
      question: response.data.question,
      answer: response.data.answer,
      hasKnowledge: response.data.has_knowledge && response.data.is_faithful,
      sources,
    }
  }
}

export { PluginKnowledgeBaseOptions } from './types'
