import { ActionRequest, Multichannel, RequestContext } from '@botonic/react'
import React from 'react'

import { FlowContent } from './content-fields'
import { HtNodeWithContent } from './content-fields/hubtype-fields'
import { doHandoff } from './handoff'
import { getFlowBuilderPlugin } from './helpers'

type FlowBuilderActionProps = {
  contents: FlowContent[]
  isHandoff?: boolean
}

let alternateFallbackMessage = false
export class FlowBuilderAction extends React.Component<FlowBuilderActionProps> {
  static contextType = RequestContext

  static async botonicInit(request: ActionRequest): Promise<any> {
    const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
    const locale = flowBuilderPlugin.getLocale(request.session)
    const payload = request.input.payload
    let targetNode: HtNodeWithContent | string | undefined = payload

    if (!payload && request.session.is_first_interaction) {
      targetNode = flowBuilderPlugin.cmsApi.getStartNode()
    }

    if (!payload && request.input.data) {
      const intentNode = flowBuilderPlugin.cmsApi.getNodeByIntent(
        request.input,
        locale
      )
      const keywordNode = flowBuilderPlugin.cmsApi.getNodeByKeyword(
        request.input.data,
        locale
      )
      targetNode = intentNode ?? keywordNode ?? targetNode
    }

    if (!targetNode) {
      targetNode = flowBuilderPlugin.cmsApi.getFallbackNode(
        alternateFallbackMessage
      )
      alternateFallbackMessage = !alternateFallbackMessage
    }

    const { contents, handoffNode } = await flowBuilderPlugin.getContents(
      targetNode,
      locale
    )

    if (flowBuilderPlugin.trackEvent) {
      // TODO: track all targets nodes?
      await flowBuilderPlugin.trackEvent(request, contents[0].code)
    }

    if (handoffNode) await doHandoff(request, locale, handoffNode)

    return { contents, handoffNode }
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

function getNodeByUserInput(
  cmsApi: FlowBuilderApi,
  locale: string,
  request: ActionRequest
): HtNodeWithContent | undefined {
  if (request.session.is_first_interaction) {
    const startNode = cmsApi.getStartNode()
    return startNode
  }

  if (request.input.data) {
    const intentNode = cmsApi.getNodeByIntent(request.input, locale)
    const keywordNode = cmsApi.getNodeByKeyword(request.input.data, locale)
    return intentNode ?? keywordNode
  }

  return undefined
}
