import { ActionRequest } from '@botonic/react'
import React from 'react'

import { getValueFromKeyPath } from '../utils'
import { ContentFieldsBase } from './content-fields-base'
import { HtCustomConditionalNode } from './hubtype-fields/custom-conditional'
import {
  HtFunctionArguments,
  HtFunctionResult,
} from './hubtype-fields/function'

export class FlowCustomConditional extends ContentFieldsBase {
  public arguments: HtFunctionArguments[] = []
  public resultMapping: HtFunctionResult[]
  public conditionalResult?: HtFunctionResult = undefined

  static fromHubtypeCMS(
    component: HtCustomConditionalNode,
    request: ActionRequest
  ): FlowCustomConditional {
    const newCustomConditional = new FlowCustomConditional(component.id)
    newCustomConditional.code = component.code
    newCustomConditional.arguments = component.content.arguments
    newCustomConditional.resultMapping = component.content.result_mapping
    newCustomConditional.setConditionalResult(request)

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
    const conditionalResult =
      this.resultMapping.find(rMap => rMap.result === botVariable) ||
      this.resultMapping.find(rMap => rMap.result === 'default')

    if (!conditionalResult) {
      throw new Error(
        `No conditional result found for node ${this.code} with key path: ${keyPath}`
      )
    }

    this.conditionalResult = conditionalResult
    console.log('FlowCustomConditional followUp', conditionalResult.target)
    this.followUp = conditionalResult.target
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async trackFlow(_request: ActionRequest): Promise<void> {
    // TODO: Implement tracking for custom conditional
  }

  toBotonic() {
    return <></>
  }
}
