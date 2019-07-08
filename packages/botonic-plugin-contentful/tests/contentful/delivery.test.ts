import { ContentCallback, MODEL_TYPES, ModelType } from '../../src/cms';
import { testContentful } from './contentful.helper';

const TEST_IMAGE = '3xjvpC7d7PYBmiptEeygfd';

test('TEST: contentful delivery checks that we get the request model type', async () => {
  let sut = testContentful();

  for (let model of MODEL_TYPES) {
    let callback = new ContentCallback(model, TEST_IMAGE);
    let content = callback.deliverPayloadContent(sut);
    if (model == ModelType.IMAGE) {
      await content;
    } else {
      await expect(content).rejects.toThrow();
    }
  }
});
