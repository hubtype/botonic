import { HubtypeSession, Plugin, PluginPreRequest } from '@botonic/core'

import { HubtypeApiService } from './hubtype-knowledge-api-service'
import { KnowledgebaseResponse, PluginKnowledgeBaseOptions } from './types'

const isProd = process.env.NODE_ENV === 'production'

export default class BotonicPluginKnowledgeBases implements Plugin {
  private readonly apiService: HubtypeApiService
  private readonly authToken: string

  constructor(options: PluginKnowledgeBaseOptions) {
    this.apiService = new HubtypeApiService(
      options.knowledgeBaseId,
      options.host,
      options.timeout
    )
    this.authToken = options.authToken || ''
  }

  async pre(_request: PluginPreRequest): Promise<void> {
    return
  }

  async getIaResponse(session: HubtypeSession): Promise<KnowledgebaseResponse> {
    try {
      const authToken = isProd ? session._access_token : this.authToken
      const response = await this.apiService.inference(
        authToken,
        session.user.id
      )
      return {
        ai: response.data.ai,
        hasKnowledge: response.data.has_knowledge,
        sources: response.data.sources,
      }
    } catch (e) {
      console.error(e)
      return {
        ai: '',
        hasKnowledge: false,
        sources: [],
      }
    }
  }
}

export { PluginKnowledgeBaseOptions } from './types'
