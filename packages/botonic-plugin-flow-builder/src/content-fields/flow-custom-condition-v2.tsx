import {
  type BotContext,
  EventAction,
  type EventConditionalCustom,
} from '@botonic/core'
import {
  getCommonFlowContentEventArgsForContentId,
  trackEvent,
} from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import {
  evaluateBooleanCondition,
  evaluateNumberCondition,
  evaluateStringCondition,
} from './custom-conditional-v2-evaluators'
import {
  type ConditionMatch,
  findLastMatchingCondition,
  resolveWithDefaultTarget,
} from './custom-conditional-v2-resolver'
import {
  type HtBooleanCondition,
  type HtCondition,
  type HtCustomConditionalV2Node,
  type HtNodeLink,
  type HtNumberCondition,
  type HtStringCondition,
  VariableFormat,
} from './hubtype-fields'

export class FlowCustomConditionalV2 extends ContentFieldsBase {
  public variableFormat: VariableFormat
  public keyPath: string
  public conditions: HtCondition[]
  public defaultTarget: HtNodeLink
  public customResult = ''
  public operator = ''

  static fromHubtypeCMS(
    component: HtCustomConditionalV2Node,
    botContext: BotContext
  ): FlowCustomConditionalV2 {
    const newCustomConditionalV2 = new FlowCustomConditionalV2(component.id)
    newCustomConditionalV2.code = component.code
    newCustomConditionalV2.variableFormat = component.content.type
    newCustomConditionalV2.keyPath = component.content.key_path
    newCustomConditionalV2.conditions = component.content.conditions
    newCustomConditionalV2.defaultTarget = component.content.default_target
    newCustomConditionalV2.setFollowUp(botContext)

    return newCustomConditionalV2
  }

  private setFollowUp(botContext: BotContext): void {
    const botVariable = this.getValueFromKeyPath(botContext, this.keyPath)
    const resolved = this.evaluateConditions(botVariable)

    this.customResult = resolved.customResult
    this.operator = resolved.operator
    this.followUp = resolved.target
  }

  private evaluateConditions(botVariable: unknown): ConditionMatch {
    switch (this.variableFormat) {
      case VariableFormat.String: {
        const match = findLastMatchingCondition(
          this.conditions as HtStringCondition[],
          botVariable,
          this.variableFormat,
          (variable, condition) =>
            evaluateStringCondition(variable as string, condition)
        )
        return resolveWithDefaultTarget(match, this.defaultTarget, this.code)
      }
      case VariableFormat.Number: {
        const match = findLastMatchingCondition(
          this.conditions as HtNumberCondition[],
          botVariable,
          this.variableFormat,
          (variable, condition) =>
            evaluateNumberCondition(variable as number, condition)
        )
        return resolveWithDefaultTarget(match, this.defaultTarget, this.code)
      }
      case VariableFormat.Boolean: {
        const match = findLastMatchingCondition(
          this.conditions as HtBooleanCondition[],
          botVariable,
          this.variableFormat,
          (variable, condition) =>
            evaluateBooleanCondition(variable as boolean, condition)
        )
        return resolveWithDefaultTarget(
          match,
          this.defaultTarget,
          this.code,
          'false'
        )
      }
      default:
        throw new Error(
          `Invalid variable format ${this.variableFormat} for custom condition node ${this.code}`
        )
    }
  }

  async trackFlow(botContext: BotContext): Promise<void> {
    const { flowThreadId, flowId, flowName, flowNodeId, flowNodeContentId } =
      getCommonFlowContentEventArgsForContentId(botContext, this.id)

    const eventCustomConditional: EventConditionalCustom = {
      action: EventAction.ConditionalCustom,
      flowThreadId,
      flowId,
      flowName,
      flowNodeId,
      flowNodeContentId,
      flowNodeIsMeaningful: false,
      conditionalVariable: this.customResult,
      variableFormat: this.variableFormat,
      operator: this.operator,
    }
    const { action, ...eventArgs } = eventCustomConditional
    await trackEvent(botContext, action, eventArgs)
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
