import { TOPCONTENT_TYPES, ContentType } from '../../src/cms'

test('TEST: ALL_TYPES', () => {
  expect(TOPCONTENT_TYPES.length).toBeGreaterThanOrEqual(9)
  expect(TOPCONTENT_TYPES).toContain(ContentType.TEXT)
})
