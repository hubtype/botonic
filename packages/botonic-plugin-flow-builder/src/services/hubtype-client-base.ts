import type { BotContext } from '@botonic/core'
import { HUBTYPE_API_URL } from '../constants'
import { getFlowBuilderPlugin } from '../utils/get-flow-builder-plugin'

/*  
    This class set accessToken and hubtypeApiUrl, 
    this is need in botonic legacy because when bot run in serve modo,
    not has connection with the backend 
*/
export class HubtypeClientBase {
  protected accessToken: string
  protected hubtypeApiUrl: string

  constructor(botContext: BotContext) {
    const flowBuilderPlugin = getFlowBuilderPlugin(botContext.plugins)
    this.accessToken = flowBuilderPlugin.getAccessToken(botContext.session)
    this.hubtypeApiUrl = botContext.settings?.HUBTYPE_API_URL || HUBTYPE_API_URL
  }
}
