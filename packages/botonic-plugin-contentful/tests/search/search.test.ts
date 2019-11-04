import { instance, mock, when } from 'ts-mockito'
import {
  CommonFields,
  ContentCallback,
  DummyCMS,
  ModelType,
  Text,
  Url,
} from '../../src/cms'
import { Search, SearchResult } from '../../src/search'
import { Normalizer } from '../../src/nlp'

const CONTEXT = { locale: 'es' }

test('TEST: respondFoundContents text with buttons', async () => {
  const cms = mock(DummyCMS)
  when(cms.url('urlCmsId', CONTEXT)).thenResolve(
    new Url(new CommonFields('url'), 'http:/mocked_url')
  )
  const sut = new Search(instance(cms), instance(mock(Normalizer)))

  const urlContent = new SearchResult(
    new ContentCallback(ModelType.URL, 'urlCmsId'),
    new CommonFields('name', { shortText: 'url shortText' })
  )

  const textContent = new SearchResult(
    new ContentCallback(ModelType.TEXT, 'textCmsId'),
    new CommonFields('name', { shortText: 'text shortText' })
  )

  // sut
  when(cms.text('foundId', CONTEXT)).thenResolve(
    new Text(new CommonFields('foundName'), 'foundText', [])
  )
  const response = await sut.respondFoundContents(
    [urlContent, textContent],
    'foundId',
    'notFoundId',
    CONTEXT
  )

  // assert
  expect(response.text).toEqual('foundText')
  expect(response.buttons).toHaveLength(2)
  expect(response.buttons[0].text).toEqual('url shortText')
  expect(response.buttons[0].callback.url).toEqual('http:/mocked_url')

  expect(response.buttons[1].text).toEqual('text shortText')
  expect(response.buttons[1].callback.payload).toEqual(
    textContent.callback.payload
  )
})

test('TEST: respondFoundContents text with chitchat', async () => {
  const cms = mock(DummyCMS)
  const sut = new Search(instance(cms), instance(mock(Normalizer)))

  const chitchat = instance(mock(Text))
  when(cms.chitchat('chitchatCmsId', CONTEXT)).thenResolve(chitchat)
  const chitchatCallback = new SearchResult(
    new ContentCallback(ModelType.CHITCHAT, 'chitchatCmsId'),
    new CommonFields('name', { shortText: 'chitchat' })
  )

  when(cms.text('foundId', CONTEXT)).thenResolve(
    new Text(new CommonFields('foundName'), 'foundText', [])
  )

  //act
  const response = await sut.respondFoundContents(
    [chitchatCallback],
    'foundId',
    'notFoundId',
    CONTEXT
  )

  // assert
  expect(response).toEqual(chitchat)
})

test('TEST: respondFoundContents without contents', async () => {
  const cms = mock(DummyCMS)
  const sut = new Search(instance(cms), instance(mock(Normalizer)))

  // sut
  when(cms.text('notFoundId', CONTEXT)).thenResolve(
    new Text(new CommonFields('notFoundName'), 'notFoundText', [])
  )
  const response = await sut.respondFoundContents(
    [],
    'foundId',
    'notFoundId',
    CONTEXT
  )

  // assert
  expect(response.text).toEqual('notFoundText')
})
