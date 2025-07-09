import { z } from 'zod'

import { CarouselMessage, CarouselSchema } from './carousel'
import { ExitMessage, ExitSchema } from './exit'
import { TextMessage, TextSchema } from './text'
import {
  TextWithButtonsMessage,
  TextWithButtonsSchema,
} from './text-with-buttons'

export type OutputMessage =
  | TextMessage
  | TextWithButtonsMessage
  | CarouselMessage
  | ExitMessage

export interface Output {
  messages: OutputMessage[]
}

export const OutputSchema = z
  .object({
    messages: z.array(
      z.union([TextSchema, TextWithButtonsSchema, CarouselSchema, ExitSchema])
    ),
  })
  .describe('The messages to be sent to the user')
