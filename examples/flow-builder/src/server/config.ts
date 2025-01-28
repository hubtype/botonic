import { Session } from '@botonic/core'
import {
  type BotonicPluginFlowBuilderOptions,
  FlowBuilderJSONVersion,
} from '@botonic/plugin-flow-builder'
import {
  KnowledgeBaseResponse,
  PluginKnowledgeBaseOptions,
} from '@botonic/plugin-knowledge-bases/src/types'
import { ActionRequest } from '@botonic/react'

import { ClientConfig, clientConfig } from '../client/config'
import { context } from './domain/user-data'
import { EventPropsMap, trackEvent } from './tracking'
import { BotRequest, BotSession } from './types'
import { ENVIRONMENT, isLocal, isProduction } from './utils/env-utils'

function getFlowBuilderConfig(
  env: ENVIRONMENT
): BotonicPluginFlowBuilderOptions {
  const FLOW_BUILDER_API_URL =
    process.env.HUBTYPE_API_URL || 'https://api.hubtype.com'
  return {
    apiUrl: FLOW_BUILDER_API_URL,
    jsonVersion: isLocal(env)
      ? FlowBuilderJSONVersion.DRAFT
      : FlowBuilderJSONVersion.LATEST,
    getLocale: (session: Session) => context(session as BotSession).locale,
    getAccessToken: () => 'ACCESS_TOKEN', // Used locally,
    trackEvent: async (request: ActionRequest, eventAction, args) => {
      await trackEvent(
        request as BotRequest,
        eventAction as keyof EventPropsMap,
        args as EventPropsMap[keyof EventPropsMap]
      )
    },
    getKnowledgeBaseResponse: async (
      request: ActionRequest,
      userInput: string,
      sources: string[]
    ): Promise<KnowledgeBaseResponse> => {
      try {
        const botRequest = request as unknown as BotRequest
        const knowledgeBasePlugin = botRequest.plugins.knowledgeBases
        const response = await knowledgeBasePlugin.getInference(
          botRequest.session,
          userInput,
          sources
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
          question: '',
          answer: '',
          hasKnowledge: false,
          isFaithuful: false,
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

interface Config extends ClientConfig {
  flowBuilder: BotonicPluginFlowBuilderOptions
  knowledgeBases: PluginKnowledgeBaseOptions
}

export const CONFIG: Record<ENVIRONMENT, Config> = {
  [ENVIRONMENT.LOCAL]: {
    ...clientConfig[ENVIRONMENT.LOCAL],
    flowBuilder: getFlowBuilderConfig(ENVIRONMENT.LOCAL),
    knowledgeBases: getKnowledgeBasesConfig(),
  },
  [ENVIRONMENT.STAGING]: {
    ...clientConfig[ENVIRONMENT.STAGING],
    flowBuilder: getFlowBuilderConfig(ENVIRONMENT.STAGING),
    knowledgeBases: getKnowledgeBasesConfig(),
  },
  [ENVIRONMENT.PRODUCTION]: {
    ...clientConfig[ENVIRONMENT.PRODUCTION],
    flowBuilder: getFlowBuilderConfig(ENVIRONMENT.PRODUCTION),
    knowledgeBases: getKnowledgeBasesConfig(),
  },
}
