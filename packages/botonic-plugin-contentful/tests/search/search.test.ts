import { instance, mock, when } from 'ts-mockito'

import {
  CommonFields,
  ContentType,
  DummyCMS,
  SCORE_MAX,
  Text,
  TopContentId,
  Url,
} from '../../src/cms'
import { rndStr } from '../../src/cms/test-helpers/builders'
import { Normalizer } from '../../src/nlp'
import { Search, SearchCandidate } from '../../src/search'

const CONTEXT = { locale: 'es' }

test('TEST: respondFoundContents text with buttons', async () => {
  const cms = mock(DummyCMS)
  when(cms.url('urlCmsId', CONTEXT)).thenResolve(
    new Url(new CommonFields(rndStr(), 'url'), 'http:/mocked_url')
  )
  const sut = new Search(instance(cms), instance(mock(Normalizer)))

  const urlContent = new SearchCandidate(
    new TopContentId(ContentType.URL, 'urlCmsId'),
    new CommonFields(rndStr(), 'name', { shortText: 'url shortText' })
  ).withResult('match', SCORE_MAX)

  const textContent = new SearchCandidate(
    new TopContentId(ContentType.TEXT, 'textCmsId'),
    new CommonFields(rndStr(), 'name', { shortText: 'text shortText' })
  ).withResult('match', SCORE_MAX)

  // sut
  when(cms.text('foundId', CONTEXT)).thenResolve(
    new Text(new CommonFields(rndStr(), 'foundName'), 'foundText', [])
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
  expect(response.buttons[0].callback?.url).toEqual('http:/mocked_url')

  expect(response.buttons[1].text).toEqual('text shortText')
  expect(response.buttons[1].callback?.asContentId()).toEqual(
    textContent.contentId
  )
})

test('TEST: respondFoundContents text with chitchat', async () => {
  const cms = mock(DummyCMS)
  const sut = new Search(instance(cms), instance(mock(Normalizer)))

  const chitchat = instance(mock(Text))
  when(cms.chitchat('chitchatCmsId', CONTEXT)).thenResolve(chitchat)
  const chitchatCallback = new SearchCandidate(
    new TopContentId(ContentType.CHITCHAT, 'chitchatCmsId'),
    new CommonFields(rndStr(), 'name', { shortText: 'chitchat' })
  ).withResult('match', SCORE_MAX)

  when(cms.text('foundId', CONTEXT)).thenResolve(
    new Text(new CommonFields(rndStr(), 'foundName'), 'foundText', [])
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
    new Text(new CommonFields(rndStr(), 'notFoundName'), 'notFoundText', [])
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
