import { EXAMPLES } from '../src/botonic-examples'

describe('TEST: New command', () => {
  it('Handoff example exists', () => {
    expect(EXAMPLES).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          uri: 'hubtype/botonic-examples//handoff',
        }),
      ])
    )
  })
})
