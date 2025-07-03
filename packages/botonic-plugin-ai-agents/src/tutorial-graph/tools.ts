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

export const weatherResponse = tool(
  async (input: {
    temperature: number
    wind_direction: string
    wind_speed: number
  }) => {
    console.log('Tool: weatherResponse', input)
    return input
  },
  {
    name: 'weatherResponse',
    description: 'Use this to respond to the user.',
    schema: z.object({
      temperature: z.number().describe('The temperature in fahrenheit'),
      wind_direction: z
        .string()
        .describe('The direction of the wind in abbreviated form'),
      wind_speed: z.number().describe('The speed of the wind in mph'),
    }),
  }
)

export const TOOLS = [getWeather, weatherResponse]
