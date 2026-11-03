import type { BotContext } from '@botonic/core'
import axios from 'axios'
import { FLOW_BUILDER_API_URL_PROD } from '../constants'
import { getFlowBuilderPlugin } from '../utils/get-flow-builder-plugin'

export type SkipEmptyBotResponseResult = {
  id: string
  status: 'skipped'
  skip_reason: 'empty_bot_response'
}

export class CampaignsV2Api {
  private hubtypeApiUrl: string
  private accessToken: string
  private chatId: string

  constructor(botContext: BotContext) {
    this.hubtypeApiUrl =
      botContext.session._hubtype_api || FLOW_BUILDER_API_URL_PROD
    const flowBuilderPlugin = getFlowBuilderPlugin(botContext.plugins)
    this.accessToken = flowBuilderPlugin.getAccessToken(botContext.session)
    this.chatId = botContext.session.user.id
  }

  async skipEmptyBotResponse(
    campaignId: string
  ): Promise<SkipEmptyBotResponseResult> {
    const { data } = await axios.post<SkipEmptyBotResponseResult>(
      `${this.hubtypeApiUrl}/external/v2/campaigns/${campaignId}/skip/`,
      { chat_id: this.chatId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )
    return data
  }
}
