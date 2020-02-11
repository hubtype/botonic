import { Text } from '../../../src'
import {
  MultichannelText,
  MultichannelButton,
} from '../../../src/components/multichannel'
import React from 'react'
import { whatsappRenderer } from '../../helpers/test-utils'
import { Multichannel } from '../../../src/components/multichannel/multichannel'

describe('Multichannel text', () => {
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
})
