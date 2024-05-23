import { ActionRequest, Multichannel, RequestContext } from '@botonic/react'
import React from 'react'

import { FlowBuilderApi } from '../api'
import { FlowContent, FlowHandoff } from '../content-fields'
import { HtNodeWithContent } from '../content-fields/hubtype-fields'
import { getFlowBuilderPlugin } from '../helpers'
import BotonicPluginFlowBuilder from '../index'
import { EventAction, getNodeEventArgs, trackEvent } from '../tracking'
import { createNodeFromKnowledgeBase } from './knowledge-bases'

export type FlowBuilderActionProps = {
  contents: FlowContent[]
}

export class FlowBuilderAction extends React.Component<FlowBuilderActionProps> {
  static contextType = RequestContext

  static async botonicInit(
    request: ActionRequest
  ): Promise<FlowBuilderActionProps> {
    const contents = await getContents(request)

    const handoffContent = contents.find(
      content => content instanceof FlowHandoff
    ) as FlowHandoff
    if (handoffContent) await handoffContent.doHandoff(request)

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
    return await flowBuilderPlugin.getStartContents(resolvedLocale)
  }

  if (request.input.payload) {
    return await getContentsByPayload(context)
  }

  return await getContentsByFallback(context)
}

interface FlowBuilderContext {
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
    const eventArgs = getNodeEventArgs(request, targetNode)
    await trackEvent(request, EventAction.flowNode, eventArgs)
    return await flowBuilderPlugin.getContentsByNode(targetNode, resolvedLocale)
  }
  return []
}

async function getContentsByFallback({
  cmsApi,
  flowBuilderPlugin,
  request,
  resolvedLocale,
}: FlowBuilderContext): Promise<FlowContent[]> {
  const fallbackNode = await getFallbackNode(cmsApi, request)
  const eventArgs = getNodeEventArgs(request, fallbackNode)
  await trackEvent(request, EventAction.flowNode, eventArgs)
  return await flowBuilderPlugin.getContentsByNode(fallbackNode, resolvedLocale)
}

async function getFallbackNode(cmsApi: FlowBuilderApi, request: ActionRequest) {
  if (request.session.user.extra_data?.isFirstFallbackOption === undefined) {
    request.session.user.extra_data = {
      ...request.session.user.extra_data,
      isFirstFallbackOption: true,
    }
  }

  const knowledgeBaseNode = await createNodeFromKnowledgeBase(cmsApi, request)
  if (knowledgeBaseNode) {
    return knowledgeBaseNode
  }

  const isFirstFallbackOption =
    !!request.session.user.extra_data.isFirstFallbackOption
  const fallbackNode = cmsApi.getFallbackNode(isFirstFallbackOption)
  request.session.user.extra_data.isFirstFallbackOption = !isFirstFallbackOption

  return fallbackNode
}
