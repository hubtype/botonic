import { FlowContent } from '../content-fields'
import { HtNodeWithContent } from '../content-fields/hubtype-fields'
import { FlowBuilderContext } from './index'

export async function getContentsByPayload({
  cmsApi,
  flowBuilderPlugin,
  request,
  resolvedLocale,
  contentID,
}: FlowBuilderContext): Promise<FlowContent[]> {
  const id = contentID
    ? cmsApi.getNodeByContentID(contentID)?.id
    : request.input.payload
  const targetNode = id ? cmsApi.getNodeById<HtNodeWithContent>(id) : undefined

  if (targetNode) {
    return await flowBuilderPlugin.getContentsByNode(targetNode, resolvedLocale)
  }

  return []
}
