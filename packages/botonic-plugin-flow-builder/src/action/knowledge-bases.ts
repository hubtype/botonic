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
import { EventName, trackEvent } from '../tracking'

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
      if (knowledgeBaseResponse.hasKnowledge) {
        await trackEvent(request, EventName.botAiKnowledgeBase, {
          answer: knowledgeBaseResponse.answer,
          knowledge_source_ids: knowledgeBaseResponse.sources.map(
            source => source.knowledgeSourceId
          ),
        })

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
      console.log('Hubtype knowledge base api error: ', { e })
      return undefined
    }
  }
  return undefined
}
