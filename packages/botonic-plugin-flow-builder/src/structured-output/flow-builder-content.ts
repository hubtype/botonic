import type { BaseMessage } from '@botonic/core'
import { z } from 'zod'

export enum FlowBuilderOutputMessageType {
  FlowBuilderContent = 'flowBuilderContent',
}

export interface FlowBuilderContentMessage
  extends BaseMessage<FlowBuilderOutputMessageType.FlowBuilderContent> {
  type: FlowBuilderOutputMessageType.FlowBuilderContent
  contentId: string
}

export const FlowBuilderContentSchema = z
  .object({
    type: z.literal(FlowBuilderOutputMessageType.FlowBuilderContent),
    contentId: z.string(),
  })
  .describe(
    'A Flow Builder content ID. Use it only when asked explicitly in the prompt'
  )
