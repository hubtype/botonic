import { z } from 'zod'
import { TextMessage, TextSchema } from './text'
import {
  TextWithButtonsMessage,
  TextWithButtonsSchema,
} from './text-with-buttons'
import { CarouselMessage, CarouselSchema } from './carousel'
import { ExitMessage, ExitSchema } from './exit'

export type OutputMessage =
  | TextMessage
  | TextWithButtonsMessage
  | CarouselMessage
  | ExitMessage

export interface Output {
  messages: OutputMessage[]
}

export const OutputSchema = z.object({
  messages: z.array(
    z.union([TextSchema, TextWithButtonsSchema, CarouselSchema, ExitSchema])
  ),
})
