import { type CarouselMessage, OutputMessageType } from '@botonic/core'
import { z } from 'zod'

export type { CarouselMessage }

export const CarouselSchema = z
  .object({
    type: z.literal(OutputMessageType.Carousel),
    content: z.object({
      text: z.string().nullable().optional(),
      elements: z.array(
        z.object({
          title: z.string(),
          subtitle: z.string(),
          image: z.string(),
          button: z.object({
            text: z.string(),
            url: z.string().nullable().optional(),
          }),
        })
      ),
    }),
  })
  .describe('A carousel message containing a list of elements')
