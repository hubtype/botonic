import {
  type BotContext,
  EventAction,
  type EventConditionalContactReasons,
} from '@botonic/core'

import {
  getCommonFlowContentEventArgsForContentId,
  trackEvent,
} from '../tracking'
import { findMatchingContactReasonBranch } from './contact-reasons-conditional-matcher'
import { ContentFieldsBase } from './content-fields-base'
import type { HtNodeLink } from './hubtype-fields/common'
import type {
  HtContactReasonBranch,
  HtContactReasonsNode,
} from './hubtype-fields/contact-reasons-conditional'

export class FlowContactReasonsConditional extends ContentFieldsBase {
  public contactReasons: HtContactReasonBranch[] = []
  public conditionalResult: string = ''
  public defaultTarget: HtNodeLink

  static fromHubtypeCMS(
    component: HtContactReasonsNode,
    botContext: BotContext
  ): FlowContactReasonsConditional {
    const newContactReasonsConditional = new FlowContactReasonsConditional(
      component.id
    )
    newContactReasonsConditional.contactReasons =
      component.content.contact_reasons
    newContactReasonsConditional.defaultTarget =
      component.content.default_target
    newContactReasonsConditional.setFollowUp(botContext)
    return newContactReasonsConditional
  }

  private setFollowUp(botContext: BotContext): void {
    const sessionContactReasons =
      botContext.session._hubtype_case_contact_reasons

    const matchingBranch = sessionContactReasons
      ? findMatchingContactReasonBranch(
          sessionContactReasons,
          this.contactReasons
        )
      : undefined

    if (matchingBranch) {
      this.conditionalResult = matchingBranch.name
      this.followUp = matchingBranch.target
    } else {
      this.conditionalResult = 'default'
      this.followUp = this.defaultTarget
    }
  }

  async trackFlow(botContext: BotContext): Promise<void> {
    const { flowThreadId, flowId, flowName, flowNodeId, flowNodeContentId } =
      getCommonFlowContentEventArgsForContentId(botContext, this.id)
    const eventContactReasonsConditional: EventConditionalContactReasons = {
      action: EventAction.ConditionalContactReasons,
      flowThreadId,
      flowId,
      flowName,
      flowNodeId,
      flowNodeContentId,
      flowNodeIsMeaningful: false,
      contactReasons:
        botContext.session._hubtype_case_contact_reasons?.map(
          contactReason => contactReason.name
        ) || [],
      result: this.conditionalResult,
    }
    const { action, ...eventArgs } = eventContactReasonsConditional
    await trackEvent(botContext, action, eventArgs)
    return
  }

  async processContent(botContext: BotContext): Promise<void> {
    await this.filterContent(botContext, this)
    await this.trackFlow(botContext)
    return
  }

  toBotonic() {
    return <></>
  }
}
