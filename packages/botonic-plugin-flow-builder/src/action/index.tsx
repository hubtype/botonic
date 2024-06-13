import { INPUT } from '@botonic/core'
import { ActionRequest, Multichannel, RequestContext } from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../api'
import { FlowContent, FlowHandoff } from '../content-fields'
import { HtNodeWithContent } from '../content-fields/hubtype-fields'
import { getFlowBuilderPlugin } from '../helpers'
import BotonicPluginFlowBuilder from '../index'
import { trackFlowContent } from '../tracking'
import { getContentsByFallback } from './fallback'
import { getContentsByFirstInteraction } from './first-interaction'
import { getContentsByKnowledgeBase } from './knowledge-bases'

export type FlowBuilderActionProps = {
  contents: FlowContent[]
}

export class FlowBuilderAction extends React.Component<FlowBuilderActionProps> {
  static contextType = RequestContext

  static async botonicInit(
    request: ActionRequest
  ): Promise<FlowBuilderActionProps> {
    const contents = await getContents(request)
    await trackFlowContent(request, contents)

    const handoffContent = contents.find(
      content => content instanceof FlowHandoff
    ) as FlowHandoff
    if (handoffContent) {
      await handoffContent.doHandoff(request)
    }

    return { contents }
  }

  render(): JSX.Element | JSX.Element[] {
    const { contents } = this.props
    const request = this.context
    return contents.map(content => content.toBotonic(content.id, request))
  }
}

export class FlowBuilderMultichannelAction extends FlowBuilderAction {
  render(): JSX.Element | JSX.Element[] {
    const { contents } = this.props
    const request = this.context
    return (
      <Multichannel text={{ buttonsAsText: false }}>
        {contents.map(content => content.toBotonic(content.id, request))}
      </Multichannel>
    )
  }
}

async function getContents(request: ActionRequest): Promise<FlowContent[]> {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  const cmsApi = flowBuilderPlugin.cmsApi
  const locale = flowBuilderPlugin.getLocale(request.session)
  const resolvedLocale = flowBuilderPlugin.cmsApi.getResolvedLocale(locale)
  const context = {
    cmsApi,
    flowBuilderPlugin,
    request,
    resolvedLocale,
  }

  if (request.session.is_first_interaction) {
    return await getContentsByFirstInteraction(context)
  }

  if (request.input.payload) {
    return await getContentsByPayload(context)
  }

  if (request.input.data && request.input.type === INPUT.TEXT) {
    return await getContentsByKnowledgeBase(context)
  }

  return await getContentsByFallback(context)
}

export interface FlowBuilderContext {
  cmsApi: FlowBuilderApi
  flowBuilderPlugin: BotonicPluginFlowBuilder
  request: ActionRequest
  resolvedLocale: string
}

async function getContentsByPayload({
  cmsApi,
  flowBuilderPlugin,
  request,
  resolvedLocale,
}: FlowBuilderContext): Promise<FlowContent[]> {
  const targetNode = request.input.payload
    ? cmsApi.getNodeById<HtNodeWithContent>(request.input.payload)
    : undefined

  if (targetNode) {
    return await flowBuilderPlugin.getContentsByNode(targetNode, resolvedLocale)
  }

  return []
}
