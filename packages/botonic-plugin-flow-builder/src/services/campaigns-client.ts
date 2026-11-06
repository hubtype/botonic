import type { BotContext } from '@botonic/core'
import axios from 'axios'

import { HubtypeClientBase } from './hubtype-client-base'

export type SkipEmptyBotResponseResult = {
  id: string
  status: 'skipped'
  skip_reason: 'empty_bot_response'
}

export class CampaignsClient extends HubtypeClientBase {
  private botId: string
  private chatId: string

  constructor(botContext: BotContext) {
    super(botContext)
    this.botId = botContext.session.bot.id
    this.chatId = botContext.session.user.id
  }

  async skipEmptyBotResponse(
    campaignId: string
  ): Promise<SkipEmptyBotResponseResult> {
    const { data } = await axios.post<SkipEmptyBotResponseResult>(
      `${this.hubtypeApiUrl}/external/v2/conversational_apps/${this.botId}/users/${this.chatId}/skip_campaign/`,
      { campaign_id: campaignId },
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
