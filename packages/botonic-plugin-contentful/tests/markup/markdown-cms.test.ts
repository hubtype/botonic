import { CMS } from '../../src/cms'
import { MarkdownCMS } from '../../src/markup/markdown-cms'
import {
  RecursiveMessageContentFilter,
  textUpdaterFilter,
} from '../../src/cms/message-content-filters'
import { anyString, anything, instance, mock, when } from 'ts-mockito'
import { RndTextBuilder } from '../../src/cms/test-helpers'
import { testContentful } from '../contentful/contentful.helper'
import { contentfulToWhatsApp } from '../../src/markup'

test('TEST: MarkdownCMS whatsapp', async () => {
  const theCms = mock<CMS>()
  const txtBuilder = new RndTextBuilder().withText('txt1')
  txtBuilder.buttonsBuilder.withText('but txt').addButton()
  when(theCms.text(anyString(), anything())).thenResolve(txtBuilder.build())
  const sut = new MarkdownCMS(
    instance(theCms),
    new RecursiveMessageContentFilter(textUpdaterFilter(t => t + 'filtered'))
  )
  // act
  const filtered = await sut.text('id', { markup: 'whatsapp' })

  // assert
  expect(filtered.text).toEqual('txt1filtered')
  expect(filtered.buttons[0].text).toEqual('but txtfiltered')
})

test('TEST: MarkdownCMS no whatsapp', async () => {
  const theCms = mock<CMS>()
  when(theCms.text(anyString(), anything())).thenResolve(
    new RndTextBuilder().withText('txt1').build()
  )
  const sut = new MarkdownCMS(
    instance(theCms),
    new RecursiveMessageContentFilter(textUpdaterFilter(t => t + 'filtered'))
  )
  // act
  const filtered = await sut.text('id')

  // assert
  expect(filtered.text).toEqual('txt1')
})
