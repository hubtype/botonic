import * as cms from '../../../src/cms'
import {
  CommonFields,
  Context,
  RecursiveMessageContentFilter,
} from '../../../src/cms'
import {
  RndCarouselBuilder,
  RndStartUpBuilder,
  RndTextBuilder,
} from '../../../src/cms/test-helpers'
import { testContext } from '../../contentful/contentful.helper'

test('TEST MessageContentFilter filtering all types except one', async () => {
  let cloningOrder = 0
  const context = testContext()
  const filter = {
    text: (text: cms.Text, contextArg: Context) => {
      expect(contextArg).toEqual(context || {})
      return Promise.resolve(text.cloneWithText(text.text + ++cloningOrder))
    },
    carousel: (carousel: cms.Carousel) => {
      ++cloningOrder
      return Promise.resolve(carousel.cloneWithElements([]))
    },
    startUp: (startUp: cms.StartUp) => {
      return Promise.resolve(
        startUp.cloneWithText(startUp.text + ++cloningOrder)
      )
    },
  }
  const sut = new RecursiveMessageContentFilter(filter)

  // act
  const imageIn = new cms.Image(new CommonFields('Id', 'name'), 'http://img')
  const carouselIn = new RndCarouselBuilder()
    .withFollowUp(imageIn)
    .addElement()
    .build()
  const textIn = new RndTextBuilder().withFollowUp(carouselIn).build()
  const startUpIn = new RndStartUpBuilder().withFollowUp(textIn).build()

  const output = await sut.filterContent(startUpIn, context)

  // assert
  expect(output).toBeInstanceOf(cms.StartUp)
  const startUpOut = output as cms.StartUp
  expect(startUpOut.text).toEqual(startUpIn.text + '3')

  expect(startUpOut.common.followUp).toBeInstanceOf(cms.Text)
  const textOut = startUpOut.common.followUp as cms.StartUp
  expect(textOut.text).toEqual(textIn.text + '2')

  expect(textOut.common.followUp).toBeInstanceOf(cms.Carousel)
  const carouselOut = textOut.common.followUp as cms.Carousel
  expect(carouselOut.elements.length).toEqual(0)

  expect(carouselOut.common.followUp).toBe(imageIn)
})
