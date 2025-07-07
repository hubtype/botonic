import z from 'zod'
import { BaseMessage } from './shared'

export interface TextWithButtonsMessage extends BaseMessage {
  type: 'textWithButtons'
  content: {
    text: string
    buttons: string[]
  }
}

export const TextWithButtonsSchema = z.object({
  type: z.enum(['textWithButtons']),
  content: z.object({
    text: z.string(),
    buttons: z.array(z.string()),
  }),
})
