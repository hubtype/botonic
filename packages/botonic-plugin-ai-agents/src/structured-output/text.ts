import { z } from 'zod'

import { BaseMessage } from './shared'

export interface TextMessage extends BaseMessage {
  type: 'text'
  content: {
    text: string
  }
}

export const TextSchema = z
  .object({
    type: z.enum(['text']),
    content: z.object({
      text: z.string(),
    }),
  })
  .describe('A text message')
