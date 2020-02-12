import {
  Text,
  Button,
  Reply,
  Carousel,
  Element,
  Pic,
  Title,
  Subtitle,
} from '../../../src'
import React from 'react'
import { whatsappRenderer } from '../../helpers/test-utils'
import { Multichannel } from '../../../src/components/multichannel/multichannel'

describe('Multichannel wrapper', () => {
  test('just text', () => {
    const sut = (
      <Multichannel>
        <Text>Some text</Text>
      </Multichannel>
    )

    const renderer = whatsappRenderer(sut)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })
  test('text with buttons', () => {
    const sut = (
      <Multichannel>
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
      <Multichannel>
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

  let carouselWithButtons = [
    {
      title: 'Title1',
      subtitle: 'Subtitle1',
      pic:
        'https://cdn.slidesharecdn.com/profile-photo-sumeet.moghe-48x48.jpg?cb=1527568614',
      buttons: [{ payload: 'Payload1', text: 'Previo a la compra' }],
    },
    {
      title: 'Title2',
      subtitle: 'Subtitle2',
      pic:
        'https://cdn.slidesharecdn.com/profile-photo-sumeet.moghe-48x48.jpg?cb=1527568614',
      buttons: [
        { payload: 'Payload2.1', text: 'Durante la compra' },
        { payload: 'Payload2.2', text: 'Durante la compra2' },
      ],
    },
    {
      title: 'Title3',
      subtitle: 'Subtitle3',
      pic:
        'https://cdn.slidesharecdn.com/profile-photo-sumeet.moghe-48x48.jpg?cb=1527568614',
      buttons: [{ payload: 'Payload3', text: 'Posterior a la compra' }],
    },
  ]
  test('text and carousel', () => {
    const sut = (
      <Multichannel>
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

  test('many multichannels', () => {
    const sut = (
      <>
        <Multichannel>
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
        <Multichannel>
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
