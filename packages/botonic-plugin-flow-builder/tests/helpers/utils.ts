import {
  Input,
  PluginPreRequest,
  PROVIDER,
  ProviderType,
  ResolvedPlugins,
} from '@botonic/core'
import { ActionRequest } from '@botonic/react'

import BotonicPluginFlowBuilder from '../../src'

export function createFlowBuilderPlugin(flow: any, locale: string = 'es') {
  const flowBuilderPlugin = new BotonicPluginFlowBuilder({
    flow,
    getLocale: () => locale,
    getAccessToken: () => 'fake_token',
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
}

export function createRequest({
  input,
  plugins = {},
  provider = PROVIDER.WEBCHAT,
  isFirstInteraction = false,
}: RequestArgs): PluginPreRequest {
  return {
    session: {
      is_first_interaction: isFirstInteraction,
      organization: 'orgTest',
      organization_id: 'orgIdTest',
      bot: { id: 'bid1' },
      user: { provider, id: 'uid1', extra_data: {} },
      __retries: 0,
      _hubtype_api: 'https://api.hubtype.com',
      _access_token: 'fake_access_token',
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
