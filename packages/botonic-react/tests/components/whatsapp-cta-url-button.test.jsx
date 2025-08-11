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

test('renders WhatsappCTAUrlButton component (passing a URL) with image header', () => {
  const props = {
    headerType: 'image',
    header:
      'https://www.hubtype.com/media/flow_builder/media_files/d712e320-27cc-4af5-83dc-82e01b7b3767/01971b5a-a6d5-7b82-b02c-cda1af13d240/dragon_ball_walpaper.jpg',
    body: 'This is the body',
    footer: 'This is the footer',
    displayText: 'Go to Hubtype',
    url: 'https://www.hubtype.com',
  }

  const tree = renderToJSON(<WhatsappCTAUrlButton {...props} />)
  expect(tree).toMatchSnapshot()
})

test('renders WhatsappCTAUrlButton component (passing a URL) with video header', () => {
  const props = {
    headerType: 'video',
    header:
      'https://www.hubtype.com/media/flow_builder/media_files/d712e320-27cc-4af5-83dc-82e01b7b3767/01971b5a-a6d5-7b82-b02c-cda1af13d240/video_test.mp4',
    body: 'This is the body',
    footer: 'This is the footer',
    displayText: 'Go to Hubtype',
    url: 'https://www.hubtype.com',
  }

  const tree = renderToJSON(<WhatsappCTAUrlButton {...props} />)
  expect(tree).toMatchSnapshot()
})

test('renders WhatsappCTAUrlButton component (passing a URL) with document header', () => {
  const props = {
    headerType: 'document',
    header:
      'https://www.hubtype.com/media/flow_builder/media_files/d712e320-27cc-4af5-83dc-82e01b7b3767/01971b5a-a6d5-7b82-b02c-cda1af13d240/requisitos_cta_url_whatsapp.pdf',
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
    headerType: 'text',
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

test('renders WhatsappCTAUrlButton component (passing a Webview) with image header', () => {
  class MyWebview {}
  const props = {
    headerType: 'image',
    header:
      'https://www.hubtype.com/media/flow_builder/media_files/d712e320-27cc-4af5-83dc-82e01b7b3767/01971b5a-a6d5-7b82-b02c-cda1af13d240/dragon_ball_walpaper.jpg',
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
