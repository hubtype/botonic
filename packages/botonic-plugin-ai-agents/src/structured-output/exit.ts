import z from 'zod'

import { BaseMessage } from './shared'

export interface ExitMessage extends BaseMessage {
  type: 'exit'
}

export const ExitSchema = z
  .object({
    type: z.enum(['exit']),
  })
  .describe(
    'An exit message. This message should only be used to exit the agent due to out of context or the user asking to exit the conversation'
  )
