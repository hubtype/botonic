import type { BotContext } from '@botonic/core'

import { CampaignsApi } from '../services/campaigns-api'
import { trackOneContent } from '../tracking'
import { getFlowBuilderPlugin } from '../utils/get-flow-builder-plugin'
import { ContentFieldsBase } from './content-fields-base'
import type { HtDoNothingNode } from './hubtype-fields'

export class FlowDoNothing extends ContentFieldsBase {
  static fromHubtypeCMS(cmsDoNothing: HtDoNothingNode): FlowDoNothing {
    const newDoNothing = new FlowDoNothing(cmsDoNothing.id)
    newDoNothing.code = cmsDoNothing.code
    newDoNothing.followUp = undefined

    return newDoNothing
  }

  private async skipCampaignIfNoBotResponse(
    botContext: BotContext
  ): Promise<void> {
    const flowBuilderPlugin = getFlowBuilderPlugin(botContext.plugins)
    const campaignExecution = flowBuilderPlugin.campaignExecution
    if (!campaignExecution.isActive() || campaignExecution.hasBotResponse) {
      return
    }
    const campaignId = campaignExecution.campaignId
    if (!campaignId) {
      return
    }

    const campaignsV2Api = new CampaignsApi(botContext)
    await campaignsV2Api.skipEmptyBotResponse(campaignId)
  }

  async trackFlow(botContext: BotContext): Promise<void> {
    await trackOneContent(botContext, this)
  }

  producesBotResponse(): boolean {
    return false
  }

  async processContent(botContext: BotContext): Promise<void> {
    await this.filterContent(botContext, this)
    await this.trackFlow(botContext)
    await this.skipCampaignIfNoBotResponse(botContext)
    return
  }

  toBotonic(): JSX.Element {
    return <></>
  }
}
