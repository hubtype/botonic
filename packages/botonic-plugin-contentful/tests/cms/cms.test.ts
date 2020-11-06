import { TOP_CONTENT_TYPES, ContentType } from '../../src/cms'

test('TEST: ALL_TYPES', () => {
  expect(TOP_CONTENT_TYPES.length).toBeGreaterThanOrEqual(8)
  expect(TOP_CONTENT_TYPES).toContain(ContentType.TEXT)
})
