import {
  Button,
  Carousel,
  Element,
  Pic,
  Reply,
  Subtitle,
  Text,
  Title,
} from '../../../src/components'
import { Multichannel } from '../../../src/components/multichannel/multichannel'
import { whatsappRenderer } from '../../helpers/test-utils'

const LEGACY_PROPS = {
  text: {
    indexMode: 'number',
  },
  indexSeparator: '.',
  messageSeparator: null,
}

describe('Multichannel wrapper', () => {
  test('just text', () => {
    const sut = (
      <Multichannel {...LEGACY_PROPS}>
        <Text>Some text</Text>
      </Multichannel>
    )

    const renderer = whatsappRenderer(sut)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })
  test('text with buttons', () => {
    const sut = (
      <Multichannel {...LEGACY_PROPS}>
        <Text>
          Some with buttons
          {[
            <Button key={'1'} payload='payload1'>
              Button 1
            </Button>,
            <Button key={'2'} path='path1'>
              Button 2
            </Button>,
            <Button key={'3'} url='http://testurl.com'>
              Visit website
            </Button>,
          ]}
        </Text>
      </Multichannel>
    )

    const renderer = whatsappRenderer(sut)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('text with replies', () => {
    const sut = (
      <Multichannel {...LEGACY_PROPS}>
        <Text>
          Some text with replies
          {[
            <Reply key={'1'} payload='payload1'>
              Reply 1
            </Reply>,
            <Reply key={'2'} path='path1'>
              Reply 2
            </Reply>,
          ]}
        </Text>
      </Multichannel>
    )

    const renderer = whatsappRenderer(sut)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  const carouselWithButtons = [
    {
      title: 'Title1',
      subtitle: 'Subtitle1',
      pic: 'https://cdn.slidesharecdn.com/profile-photo-sumeet.moghe-48x48.jpg?cb=1527568614',
      buttons: [{ payload: 'Payload1', text: 'Previo a la compra' }],
    },
    {
      title: 'Title2',
      subtitle: 'Subtitle2',
      pic: 'https://cdn.slidesharecdn.com/profile-photo-sumeet.moghe-48x48.jpg?cb=1527568614',
      buttons: [
        { payload: 'Payload2.1', text: 'Durante la compra' },
        { payload: 'Payload2.2', text: 'Durante la compra2' },
      ],
    },
    {
      title: 'Title3',
      subtitle: 'Subtitle3',
      pic: 'https://cdn.slidesharecdn.com/profile-photo-sumeet.moghe-48x48.jpg?cb=1527568614',
      buttons: [{ payload: 'Payload3', text: 'Posterior a la compra' }],
    },
  ]
  test('text and carousel legacy', () => {
    const sut = (
      <Multichannel {...LEGACY_PROPS}>
        <Text>This is a multichannel Carousel</Text>

        <Carousel>
          {carouselWithButtons.map((e, i) => (
            <Element key={i}>
              <Pic src={e.pic} />
              <Title>{e.title}</Title>
              <Subtitle>{e.subtitle}</Subtitle>
              {e.buttons.map((e, i) => (
                <Button key={`${e.text}${i}`} payload={e.payload}>
                  {e.text}
                </Button>
              ))}
            </Element>
          ))}
        </Carousel>
      </Multichannel>
    )

    const renderer = whatsappRenderer(sut)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('text and carousel only show button text, 1 single message', () => {
    const sut = (
      <Multichannel indexSeparator={'.'} messageSeparator={'\n'}>
        <Text>This is a multichannel Carousel</Text>

        <Carousel>
          <Element key={0}>
            <Subtitle>Subtitle will not appear</Subtitle>
            {[
              <Button key={1} payload='Payload1'>
                {'Previo'}
              </Button>,
            ]}
          </Element>
          <Element key={1}>
            {[
              <Button key={2} payload='Payload2'>
                {'Durante'}
              </Button>,
            ]}
          </Element>
        </Carousel>
      </Multichannel>
    )

    const renderer = whatsappRenderer(sut)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('2 text in 1 single message', () => {
    const sut = (
      <Multichannel messageSeparator={'\n'}>
        <Text>Text1</Text>
        <Text>Text2</Text>
      </Multichannel>
    )

    const renderer = whatsappRenderer(sut)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('1 text in 1 single message', () => {
    const sut = (
      <Multichannel messageSeparator={'\n'}>
        <Text>Text1</Text>
      </Multichannel>
    )

    const renderer = whatsappRenderer(sut)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('2 texts with buttons', () => {
    const sut = (
      <Multichannel messageSeparator={'\n'}>
        <Text>
          Text1
          <Button key={'1'} payload='payload1'>
            Button 1
          </Button>
        </Text>
        <Text>
          Text2
          <Button key={'2'} payload='payload2'>
            Button 2
          </Button>
        </Text>
      </Multichannel>
    )

    const renderer = whatsappRenderer(sut)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('many multichannels', () => {
    const sut = (
      <>
        <Multichannel {...LEGACY_PROPS}>
          <Text>
            Some text with replies
            {[
              <Reply key={'1'} payload='payload1'>
                Reply 1
              </Reply>,
              <Reply key={'2'} path='path1'>
                Reply 2
              </Reply>,
            ]}
          </Text>
          <Text>
            Some text with replies
            {[
              <Reply key={'1'} payload='payload1'>
                Reply 1 should have 3.
              </Reply>,
              <Reply key={'2'} path='path1'>
                Reply 2 should have 4.
              </Reply>,
            ]}
          </Text>
        </Multichannel>
        <Multichannel {...LEGACY_PROPS}>
          <Text>
            Some text with replies
            {[
              <Reply key={'1'} payload='payload1'>
                Reply 1 number reset
              </Reply>,
              <Reply key={'2'} path='path1'>
                Reply 2 number reset
              </Reply>,
            ]}
          </Text>
        </Multichannel>
      </>
    )

    const renderer = whatsappRenderer(sut)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
