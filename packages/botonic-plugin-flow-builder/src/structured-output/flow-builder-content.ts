import type { BaseMessage } from '@botonic/core'
import z from 'zod'

export interface FlowBuilderContentMessage
  extends BaseMessage<'flowBuilderContent'> {
  type: 'flowBuilderContent'
  contentId: string
}

export const FlowBuilderContentSchema = z
  .object({
    type: z.enum(['flowBuilderContent']),
    contentId: z.string(),
  })
  .describe(
    'A Flow Builder content ID. Use it only when asked explicitly in the prompt'
  )
