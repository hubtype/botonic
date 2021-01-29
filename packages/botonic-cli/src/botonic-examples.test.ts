import { EXAMPLES } from './botonic-examples'

test('handoff example exists', () => {
  expect(EXAMPLES).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        uri: 'hubtype/botonic-examples//handoff',
      }),
    ])
  )
})
