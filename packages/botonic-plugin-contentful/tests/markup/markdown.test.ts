// import * as cms from '../../src/cms'
import { findContentfulBold } from '../../src/markup'
// import { RndTextBuilder } from '../../src/cms/test-helpers'

test('TEST findContentfulBold(', () => {
  expect(findContentfulBold('kk')).toEqual([])
  expect(findContentfulBold('a __kkk__ 3')).toEqual(['kkk'])
  expect(findContentfulBold('a *qqq* 3')).toEqual(['qqq'])
})

// test('TEST: MarkdownConverter text', async () => {
//   const builder = new RndTextBuilder('name', 'hola __hi__')
//   builder.buttonsBuilder
//     .withText('__button__ rest')
//     .addButton()
//     .withText('11 22')
//     .addButton()
//   const sut = new MarkdownConverter()
//
//   const converted = (await sut.convert(builder.build())) as cms.Text
//   expect(converted.text).toEqual('hola *hi*')
//   expect(converted.buttons[0].text).toEqual('*button* rest')
//   expect(converted.buttons[1].text).toEqual('*11 22*')
// })
//
// test('TEST: MarkdownConverter carousel', async () => {
//   const element = new cms.Element(
//     'id',
//     new RndButtonsBuilder().withText('Hello guys').addButton().build(),
//     '',
//     ''
//   )
//   const carousel = new cms.Carousel(new CommonFields('id', name), [element])
//   const sut = new MarkdownConverter()
//
//   const converted = (await sut.convert(carousel)) as cms.Carousel
//   expect(converted.elements[0].buttons[0].text).toEqual('*Hello* guys')
// })
