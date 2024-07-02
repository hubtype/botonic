/* eslint-disable @typescript-eslint/naming-convention */
import {
  Input,
  PluginPreRequest,
  PROVIDER,
  ProviderType,
  ResolvedPlugins,
} from '@botonic/core'
import { ActionRequest } from '@botonic/react'

import BotonicPluginFlowBuilder, {
  FlowBuilderAction,
  FlowBuilderActionProps,
} from '../../src'
import { KnowledgeBaseFunction } from '../../src/types'

interface FlowBuilderOptions {
  flow: any
  locale?: string
  getKnowledgeBaseResponse?: KnowledgeBaseFunction
}

export function createFlowBuilderPlugin({
  flow,
  locale = 'en',
  getKnowledgeBaseResponse,
}: FlowBuilderOptions) {
  const flowBuilderPlugin = new BotonicPluginFlowBuilder({
    flow,
    getLocale: () => locale,
    getAccessToken: () => 'fake_token',
    getKnowledgeBaseResponse,
  })

  // @ts-ignore
  flowBuilderPlugin.id = 'flowBuilder'
  // @ts-ignore
  flowBuilderPlugin.name = 'BotonicPluginFlowBuilder'
  // @ts-ignore
  flowBuilderPlugin.config = {}

  return flowBuilderPlugin
}

interface RequestArgs {
  input: Input
  plugins?: ResolvedPlugins
  provider?: ProviderType
  isFirstInteraction?: boolean
  isTestIntegration?: boolean
  extraData?: any
}

export function createRequest({
  input,
  plugins = {},
  provider = PROVIDER.WEBCHAT,
  isFirstInteraction = false,
  isTestIntegration = false,
  extraData = {},
}: RequestArgs): PluginPreRequest {
  return {
    session: {
      is_first_interaction: isFirstInteraction,
      is_test_integration: isTestIntegration,
      organization: 'orgTest',
      organization_id: 'orgIdTest',
      bot: { id: 'bid1' },
      user: { provider, id: 'uid1', extra_data: extraData },
      __retries: 0,
      _access_token: 'fake_access_token',
      _hubtype_api: 'https://api.hubtype.com',
    },
    input,
    lastRoutePath: '',
    plugins,
  }
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

export async function getContentsAfterPreAndBotonicInit(
  request: PluginPreRequest,
  flowBuilderPlugin: BotonicPluginFlowBuilder
): Promise<FlowBuilderActionProps> {
  await flowBuilderPlugin.pre(request)
  const actionRequest = getActionRequest(request)
  return await FlowBuilderAction.botonicInit(actionRequest)
}

interface FlowBuilderPluginAndGetContentsArgs {
  flowBuilderOptions: FlowBuilderOptions
  requestArgs: RequestArgs
}

export function createFlowBuilderPluginAndGetContents({
  flowBuilderOptions,
  requestArgs,
}: FlowBuilderPluginAndGetContentsArgs): Promise<FlowBuilderActionProps> {
  const flowBuilderPlugin = createFlowBuilderPlugin(flowBuilderOptions)
  const request = createRequest({
    ...requestArgs,
    plugins: {
      // @ts-ignore
      flowBuilderPlugin,
    },
  })
  return getContentsAfterPreAndBotonicInit(request, flowBuilderPlugin)
}
