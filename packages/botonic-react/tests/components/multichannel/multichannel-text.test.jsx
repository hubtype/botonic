import { Button, Text, Element, Pic, Subtitle, Title } from '../../../src'
import { MultichannelText } from '../../../src/components/multichannel'
import React from 'react'
import TestRenderer from 'react-test-renderer'
import { withContext, withProvider } from '../../helpers/react-traverser'

describe('multiChannel text', () => {

  test('with buttons', () => {
    const text = <Text style="style1">
      The verbose text
      {[
        <Button key='0' payload='payload1'>
          button text1
        </Button>,
        <Button key='1' url='http://url1'>
          button text2
        </Button>,
      ]}
    </Text>
    const sut = <MultichannelText {...text.props}>
      {text.props.children}
    </MultichannelText>
    const renderer = TestRenderer.create(withContext(sut, { session: { user: { provider: 'whatsappnew' } } }))
    const tree = renderer.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
