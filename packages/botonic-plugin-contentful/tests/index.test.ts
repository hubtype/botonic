import { testContentful } from './contentful/contentful.helper';
import * as plugin from '../src/';
import 'jest-extended';

test('TEST: suggestTextsForInput keywords found', async () => {
  let cmsPlugin = new plugin.default({ cms: testContentful() });

  // act
  let text = await cmsPlugin.suggestTextsForInput(
    ' DevoluciON fuera de  plazo?',
    'GbIpKJu8kW6PqMGAUYkoS',
    '4C2ghzuNPXIl0KqLaq1Qqm'
  );

  // assert
  expect(text.buttons).toHaveLength(2);
  let textNames = text.buttons.map(b => b.name);
  expect(textNames).toIncludeSameMembers(['POST_FAQ3', 'POST_FAQ5']);
});

test('TEST: suggestTextsForInput', async () => {
  let cmsPlugin = new plugin.default({ cms: testContentful() });

  // act
  let text = await cmsPlugin.suggestTextsForInput(
    ' donde esta  Mi pedido?',
    'GbIpKJu8kW6PqMGAUYkoS',
    '4C2ghzuNPXIl0KqLaq1Qqm'
  );

  // assert
  expect(text.buttons).toHaveLength(1);
  expect(text.buttons[0].name).toEqual('POST_FAQ1');
});
