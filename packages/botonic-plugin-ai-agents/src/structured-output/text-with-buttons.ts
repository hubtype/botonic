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
          target: z
            .enum(['_blank', '_self'])
            .default('_blank')
            .nullable()
            .optional()
            .describe(
              'The target of the button when it has an url. If not provided, it will default to _blank.'
            ),
        })
      ),
    }),
  })
  .describe(
    'A text message with buttons to allow the user to use quick replies'
  )
