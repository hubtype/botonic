import type { WhatsappButtonListMessage } from '@botonic/core'
import z from 'zod'

export type { WhatsappButtonListMessage }

export const WhatsappButtonListSchema = z
  .object({
    type: z.enum(['whatsappButtonList']),
    content: z.object({
      text: z.string().describe('The body text shown above the list'),
      buttonText: z
        .string()
        .describe(
          'The label of the button that opens the list of options (max 20 chars)'
        ),
      sections: z.array(
        z.object({
          title: z.string().describe('The title of the section (max 24 chars)'),
          rows: z.array(
            z.object({
              text: z.string().describe('The option title (max 24 chars)'),
              description: z
                .string()
                .nullable()
                .optional()
                .describe(
                  'Optional subtitle shown under the option (max 72 chars)'
                ),
            })
          ),
        })
      ),
    }),
  })
  .describe(
    'A WhatsApp interactive list message. Use this instead of textWithButtons when you need to present more than 3 options, or when options benefit from a short description. Renders as quick-reply buttons on non-WhatsApp channels.'
  )
