import { PluginPreRequest, Session } from '@botonic/core'
import { ActionRequest } from '@botonic/react'

import { HtFlowBuilderData } from './content-fields/hubtype-fields'

export interface BotonicPluginFlowBuilderOptions {
  flowUrl: string
  flow?: HtFlowBuilderData
  customFunctions?: Record<any, any>
  getLocale: (session: Session) => string
  getAccessToken: () => string
  trackEvent?: (
    request: ActionRequest,
    eventName: string,
    args?: Record<string, any>
  ) => Promise<void>
}

export interface FlowBuilderApiOptions {
  url: string
  flow?: HtFlowBuilderData
  accessToken: string
  request: PluginPreRequest
}

export enum ProcessEnvNodeEnvs {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}
