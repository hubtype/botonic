import { ButtonStyle } from '../../src/cms'
import {
  RndCarouselBuilder,
  RndDocumentBuilder,
  RndImageBuilder,
  RndTextBuilder,
} from '../../src/cms/test-helpers'
import { BotonicMsgConverter } from '../../src/render'

describe('TEST BotonicMsgConverter', () => {
  test('text', () => {
    const sut = new BotonicMsgConverter()
    const builder = new RndTextBuilder()
    builder.withButtonsBuilder().addButton().addButton()
    const text = builder.build()

    // act
    const msg = sut.convert(text, 42)

    // assert
    expect(msg).toEqual({
      type: 'text',
      delay: 42,
      data: { text: text.text },
      buttons: [
        {
          payload: text.buttons[0].callback.payload,
          url: undefined,
          title: text.buttons[0].text,
        },
        {
          payload: text.buttons[1].callback.payload,
          url: undefined,
          title: text.buttons[1].text,
        },
      ],
    })
  })

  test('text with empty texts', () => {
    const sut = new BotonicMsgConverter({ replaceEmptyStringsWith: 'x' })
    const builder = new RndTextBuilder()
    builder.buttonsBuilder.withText('').withName('').addButton()
    const text = builder.withText('').build()

    // act
    const msg = sut.convert(text, 42)

    // assert
    expect((msg as any)['data']['text']).toEqual('x')
    expect((msg as any)['buttons'][0]['title']).toEqual('x')
  })

  test('text with reply as default buttonsStyle', () => {
    const sut = new BotonicMsgConverter({
      defaultButtonsStyle: ButtonStyle.QUICK_REPLY,
    })
    const builder = new RndTextBuilder()
    builder.buttonsBuilder.withText('Test').addButton()
    const text = builder.build()

    // act
    const msg = sut.convert(text, 42)

    // assert
    expect((msg as any)['replies'].length).toEqual(1)
    expect((msg as any)['buttons']).toBeUndefined()
  })

  test('carousel with 1 element and 1 button', () => {
    const sut = new BotonicMsgConverter()
    const builder = new RndCarouselBuilder()
    builder.elementBuilder.withButtonsBuilder().addButton()
    const carousel = builder.addElement().build()

    // act
    const msg = sut.convert(carousel, 42)

    // assert
    const element = carousel.elements[0]
    const button = carousel.elements[0].buttons[0]
    expect(msg).toEqual({
      type: 'carousel',
      delay: 42,
      data: {
        elements: [
          {
            img: element.imgUrl,
            title: element.title,
            subtitle: element.subtitle,
            buttons: [
              {
                payload: button.callback.payload,
                url: undefined,
                title: button.text,
              },
            ],
          },
        ],
      },
    })
  })

  test('image', () => {
    const sut = new BotonicMsgConverter()
    const builder = new RndImageBuilder()
    const image = builder.withRandomFields().build()

    // act
    const msgs = sut.convert(image, 42) as any

    // assert
    const msg = assertHasFollowUp(msgs, builder.followUp != undefined)
    expect(msg['data']['image']).toEqual(builder.imgUrl)
  })

  test('document', () => {
    const sut = new BotonicMsgConverter()
    const builder = new RndDocumentBuilder()
    const image = builder.withRandomFields().build()

    // act
    const msgs = sut.convert(image, 42) as any

    // assert
    const msg = assertHasFollowUp(msgs, builder.followUp != undefined)
    expect(msg['data']['document']).toEqual(builder.docUrl)
  })

  function assertHasFollowUp(msgs: any, expectFollowUp: boolean): any {
    if (expectFollowUp) {
      expect(msgs).toBeArrayOfSize(2)
      return msgs[0]
    }
    expect(msgs).toBeObject()
    return msgs
  }
})
