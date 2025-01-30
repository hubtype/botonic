import { Session } from '@botonic/core'
import PluginFlowBuilder from '@botonic/plugin-flow-builder'

import { context, UserData } from '../domain/user-data'
import { BotRequest, ContextWithLocale } from '../types'

export type ActionData = {
  session: Session
  cmsPlugin: PluginFlowBuilder
  userData: UserData
  botContext: ContextWithLocale
  payload: string
  userInput: string
  referral: string
}

export function getRequestData(request: BotRequest): ActionData {
  return {
    session: request.session,
    cmsPlugin: request.plugins.flowBuilder,
    userData: UserData.get(request.session),
    botContext: context(request.session),
    payload: request.input.payload as string,
    userInput: request.input.data as string,
    referral: request.input.referral as string,
  }
}
