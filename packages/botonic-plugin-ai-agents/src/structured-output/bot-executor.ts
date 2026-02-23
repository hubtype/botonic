import type { BotExecutorMessage } from '@botonic/core'
import z from 'zod'

export type { BotExecutorMessage }

export const BotExecutorSchema = z
  .object({
    type: z.enum(['botExecutor']),
    content: z.object({
      text: z.string(),
      buttons: z.array(
        z.object({
          text: z.string(),
          payload: z.string(),
        })
      ),
    }),
  })
  .describe(
    'A text message with buttons to allow the bot to execute a specific action. Use it only when asked explicitly in the prompt'
  )
