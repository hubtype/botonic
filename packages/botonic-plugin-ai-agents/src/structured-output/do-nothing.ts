import { type DoNothingMessage, OutputMessageType } from '@botonic/core'
import { z } from 'zod'

export type { DoNothingMessage }

export const DoNothingSchema = z
  .object({
    type: z.literal(OutputMessageType.DoNothing),
  })
  .describe(
    'A do nothing message is used to end the conversation without send a reply. Use it only when asked explicitly in the prompt.'
  )
