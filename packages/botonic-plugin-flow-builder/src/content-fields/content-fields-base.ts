import type { ActionRequest } from '@botonic/react'

import {
  ACCESS_TOKEN_VARIABLE_KEY,
  VARIABLE_PATTERN_GLOBAL,
} from '../constants'
import type {
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
        // remove \\ ( escape for _ ) added by text node with markdown
        const keyPath = match.slice(1, -1).replaceAll('\\', '')
        const botVariable = keyPath.endsWith(ACCESS_TOKEN_VARIABLE_KEY)
          ? match
          : this.getValueFromKeyPath(request, keyPath)
        // TODO In local if change variable and render multiple times the value is always the last update
        replacedText = replacedText.replace(
          match,
          this.isValidType(botVariable) ? botVariable : match
        )
      })
    }

    return replacedText
  }

  getValueFromKeyPath(request: ActionRequest, keyPath: string): any {
    if (keyPath.startsWith('session.user.contact_info.')) {
      const name = keyPath.split('.').at(-1)
      return request.session.user.contact_info?.find(
        contact => contact.name === name
      )?.value
    }

    if (keyPath.startsWith('input.') || keyPath.startsWith('session.')) {
      return keyPath
        .split('.')
        .reduce((object, key) => this.resolveObjectKey(object, key), request)
    }

    return keyPath
      .split('.')
      .reduce(
        (object, key) => this.resolveObjectKey(object, key),
        request.session.user.extra_data
      )
  }

  private resolveObjectKey(object: any, key: string): any {
    if (object && object[key] !== undefined) {
      return object[key]
    }
    return undefined
  }

  private isValidType(botVariable: any): boolean {
    const validTypes = ['boolean', 'string', 'number']
    return validTypes.includes(typeof botVariable)
  }
}
