import { OutputMessageType, type TextMessage } from '@botonic/core'
import { z } from 'zod'

export type { TextMessage }

export const TextSchema = z
  .object({
    type: z.literal(OutputMessageType.Text),
    content: z.object({
      text: z.string(),
    }),
  })
  .describe('A text message')
