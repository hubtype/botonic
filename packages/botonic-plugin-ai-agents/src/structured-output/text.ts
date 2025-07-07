import { BaseMessage } from './shared'
import { z } from 'zod'

export interface TextMessage extends BaseMessage {
  type: 'text'
  content: {
    text: string
  }
}

export const TextSchema = z.object({
  type: z.enum(['text']),
  content: z.object({
    text: z.string(),
  }),
})
