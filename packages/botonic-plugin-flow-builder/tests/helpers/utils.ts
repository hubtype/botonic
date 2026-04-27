/* eslint-disable @typescript-eslint/naming-convention */
import {
  type ContactInfo,
  type Input,
  type PluginPostRequest,
  type PluginPreRequest,
  PROVIDER,
  type ProviderType,
  type ResolvedPlugins,
} from '@botonic/core'
import { createTestPluginPreRequest } from '@botonic/core/testing'
import type { ActionRequest } from '@botonic/react'

import BotonicPluginFlowBuilder, {
  FlowBuilderAction,
  type FlowBuilderActionProps,
  type FlowContent,
} from '../../src'
import type {
  AiAgentFunction,
  ContentFilter,
  InShadowingConfig,
  KnowledgeBaseFunction,
  TrackEventFunction,
} from '../../src/types'

interface FlowBuilderOptions {
  flow: any
  trackEvent?: TrackEventFunction<ResolvedPlugins>
  getKnowledgeBaseResponse?: KnowledgeBaseFunction<ResolvedPlugins>
  getAiAgentResponse?: AiAgentFunction<ResolvedPlugins>
  inShadowing?: Partial<InShadowingConfig>
  contentFilters?: ContentFilter[]
  disableAIAgentInFirstInteraction?: boolean
}

export function createFlowBuilderPlugin({
  flow,
  trackEvent,
  getKnowledgeBaseResponse,
  getAiAgentResponse,
  inShadowing,
  contentFilters,
  disableAIAgentInFirstInteraction,
}: FlowBuilderOptions): BotonicPluginFlowBuilder {
  const flowBuilderPlugin = new BotonicPluginFlowBuilder({
    flow,
    getAccessToken: () => 'fake_token',
    trackEvent,
    getKnowledgeBaseResponse,
    getAiAgentResponse,
    inShadowing,
    contentFilters,
    disableAIAgentInFirstInteraction,
  })

  return flowBuilderPlugin
}

interface RequestArgs {
  input: Omit<Input, 'bot_interaction_id' | 'message_id'>
  plugins?: ResolvedPlugins
  provider?: ProviderType
  isFirstInteraction?: boolean
  extraData?: any
  shadowing?: boolean
  user?: {
    locale: string
    country: string
    systemLocale: string
  }
  hubtypeCaseId?: string
  captureUserInputId?: string
  contactInfo?: ContactInfo[]
}

export function createRequest({
  input,
  plugins = {},
  provider = PROVIDER.WEBCHAT,
  isFirstInteraction = false,
  user = {
    locale: 'en',
    country: 'US',
    systemLocale: 'en',
  },
  extraData = {},
  shadowing = false,
  hubtypeCaseId,
  captureUserInputId,
  contactInfo = [],
}: RequestArgs): PluginPreRequest {
  return createTestPluginPreRequest({
    session: {
      isFirstInteraction,
      organization: 'orgTest',
      organizationId: 'orgIdTest',
      botId: 'bid1',
      user: {
        id: 'uid1',
        provider,
        locale: user.locale,
        country: user.country,
        systemLocale: user.systemLocale,
        contactInfo,
        extraData,
      },
      shadowing,
      hubtypeCaseId,
      captureUserInputNodeId: captureUserInputId,
    },
    input: {
      bot_interaction_id: 'testInteractionId',
      message_id: 'testMessageId',
      ...input,
    } as Input,
    plugins,
  })
}

export async function getContentsAfterPreAndBotonicInit(
  request: PluginPreRequest,
  flowBuilderPlugin: BotonicPluginFlowBuilder
): Promise<FlowBuilderActionProps> {
  await flowBuilderPlugin.pre(request)
  const actionRequest = getActionRequest(request)
  return await FlowBuilderAction.botonicInit(actionRequest)
}

export function getActionRequest(request: PluginPreRequest): ActionRequest {
  return {
    ...request,
    lastRoutePath: 'flow-builder-action',
    defaultDelay: 0,
    defaultTyping: 0,
    params: {},
  }
}
interface FlowBuilderPluginAndGetContentsArgs {
  flowBuilderOptions: FlowBuilderOptions
  requestArgs: RequestArgs
}

export async function createFlowBuilderPluginAndGetContents({
  flowBuilderOptions,
  requestArgs,
}: FlowBuilderPluginAndGetContentsArgs): Promise<{
  contents: FlowContent[]
  request: PluginPreRequest
  flowBuilderPluginPost: (request: PluginPostRequest) => void
}> {
  const flowBuilderPlugin = createFlowBuilderPlugin(flowBuilderOptions)

  const request = createRequest({
    ...requestArgs,
    plugins: {
      flowBuilderPlugin,
    },
  })

  const { contents } = await getContentsAfterPreAndBotonicInit(
    request,
    flowBuilderPlugin
  )

  const flowBuilderPluginPost = (request: PluginPostRequest) => {
    flowBuilderPlugin.post(request)
  }

  return { contents, request, flowBuilderPluginPost }
}
