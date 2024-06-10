import { INPUT } from '@botonic/core'
import { ActionRequest } from '@botonic/react'

import { FlowContent, FlowKnowledgeBase } from '../content-fields'
import { EventAction, KnowledgebaseFailReason, trackEvent } from '../tracking'
import { KnowledgeBaseResponse } from '../types'
import { getContentsByFallback } from './fallback'
import { FlowBuilderContext } from './index'

export async function getContentsByKnowledgeBase({
  cmsApi,
  flowBuilderPlugin,
  request,
  resolvedLocale,
}: FlowBuilderContext): Promise<FlowContent[]> {
  const startNodeKnowledeBaseFlow = cmsApi.getStartNodeKnowledeBaseFlow()

  if (startNodeKnowledeBaseFlow) {
    const contents = await flowBuilderPlugin.getContentsByNode(
      startNodeKnowledeBaseFlow,
      resolvedLocale
    )

    const knowledgeBaseContent = contents.find(
      content => content instanceof FlowKnowledgeBase
    ) as FlowKnowledgeBase

    if (
      flowBuilderPlugin.getKnowledgeBaseResponse &&
      knowledgeBaseContent &&
      request.input.data &&
      request.input.type === INPUT.TEXT
    ) {
      await resolveKnowledgeBaseNode(
        flowBuilderPlugin.getKnowledgeBaseResponse,
        request,
        knowledgeBaseContent,
        contents
      )
    }
    return contents
  }

  return await getContentsByFallback({
    cmsApi,
    flowBuilderPlugin,
    request,
    resolvedLocale,
  })
}

async function resolveKnowledgeBaseNode(
  getKnowledgeBaseResponse: (
    request: ActionRequest,
    userInput: string,
    sources: string[]
  ) => Promise<KnowledgeBaseResponse>,
  request: ActionRequest,
  knowledgeBaseContent: FlowKnowledgeBase,
  contents: FlowContent[]
) {
  const knowledgeBaseResponse = await getKnowledgeBaseResponse(
    request,
    request.input.data!,
    knowledgeBaseContent.sources
  )

  if (knowledgeBaseResponse.hasKnowledge && knowledgeBaseResponse.isFaithuful) {
    const answer = knowledgeBaseResponse.answer

    contents.forEach(content => {
      if (content instanceof FlowKnowledgeBase) {
        content.text = answer
      }
    })
    await trackKnowledgeBase(knowledgeBaseResponse, request)
  }
}

async function trackKnowledgeBase(
  response: KnowledgeBaseResponse,
  request: ActionRequest
) {
  const knowledgebaseInferenceId = response.inferenceId
  const knowledgebaseSourcesIds = response.sources.map(
    source => source.knowledgeSourceId
  )
  const knowledgebaseChunksIds = response.sources.map(
    source => source.knowledgeChunkId
  )
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
  })
}
