import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { getOutputSchema, OutputSchema } from '../src/structured-output/index'

describe('Structured Output Schema Validation', () => {
  it('should validate textWithButtons with multiple buttons', () => {
    const validOutput = {
      messages: [
        {
          type: 'textWithButtons',
          content: {
            text: 'Choose an option:',
            buttons: [
              { text: 'Option 1' },
              { text: 'Option 2' },
              { text: 'Option 3' },
            ],
          },
        },
      ],
    }

    const result = OutputSchema.safeParse(validOutput)
    expect(result.success).toBe(true)
  })

  it('should validate carousel with multiple elements', () => {
    const validOutput = {
      messages: [
        {
          type: 'carousel',
          content: {
            elements: [
              {
                title: 'Product 1',
                subtitle: 'Description 1',
                image: 'https://example.com/1.jpg',
                button: { text: 'View', url: 'https://example.com/1' },
              },
              {
                title: 'Product 2',
                subtitle: 'Description 2',
                image: 'https://example.com/2.jpg',
                button: { text: 'Buy', url: 'https://example.com/2' },
              },
            ],
          },
        },
      ],
    }

    const result = OutputSchema.safeParse(validOutput)
    expect(result.success).toBe(true)
  })

  it('should reject invalid button structure', () => {
    const invalidOutput = {
      messages: [
        {
          type: 'textWithButtons',
          content: {
            text: 'Choose an option:',
            buttons: [
              { text: 'Valid button' },
              {}, // Invalid empty button
            ],
          },
        },
      ],
    }

    const result = OutputSchema.safeParse(invalidOutput)
    expect(result.success).toBe(false)
  })

  it('should reject carousel with missing required fields', () => {
    const invalidOutput = {
      messages: [
        {
          type: 'carousel',
          content: {
            elements: [
              {
                title: 'Product 1',
                // Missing subtitle, image, button
              },
            ],
          },
        },
      ],
    }

    const result = OutputSchema.safeParse(invalidOutput)
    expect(result.success).toBe(false)
  })
})

describe('getOutputSchema', () => {
  it('should build with only base schemas when no external schemas are provided', () => {
    const outputType = getOutputSchema([])

    const validBaseMessage = {
      messages: [{ type: 'text', content: { text: 'Hello' } }],
    }
    expect(outputType.safeParse(validBaseMessage).success).toBe(true)

    const invalidCustomMessage = {
      messages: [
        {
          type: 'customVideo',
          content: { videoUrl: 'https://example.com/video.mp4' },
        },
      ],
    }
    expect(outputType.safeParse(invalidCustomMessage).success).toBe(false)
  })

  it('should include custom schemas when provided', () => {
    const customVideoSchema = z.object({
      type: z.enum(['customVideo']),
      content: z.object({
        videoUrl: z.string(),
        thumbnail: z.string().optional(),
      }),
    })

    const outputType = getOutputSchema([customVideoSchema])

    const validCustomMessage = {
      messages: [
        {
          type: 'customVideo',
          content: { videoUrl: 'https://example.com/video.mp4' },
        },
      ],
    }
    expect(outputType.safeParse(validCustomMessage).success).toBe(true)

    const validBaseMessage = {
      messages: [{ type: 'text', content: { text: 'Hello' } }],
    }
    expect(outputType.safeParse(validBaseMessage).success).toBe(true)
  })

  it('should include multiple custom schemas when provided', () => {
    const customVideoSchema = z.object({
      type: z.enum(['customVideo']),
      content: z.object({
        videoUrl: z.string(),
      }),
    })
    const customImageSchema = z.object({
      type: z.enum(['customImage']),
      content: z.object({
        imageUrl: z.string(),
        altText: z.string(),
      }),
    })

    const outputType = getOutputSchema([customVideoSchema, customImageSchema])

    const validVideoMessage = {
      messages: [
        {
          type: 'customVideo',
          content: { videoUrl: 'https://example.com/video.mp4' },
        },
      ],
    }
    expect(outputType.safeParse(validVideoMessage).success).toBe(true)

    const validImageMessage = {
      messages: [
        {
          type: 'customImage',
          content: {
            imageUrl: 'https://example.com/image.png',
            altText: 'A test image',
          },
        },
      ],
    }
    expect(outputType.safeParse(validImageMessage).success).toBe(true)
  })

  it('should reject invalid custom message when custom schemas are provided', () => {
    const customVideoSchema = z.object({
      type: z.enum(['customVideo']),
      content: z.object({
        videoUrl: z.string(),
      }),
    })

    const outputType = getOutputSchema([customVideoSchema])

    const invalidMessage = {
      messages: [
        {
          type: 'customVideo',
          content: { videoUrl: 123 },
        },
      ],
    }
    expect(outputType.safeParse(invalidMessage).success).toBe(false)
  })

  it('should produce same schema as OutputSchema when empty array is provided', () => {
    const outputType = getOutputSchema([])

    const testMessages = [
      { messages: [{ type: 'text', content: { text: 'Hello' } }] },
      {
        messages: [
          {
            type: 'textWithButtons',
            content: {
              text: 'Pick one',
              buttons: [{ text: 'A' }],
            },
          },
        ],
      },
      { messages: [{ type: 'exit' }] },
    ]

    for (const msg of testMessages) {
      expect(outputType.safeParse(msg).success).toBe(
        OutputSchema.safeParse(msg).success
      )
    }
  })

  it('should include external output message schemas in the router output type', () => {
    const customMessageSchema = z.object({
      type: z.literal('custom'),
      content: z.object({ value: z.string() }),
    })

    const outputType = getOutputSchema([customMessageSchema])

    expect(
      outputType.safeParse({
        messages: [{ type: 'custom', content: { value: 'extra' } }],
      }).success
    ).toBe(true)
  })
})
