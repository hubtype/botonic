import { ActionRequest, RequestContext, Text } from '@botonic/react'
import React from 'react'

import { FlowContent } from './content-fields/content-base'
import { doHandoff } from './handoff'
import { HtHandoffNode } from './hubtype-models'

// TODO: remove this from here and use the new "start" attribute in the flow
export const START = '08c7df06-0c7c-4f06-b8c1-4157582efeb2'

type FlowBuilderActionProps = {
  content?: FlowContent[]
  handoffMsg?: HtHandoffNode
}

export default class FlowBuilderAction extends React.Component<FlowBuilderActionProps> {
  static contextType = RequestContext

  static async botonicInit(request: ActionRequest): Promise<any> {
    const flowBuilderPlugin = request.plugins.hubtypeFlowBuilder as any

    let payload = request.input.payload ? request.input.payload : START
    if (!request.input.payload) {
      const intentPayload = await flowBuilderPlugin.getPayloadByInput(
        request.input,
        'es-ES'
      )
      if (intentPayload) {
        payload = intentPayload
      }
      const keywordPayload = await flowBuilderPlugin.getPayloadByKeyword(
        request.input,
        'es-ES'
      )
      if (keywordPayload) {
        payload = keywordPayload
      }
    }
    // We use only Spanish because they are the backend examples
    const content = await flowBuilderPlugin.getContents(payload, 'es-ES')

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
