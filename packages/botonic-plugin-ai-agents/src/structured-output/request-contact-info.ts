import {
  OutputMessageType,
  type RequestContactInfoMessage,
} from '@botonic/core'
import { z } from 'zod'

export type { RequestContactInfoMessage }

export const RequestContactInfoSchema = z
  .object({
    type: z.literal(OutputMessageType.RequestContactInfo),
    content: z.object({
      text: z.string().describe('The text of the message'),
    }),
  })
  .describe(
    'A message to request phone number from the user. Use it only when asked explicitly in the prompt.'
  )
