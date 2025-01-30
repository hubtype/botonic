import {
  BotonicAction,
  HubtypeHandoffParams,
  Plugin,
  PluginPostRequest,
} from '@botonic/core'

export default class PreHandoffPlugin implements Plugin {
  post(request: PluginPostRequest): void {
    if (isHandoff(request)) {
      const params: HubtypeHandoffParams = {}
      addHandoffParams(request, params)
    }
  }
}

function isHandoff(request: PluginPostRequest): boolean {
  const botonicAction = request.session._botonic_action
  return !!botonicAction && botonicAction.startsWith(BotonicAction.CreateCase)
}

function addHandoffParams(
  request: PluginPostRequest,
  newParams: HubtypeHandoffParams
): void {
  const botonicAction = request.session._botonic_action as string

  const handoffParams = JSON.parse(
    botonicAction.split(`${BotonicAction.CreateCase}:`)[1]
  )

  const botonicActionParams = { ...handoffParams, ...newParams }

  request.session._botonic_action = `${BotonicAction.CreateCase}:${JSON.stringify(
    botonicActionParams
  )}`
}
