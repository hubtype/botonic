import { ActionRequest, RequestContext } from '@botonic/react'
import React from 'react'

import { FlowContent } from './content-fields'
import { doHandoff } from './handoff'
import { getFlowBuilderPlugin } from './helpers'

type FlowBuilderActionProps = {
  content?: FlowContent[]
  isHandoff?: boolean
}

export class FlowBuilderAction extends React.Component<FlowBuilderActionProps> {
  static contextType = RequestContext

  static async botonicInit(request: ActionRequest): Promise<any> {
    const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
    const locale = flowBuilderPlugin.getLocale(request.session)
    const payload = request.input.payload
    let targetContentId: string | undefined = payload
    if (!payload && request.session.is_first_interaction) {
      targetContentId = await flowBuilderPlugin.getStartId()
    }
    if (!payload) {
      const intentPayload = await flowBuilderPlugin.getPayloadByInput(
        request.input,
        locale
      )
      if (intentPayload) targetContentId = intentPayload
      const keywordPayload = await flowBuilderPlugin.getPayloadByKeyword(
        request.input,
        locale
      )
      if (keywordPayload) targetContentId = keywordPayload
    }
    if (!targetContentId) {
      targetContentId = await flowBuilderPlugin.getFallbackId()
    }

    const { contents, handoffNode } = await flowBuilderPlugin.getContents(
      targetContentId,
      locale
    )

    if (handoffNode) await doHandoff(request, locale, handoffNode)

    return { contents, handoffNode }
  }

  render(): JSX.Element | JSX.Element[] {
    // @ts-ignore
    const { contents, handoffNode } = this.props
    return contents!.map((content, index) => content.toBotonic(index))
  }
}
