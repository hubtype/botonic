import { Search } from '../../src/search';
import { testContentful } from '../contentful/contentful.helper';
import { KeywordsOptions, MatchType, Normalizer } from '../../src/nlp';

test('TEST search: ', async () => {
  const contentful = testContentful();
  const normalizer = new Normalizer();
  const sut = new Search(contentful, normalizer, {
    es: new KeywordsOptions(1)
  });
  const res = await sut.searchByKeywords(
    'esta',
    MatchType.ONLY_KEYWORDS_FOUND,
    {
      locale: 'es'
    }
  );
  console.log(res);
});
