import type { BotContext } from '@botonic/core'
import {
  ACCESS_TOKEN_VARIABLE_KEY,
  VARIABLE_PATTERN_GLOBAL,
} from '../constants'
import { ContentFilterExecutor } from '../filters'
import { getFlowBuilderPlugin } from '../utils/get-flow-builder-plugin'
import type {
  HtMediaFileLocale,
  HtNodeLink,
  HtQueueLocale,
  HtTextLocale,
  HtVideoLocale,
} from './hubtype-fields'
import type { FlowContent } from './index'

export abstract class ContentFieldsBase {
  public code: string
  public followUp?: HtNodeLink

  constructor(public readonly id: string) {}

  abstract trackFlow(botContext: BotContext): Promise<void>

  abstract processContent(botContext: BotContext): Promise<void>

  async filterContent(
    botContext: BotContext,
    content: FlowContent
  ): Promise<FlowContent> {
    const flowBuilderPlugin = getFlowBuilderPlugin(botContext.plugins)
    const contentFilters = flowBuilderPlugin.contentFilters
    const contentFilterExecutor = new ContentFilterExecutor({
      filters: contentFilters,
    })
    const filteredContent = await contentFilterExecutor.filter(
      botContext,
      content
    )
    return filteredContent
  }

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

  replaceVariables(text: string, botContext: BotContext): string {
    if (!botContext) {
      return text
    }

    return text.replace(VARIABLE_PATTERN_GLOBAL, match => {
      // remove \\ ( escape for _ ) added by text node with markdown
      const keyPath = match.slice(1, -1).replaceAll('\\', '')
      if (keyPath.startsWith('secrets.')) {
        return '****'
      }

      const botVariable = keyPath.endsWith(ACCESS_TOKEN_VARIABLE_KEY)
        ? match
        : this.getValueFromKeyPath(botContext, keyPath)

      return this.isValidType(botVariable) ? String(botVariable) : match
    })
  }

  getValueFromKeyPath(botContext: BotContext, keyPath: string): any {
    if (keyPath.startsWith('session.user.contact_info.')) {
      const name = keyPath.split('.').at(-1)
      return botContext.session.user.contact_info?.find(
        contact => contact.name === name
      )?.value
    }

    if (keyPath.startsWith('input.') || keyPath.startsWith('session.')) {
      return keyPath
        .split('.')
        .reduce((object, key) => this.resolveObjectKey(object, key), botContext)
    }

    return keyPath
      .split('.')
      .reduce(
        (object, key) => this.resolveObjectKey(object, key),
        botContext.session.user.extra_data
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
