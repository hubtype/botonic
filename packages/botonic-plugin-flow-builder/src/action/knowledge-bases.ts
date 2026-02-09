import {
  type BotContext,
  EventAction,
  type EventKnowledgeBase,
  type KnowledgeBasesResponse,
  KnowledgebaseFailReason,
  type ResolvedPlugins,
} from '@botonic/core'

import {
  DISABLED_MEMORY_LENGTH,
  type FlowContent,
  FlowKnowledgeBase,
} from '../content-fields'
import {
  getCommonFlowContentEventArgsForContentId,
  trackEvent,
} from '../tracking'
import type { KnowledgeBaseFunction } from '../types'
import { inputHasTextData, isKnowledgeBasesAllowed } from '../utils'
import type { FlowBuilderContext } from './index'

export async function getContentsByKnowledgeBase({
  cmsApi,
  flowBuilderPlugin,
  request,
}: FlowBuilderContext): Promise<FlowContent[]> {
  if (isKnowledgeBasesAllowed(request)) {
    const startNodeKnowledgeBaseFlow = cmsApi.getStartNodeKnowledgeBaseFlow()
    const isKnowledgeBaseEnabled = cmsApi.isKnowledgeBaseEnabled()

    if (!startNodeKnowledgeBaseFlow || !isKnowledgeBaseEnabled) {
      return []
    }

    const contents = await flowBuilderPlugin.getContentsByNode(
      startNodeKnowledgeBaseFlow
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
          knowledgeBaseContent
        )

      if (contentsWithKnowledgeResponse) {
        return contentsWithKnowledgeResponse
      }
    }
  }

  return []
}

async function getContentsWithKnowledgeResponse<
  T extends ResolvedPlugins = ResolvedPlugins,
>(
  getKnowledgeBaseResponse: KnowledgeBaseFunction<T>,
  request: BotContext<T>,
  contents: FlowContent[],
  knowledgeBaseContent: FlowKnowledgeBase
): Promise<FlowContent[] | undefined> {
  const sourceIds = knowledgeBaseContent.sourcesData.map(source => source.id)
  const instructions = knowledgeBaseContent.instructions
  const messageId = request.input.message_id
  const memoryLength = knowledgeBaseContent.hasMemory
    ? knowledgeBaseContent.memoryLength
    : DISABLED_MEMORY_LENGTH

  const knowledgeBaseResponse = await getKnowledgeBaseResponse(
    request,
    sourceIds,
    instructions,
    messageId,
    memoryLength
  )
  await trackKnowledgeBase(knowledgeBaseResponse, request, knowledgeBaseContent)

  if (
    !knowledgeBaseResponse.hasKnowledge ||
    !knowledgeBaseResponse.isFaithful
  ) {
    return undefined
  }

  return updateContentsWithResponse(contents, knowledgeBaseResponse)
}

function updateContentsWithResponse(
  contents: FlowContent[],
  response: KnowledgeBasesResponse
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
  response: KnowledgeBasesResponse,
  request: BotContext,
  knowledgeBaseContent: FlowKnowledgeBase
) {
  const getKnowledgeFailReason = (): KnowledgebaseFailReason | undefined => {
    let knowledgebaseFailReason: KnowledgebaseFailReason | undefined

    if (!response.isFaithful) {
      knowledgebaseFailReason = KnowledgebaseFailReason.Hallucination
    }

    if (!response.hasKnowledge) {
      knowledgebaseFailReason = KnowledgebaseFailReason.NoKnowledge
    }
    return knowledgebaseFailReason
  }

  const { flowId, flowName, flowNodeId, flowNodeContentId } =
    getCommonFlowContentEventArgsForContentId(request, knowledgeBaseContent.id)

  const event: EventKnowledgeBase = {
    action: EventAction.Knowledgebase,
    knowledgebaseInferenceId: response.inferenceId,
    knowledgebaseFailReason: getKnowledgeFailReason(),
    knowledgebaseSourcesIds: knowledgeBaseContent.sourcesData.map(
      source => source.id
    ),
    knowledgebaseChunksIds: response.chunkIds,
    knowledgebaseMessageId: request.input.message_id,
    userInput: request.input.data as string,
    flowThreadId: request.session.flow_thread_id as string,
    flowId,
    flowName,
    flowNodeId,
    flowNodeContentId,
  }

  const { action, ...eventArgs } = event

  await trackEvent(request, action, eventArgs)
}
