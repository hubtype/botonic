import { ActionRequest } from '@botonic/react'

import { FlowContent, FlowKnowledgeBase } from '../content-fields'
import { EventAction, KnowledgebaseFailReason, trackEvent } from '../tracking'
import { KnowledgeBaseFunction, KnowledgeBaseResponse } from '../types'
import { inputHasTextData } from '../utils'
import { FlowBuilderContext } from './index'

export async function getContentsByKnowledgeBase({
  cmsApi,
  flowBuilderPlugin,
  request,
  resolvedLocale,
}: FlowBuilderContext): Promise<FlowContent[]> {
  const startNodeKnowledeBaseFlow = cmsApi.getStartNodeKnowledeBaseFlow()

  if (!startNodeKnowledeBaseFlow) {
    return []
  }

  const contents = await flowBuilderPlugin.getContentsByNode(
    startNodeKnowledeBaseFlow,
    resolvedLocale
  )

  const knowledgeBaseContent = contents.find(
    content => content instanceof FlowKnowledgeBase
  ) as FlowKnowledgeBase

  if (!knowledgeBaseContent) {
    return contents
  }

  const sourceIds = knowledgeBaseContent.sourcesData.map(source => source.id)

  if (
    flowBuilderPlugin.getKnowledgeBaseResponse &&
    inputHasTextData(request.input) &&
    sourceIds.length > 0
  ) {
    const contentsWithKnowledgeResponse =
      await getContentsWithKnowledgeResponse(
        flowBuilderPlugin.getKnowledgeBaseResponse,
        request,
        contents,
        sourceIds
      )

    if (contentsWithKnowledgeResponse) {
      return contentsWithKnowledgeResponse
    }
  }

  return []
}

async function getContentsWithKnowledgeResponse(
  getKnowledgeBaseResponse: KnowledgeBaseFunction,
  request: ActionRequest,
  contents: FlowContent[],
  sourceIds: string[]
): Promise<FlowContent[] | undefined> {
  const knowledgeBaseResponse = await getKnowledgeBaseResponse(
    request,
    request.input.data!,
    sourceIds
  )
  await trackKnowledgeBase(knowledgeBaseResponse, request, sourceIds)

  if (
    !knowledgeBaseResponse.hasKnowledge ||
    !knowledgeBaseResponse.isFaithuful
  ) {
    return undefined
  }

  return updateContentsWithResponse(contents, knowledgeBaseResponse)
}

function updateContentsWithResponse(
  contents: FlowContent[],
  response: KnowledgeBaseResponse
): FlowContent[] {
  return contents.map(content => {
    if (content instanceof FlowKnowledgeBase) {
      content.text = response.answer
      content.inferenceId = response.inferenceId
    }

    return content
  })
}

async function trackKnowledgeBase(
  response: KnowledgeBaseResponse,
  request: ActionRequest,
  sourceIds: string[]
) {
  const knowledgebaseInferenceId = response.inferenceId
  const knowledgebaseSourcesIds = sourceIds
  const knowledgebaseChunksIds = response.chunkIds
  const knowledgebaseMessageId = request.input.message_id

  let knowledgebaseFailReason: KnowledgebaseFailReason | undefined

  if (!response.isFaithuful) {
    knowledgebaseFailReason = KnowledgebaseFailReason.Hallucination
  }

  if (!response.hasKnowledge) {
    knowledgebaseFailReason = KnowledgebaseFailReason.NoKnowledge
  }

  await trackEvent(request, EventAction.Knowledgebase, {
    knowledgebaseInferenceId,
    knowledgebaseFailReason,
    knowledgebaseSourcesIds,
    knowledgebaseChunksIds,
    knowledgebaseMessageId,
    userInput: request.input.data,
  })
}
