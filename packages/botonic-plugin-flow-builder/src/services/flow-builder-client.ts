import type { BotContext } from '@botonic/core'
import axios from 'axios'
import type { HtFlowBuilderData } from '../content-fields/hubtype-fields'
import { FlowBuilderJSONVersion } from '../types'
import { getFlowBuilderPlugin } from '../utils/get-flow-builder-plugin'
import { HubtypeClientBase } from './hubtype-client-base'

export class FlowBuilderClient extends HubtypeClientBase {
  private botContext: BotContext
  private jsonVersion: FlowBuilderJSONVersion

  constructor(botContext: BotContext) {
    super(botContext)
    this.botContext = botContext

    const flowBuilderPlugin = getFlowBuilderPlugin(botContext.plugins)
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

    this.botContext.session.organization_id = response.data.organization_id
    this.botContext.session.bot.id = response.data.bot_id
  }
}
