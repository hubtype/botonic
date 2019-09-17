import { ContentCallback, MODEL_TYPES, ModelType } from '../../src/cms';
import { testContentful } from './contentful.helper';

const TEST_IMAGE = '3xjvpC7d7PYBmiptEeygfd';

test('TEST: contentful delivery checks that we get the requested model type', async () => {
  const sut = testContentful();

  for (const model of MODEL_TYPES) {
    const callback = new ContentCallback(model, TEST_IMAGE);
    const content = callback.deliverPayloadContent(sut, { locale: 'es' });
    if (model == ModelType.IMAGE) {
      await content;
    } else {
      await expect(content).rejects.toThrow();
    }
  }
});
