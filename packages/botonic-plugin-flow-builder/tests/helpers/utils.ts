/* eslint-disable @typescript-eslint/naming-convention */
import {
  Input,
  PluginPreRequest,
  PROVIDER,
  ProviderType,
  ResolvedPlugins,
} from '@botonic/core'
import { ActionRequest } from '@botonic/react'
import { v4 as uuid } from 'uuid'

import BotonicPluginFlowBuilder, {
  FlowBuilderAction,
  FlowBuilderActionProps,
} from '../../src'
import { KnowledgeBaseFunction, TrackEventFunction } from '../../src/types'

interface FlowBuilderOptions {
  flow: any
  locale?: string
  trackEvent?: TrackEventFunction
  getKnowledgeBaseResponse?: KnowledgeBaseFunction
}

export function createFlowBuilderPlugin({
  flow,
  locale = 'en',
  trackEvent,
  getKnowledgeBaseResponse,
}: FlowBuilderOptions) {
  const flowBuilderPlugin = new BotonicPluginFlowBuilder({
    flow,
    getLocale: () => locale,
    getAccessToken: () => 'fake_token',
    trackEvent,
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
  extraData?: any
}

export function createRequest({
  input,
  plugins = {},
  provider = PROVIDER.WEBCHAT,
  isFirstInteraction = false,
  extraData = {},
}: RequestArgs): PluginPreRequest {
  return {
    session: {
      is_first_interaction: isFirstInteraction,
      organization: 'orgTest',
      organization_id: 'orgIdTest',
      bot: { id: 'bid1' },
      user: { provider, id: 'uid1', extra_data: extraData },
      __retries: 0,
      _access_token: 'fake_access_token',
      _hubtype_api: 'https://api.hubtype.com',
      is_test_integration: false,
    },
    input: { ...input, message_id: uuid() },
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
