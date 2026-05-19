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

const baseMessageSchemas = [
  TextSchema,
  TextWithButtonsSchema,
  CarouselSchema,
  ExitSchema,
  BotExecutorSchema,
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

export function getOutputInstructions(): string {
  const example = {
    messages: [
      {
        type: 'text',
        content: {
          text: 'Hello, how can I help you today?',
        },
      },
    ],
  }
  const output = `Return a JSON that follows the output schema provided. Never return multiple output schemas concatenated by a line break.\n<example>\n${JSON.stringify(example)}\n</example>`
  return `<output>\n${output}\n</output>`
}
