import { MODEL_TYPES, ModelType } from '../../src/cms';

test('TEST: ALL_TYPES', () => {
  expect(MODEL_TYPES.length).toBeGreaterThan(10);
  expect(MODEL_TYPES).toContain(ModelType.TEXT);
});
