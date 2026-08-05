import { gzip } from 'pako'

import { decompressData } from '../src/pusher-utils'

function compressData(data: string): string {
  const compressed = gzip(data)
  return Buffer.from(compressed).toString('base64')
}

describe('decompressData', () => {
  test('decompresses a small JSON payload', () => {
    const original = '{"message":{"text":"hi"}}'
    const compressed = compressData(original)

    expect(decompressData(compressed)).toBe(original)
  })

  test('round-trips a typical debug trace JSON object', () => {
    const original = {
      type: 'ai_agent',
      trace: {
        steps: [{ name: 'tool_call', input: { query: 'weather' } }],
        duration_ms: 1234,
      },
    }
    const json = JSON.stringify(original)
    const compressed = compressData(json)

    expect(JSON.parse(decompressData(compressed))).toEqual(original)
  })

  test('decompresses UTF-8 content with non-ASCII characters', () => {
    const original = '{"text":"á ñ emoji 🎉"}'
    const compressed = compressData(original)

    expect(decompressData(compressed)).toBe(original)
  })

  test('decompresses a large payload without stack overflow', () => {
    const original = JSON.stringify({ data: 'x'.repeat(200_000) })
    const compressed = compressData(original)

    expect(decompressData(compressed)).toBe(original)
  })
})
