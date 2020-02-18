import { Text } from '../../../src'
import {
  MultichannelText,
  MultichannelButton,
} from '../../../src/components/multichannel'
import React from 'react'
import { whatsappRenderer } from '../../helpers/test-utils'
import { MultichannelReply } from '../../../src/components/multichannel/multichannel-reply'

describe('Multichannel text', () => {
  test('just text', () => {
    const text = <Text>Some text</Text>
    const sut = (
      <MultichannelText {...text.props}>{text.props.children}</MultichannelText>
    )
    const renderer = whatsappRenderer(sut)
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
      <MultichannelText {...text.props}>{text.props.children}</MultichannelText>
    )
    const renderer = whatsappRenderer(sut)
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
      <MultichannelText {...text.props}>{text.props.children}</MultichannelText>
    )
    const renderer = whatsappRenderer(sut)
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
      <MultichannelText {...text.props}>{text.props.children}</MultichannelText>
    )
    const renderer = whatsappRenderer(sut)
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
      <MultichannelText {...text.props}>{text.props.children}</MultichannelText>
    )
    const renderer = whatsappRenderer(sut)
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
