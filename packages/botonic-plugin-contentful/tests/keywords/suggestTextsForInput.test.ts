import { ContentCallback, ModelType } from '../../src';
import { testContentful } from '../contentful/contentful.helper';
import * as plugin from '../../src';
import 'jest-extended';

test('TEST: suggestTextsForInput keywords found', async () => {
  let cmsPlugin = new plugin.default({ cms: testContentful() });

  // act

  let text = await cmsPlugin.keywords.suggestContentsForInput(
    cmsPlugin.keywords.tokenize(' DevoluciON fuera de  plazo? Empezar'),
    'GbIpKJu8kW6PqMGAUYkoS',
    '4C2ghzuNPXIl0KqLaq1Qqm'
  );

  // assert
  expect(text.name).toEqual('KEYWORDS_OK');
  expect(text.buttons).toHaveLength(3);
  let textNames = text.buttons.map(b => b.name);
  expect(textNames).toIncludeSameMembers(['POST_FAQ3', 'POST_FAQ5', 'INICIO']);
  let models = text.buttons.map(b => (b.callback as ContentCallback).model);
  expect(models).toIncludeSameMembers([
    ModelType.TEXT,
    ModelType.TEXT,
    ModelType.CAROUSEL
  ]);
});

test('TEST: suggestTextsForInput no keywords found', async () => {
  let cmsPlugin = new plugin.default({ cms: testContentful() });

  // act
  let text = await cmsPlugin.keywords.suggestContentsForInput(
    cmsPlugin.keywords.tokenize('willnotbefound'),
    'GbIpKJu8kW6PqMGAUYkoS',
    '4C2ghzuNPXIl0KqLaq1Qqm'
  );

  // assert
  expect(text.name).toEqual('KEYWORDS_KO_RETRY');
  expect(text.buttons).toHaveLength(0);
});
