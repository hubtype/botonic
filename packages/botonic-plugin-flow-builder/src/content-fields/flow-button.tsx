import { Button, Reply, Webview } from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../api'
import { SOURCE_INFO_SEPARATOR } from '../constants'
import { ContentFieldsBase } from './content-fields-base'
import { FlowWebview } from './flow-webview'
import {
  HtButton,
  HtButtonStyle,
  HtNodeWithContent,
  HtUrlNode,
} from './hubtype-fields'
import { HtRatingButton } from './hubtype-fields/rating'

export class FlowButton extends ContentFieldsBase {
  public text = ''
  public url?: string
  public payload?: string
  public target?: string
  public webview?: Webview
  public params?: Record<string, string>

  static fromHubtypeCMS(
    cmsButton: HtButton,
    locale: string,
    cmsApi: FlowBuilderApi
  ): FlowButton {
    const urlId = this.getUrlId(cmsButton, locale)

    const newButton = new FlowButton(cmsButton.id)
    newButton.text = this.getTextByLocale(locale, cmsButton.text)
    if (cmsButton.target) {
      const webview = this.getTargetWebview(cmsApi, cmsButton.target.id)
      if (webview) {
        const params = this.getWebviewParams(webview, cmsApi)
        newButton.webview = { name: webview.webviewComponentName }
        newButton.params = params
      } else {
        newButton.payload = cmsApi.getPayload(cmsButton.target)
      }
    }

    if (cmsButton.url && urlId) {
      const urlNode = cmsApi.getNodeById<HtUrlNode>(urlId)
      newButton.url = urlNode.content.url
    }

    return newButton
  }

  private static getWebviewParams(
    webview: FlowWebview,
    cmsApi: FlowBuilderApi
  ) {
    const params: Record<string, string> = {
      webviewId: webview.webviewTargetId,
    }
    const exitSuccessContentID = this.getExitSuccessContentID(webview, cmsApi)

    if (exitSuccessContentID) {
      params.exitSuccessContentID = exitSuccessContentID
    }

    return params
  }

  private static getExitSuccessContentID(
    webview: FlowWebview,
    cmsApi: FlowBuilderApi
  ) {
    const webviewSuccessExit = webview.exits?.find(
      exit => exit.name === 'Success'
    )
    const exitSuccessId = webviewSuccessExit?.target?.id
    if (!exitSuccessId) {
      return undefined
    }
    const exitNode = cmsApi.getNodeById<HtNodeWithContent>(exitSuccessId)

    return exitNode.code
  }

  static fromAIAgent(button: {
    id: string
    text: string
    payload?: string
    url?: string
  }): FlowButton {
    const newButton = new FlowButton(button.id)
    newButton.text = button.text
    newButton.payload = button.payload
    newButton.url = button.url
    return newButton
  }

  static fromRating(button: HtRatingButton): FlowButton {
    const newButton = new FlowButton(button.id)
    newButton.text = button.text
    newButton.payload = button.payload
    newButton.target = button.target?.id
    return newButton
  }

  static getUrlId(cmsButton: HtButton, locale: string): string | undefined {
    return cmsButton.url.find(url => url.locale === locale)?.id
  }

  static getTargetWebview(
    cmsApi: FlowBuilderApi,
    targetId: string
  ): FlowWebview | undefined {
    const targetNode = cmsApi.getNodeById(targetId)
    if (targetNode.type !== 'webview') {
      return undefined
    }
    return FlowWebview.fromHubtypeCMS(targetNode)
  }

  renderButton(buttonIndex: number, buttonStyle?: HtButtonStyle): JSX.Element {
    if (buttonStyle === HtButtonStyle.QUICK_REPLY) {
      return (
        <Reply key={this.id} payload={this.getButtonPayload(buttonIndex)}>
          {this.text}
        </Reply>
      )
    }

    return (
      <Button
        key={this.id}
        url={this.url}
        payload={this.getButtonPayload(buttonIndex)}
        target={this.target}
        webview={this.webview}
        params={this.params}
      >
        {this.text}
      </Button>
    )
  }

  private getButtonPayload(buttonIndex: number): string | undefined {
    return this.payload
      ? `${this.payload}${SOURCE_INFO_SEPARATOR}${buttonIndex}`
      : undefined
  }
}
