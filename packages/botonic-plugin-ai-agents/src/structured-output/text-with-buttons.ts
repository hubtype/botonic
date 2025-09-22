import { TextWithButtonsMessage } from '@botonic/core'
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
          payload: z.string().nullable().optional(),
          url: z.string().nullable().optional(),
        })
      ),
    }),
  })
  .describe(
    `A text message with buttons to allow the user to use quick replies. The payload value is filled with JUST the same value as the button text. Each button must have either a payload (for internal actions) or a url (for external links).`
  )
