import { SimilarSearch } from 'node-nlp/lib/util';
import { ContentCallback, ModelType } from '../../src/cms';
import { SearchResult } from '../../src/search';
import { testContentful, testContext } from './contentful.helper';
import { TEST_POST_FAQ1_ID } from './text.test';
import 'jest-extended';

test('TEST: contentful contentsWithKeywords', async () => {
  const results = await testContentful().contentsWithKeywords(
    testContext([{ locale: 'en' }, {}, undefined])
  );

  const queues: SearchResult[] = [];
  const contentsWithKeywords: SearchResult[] = [];
  results
    .filter(result => result.callback instanceof ContentCallback)
    .map(result => {
      switch ((result.callback as ContentCallback).model) {
        case ModelType.QUEUE:
          queues.push(result);
          break;
        default:
          contentsWithKeywords.push(result);
      }
    });
  expect(queues).toHaveLength(2);
  const keywordsByPrio: { [priority: number]: string[] } = {};
  for (const queue of queues) {
    expect(queue.common.name).toEqual('TEST_QUEUE');
    expect(queue.common.shortText).toEqual('Short Text');
    keywordsByPrio[queue.priority] = queue.common.keywords;
  }
  expect(keywordsByPrio[10]).toEqual(['low1', 'low2']);
  expect(keywordsByPrio[99]).toEqual(['high1', 'high2']);

  expect(contentsWithKeywords).toHaveLength(16);

  const postFaq1 = contentsWithKeywords.find(
    content => (content.callback as ContentCallback).id == TEST_POST_FAQ1_ID
  );
  expect(postFaq1!.common.name).toEqual('POST_FAQ1');
  expect(postFaq1!.common.shortText).toEqual('Find my command');
  expect(postFaq1!.priority).toEqual(100);
  expect(postFaq1!.common.keywords).toIncludeSameMembers([
    'no encuentro mi pedido',
    'donde esta mi pedido'
  ]);
});

test('TEST: similar', () => {
  const search = new SimilarSearch({ normalize: true });
  expect(search.getSimilarity('factura', 'fastura')).toEqual(1);
});
