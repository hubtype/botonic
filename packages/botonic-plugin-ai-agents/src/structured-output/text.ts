import { TextMessage } from '@botonic/core'
import { z } from 'zod'

export type { TextMessage }

export const TextSchema = z
  .object({
    type: z.enum(['text']),
    content: z.object({
      text: z.string(),
    }),
  })
  .describe('A text message')
