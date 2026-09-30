import type { BotContext, HubtypeCaseContactReason } from '@botonic/core'
import { findMatchingContactReasonBranch } from './contact-reasons-conditional-matcher'
import { ContentFieldsBase } from './content-fields-base'
import type { HtNodeLink } from './hubtype-fields/common'
import type {
  HtContactReasonBranch,
  HtContactReasonsNode,
} from './hubtype-fields/contact-reasons-conditional'

export class FlowContactReasonsConditional extends ContentFieldsBase {
  public contactReasons: HtContactReasonBranch[] = []
  public discardedTarget?: HtNodeLink
  public discardedByUserTarget?: HtNodeLink
  public discardedBySystemTarget?: HtNodeLink
  public defaultTarget?: HtNodeLink

  static fromHubtypeCMS(
    component: HtContactReasonsNode,
    botContext: BotContext
  ): FlowContactReasonsConditional {
    const newContactReasonsConditional = new FlowContactReasonsConditional(
      component.id
    )
    newContactReasonsConditional.contactReasons =
      component.content.contact_reasons
    newContactReasonsConditional.discardedTarget =
      component.content.discarded_target
    newContactReasonsConditional.discardedByUserTarget =
      component.content.discarded_by_user_target
    newContactReasonsConditional.discardedBySystemTarget =
      component.content.discarded_by_system_target
    newContactReasonsConditional.defaultTarget =
      component.content.default_target
    newContactReasonsConditional.setFollowUp(botContext)
    return newContactReasonsConditional
  }

  private setFollowUp(botContext: BotContext): void {
    const sessionContactReasons: HubtypeCaseContactReason[] | undefined =
      botContext.session._hubtype_case_contact_reasons

    if (sessionContactReasons) {
      const matchingBranch = findMatchingContactReasonBranch(
        sessionContactReasons,
        this.contactReasons
      )
      if (matchingBranch?.target) {
        this.followUp = matchingBranch.target
      }
    }

    if (sessionContactReasons?.some(reason => reason.name === 'discarded')) {
      this.followUp = this.discardedTarget
    }
    if (
      sessionContactReasons?.some(reason => reason.name === 'discarded_by_user')
    ) {
      this.followUp = this.discardedByUserTarget
    }
    if (
      sessionContactReasons?.some(
        reason => reason.name === 'discarded_by_system'
      )
    ) {
      this.followUp = this.discardedBySystemTarget
    }

    this.followUp ??= this.defaultTarget
  }

  async trackFlow(_botContext: BotContext): Promise<void> {
    // await trackFlow(botContext)
    return
  }

  async processContent(_botContext: BotContext): Promise<void> {
    // await this.filterContent(botContext, this)
    // await this.trackFlow(botContext)
    return
  }

  toBotonic() {
    return <></>
  }
}
