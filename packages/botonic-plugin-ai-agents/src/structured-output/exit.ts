import z from 'zod'

import { BaseMessage } from './shared'

export interface ExitMessage extends BaseMessage {
  type: 'exit'
}

export const ExitSchema = z.object({
  type: z.enum(['exit']),
})
