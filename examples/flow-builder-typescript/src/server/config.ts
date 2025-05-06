import {
  type BotonicPluginFlowBuilderOptions,
  FlowBuilderJSONVersion,
} from '@botonic/plugin-flow-builder'
import {
  KnowledgeBaseResponse,
  type PluginKnowledgeBaseOptions,
} from '@botonic/plugin-knowledge-bases/src/types'

import { UserData } from './domain/user-data'
import { BotPlugins } from './plugins'
import { trackEvent } from './tracking'
import { BotRequest } from './types'
import { ENVIRONMENT, isLocal, isProduction } from './utils/env-utils'

function getFlowBuilderConfig(
  env: ENVIRONMENT
): BotonicPluginFlowBuilderOptions<BotPlugins, UserData> {
  return {
    jsonVersion: isLocal(env)
      ? FlowBuilderJSONVersion.DRAFT
      : FlowBuilderJSONVersion.LATEST,
    getAccessToken: () => 'AUTH_TOKEN', // Used locally,
    trackEvent: async (request: BotRequest, eventName, args) => {
      await trackEvent(request, eventName, args)
    },
    getKnowledgeBaseResponse: async (
      request: BotRequest,
      sources: string[],
      instructions: string,
      messageId: string,
      memoryLength: number
    ): Promise<KnowledgeBaseResponse> => {
      try {
        const knowledgeBasePlugin = request.plugins.knowledgeBases
        const response = await knowledgeBasePlugin.getInference(
          request,
          sources,
          instructions,
          messageId,
          memoryLength
        )
        if (!isProduction()) {
          console.log('knowledgeBasePlugin.getInference', { response })
        }
        return response
      } catch (error: any) {
        console.error('knowledgeBasePlugin.getInference', {
          e: error?.response?.data,
        })
        return {
          inferenceId: '',
          answer: '',
          hasKnowledge: false,
          isFaithful: false,
          chunkIds: [],
        }
      }
    },
  }
}

function getKnowledgeBasesConfig(): PluginKnowledgeBaseOptions {
  return {
    authToken: 'AUTH_TOKEN', // Used locally
    host: process.env.HUBTYPE_API_URL || 'https://api.hubtype.com',
  }
}

interface Config {
  // Use any for infer type for TPlugins and TExtraData
  // to avoid type errors with circular dependencies
  flowBuilder: BotonicPluginFlowBuilderOptions<any, any>
  knowledgeBases: PluginKnowledgeBaseOptions
}

export const CONFIG: Record<ENVIRONMENT, Config> = {
  [ENVIRONMENT.LOCAL]: {
    flowBuilder: getFlowBuilderConfig(ENVIRONMENT.LOCAL),
    knowledgeBases: getKnowledgeBasesConfig(),
  },
  [ENVIRONMENT.PRODUCTION]: {
    flowBuilder: getFlowBuilderConfig(ENVIRONMENT.PRODUCTION),
    knowledgeBases: getKnowledgeBasesConfig(),
  },
}
