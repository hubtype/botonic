import { FlowContent } from '../content-fields'
import { HtNodeWithContent } from '../content-fields/hubtype-fields'
import { FlowBuilderContext } from './index'

export async function getContentsByPayload({
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
