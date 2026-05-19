import { z } from 'zod'

import { getToolsForBotConfig } from '../src/bot-config-tools'
import type { CustomTool } from '../src/types'

describe('getToolsForBotConfig', () => {
  it('should convert custom tool schemas to JSON Schema', () => {
    const customTools: CustomTool[] = [
      {
        name: 'schedule_meeting',
        description: 'Schedule a meeting with a contact.',
        schema: z
          .object({
            contactEmail: z.string().email().describe('Contact email address'),
            durationMinutes: z
              .number()
              .int()
              .positive()
              .describe('Meeting duration in minutes'),
            notes: z.string().optional().describe('Optional meeting notes'),
          })
          .describe('Meeting scheduling input'),
        func: async () => undefined,
      },
    ]

    expect(getToolsForBotConfig(customTools)).toEqual([
      {
        name: 'schedule_meeting',
        description: 'Schedule a meeting with a contact.',
        schema: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          additionalProperties: false,
          description: 'Meeting scheduling input',
          properties: {
            contactEmail: {
              description: 'Contact email address',
              format: 'email',
              pattern:
                "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
              type: 'string',
            },
            durationMinutes: {
              description: 'Meeting duration in minutes',
              exclusiveMinimum: 0,
              maximum: 9007199254740991,
              type: 'integer',
            },
            notes: {
              description: 'Optional meeting notes',
              type: 'string',
            },
          },
          required: ['contactEmail', 'durationMinutes'],
          type: 'object',
        },
      },
    ])
  })

  it('should fail when a custom tool schema cannot be represented as JSON Schema', () => {
    const customTools: CustomTool[] = [
      {
        name: 'invalid_tool',
        description: 'Uses an unrepresentable schema.',
        schema: z.object({
          value: z.string().transform(value => value.length),
        }),
        func: async () => undefined,
      },
    ]

    expect(() => getToolsForBotConfig(customTools)).toThrow()
  })
})
