import React from 'react'
import { msgsToBotonic } from '../src/msg-to-botonic'
import { Text } from '../src/components/text'
import { Reply } from '../src/components/reply'

import { Button } from '../src/components/button'

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
          text: 'button text',
        },
      ],
    }
    expect(msgsToBotonic(msg)).toEqual(
      <Text {...msg}>
        The verbose text
        {[
          <Reply key='0' payload='payload1'>
            button text
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
})
