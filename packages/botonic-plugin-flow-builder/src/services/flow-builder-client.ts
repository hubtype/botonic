import type { BotContext } from '@botonic/core'
import axios from 'axios'
import { HUBTYPE_API_URL } from '../constants'
import type { HtFlowBuilderData } from '../content-fields/hubtype-fields'
import { FlowBuilderJSONVersion } from '../types'
import { getFlowBuilderPlugin } from '../utils/get-flow-builder-plugin'

export class FlowBuilderClient {
  private botContext: BotContext
  private accessToken: string
  private hubtypeApiUrl: string
  private jsonVersion: FlowBuilderJSONVersion

  constructor(botContext: BotContext) {
    this.botContext = botContext
    this.hubtypeApiUrl = botContext.settings?.HUBTYPE_API_URL || HUBTYPE_API_URL
    const flowBuilderPlugin = getFlowBuilderPlugin(botContext.plugins)
    this.accessToken = flowBuilderPlugin.getAccessToken(botContext.session)
    this.jsonVersion = botContext.session.is_test_integration
      ? FlowBuilderJSONVersion.DRAFT
      : flowBuilderPlugin.jsonVersion
  }

  async getFlow(): Promise<HtFlowBuilderData> {
    const botId = this.botContext.session.bot.id
    const { data } = await axios.get<HtFlowBuilderData>(
      `${this.hubtypeApiUrl}/v1/bot_flows/${botId}/versions/${this.jsonVersion}/`,
      {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      }
    )
    return data
  }

  async updateSessionWithUserInfo() {
    const url = `${this.hubtypeApiUrl}/v1/flow_builder/user_info/`
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    })
    console.log('updateSessionWithUserInfo:', this.botContext.session.bot.id)

    this.botContext.session.organization_id = response.data.organization_id
    this.botContext.session.bot.id = response.data.bot_id
  }
}
