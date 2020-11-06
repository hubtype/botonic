import React from 'react'

import { Text } from '../../../src'
import {
  MultichannelButton,
  MultichannelText,
} from '../../../src/components/multichannel'
import { MultichannelReply } from '../../../src/components/multichannel/multichannel-reply'
import { whatsappRenderer } from '../../helpers/test-utils'

const LEGACY_CONTEXT = {
  indexSeparator: '.',
  messageSeparator: null,
}
const LEGACY_PROPS = {
  indexMode: 'number',
}

describe('Multichannel text', () => {
  test('just text', () => {
    const text = <Text>Some text</Text>
    const sut = (
      <MultichannelText {...LEGACY_PROPS}>
        {text.props.children}
      </MultichannelText>
    )
    const renderer = whatsappRenderer(sut, LEGACY_CONTEXT)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('with buttons plain', () => {
    const text = (
      <Text>
        The verbose text
        <MultichannelButton key='0' payload='payload1'>
          button text1
        </MultichannelButton>
        <MultichannelButton key='1' url='http://adrss'>
          button text2
        </MultichannelButton>
        <MultichannelButton key='2' path='path'>
          button text3
        </MultichannelButton>
      </Text>
    )
    const sut = (
      <MultichannelText {...LEGACY_PROPS}>
        {text.props.children}
      </MultichannelText>
    )
    const renderer = whatsappRenderer(sut, LEGACY_CONTEXT)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('with buttons as array', () => {
    const text = (
      <Text>
        The verbose text
        {[
          <MultichannelButton key={'0'} payload={'payload1'}>
            button text1
          </MultichannelButton>,
          <MultichannelButton key={'1'} url='http://adrss'>
            button text2
          </MultichannelButton>,
          <MultichannelButton key={'2'} path='path'>
            button text3
          </MultichannelButton>,
        ]}
      </Text>
    )

    const sut = (
      <MultichannelText {...LEGACY_PROPS}>
        {text.props.children}
      </MultichannelText>
    )
    const renderer = whatsappRenderer(sut, LEGACY_CONTEXT)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('with replies plain', () => {
    const text = (
      <Text>
        Quick replies
        <MultichannelReply key='0' payload='payload1'>
          reply text1
        </MultichannelReply>
        <MultichannelReply key='2' path='path'>
          reply text2
        </MultichannelReply>
      </Text>
    )
    const sut = (
      <MultichannelText {...LEGACY_PROPS}>
        {text.props.children}
      </MultichannelText>
    )
    const renderer = whatsappRenderer(sut, LEGACY_CONTEXT)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('with replies as array', () => {
    const text = (
      <Text>
        The verbose text
        {[
          <MultichannelReply key='0' payload='payload1'>
            reply text1
          </MultichannelReply>,
          <MultichannelReply key='2' path='path'>
            reply text2
          </MultichannelReply>,
        ]}
      </Text>
    )

    const sut = (
      <MultichannelText {...LEGACY_PROPS}>
        {text.props.children}
      </MultichannelText>
    )
    const renderer = whatsappRenderer(sut, LEGACY_CONTEXT)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
