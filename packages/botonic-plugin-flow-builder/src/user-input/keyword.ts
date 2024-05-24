import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import { REG_EXP_PATTERN } from '../constants'
import { HtKeywordNode } from '../content-fields/hubtype-fields'
import { EventAction, trackEvent } from '../tracking'

interface KeywordProps {
  cmsApi: FlowBuilderApi
  locale: string
  request: ActionRequest
}
export class Keyword {
  public cmsApi: FlowBuilderApi
  public locale: string
  public request: ActionRequest
  public isRegExp: boolean
  public matchedKeyword?: string
  public keywordNodeId?: string

  constructor({ cmsApi, locale, request }: KeywordProps) {
    this.cmsApi = cmsApi
    this.locale = locale
    this.request = request
    this.isRegExp = false
  }

  async getNodeByInput(userInput: string): Promise<HtKeywordNode | undefined> {
    const keywordNodes = this.cmsApi.getKeywordNodes()
    const keywordNode = this.getNodeByKeyword(userInput, keywordNodes)
    if (!keywordNode) {
      return undefined
    }
    this.trackKeywordEvent()
    return keywordNode
  }

  private getNodeByKeyword(
    userInput: string,
    keywordNodes: HtKeywordNode[]
  ): HtKeywordNode | undefined {
    try {
      const matchedKeywordNodes = keywordNodes.filter(node =>
        this.matchKeywords(userInput, node)
      )

      if (matchedKeywordNodes.length > 0 && matchedKeywordNodes[0].target) {
        return matchedKeywordNodes[0]
      }
    } catch (error) {
      console.error(`Error getting node by keyword '${userInput}': `, error)
    }

    return undefined
  }

  private matchKeywords(userInput: string, node: HtKeywordNode): boolean {
    const result = node.content.keywords.find(keywords => {
      if (keywords.locale === this.locale) {
        this.keywordNodeId = node.id
        return this.inputMatchesAnyKeyword(userInput, keywords.values)
      }

      return false
    })

    return Boolean(result)
  }

  private inputMatchesAnyKeyword(
    userInput: string,
    keywords: string[]
  ): boolean {
    return keywords.some(keyword => {
      const regExpMatchArray = keyword.match(REG_EXP_PATTERN)
      if (regExpMatchArray) {
        return this.resolveKeywordAsRegExp(userInput, regExpMatchArray)
      }

      if (userInput.includes(keyword)) {
        this.isRegExp = false
        this.matchedKeyword = keyword
        return true
      }

      return false
    })
  }

  private resolveKeywordAsRegExp(
    userInput: string,
    regExpMatchArray: RegExpMatchArray
  ) {
    const [, pattern, flags] = regExpMatchArray
    const keywordAsRegExp = new RegExp(pattern, flags)
    const match = userInput.match(keywordAsRegExp)
    this.isRegExp = true
    this.matchedKeyword = match ? match[0] : undefined

    return match
  }

  private async trackKeywordEvent() {
    const eventArgs = {
      nluKeywordId: this.keywordNodeId,
      nluKeywordName: this.matchedKeyword,
      nluKeywordIsRegex: this.isRegExp,
      // @ts-ignore
      nluKeywordMessageId: this.request.input.messageId,
    }
    await trackEvent(this.request, EventAction.keyword, eventArgs)
  }
}
