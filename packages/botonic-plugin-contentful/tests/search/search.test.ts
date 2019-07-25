import { instance, mock, when } from 'ts-mockito';
import { ContentCallback, DummyCMS, ModelType, Text, Url } from '../../src/cms';
import { Search, SearchResult } from '../../src/search';

const CONTEXT = { locale: 'es' };

test('TEST: respondFoundContents text with buttons', async () => {
  let cms = mock(DummyCMS);
  when(cms.url('urlCmsId', CONTEXT)).thenResolve(
    new Url('url', 'http:/mocked_url')
  );
  let sut = new Search(instance(cms));

  let urlContent = new SearchResult(
    new ContentCallback(ModelType.URL, 'urlCmsId'),
    'name',
    'url shortText',
    []
  );

  let textContent = new SearchResult(
    new ContentCallback(ModelType.TEXT, 'textCmsId'),
    'name',
    'text shortText',
    []
  );

  // sut
  when(cms.text('foundId', CONTEXT)).thenResolve(
    new Text('foundName', 'foundText', [])
  );
  let response = await sut.respondFoundContents(
    [urlContent, textContent],
    'foundId',
    'notFoundId',
    CONTEXT
  );

  // assert
  expect(response.text).toEqual('foundText');
  expect(response.buttons).toHaveLength(2);
  expect(response.buttons[0].text).toEqual('url shortText');
  expect(response.buttons[0].callback.url).toEqual('http:/mocked_url');

  expect(response.buttons[1].text).toEqual('text shortText');
  expect(response.buttons[1].callback.payload).toEqual(
    textContent.callback.payload
  );
});

test('TEST: respondFoundContents text with chitchat', async () => {
  let cms = mock(DummyCMS);
  let sut = new Search(instance(cms));

  let chitchat = instance(mock(Text));
  when(cms.chitchat('chitchatCmsId', CONTEXT)).thenResolve(chitchat);
  let chitchatCallback = new SearchResult(
    new ContentCallback(ModelType.CHITCHAT, 'chitchatCmsId'),
    'name',
    'chitchat',
    []
  );

  // sut
  when(cms.text('foundId', CONTEXT)).thenResolve(
    new Text('foundName', 'foundText', [])
  );
  let response = await sut.respondFoundContents(
    [chitchatCallback],
    'foundId',
    'notFoundId',
    CONTEXT
  );

  // assert
  expect(response).toEqual(chitchat);
});

test('TEST: respondFoundContents without contents', async () => {
  let cms = mock(DummyCMS);
  let sut = new Search(instance(cms));

  // sut
  when(cms.text('notFoundId', CONTEXT)).thenResolve(
    new Text('notFoundName', 'notFoundText', [])
  );
  let response = await sut.respondFoundContents(
    [],
    'foundId',
    'notFoundId',
    CONTEXT
  );

  // assert
  expect(response.text).toEqual('notFoundText');
});
