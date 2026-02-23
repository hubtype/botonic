import type { OutputMessage } from '@botonic/core'
import { z } from 'zod'
import { BotExecutorSchema } from './bot-executor'
import { CarouselSchema } from './carousel'
import { ExitSchema } from './exit'
import { TextSchema } from './text'
import { TextWithButtonsSchema } from './text-with-buttons'

export interface Output {
  messages: OutputMessage[]
}

export const OutputSchema = z
  .object({
    messages: z.array(
      z.union([
        TextSchema,
        TextWithButtonsSchema,
        CarouselSchema,
        ExitSchema,
        BotExecutorSchema,
      ])
    ),
  })
  .describe('The messages to be sent to the user')
