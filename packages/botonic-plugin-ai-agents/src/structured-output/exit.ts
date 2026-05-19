import { type ExitMessage, OutputMessageType } from '@botonic/core'
import { z } from 'zod'

export type { ExitMessage }

export const ExitSchema = z
  .object({
    type: z.literal(OutputMessageType.Exit),
  })
  .describe(
    'An exit message. This message should only be used to exit the agent due to out of context or the user asking to exit the conversation'
  )
