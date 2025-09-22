import { CarouselMessage } from '@botonic/core'
import { z } from 'zod'

export type { CarouselMessage }

export const CarouselSchema = z
  .object({
    type: z.enum(['carousel']),
    content: z.object({
      elements: z.array(
        z.object({
          title: z.string(),
          subtitle: z.string(),
          image: z.string(),
          button: z.object({
            text: z.string(),
            url: z.string().nullable().optional(),
            // TODO: Add payload?
          }),
        })
      ),
    }),
  })
  .describe('A carousel message containing a list of elements')
