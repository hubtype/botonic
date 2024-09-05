import { BotonicAction, BotonicActionType } from '@botonic/core'

export const getParsedAction = (botonicAction: BotonicActionType) => {
  const splittedAction = botonicAction.split(`${BotonicAction.CreateCase}:`)
  if (splittedAction.length <= 1) return undefined
  return JSON.parse(splittedAction[1])
}
