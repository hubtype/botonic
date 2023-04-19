import { ActionRequest, RequestContext, Text } from '@botonic/react'
import React from 'react'

import { FlowContent } from './content-fields'
import { doHandoff } from './handoff'
import BotonicPluginFlowBuilder from './index'

type FlowBuilderActionProps = {
  content?: FlowContent[]
  isHandoff?: boolean
}

export class FlowBuilderAction extends React.Component<FlowBuilderActionProps> {
  static contextType = RequestContext

  static async botonicInit(request: ActionRequest): Promise<any> {
    const flowBuilderPlugin = request.plugins
      .hubtypeFlowBuilder as BotonicPluginFlowBuilder
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

    if (content.length === 0) {
      const handoffParams = {
        queue: 'Test', // TODO: Take it from the flow
        agentEmail: 'test@gmail.com',
        note: 'This is a note that will be attached to the case as a reminder',
      }
      await doHandoff(request, handoffParams.queue, handoffParams.note)
      const isHandoff = true
      return { isHandoff }
    }
    return { content }
  }

  render(): JSX.Element | JSX.Element[] {
    // @ts-ignore
    const { content: contents, isHandoff } = this.props
    if (isHandoff) {
      return <Text>You are being transferred to an agent!</Text>
    } else {
      return contents!.map((content, index) => content.toBotonic(index))
    }
  }
}
