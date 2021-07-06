import React from 'react'

import { Button } from '../../../src'
import { MultichannelButton } from '../../../src/components/multichannel'
import { whatsappRenderer } from '../../helpers/test-utils'

describe('Multichannel buttons:', () => {
  const Buttons = {}
  Buttons.withPayload = (
    <Button payload='payload1'>button text with payload1</Button>
  )
  Buttons.withPath = <Button path='path1'>button text with path1</Button>
  Buttons.withUrl = (
    <Button url='https://docs.botonic.io/'>button text with URL</Button>
  )
  Buttons.withWebview = (
    <Button webview='webview'>button text with Webview</Button>
  )
  test('with payload', () => {
    const sut = (
      <MultichannelButton {...Buttons.withPayload.props}>
        {Buttons.withPayload.props.children}
      </MultichannelButton>
    )

    const rendered = whatsappRenderer(sut, { indexSeparator: '-' }).toJSON()
    expect(rendered).toMatchSnapshot()
  })

  test('with path', () => {
    const sut = (
      <MultichannelButton {...Buttons.withPath.props}>
        {Buttons.withPath.props.children}
      </MultichannelButton>
    )

    const rendered = whatsappRenderer(sut, { indexSeparator: '.-' }).toJSON()
    expect(rendered).toMatchSnapshot()
  })

  test('with URL', () => {
    const sut = (
      <MultichannelButton {...Buttons.withUrl.props}>
        {Buttons.withUrl.props.children}
      </MultichannelButton>
    )
    const rendered = whatsappRenderer(sut).toJSON()
    expect(rendered).toMatchSnapshot()
  })

  test('with webview', () => {
    const sut = (
      <MultichannelButton {...Buttons.withWebview.props}>
        {Buttons.withWebview.props.children}
      </MultichannelButton>
    )
    const rendered = whatsappRenderer(sut).toJSON()
    expect(rendered).toMatchSnapshot()
  })

  test('truncate text if more than 20 chars in whatsapp buttons', () => {
    const sut = (
      <MultichannelButton asText={false} {...Buttons.withPayload.props}>
        {Buttons.withPayload.props.children}
      </MultichannelButton>
    )
    const rendered = whatsappRenderer(sut).toJSON()
    expect(rendered).toMatchSnapshot()
  })
})
