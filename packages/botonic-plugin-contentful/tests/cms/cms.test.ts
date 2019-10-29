import { MODEL_TYPES, ModelType } from '../../src/cms'

test('TEST: ALL_TYPES', () => {
  expect(MODEL_TYPES.length).toBeGreaterThanOrEqual(9)
  expect(MODEL_TYPES).toContain(ModelType.TEXT)
})
