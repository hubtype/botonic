import { Session } from '@botonic/core'
import {
  type BotonicPluginFlowBuilderOptions,
  FlowBuilderJSONVersion,
} from '@botonic/plugin-flow-builder'

import { context } from './domain/user-data'
import { BotSession } from './types'
import { ENVIRONMENT, isLocal } from './utils/env-utils'

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
    getAccessToken: () => '3640aad404dfd7b1da0e4dd74440fa', // Used locally,
  }
}

interface Config {
  flowBuilder: BotonicPluginFlowBuilderOptions
}

export const CONFIG: Record<ENVIRONMENT, Config> = {
  [ENVIRONMENT.LOCAL]: {
    flowBuilder: getFlowBuilderConfig(ENVIRONMENT.LOCAL),
  },
  [ENVIRONMENT.PRODUCTION]: {
    flowBuilder: getFlowBuilderConfig(ENVIRONMENT.PRODUCTION),
  },
}
