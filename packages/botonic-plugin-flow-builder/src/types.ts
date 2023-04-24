import { Session } from '@botonic/core'

import { FlowBuilderData } from './flow-builder-models'

export interface BotonicPluginFlowBuilderOptions {
  flowUrl: string
  flow?: FlowBuilderData
  customFunctions?: Record<any, any>
  getLocale: (session: Session) => string
  getAccessToken: () => string
}

export enum ProcessEnvNodeEnvs {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}
