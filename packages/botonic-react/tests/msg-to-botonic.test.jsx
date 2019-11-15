import React from 'react'
import { BotonicDecorator, msgsToBotonic } from '../src/msg-to-botonic'
import { Text } from '../src/components/text'
import { Reply } from '../src/components/reply'
import { Button } from '../src/components/button'

describe('msgsToBotonic', () => {
  test('text with replies', () => {
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
      </Text>
    )
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
    const decorator = new BotonicDecorator()
    const swapChildren = txt => (
      <Text {...txt.props}>
        {txt.props.children[1]}
        {txt.props.children[0]}
      </Text>
    )
    decorator.addDecorator('text', swapChildren)

    const botNode = msgsToBotonic(msg, null, decorator)
    expect(botNode).toEqual(
      <Text {...msg}>
        {[
          <Button key='0' url='http://...' webview={null}>
            button text
          </Button>,
        ]}
        The verbose text
      </Text>
    )
  })
})
