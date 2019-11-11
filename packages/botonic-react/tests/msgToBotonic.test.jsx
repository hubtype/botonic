import React from 'react'
import {msgsToBotonic} from '../src/msg-to-botonic'
import {Text} from '../src/components/text'
import {Reply} from '../src/components/reply'


describe('msgsToBotonic', () => {
  test('', () => {
    const msg = {
      type: 'text',
      data: {
        text: 'The verbose text'
      },
      replies: [
        {
          payload: 'payload1',
          text: 'button text'
        },
      ]
    }
    expect(msgsToBotonic(msg)).toEqual(
      <Text {...msg}>
        The verbose text
        {
          [
            <Reply
              key="0"
              payload="payload1"
            >
              button text
            </Reply>
          ]
        }
      </Text>
    )
  })
})

