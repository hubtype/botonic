import { Session } from '@botonic/core'
import { ActionRequest } from '@botonic/react'

import { FlowBuilderData } from './flow-builder-models'

export interface BotonicPluginFlowBuilderOptions {
  flowUrl: string
  flow?: FlowBuilderData
  customFunctions?: Record<any, any>
  getLocale: (session: Session) => string
  getAccessToken: () => string
  trackEvent?: (
    request: ActionRequest,
    eventName: string,
    args?: Record<string, any>
  ) => Promise<void>
}

export enum ProcessEnvNodeEnvs {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}
