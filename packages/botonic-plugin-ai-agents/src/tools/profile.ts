import { tool, RunContext } from '@openai/agents'
import { z } from 'zod'
import { Context } from '../types'

export const updateUserProfile = tool({
  name: 'updateUserProfile',
  description:
    'Use this tool to update the profile of the user (name, email, etc.)',
  parameters: z.object({
    attributes: z.array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    ),
  }),
  execute: async (input, runContext?: RunContext<Context>) => {
    if (!runContext) {
      throw new Error('Run context is required')
    }
    const profile: Record<string, string> = {}
    for (const attr of input.attributes) {
      profile[attr.key] = attr.value
    }

    runContext.context.request.session.user.extra_data['profile'] = {
      ...(runContext.context.request.session.user.extra_data['profile'] || {}),
      ...profile,
    }
    return 'Profile updated'
  },
})
