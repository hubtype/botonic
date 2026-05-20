import type { OutputMessage } from '@botonic/core'
import { z } from 'zod'
import { BotExecutorSchema } from './bot-executor'
import { CarouselSchema } from './carousel'
import { ExitSchema } from './exit'
import { TextSchema } from './text'
import { TextWithButtonsSchema } from './text-with-buttons'
import { WhatsappButtonListSchema } from './whatsapp-button-list'

export interface Output {
  messages: OutputMessage[]
}

const baseMessageSchemas = [
  TextSchema,
  TextWithButtonsSchema,
  CarouselSchema,
  ExitSchema,
  BotExecutorSchema,
  WhatsappButtonListSchema,
] as const
export const OutputSchema = z
  .object({
    messages: z.array(z.union(baseMessageSchemas)),
  })
  .describe('The messages to be sent to the user')

export function getOutputSchema(
  externalOutputMessagesSchemas: z.ZodObject<any>[]
) {
  return z.object({
    messages: z.array(
      z.union([...baseMessageSchemas, ...externalOutputMessagesSchemas])
    ),
  })
}
