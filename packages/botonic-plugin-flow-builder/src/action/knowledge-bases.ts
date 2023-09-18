/* eslint-disable @typescript-eslint/naming-convention */
import { ActionRequest } from '@botonic/react'
import { randomUUID } from 'crypto'

import { FlowBuilderApi } from '../api'
import {
  HtNodeWithContent,
  HtNodeWithContentType,
  HtTextNode,
} from '../content-fields/hubtype-fields'
import { getFlowBuilderPlugin } from '../helpers'
import { EventName, trackEvent } from './tracking'

export async function createKnowledgeNode(
  cmsApi: FlowBuilderApi,
  request: ActionRequest
): Promise<HtNodeWithContent | undefined> {
  const flowBuilderPlugin = getFlowBuilderPlugin(request.plugins)
  const locale = flowBuilderPlugin.getLocale(request.session)
  const knowledgeBaseNode = cmsApi.getKnowledgeBaseNode()

  if (flowBuilderPlugin.getKnowledgeResponse && knowledgeBaseNode?.isActive) {
    try {
      const knowledgeResponse = await flowBuilderPlugin.getKnowledgeResponse(
        request
      )

      if (knowledgeResponse.hasKnowledge) {
        await trackEvent(request, EventName.botAiKnowladgeBase, {
          answer: knowledgeResponse.ai,
          knowledge_source_ids: knowledgeResponse.sources.map(
            source => source.knowledgeSourceId
          ),
        })

        const knowledgeNode: HtTextNode = {
          type: HtNodeWithContentType.TEXT,
          content: {
            text: [
              {
                message: knowledgeResponse.ai,
                locale,
              },
            ],
            buttons_style: undefined,
            buttons: [],
          },
          id: randomUUID(),
          code: 'knowledge-response',
          meta: {
            x: 0,
            y: 0,
          },
          follow_up: knowledgeBaseNode.followup,
        }
        return knowledgeNode
      }
    } catch (e) {
      console.log('Hubtype knowledge api error: ', { e })
      return undefined
    }
  }
  return undefined
}
