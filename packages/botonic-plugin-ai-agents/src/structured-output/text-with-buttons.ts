import type { TextWithButtonsMessage } from '@botonic/core'
import z from 'zod'

export type { TextWithButtonsMessage }

export const TextWithButtonsSchema = z
  .object({
    type: z.enum(['textWithButtons']),
    content: z.object({
      text: z.string(),
      buttons: z.array(
        z.object({
          text: z.string(),
          url: z.string().nullable().optional(),
        })
      ),
    }),
  })
  .describe(
    'A text message with buttons to allow the user to use quick replies'
  )
