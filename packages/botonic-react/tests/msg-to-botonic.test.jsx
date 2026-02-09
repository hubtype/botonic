import {
  Button,
  Carousel,
  Element,
  Pic,
  Reply,
  Subtitle,
  Text,
  Title,
} from '../src/components'
import { msgsToBotonic } from '../src/msg-to-botonic'

describe('msgsToBotonic carousel', () => {
  test('with pic, title & subtitle', () => {
    const msg = {
      type: 'carousel',
      elements: [
        {
          title: 'tit1',
          subtitle: 'sub1',
          pic: 'htp://pic',
          buttons: [
            {
              payload: 'payload1',
              title: 'button text',
            },
          ],
        },
      ],
    }
    expect(msgsToBotonic(msg)).toEqual(
      <Carousel {...msg}>
        {[
          <Element key='element-0'>
            <Pic src='htp://pic' />
            <Title>tit1</Title>
            <Subtitle>sub1</Subtitle>
            {[
              <Button key='button-0' payload='payload1'>
                button text
              </Button>,
            ]}
          </Element>,
        ]}
      </Carousel>
    )
  })
})

describe('msgsToBotonic text', () => {
  test('with replies', () => {
    const msg = {
      type: 'text',
      data: {
        text: 'The verbose text',
      },
      replies: [
        {
          payload: 'payload1',
          text: 'reply text',
        },
      ],
    }
    expect(msgsToBotonic(msg)).toEqual(
      <Text {...msg}>
        The verbose text
        {[
          <Reply key='reply-0' payload='payload1'>
            reply text
          </Reply>,
        ]}
      </Text>
    )
  })

  test('with buttons', () => {
    const msg = {
      type: 'text',
      data: {
        text: 'The verbose text',
      },
      buttons: [
        {
          payload: 'payload1',
          title: 'button text',
        },
      ],
    }

    expect(msgsToBotonic(msg)).toEqual(
      <Text {...msg}>
        The verbose text
        {[
          <Button key='button-0' payload='payload1'>
            button text
          </Button>,
        ]}
      </Text>
    )
  })

  test('without replies nor buttons', () => {
    // normal text
    let msg = { type: 'text', data: { text: 'texto' } }
    expect(msgsToBotonic(msg)).toEqual(<Text {...msg}>texto</Text>)

    // no text
    msg = { type: 'text', data: { text: '' }, replies: [] }
    expect(msgsToBotonic(msg)).toEqual(<Text {...msg}>{''}</Text>) // empty replies field

    msg = { type: 'text', data: { text: 'texto' }, replies: [] }
    expect(msgsToBotonic(msg)).toEqual(<Text {...msg}>texto</Text>)
  })

  test('no text', () => {
    let msg = { type: 'text', data: { text: '' } }
    expect(msgsToBotonic(msg)).toEqual(<Text {...msg}>{''}</Text>)

    msg = { type: 'text', data: 'no text field', replies: [] }
    expect(msgsToBotonic(msg)).toEqual(<Text {...msg}>no text field</Text>)
  })

  test('array', () => {
    const msg = { type: 'text', data: { text: '' } }
    expect(msgsToBotonic([msg])).toEqual(
      <>
        {[
          <Text key={'msg0'} {...msg}>
            {''}
          </Text>,
        ]}
      </>
    )
  })
})
