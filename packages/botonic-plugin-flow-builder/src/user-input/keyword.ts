import { ActionRequest } from '@botonic/react'

import { FlowBuilderApi } from '../api'
import { REG_EXP_PATTERN } from '../constants'
import {
  HtKeywordNode,
  HtNodeWithContent,
} from '../content-fields/hubtype-fields'
import { EventAction, trackEvent } from '../tracking'

interface KeywordProps {
  cmsApi: FlowBuilderApi
  locale: string
  request: ActionRequest
}
export class KeywordMatcher {
  public cmsApi: FlowBuilderApi
  public locale: string
  public request: ActionRequest
  public isRegExp: boolean
  public matchedKeyword?: string
  public keywordNodeId?: string
  public flowId?: string

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
    await this.trackKeywordEvent()
    return keywordNode
  }

  private getNodeByKeyword(
    userInput: string,
    keywordNodes: HtKeywordNode[]
  ): HtKeywordNode | undefined {
    const matchedKeywordNode = keywordNodes.find(node =>
      this.matchKeywords(userInput, node)
    )

    return matchedKeywordNode?.target ? matchedKeywordNode : undefined
  }

  private matchKeywords(userInput: string, node: HtKeywordNode): boolean {
    const result = node.content.keywords.find(keywords => {
      if (keywords.locale === this.locale) {
        this.keywordNodeId = node.id
        this.flowId = this.cmsApi.getNodeById<HtNodeWithContent>(
          node.id
        ).flow_id
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
        const keywordAsRegExp = this.resolveKeywordAsRegExp(regExpMatchArray)
        const match = userInput.match(keywordAsRegExp)
        this.isRegExp = true
        this.matchedKeyword = match ? match[0] : undefined
      } else {
        this.isRegExp = false
        this.matchedKeyword = userInput.includes(keyword) ? keyword : undefined
      }

      return this.matchedKeyword !== undefined
    })
  }

  private resolveKeywordAsRegExp(regExpMatchArray: RegExpMatchArray): RegExp {
    const [, pattern, flags] = regExpMatchArray
    return new RegExp(pattern, flags)
  }

  private async trackKeywordEvent() {
    const eventArgs = {
      nluKeywordName: this.matchedKeyword,
      nluKeywordIsRegex: this.isRegExp,
      nluKeywordMessageId: this.request.input.message_id,
      userInput: this.request.input.data,
      flowThreadId: this.request.session.flow_thread_id,
      flowId: this.flowId,
      flowNodeId: this.keywordNodeId,
    }
    await trackEvent(this.request, EventAction.Keyword, eventArgs)
  }
}
