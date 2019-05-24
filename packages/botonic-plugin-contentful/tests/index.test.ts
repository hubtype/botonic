import { testContentful } from './contentful/contentful.helper';
import * as plugin from '../src/';
import 'jest-extended';

// TODO move to keywords folder

test('TEST: suggestTextsForInput keywords found', async () => {
  let cmsPlugin = new plugin.default({ cms: testContentful() });

  // act

  let text = await cmsPlugin.keywords.suggestTextsForInput(
    cmsPlugin.keywords.tokenize(' DevoluciON fuera de  plazo?'),
    'GbIpKJu8kW6PqMGAUYkoS',
    '4C2ghzuNPXIl0KqLaq1Qqm'
  );

  // assert
  expect(text.name).toEqual('KEYWORDS_OK');
  expect(text.buttons).toHaveLength(2);
  let textNames = text.buttons.map(b => b.name);
  expect(textNames).toIncludeSameMembers(['POST_FAQ3', 'POST_FAQ5']);
});

test('TEST: suggestTextsForInput no keywords found', async () => {
  let cmsPlugin = new plugin.default({ cms: testContentful() });

  // act
  let text = await cmsPlugin.keywords.suggestTextsForInput(
    cmsPlugin.keywords.tokenize('willnotbefound'),
    'GbIpKJu8kW6PqMGAUYkoS',
    '4C2ghzuNPXIl0KqLaq1Qqm'
  );

  // assert
  expect(text.name).toEqual('KEYWORDS_KO_RETRY');
  expect(text.buttons).toHaveLength(0);
});
