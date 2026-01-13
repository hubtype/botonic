import { PluginAiAgentOptions } from '@botonic/plugin-ai-agents'
import {
  type BotonicPluginFlowBuilderOptions,
  FlowBuilderJSONVersion,
} from '@botonic/plugin-flow-builder'
import {
  KnowledgeBasesResponse,
  type PluginKnowledgeBaseOptions,
} from '@botonic/plugin-knowledge-bases/src/types'

import { UserData } from './domain/user-data'
import { BotPlugins } from './plugins'
import { customTools } from './tools'
import { trackEvent } from './tracking'
import { BotRequest } from './types'
import { ENVIRONMENT, isLocal, isProduction } from './utils/env-utils'

const AUTH_TOKEN = 'ADD_YOUR_FLOW_BUILDER_AUTH_TOKEN'

function getFlowBuilderConfig(
  env: ENVIRONMENT
): BotonicPluginFlowBuilderOptions<BotPlugins, UserData> {
  return {
    jsonVersion: isLocal(env)
      ? FlowBuilderJSONVersion.DRAFT
      : FlowBuilderJSONVersion.LATEST,
    customRatingMessageEnabled: true,
    getAccessToken: () => AUTH_TOKEN, // Used locally,
    trackEvent: async (request: BotRequest, eventName, args) => {
      await trackEvent(request, eventName, args)
    },
    getKnowledgeBaseResponse: async (
      request: BotRequest,
      sources: string[],
      instructions: string,
      messageId: string,
      memoryLength: number
    ): Promise<KnowledgeBasesResponse> => {
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
    // TODO: Uncomment this to use the AI Agents. You need to create a .env file as .env.template in root with your AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT
    // getAiAgentResponse: async (
    //   request: BotRequest,
    //   aiAgentArgs: {
    //     name: string
    //     instructions: string
    //   }
    // ) => {
    //   const aiAgentPlugin = request.plugins.aiAgents
    //   return await aiAgentPlugin.getInference(request, aiAgentArgs)
    // },
  }
}

function getKnowledgeBasesConfig(): PluginKnowledgeBaseOptions {
  return {
    authToken: AUTH_TOKEN, // Used locally
    host: process.env.HUBTYPE_API_URL || 'https://api.hubtype.com',
  }
}

function getAiAgentsConfig(): PluginAiAgentOptions {
  return {
    authToken: AUTH_TOKEN, // Used locally
    customTools: customTools,
  }
}

interface Config {
  // Use any for infer type for TPlugins and TExtraData
  // to avoid type errors with circular dependencies
  aiAgents: PluginAiAgentOptions
  flowBuilder: BotonicPluginFlowBuilderOptions<any, any>
  knowledgeBases: PluginKnowledgeBaseOptions
}

export const CONFIG: Record<ENVIRONMENT, Config> = {
  [ENVIRONMENT.LOCAL]: {
    aiAgents: getAiAgentsConfig(),
    flowBuilder: getFlowBuilderConfig(ENVIRONMENT.LOCAL),
    knowledgeBases: getKnowledgeBasesConfig(),
  },
  [ENVIRONMENT.PRODUCTION]: {
    aiAgents: getAiAgentsConfig(),
    flowBuilder: getFlowBuilderConfig(ENVIRONMENT.PRODUCTION),
    knowledgeBases: getKnowledgeBasesConfig(),
  },
}
