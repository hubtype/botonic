/* eslint-disable @typescript-eslint/naming-convention */
import {
  Input,
  PluginPostRequest,
  PluginPreRequest,
  PROVIDER,
  ProviderType,
  ResolvedPlugins,
} from '@botonic/core'
import { ActionRequest } from '@botonic/react'

import BotonicPluginFlowBuilder, {
  FlowBuilderAction,
  FlowBuilderActionProps,
  FlowContent,
} from '../../src'
import {
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
}

export function createFlowBuilderPlugin({
  flow,
  trackEvent,
  getKnowledgeBaseResponse,
  getAiAgentResponse,
  inShadowing,
  contentFilters,
}: FlowBuilderOptions): BotonicPluginFlowBuilder {
  const flowBuilderPlugin = new BotonicPluginFlowBuilder({
    flow,
    getAccessToken: () => 'fake_token',
    trackEvent,
    getKnowledgeBaseResponse,
    getAiAgentResponse,
    inShadowing,
    contentFilters,
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
}: RequestArgs): PluginPreRequest {
  return {
    session: {
      is_first_interaction: isFirstInteraction,
      organization: 'orgTest',
      organization_id: 'orgIdTest',
      bot: { id: 'bid1' },
      user: {
        provider,
        id: 'uid1',
        locale: user.locale,
        country: user.country,
        system_locale: user.systemLocale,
        extra_data: extraData,
      },
      _shadowing: shadowing,
      _hubtype_case_id: hubtypeCaseId,
      __retries: 0,
      _access_token: 'fake_access_token',
      _hubtype_api: 'https://api.hubtype.com',
      is_test_integration: false,
      flow_thread_id: 'testFlowThreadId',
      flow_builder: {
        capture_user_input_id: captureUserInputId,
      },
    },
    input: {
      bot_interaction_id: 'testInteractionId',
      message_id: 'testMessageId',
      ...input,
    },
    lastRoutePath: '',
    plugins,
    getUserCountry: () => user.country,
    getUserLocale: () => user.locale,
    getSystemLocale: () => user.systemLocale,
    setUserCountry: (_country: string) => {
      user.country = _country
      return
    },
    setUserLocale: (_locale: string) => {
      return
    },
    setSystemLocale: (_locale: string) => {
      return
    },
    params: {},
    defaultDelay: 0,
    defaultTyping: 0,
  }
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
      // @ts-ignore
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
