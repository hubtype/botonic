import { EventAction, type EventConditionalCustom } from '@botonic/core'
import type { ActionRequest } from '@botonic/react'

import {
  getCommonFlowContentEventArgsForContentId,
  trackEvent,
} from '../tracking'
import { getValueFromKeyPath } from '../utils'
import { ContentFieldsBase } from './content-fields-base'
import type { HtCustomConditionalNode } from './hubtype-fields/custom-conditional'
import type {
  HtFunctionArgument,
  HtFunctionArguments,
  HtFunctionResult,
} from './hubtype-fields/function'

export class FlowCustomConditional extends ContentFieldsBase {
  public arguments: HtFunctionArguments[] = []
  public resultMapping: HtFunctionResult[]
  public conditionalResult?: HtFunctionResult = undefined
  public customResult: boolean = false
  public variableFormat: string = ''

  static fromHubtypeCMS(
    component: HtCustomConditionalNode,
    request: ActionRequest
  ): FlowCustomConditional {
    const newCustomConditional = new FlowCustomConditional(component.id)
    newCustomConditional.code = component.code
    newCustomConditional.arguments = component.content.arguments
    newCustomConditional.resultMapping = component.content.result_mapping
    newCustomConditional.setConditionalResult(request)
    newCustomConditional.variableFormat = (
      component.content.arguments as HtFunctionArgument[]
    )[0].type

    return newCustomConditional
  }

  setConditionalResult(request: ActionRequest): void {
    const functionArgument = this.arguments.find(arg => {
      if ('name' in arg) {
        return arg.name === 'keyPath'
      }
      return false
    })

    let keyPath = ''

    if (functionArgument && 'value' in functionArgument) {
      keyPath = functionArgument.value
    } else {
      throw new Error(`Key path not found for node ${this.code}`)
    }

    const botVariable = getValueFromKeyPath(request, keyPath)

    let conditionalResult =
      this.resultMapping.find(rMap => rMap.result === botVariable) ||
      this.resultMapping.find(rMap => rMap.result === 'default')

    if (
      this.isBooleanConditional(this.resultMapping) &&
      typeof botVariable !== 'boolean'
    ) {
      conditionalResult =
        this.resultMapping.find(
          rMap =>
            rMap.result === (botVariable !== undefined && botVariable !== null)
        ) || this.resultMapping.find(rMap => rMap.result === 'default')
    }

    if (!conditionalResult) {
      throw new Error(
        `No conditional result found for node ${this.code} with key path: ${keyPath}`
      )
    }

    this.conditionalResult = conditionalResult
    this.customResult = conditionalResult.result as unknown as boolean
    this.followUp = conditionalResult.target
  }

  async trackFlow(request: ActionRequest): Promise<void> {
    const { flowThreadId, flowId, flowName, flowNodeId, flowNodeContentId } =
      getCommonFlowContentEventArgsForContentId(request, this.id)
    if (!this.conditionalResult?.result) {
      console.warn(
        `Tracking event for node ${this.code} but no conditional result found`
      )
    }
    const eventCustomConditional: EventConditionalCustom = {
      action: EventAction.ConditionalCustom,
      flowThreadId,
      flowId,
      flowName,
      flowNodeId,
      flowNodeContentId,
      flowNodeIsMeaningful: false,
      conditionalVariable: this.customResult.toString(),
      variableFormat: this.variableFormat,
    }
    const { action, ...eventArgs } = eventCustomConditional
    await trackEvent(request, action, eventArgs)
  }

  private isBooleanConditional(resultMapping: HtFunctionResult[]): boolean {
    return (
      resultMapping.some(rMap => rMap.result === true) &&
      resultMapping.some(rMap => rMap.result === false) &&
      resultMapping.some(rMap => rMap.result === 'default')
    )
  }

  toBotonic() {
    return <></>
  }
}
