import {
  Audio,
  Button,
  Carousel,
  Document,
  Element,
  Image,
  Pic,
  Reply,
  Subtitle,
  Text,
  Title,
  Video,
} from '../src/components'
import { msgsToBotonic } from '../src/msg-to-botonic'

const MEDIA_URL = 'https://example.com/file'

describe('msgsToBotonic media captions', () => {
  test.each([
    ['image', Image],
    ['video', Video],
    ['audio', Audio],
    ['document', Document],
  ])('maps %s with sibling caption from Pusher payload', (type, Component) => {
    const msg = {
      type,
      data: MEDIA_URL,
      caption: 'Caption from agent',
    }
    const element = msgsToBotonic(msg)
    expect(element).toEqual(
      <Component {...msg} src={MEDIA_URL} caption='Caption from agent' />
    )
  })

  test('image without caption', () => {
    const msg = { type: 'image', data: MEDIA_URL }
    expect(msgsToBotonic(msg)).toEqual(
      <Image {...msg} src={MEDIA_URL} caption={undefined} />
    )
  })

  test('rehydrated image keeps caption from serialized data', () => {
    const msg = {
      type: 'image',
      data: { image: MEDIA_URL, caption: 'Stored caption' },
    }
    expect(msgsToBotonic(msg)).toEqual(
      <Image {...msg} src={MEDIA_URL} caption='Stored caption' />
    )
  })
})

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
