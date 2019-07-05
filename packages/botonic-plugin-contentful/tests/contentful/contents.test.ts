import { ContentCallback, ModelType, Queue } from '../../src/cms';
import { testContentful, testContext } from './contentful.helper';

test('TEST: contentful contents', async () => {
  let queues = await testContentful().contents(ModelType.QUEUE, {
    locale: 'en'
  });
  expect(queues).toSatisfyAll(queue => queue instanceof Queue);
  expect(queues.length).toEqual(1);
});

test('TEST: contentful contentsWithKeywords', async () => {
  // act
  let results = await testContentful().contentsWithKeywords(
    testContext([{ locale: 'es' }, {}, undefined])
  );

  // assert
  expect(
    results.filter(result => !(result.callback instanceof ContentCallback))
  ).toHaveLength(1);
  let contentResults = results.filter(
    result => result.callback instanceof ContentCallback
  );
  let ofType = (model: ModelType) =>
    contentResults.filter(r => (r.callback as ContentCallback).model == model);
  // for (let m of ALL_TYPES) {
  //   console.log(`${m}: ${ofType(m).length}`);
  // }

  expect(ofType(ModelType.CAROUSEL)).toHaveLength(1);
  expect(ofType(ModelType.TEXT)).toHaveLength(15);
  expect(ofType(ModelType.CHITCHAT)).toHaveLength(0);
  expect(ofType(ModelType.BUTTON)).toHaveLength(0);
  expect(ofType(ModelType.URL)).toHaveLength(0);
  expect(ofType(ModelType.PAYLOAD)).toHaveLength(0);
  expect(ofType(ModelType.SCHEDULE)).toHaveLength(0);
  expect(ofType(ModelType.DATE_RANGE)).toHaveLength(0);
  expect(ofType(ModelType.IMAGE)).toHaveLength(0);
  expect(ofType(ModelType.ASSET)).toHaveLength(0);
  expect(ofType(ModelType.QUEUE)).toHaveLength(2);
});
