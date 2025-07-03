import { tool } from '@langchain/core/tools'
import { z } from 'zod'

export const getWeather = tool(
  async (input: { city: 'nyc' | 'sf' }) => {
    if (input.city === 'nyc') {
      return 'It is cloudy in NYC, with 5 mph winds in the North-East direction and a temperature of 70 degrees'
    } else if (input.city === 'sf') {
      return 'It is 75 degrees and sunny in SF, with 3 mph winds in the South-East direction'
    } else {
      throw new Error('Unknown city')
    }
  },
  {
    name: 'getWeather',
    description: 'Use this to get weather information.',
    schema: z.object({
      city: z.enum(['nyc', 'sf']),
    }),
  }
)

export const messageResponse = tool(
  async (input: { messages: any[] }) => {
    console.log('Tool: messageResponse', input)
    return input
  },
  {
    name: 'messageResponse',
    description: 'Use this to respond to the user.',
    schema: z.object({
      messages: z.array(
        z.union([
          z.object({
            type: z.enum(['text']),
            content: z.object({ text: z.string() }),
          }),
          z.object({
            type: z.enum(['textWithButtons']),
            content: z.object({
              text: z.string(),
              buttons: z.array(z.string()),
            }),
          }),
        ])
      ),
    }),
  }
)

export const TOOLS = [getWeather]
