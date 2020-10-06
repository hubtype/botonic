import { BotonicMsgConverter } from '../../src/render'
import { RndTextBuilder } from '../../src/cms/test-helpers'

describe('TEST BotonicMsgConverter', () => {
  test('text', () => {
    const sut = new BotonicMsgConverter()
    const builder = new RndTextBuilder()
    builder.withButtonsBuilder().addButton().addButton()
    const text = builder.build()

    // act
    const msg = sut.text(text, 42)

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
    const msg = sut.text(text, 42)

    // assert
    expect((msg as any)['data']['text']).toEqual('x')
    expect((msg as any)['buttons'][0]['title']).toEqual('x')
  })
})
