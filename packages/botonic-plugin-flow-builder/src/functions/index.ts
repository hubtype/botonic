import type { ActionRequest } from '@botonic/react'

import type {
  HtFunctionArgument,
  HtFunctionArguments,
  HtFunctionNode,
} from '../content-fields/hubtype-fields'

export const DEFAULT_FUNCTION_NAMES = [
  'check-queue-status',
  'get-channel-type',
  'check-country',
  'check-bot-variable',
]

export class CustomFunction {
  public functions: Record<any, any>
  public currentRequest: ActionRequest
  public locale: string

  constructor(
    functions: Record<any, any>,
    currentRequest: ActionRequest,
    locale: string
  ) {
    this.functions = functions
    this.currentRequest = currentRequest
    this.locale = locale
  }

  async call(functionNode: HtFunctionNode): Promise<string> {
    const functionNodeId = functionNode.id
    const functionArguments = getArgumentsByLocale(
      functionNode.content.arguments,
      this.locale
    )
    const nameValues = functionArguments.map(arg => {
      return { [arg.name]: arg.value }
    })

    const args = Object.assign(
      {
        request: this.currentRequest,
        results: functionNode.content.result_mapping.map(r => r.result),
      },
      ...nameValues
    )
    const functionResult =
      await this.functions[functionNode.content.action](args)
    // TODO define result_mapping per locale??
    const result = functionNode.content.result_mapping.find(
      r => r.result === functionResult
    )
    if (!result?.target) {
      throw new Error(
        `No result found for result_mapping for node with id: ${functionNodeId}`
      )
    }
    return result.target.id
  }
}

export function getArgumentsByLocale(
  args: HtFunctionArguments[],
  locale: string
): HtFunctionArgument[] {
  let resultArguments: HtFunctionArgument[] = []
  for (const arg of args) {
    if ('locale' in arg && arg.locale === locale) {
      resultArguments = [...resultArguments, ...arg.values]
    }
    if ('type' in arg) {
      resultArguments = [...resultArguments, arg]
    }
  }

  return resultArguments
}
