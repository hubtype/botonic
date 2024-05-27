/* eslint-disable @typescript-eslint/naming-convention */
import { ActionRequest } from '@botonic/react'
import { v4 as uuid } from 'uuid'

import { FlowBuilderApi } from '../api'
import {
  HtNodeWithContent,
  HtNodeWithContentType,
  HtTextNode,
} from '../content-fields/hubtype-fields'
import { getFlowBuilderPlugin } from '../helpers'
import { EventAction, KnowledgebaseFailReason, trackEvent } from '../tracking'
import { KnowledgeBaseResponse } from '../types'

export async function createNodeFromKnowledgeBase(
  cmsApi: FlowBuilderApi,
  request: ActionRequest
): Promise<HtNodeWithContent | undefined> {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  const locale = flowBuilderPlugin.getLocale(request.session)
  const resolvedLocale = cmsApi.getResolvedLocale(locale)
  const knowledgeBaseConfig = cmsApi.getKnowledgeBaseConfig()

  if (
    flowBuilderPlugin.getKnowledgeBaseResponse &&
    knowledgeBaseConfig?.isActive
  ) {
    try {
      const knowledgeBaseResponse =
        await flowBuilderPlugin.getKnowledgeBaseResponse(request)
      await trackKnowledgeBase(knowledgeBaseResponse, request)

      if (
        knowledgeBaseResponse.hasKnowledge &&
        knowledgeBaseResponse.isFaithuful
      ) {
        const knowledgeBaseNode: HtTextNode = {
          type: HtNodeWithContentType.TEXT,
          content: {
            text: [
              {
                message: knowledgeBaseResponse.answer,
                locale: resolvedLocale,
              },
            ],
            buttons_style: undefined,
            buttons: [],
          },
          flow_id: 'randomUUID', // TODO: Add flow_id consequentially with HtBaseNode changes
          id: uuid(),
          code: 'knowledge-response',
          meta: {
            x: 0,
            y: 0,
          },
          follow_up: knowledgeBaseConfig.followup,
        }
        return knowledgeBaseNode
      }
    } catch (e) {
      console.error('Hubtype knowledge base api error: ', { e })
    }
  }
  return undefined
}

async function trackKnowledgeBase(
  response: KnowledgeBaseResponse,
  request: ActionRequest
) {
  /*  TODO:
      In order to have all these parameters in the base knowlege response 
      it is necessary to use the new endpoint to which the knowledge sources 
      have to be indicated. For now this will not work, we need to finish 
      the knowldege base node in the flow builder frontend.
  */
  const knowlaedgebaseInferenceId = response.inferenceId
  const knowledgebaseSourcesIds = response.sources.map(
    source => source.knowledgeSourceId
  )
  const knowledgebaseChunksIds = response.sources.map(
    source => source.knowledgeChunkId
  )
  const knowledgebaseMessageId = request.input.message_id

  let knowledgebaseFailReason: KnowledgebaseFailReason | undefined
  if (!response.isFaithuful) {
    knowledgebaseFailReason = KnowledgebaseFailReason.hallucination
  }
  if (!response.hasKnowledge) {
    knowledgebaseFailReason = KnowledgebaseFailReason.noKnowledge
  }

  await trackEvent(request, EventAction.knowledgebase, {
    knowlaedgebaseInferenceId,
    knowledgebaseFailReason,
    knowledgebaseSourcesIds,
    knowledgebaseChunksIds,
    knowledgebaseMessageId,
  })
}
