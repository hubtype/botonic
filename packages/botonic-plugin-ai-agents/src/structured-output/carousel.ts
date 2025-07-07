import { BaseMessage } from './shared'
import { z } from 'zod'

interface CarouselElement {
  title: string
  subtitle: string
  image: string
  button: { text: string; url: string }
}

export interface CarouselMessage extends BaseMessage {
  type: 'carousel'
  content: {
    elements: CarouselElement[]
  }
}

export const CarouselSchema = z.object({
  type: z.enum(['carousel']),
  content: z.object({
    elements: z.array(
      z.object({
        title: z.string(),
        subtitle: z.string(),
        image: z.string(),
        button: z.object({
          text: z.string(),
          url: z.string(),
        }),
      })
    ),
  }),
})
