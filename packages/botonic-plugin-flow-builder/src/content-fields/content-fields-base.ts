import { ActionRequest } from '@botonic/react'

import {
  ACCESS_TOKEN_VARIABLE_KEY,
  VARIABLE_PATTERN_GLOBAL,
} from '../constants'
import { getValueFromKeyPath } from '../utils'
import {
  HtMediaFileLocale,
  HtNodeLink,
  HtQueueLocale,
  HtTextLocale,
  HtVideoLocale,
} from './hubtype-fields'

export abstract class ContentFieldsBase {
  public code: string
  public followUp?: HtNodeLink

  constructor(public readonly id: string) {}

  abstract trackFlow(request: ActionRequest): Promise<void>

  static getTextByLocale(locale: string, text: HtTextLocale[]): string {
    const result = text.find(t => t.locale === locale)
    return result?.message ?? ''
  }

  static getAssetByLocale(locale: string, asset: HtMediaFileLocale[]): string {
    const result = asset.find(i => i.locale === locale)
    return result?.file ?? ''
  }

  static getVideoByLocale(locale: string, video: HtVideoLocale[]): string {
    const result = video.find(v => v.locale === locale)
    return result?.url ?? ''
  }

  static getQueueByLocale(
    locale: string,
    queues: HtQueueLocale[]
  ): HtQueueLocale | undefined {
    return queues.find(queue => queue.locale === locale)
  }

  replaceVariables(text: string, request: ActionRequest): string {
    const matches = text.match(VARIABLE_PATTERN_GLOBAL)

    let replacedText = text
    if (matches && request) {
      matches.forEach(match => {
        const keyPath = match.slice(1, -1)
        const botVariable = keyPath.endsWith(ACCESS_TOKEN_VARIABLE_KEY)
          ? match
          : getValueFromKeyPath(request, keyPath)
        // TODO In local if change variable and render multiple times the value is always the last update
        replacedText = replacedText.replace(
          match,
          this.isValidType(botVariable) ? botVariable : match
        )
      })
    }

    return replacedText
  }

  private isValidType(botVariable: any): boolean {
    const validTypes = ['boolean', 'string', 'number']
    return validTypes.includes(typeof botVariable)
  }
}
