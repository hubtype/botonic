import 'jest-extended';
import * as plugin from '../../src';
import { Button, ContentCallback, ModelType } from '../../src';
import { testContentful } from '../contentful/contentful.helper';

test('TEST: suggestTextsForInput keywords found', async () => {
  let cmsPlugin = new plugin.default({ cms: testContentful() });

  // act

  let text = await cmsPlugin.keywords.suggestContentsForInput(
    cmsPlugin.keywords.tokenize(' DevoluciON fuera de  plazo? Empezar Hubtype'),
    'GbIpKJu8kW6PqMGAUYkoS',
    '4C2ghzuNPXIl0KqLaq1Qqm'
  );

  // assert
  expect(text.name).toEqual('KEYWORDS_OK');
  expect(text.buttons).toHaveLength(4);
  let textNames = text.buttons.map(b => b.name);
  expect(textNames).toIncludeSameMembers([
    'POST_FAQ3',
    'POST_FAQ5',
    'INICIO',
    'URL_HUBTYPE'
  ]);
  let contentButtons = text.buttons.filter(
    b => b.callback instanceof ContentCallback
  );
  let models = contentButtons.map(b => (b.callback as ContentCallback).model);
  expect(models).toIncludeSameMembers([
    ModelType.TEXT,
    ModelType.TEXT,
    ModelType.CAROUSEL
  ]);
  let hubTypeUrl: Button = text.buttons.find(b => b.name == 'URL_HUBTYPE')!;
  expect(hubTypeUrl.callback.url).toEqual('https://www.hubtype.com/');
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
