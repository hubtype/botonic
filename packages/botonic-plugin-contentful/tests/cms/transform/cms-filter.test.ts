import { CMS, StartUp } from '../../../src/cms'
import {
  RecursiveMessageContentFilter,
  stringsFilter,
} from '../../../src/cms/transform/message-content-filters'
import { anyString, anything, instance, mock, when } from 'ts-mockito'
import { RndTextBuilder } from '../../../src/cms/test-helpers'
import { FilteredCMS } from '../../../src/cms/transform/cms-filter'

test('TEST: FilteredCMS filter', async () => {
  const theCms = mock<CMS>()
  const txtBuilder = new RndTextBuilder().withText('txt1')
  txtBuilder.buttonsBuilder.withText('but txt').addButton()
  when(theCms.text(anyString(), anything())).thenResolve(txtBuilder.build())
  const sut = new FilteredCMS(
    instance(theCms),
    new RecursiveMessageContentFilter(stringsFilter(t => t + 'filtered'))
  )
  // act
  const filtered = await sut.text('id')

  // assert
  expect(filtered.text).toEqual('txt1filtered')
  expect(filtered.buttons[0].text).toEqual('but txtfiltered')
})

test('TEST: FilteredCMS no filter', async () => {
  const theCms = mock<CMS>()
  const text = new RndTextBuilder().withText('txt1').build()
  when(theCms.text(anyString(), anything())).thenResolve(text)
  const sut = new FilteredCMS(
    instance(theCms),
    new RecursiveMessageContentFilter({
      startUp: (c: StartUp) => Promise.resolve(c.cloneWithText('cloned')),
    })
  )
  // act
  const filtered = await sut.text('id')

  // assert
  expect(filtered).toBe(text)
})
