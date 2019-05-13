import { testContentful } from './contentful/contentful.helper';
import * as plugin from '../src/';

test('TEST: suggestTextsForInput', async () => {
  let cmsPlugin = new plugin.default({ cms: testContentful() });

  // act
  let text = await cmsPlugin.suggestTextsForInput(
    ' donde esta  Mi pedido?',
    'GbIpKJu8kW6PqMGAUYkoS'
  );

  // assert
  expect(text.buttons).toHaveLength(1);
  expect(text.buttons[0].name).toEqual('POST_FAQ1');
});
