import React from 'react'
import { msgsToBotonic } from '../src/msg-to-botonic'
import { Text, Carousel, Reply, Button, Element, Pic, Subtitle, Title } from '../src'

describe('msgsToBotonic carousel', () => {

  test('with pic, title & subtitle', () => {
    const msg = {
      type: 'carousel',
      elements: [{
        title: 'tit1',
        subtitle: 'sub1',
        pic: 'htp://pic',
        buttons: [
          {
            payload: 'payload1',
            title: 'button text',
          },
        ],
      }],
    }
    expect(msgsToBotonic(msg)).toEqual(
      <Carousel {...msg}>
          {[
            <Element key={0}>
              <Pic src="htp://pic"/>
              <Title>tit1</Title>
              <Subtitle>sub1</Subtitle>
              {[
                <Button key='0' payload='payload1'>
                  button text
                </Button>,
              ]}
            </Element>,
          ]}
      </Carousel>,
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
          <Reply key='0' payload='payload1'>
            reply text
          </Reply>,
        ]}
      </Text>,
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
          <Button key='0' payload='payload1'>
            button text
          </Button>,
        ]}
      </Text>,
    )
  })

  test('without replies nor buttons', () => {
    // normal text
    let msg = { type: 'text', data: { text: 'texto' } }
    expect(msgsToBotonic(msg)).toEqual(<Text {...msg}>texto</Text>)

    // no text
    msg = { type: 'text', data: { text: '' }, replies: [] }
    expect(msgsToBotonic(msg)).toEqual(<Text {...msg}>{''}</Text>)// empty replies field

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
    let msg = { type: 'text', data: { text: '' } }
    expect(msgsToBotonic([msg])).toEqual(<>{[<Text key={'msg0'} {...msg}>{''}</Text>]}</>)
  })

  test('text with button with decorator', () => {
    let msg = {
      prop1: 'val1',
      type: 'text',
      data: {
        text: 'The verbose text',
      },
      buttons: [
        {
          url: 'http://...',
          title: 'button text',
        },
      ],
    }
    const swapChildren = (txt, key) => (
      <Text {...txt.props} key={key}>
        {txt.props.children[1]}
        {txt.props.children[0]}
      </Text>
    )
    decorator.addDecorator('text', swapChildren)

    const botNode = msgsToBotonic([msg], null, decorator)
    expect(botNode).toEqual(
      <>
        {[
          <Text key={'msg0'} {...msg}>
            {[
              <Button key='0' url='http://...'>
                button text
              </Button>,
            ]}
            The verbose text
          </Text>,
        ]}
      </>,
    )
  })
})
