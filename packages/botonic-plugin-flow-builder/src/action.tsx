import { ActionRequest, RequestContext, Text } from '@botonic/react'
import React from 'react'

import { FlowContent } from './content-fields/content-base'
import { doHandoff } from './handoff'
import { HtHandoffNode } from './hubtype-models'
import BotonicPluginFlowBuilder from './index'

type FlowBuilderActionProps = {
  content?: FlowContent[]
  handoffMsg?: HtHandoffNode
}

export default class FlowBuilderAction extends React.Component<FlowBuilderActionProps> {
  static contextType = RequestContext

  static async botonicInit(request: ActionRequest): Promise<any> {
    console.log(request)
    const flowBuilderPlugin = request.plugins
      .flowBuilder as BotonicPluginFlowBuilder

    const locale = flowBuilderPlugin.getLocale(request.session)

    let payload = request.input.payload
      ? request.input.payload
      : await flowBuilderPlugin.getStartId()

    if (!request.input.payload) {
      const intentPayload = await flowBuilderPlugin.getPayloadByInput(
        request.input,
        locale
      )
      if (intentPayload) {
        payload = intentPayload
      }
      const keywordPayload = await flowBuilderPlugin.getPayloadByKeyword(
        request.input,
        locale
      )
      if (keywordPayload) {
        payload = keywordPayload
      }
    }
    // We use only Spanish because they are the backend examples
    const content = await flowBuilderPlugin.getContents(payload, locale)

    if (content.length == 0) {
      const handoffMsg = await doHandoff(request)
      return { handoffMsg }
    }
    return { content }
  }

  render() {
    // @ts-ignore
    const { content: contents, handoffMsg } = this.props
    if (handoffMsg) {
      // @ts-ignore
      return <Text>{handoffMsg}</Text>
    } else {
      return contents!.map((content, index) => content.toBotonic(index))
    }
  }
}
