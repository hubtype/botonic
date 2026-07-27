import type { PluginAiAgentOptions } from '@botonic/plugin-ai-agents'
import {
  type BotonicPluginFlowBuilderOptions,
  FlowBuilderJSONVersion,
} from '@botonic/plugin-flow-builder'

import type { UserData } from './domain/user-data'
import type { BotPlugins } from './plugins'
import { customTools } from './tools'
import { trackEvent } from './tracking'
import type { BotRequest } from './types'
import { ENVIRONMENT, isLocal } from './utils/env-utils'

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
}

export const CONFIG: Record<ENVIRONMENT, Config> = {
  [ENVIRONMENT.LOCAL]: {
    aiAgents: getAiAgentsConfig(),
    flowBuilder: getFlowBuilderConfig(ENVIRONMENT.LOCAL),
  },
  [ENVIRONMENT.PRODUCTION]: {
    aiAgents: getAiAgentsConfig(),
    flowBuilder: getFlowBuilderConfig(ENVIRONMENT.PRODUCTION),
  },
}
