import { convertToMarkdownMeta } from '../../../src/components/multichannel/whatsapp/markdown-meta'

describe('Markdown to WhatsApp conversion', () => {
  test('convert bold markdown to WhatsApp format', () => {
    const input = 'This is **bold** text'
    const expectedOutput = 'This is *bold* text'
    expect(convertToMarkdownMeta(input)).toBe(expectedOutput)
  })

  test('convert italic markdown to WhatsApp format', () => {
    const input = 'This is *italic* text'
    const expectedOutput = 'This is _italic_ text'
    expect(convertToMarkdownMeta(input)).toBe(expectedOutput)
  })

  test('convert bold and italic markdown to WhatsApp format', () => {
    const input = 'This is **bold** and *italic* text'
    const expectedOutput = 'This is *bold* and _italic_ text'
    expect(convertToMarkdownMeta(input)).toBe(expectedOutput)
  })

  test('convert markdown links to WhatsApp format', () => {
    const input = 'This is a [link](http://example.com)'
    const expectedOutput = 'This is a link: http://example.com'
    expect(convertToMarkdownMeta(input)).toBe(expectedOutput)
  })

  test('convert complex markdown to WhatsApp format', () => {
    const input = '_This is __bold__, italic_, and a [link](http://example.com)'
    const expectedOutput =
      '_This is *bold*, italic_, and a link: http://example.com'
    expect(convertToMarkdownMeta(input)).toBe(expectedOutput)
  })
})
