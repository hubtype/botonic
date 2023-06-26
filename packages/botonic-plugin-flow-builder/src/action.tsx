import { ActionRequest, Multichannel, RequestContext } from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from './api'
import { FlowContent, FlowHandoff } from './content-fields'
import { HtNodeWithContent } from './content-fields/hubtype-fields'
import { getFlowBuilderPlugin } from './helpers'

type FlowBuilderActionProps = {
  contents: FlowContent[]
}

export class FlowBuilderAction extends React.Component<FlowBuilderActionProps> {
  static contextType = RequestContext

  static async botonicInit(request: ActionRequest): Promise<any> {
    const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
    const locale = flowBuilderPlugin.getLocale(request.session)

    const targetNode = getTargetNode(flowBuilderPlugin.cmsApi, locale, request)

    const contents = await flowBuilderPlugin.getContentsByNode(
      targetNode,
      locale
    )

    if (flowBuilderPlugin.trackEvent) {
      // TODO: track all targets nodes?
      await flowBuilderPlugin.trackEvent(request, contents[0].code)
    }

    const renderContents = contents.filter(async content => {
      if (content instanceof FlowHandoff) {
        await content.doHandoff(request)
        return false
      }
      return true
    })

    return { contents: renderContents }
  }

  render(): JSX.Element | JSX.Element[] {
    const { contents } = this.props
    return contents.map(content => content.toBotonic(content.id))
  }
}

export class FlowBuilderMultichannelAction extends FlowBuilderAction {
  render(): JSX.Element | JSX.Element[] {
    const { contents } = this.props
    return (
      <Multichannel text={{ buttonsAsText: false }}>
        {contents.map(content => content.toBotonic(content.id))}
      </Multichannel>
    )
  }
}

function getTargetNode(
  cmsApi: FlowBuilderApi,
  locale: string,
  request: ActionRequest
) {
  const contentId = request.input.payload
  let targetNode: HtNodeWithContent | undefined
  if (!contentId) {
    targetNode = getNodeByUserInput(cmsApi, locale, request)
  } else {
    targetNode = cmsApi.getNodeById(contentId) as HtNodeWithContent
  }
  if (targetNode) {
    return targetNode
  }
  return getFallbackNode(cmsApi, request)
}

function getNodeByUserInput(
  cmsApi: FlowBuilderApi,
  locale: string,
  request: ActionRequest
): HtNodeWithContent | undefined {
  if (request.session.is_first_interaction) {
    return cmsApi.getStartNode()
  }

  if (request.input.data) {
    const intentNode = cmsApi.getNodeByIntent(request.input, locale)
    if (intentNode) return intentNode
    const keywordNode = cmsApi.getNodeByKeyword(request.input.data, locale)
    return keywordNode
  }

  return undefined
}

function getFallbackNode(cmsApi: FlowBuilderApi, request: ActionRequest) {
  const isFirstFallbackOption =
    request.session.user.extra_data.isFirstFallbackOption || true
  const fallbackNode = cmsApi.getFallbackNode(isFirstFallbackOption)
  request.session.user.extra_data.isFirstFallbackOption = !isFirstFallbackOption
  return fallbackNode
}
