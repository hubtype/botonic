import { SimilarSearch } from 'node-nlp/lib/util';
import { ContentCallback, ModelType } from '../../src/cms';
import { SearchResult } from '../../src/search';
import { testContentful, testContext } from './contentful.helper';
import { TEST_POST_FAQ1_ID } from './text.test';
import 'jest-extended';

test('TEST: contentful contentsWithKeywords', async () => {
  const results = await testContentful().contentsWithKeywords(
    testContext([{ locale: 'es' }, {}, undefined])
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
    expect(queue.name).toEqual('TEST_QUEUE');
    expect(queue.shortText).toEqual('Short Text');
    keywordsByPrio[queue.priority] = queue.keywords;
  }
  expect(keywordsByPrio[10]).toEqual(['low1', 'low2']);
  expect(keywordsByPrio[99]).toEqual(['high1', 'high2']);

  expect(contentsWithKeywords).toHaveLength(16);

  const postFaq1 = contentsWithKeywords.find(
    content => (content.callback as ContentCallback).id == TEST_POST_FAQ1_ID
  );
  expect(postFaq1!.name).toEqual('POST_FAQ1');
  expect(postFaq1!.shortText).toEqual('Encontrar mi pedido');
  expect(postFaq1!.priority).toEqual(100);
  expect(postFaq1!.keywords).toIncludeSameMembers([
    'no encuentro mi pedido',
    'donde esta mi pedido'
  ]);
});

test('TEST: similar', () => {
  const search = new SimilarSearch({ normalize: true });
  expect(search.getSimilarity('factura', 'fastura')).toEqual(1);
});
