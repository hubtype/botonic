import { expect, test } from '@jest/globals'
import React from 'react'
import TestRenderer from 'react-test-renderer'

import { WhatsappCTAUrlButton } from '../../src/components/whatsapp-cta-url-button'

const renderToJSON = sut => TestRenderer.create(sut).toJSON()

test('renders WhatsappCTAUrlButton component (passing a URL)', () => {
  const props = {
    header: 'This is the header',
    body: 'This is the body',
    footer: 'This is the footer',
    displayText: 'Go to Hubtype',
    url: 'https://www.hubtype.com',
  }

  const tree = renderToJSON(<WhatsappCTAUrlButton {...props} />)
  expect(tree).toMatchSnapshot()
})

test('renders WhatsappCTAUrlButton component (passing a Webview)', () => {
  class MyWebview {}
  const props = {
    header: 'This is the header',
    body: 'This is the body',
    footer: 'This is the footer',
    displayText: 'Go to webview',
    webview: MyWebview,
    params: {
      numbers: '123',
      redirectUri: 'www.some-site.com',
    },
  }

  const tree = renderToJSON(<WhatsappCTAUrlButton {...props} />)
  expect(tree).toMatchSnapshot()
})
