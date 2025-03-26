/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://jestjs.io/"}
 */

import React from 'react'
import TestRenderer from 'react-test-renderer'

import {
  Button,
  Carousel,
  Element,
  Pic,
  Subtitle,
  Text,
  Title,
} from '../../src/components'
import { ButtonsDisabler } from '../../src/components/buttons-disabler'
import { msgToBotonic } from '../../src/msg-to-botonic'

const renderToJSON = sut => TestRenderer.create(sut).toJSON()

describe('TEST: ButtonsDisabler (Disabling buttons in Webchat)', () => {
  it('Appends the disabling props to a component', () => {
    const componentProps = (
      <Button payload='some-payload' autodisable={false}>
        Button Text
      </Button>
    ).props
    const sut = {
      ...componentProps,
      ...ButtonsDisabler.withDisabledProps(componentProps),
    }

    expect(sut).toEqual({
      payload: 'some-payload',
      autodisable: false,
      children: 'Button Text',
      disabled: undefined,
      disabledstyle: undefined,
    })
  })

  it('Passes a message with expected props to node (text with buttons)', () => {
    const sut = COMPONENTS.TEXT_WITH_BUTTONS
    const tree = renderToJSON(sut)

    expect(tree).toMatchSnapshot()
  })

  it('Passes a message with expected props to node (carousel)', () => {
    const sut = COMPONENTS.CAROUSEL
    const tree = renderToJSON(sut)

    expect(tree).toMatchSnapshot()
  })

  it('Fills the props correctly in browser', () => {
    const props = { autodisable: false }
    const sut = ButtonsDisabler.constructBrowserProps(props)

    expect(sut).toEqual({ disabled: undefined, autodisable: false })
  })

  it('Fills the props correctly in node', () => {
    const props = { autodisable: false }
    const sut = ButtonsDisabler.constructNodeProps(props)

    expect(sut).toEqual({ autodisable: 'false' })
  })

  it('Resolves disabling properties correctly', () => {
    const props = (
      <Button payload='some-payload' autodisable={false}>
        Button Text
      </Button>
    ).props
    const sut = ButtonsDisabler.resolveDisabling(WEBCHAT.theme, props)

    expect(sut.autoDisable).toEqual(false)
    expect(sut.disabledStyle).toEqual({
      opacity: 0.5,
      cursor: 'auto',
      pointerEvents: 'none',
      backgroundColor: 'green',
    })
  })

  it('Updates children with buttons disabling properties', () => {
    const initialChildren = COMPONENTS.TEXT_WITH_BUTTONS.props.children
    const sut = ButtonsDisabler.updateChildrenButtons(initialChildren, {
      parentId: '1234',
      disabled: true,
      setDisabled: () => {},
    })
      .filter(e => e.type === Button)
      .map(e => e.props)

    expect(sut[0].autodisable).toEqual(false)
    expect(sut[0].disabledstyle).toEqual(undefined)
    expect(sut[0].disabled).toEqual(true)
    expect(sut[1].autodisable).toEqual(true)
    expect(sut[1].disabledstyle).toEqual({ backgroundColor: 'red' })
    expect(sut[1].disabled).toEqual(true)
  })

  it('Converts correctly a buttonmessage event', () => {
    const buttonMessage = {
      type: 'buttonmessage',
      text: 'Here I display two types of buttons, the first one is a URL button and the second is a payload button:',
      buttons: [
        {
          type: 'postback',
          title: 'Visit botonic.io',
          payload: 'https://botonic.io',
          autodisable: 'false',
        },
        {
          type: 'postback',
          title: 'Show me a carousel',
          payload: 'carousel',
        },
      ],
      payload: {},
      id: '16972707e231427fbeeb707ab79b0b19',
    }
    const sut = msgToBotonic(buttonMessage)
    const buttons = sut.props.children.props.children[1]
    const button1Props = buttons[0].props
    const button2Props = buttons[1].props

    expect(button1Props.autodisable).toEqual(false)
    expect(button2Props.autodisable).toEqual(undefined)
  })

  it('Converts correctly a carousel event', () => {
    const carouselMessage = {
      type: 'carousel',
      elements: [
        {
          title: 'ELEMENT1',
          buttons: [
            {
              type: 'postback',
              title: 'Visit website',
              payload: 'URL1',
            },
          ],
          image_url: 'PIC1',
          subtitle: 'DESC1',
        },
        {
          title: 'ELEMENT2',
          buttons: [
            {
              type: 'postback',
              title: 'KAKA',
              payload: 'URL2',
              autodisable: 'true',
              disabledstyle: {
                backgroundColor: 'red',
              },
            },
          ],
          image_url: 'PIC2',
          subtitle: 'DESC2',
        },
      ],
      payload: {},
      id: 'cca3f3a852f6412885ecd9149a89deee',
    }
    const sut = msgToBotonic(carouselMessage)
    const elements = sut.props.children
    const element1ButtonProps = elements[0].props.children[3][0].props
    const element2ButtonProps = elements[1].props.children[3][0].props

    expect(Object.keys(element1ButtonProps)).toEqual([
      'payload',
      'url',
      'target',
      'webview',
      'disabled',
      'children',
    ])
    expect(Object.keys(element2ButtonProps)).toEqual([
      'payload',
      'url',
      'target',
      'webview',
      'disabled',
      'autodisable',
      'disabledstyle',
      'children',
    ])
    expect(element2ButtonProps.disabled).toEqual(undefined)
    expect(element2ButtonProps.autodisable).toEqual(true)
    expect(element2ButtonProps.disabledstyle).toEqual({
      backgroundColor: 'red',
    })
  })
})

const WEBCHAT = {
  theme: {
    style: {
      width: 500,
    },
    button: {
      disabledstyle: {
        opacity: 0.5,
        cursor: 'auto',
        pointerEvents: 'none',
        backgroundColor: 'green',
      },
      autodisable: true,
    },
  },
}

const COMPONENTS = {
  TEXT_WITH_BUTTONS: (
    <Text>
      Here I display two types of buttons, the first one is a URL button and the
      second is a payload button:
      <Button payload='https://botonic.io' autodisable={false}>
        Visit botonic.io
      </Button>
      <Button
        payload='carousel'
        autodisable={true}
        disabledstyle={{ backgroundColor: 'red' }}
      >
        Show me a carousel
      </Button>
    </Text>
  ),
  CAROUSEL: (
    <Carousel>
      {[
        {
          name: 'ELEMENT1',
          desc: 'DESC1',
          url: 'URL1',
          pic: 'PIC1',
          props: {
            payload: 'payload1',
            children: 'text1',
          },
        },
        {
          name: 'ELEMENT2',
          desc: 'DESC2',
          url: 'URL2',
          pic: 'PIC2',
          props: {
            payload: 'payload2',
            autodisable: true,
            disabledstyle: { backgroundColor: 'red' },
            children: 'text2',
          },
        },
      ].map((e, i) => (
        <Element key={e.name}>
          <Pic src={e.pic} />
          <Title>{e.name}</Title>
          <Subtitle>{e.desc}</Subtitle>
          <Button {...e.props} />
        </Element>
      ))}
    </Carousel>
  ),
}
