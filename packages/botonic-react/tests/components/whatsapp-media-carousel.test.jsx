import { expect, test } from '@jest/globals'
import React from 'react'
import TestRenderer from 'react-test-renderer'

import { WhatsappMediaCarousel } from '../../src/components'

const renderToJSON = sut => TestRenderer.create(sut).toJSON()

const getProps = withIndexes => {
  return {
    templateName: 'fake-template-name',
    templateLanguage: 'en_US',
    cards: [
      {
        cardIndex: withIndexes ? 1 : undefined,
        fileType: 'image',
        fileId: 'fake-file-id-1',
        buttons: [
          {
            buttonIndex: withIndexes ? 1 : undefined,
            type: 'quick_reply',
            payload: 'payload-1',
          },
          {
            buttonIndex: withIndexes ? 0 : undefined,
            type: 'url',
            urlVariable: 'a',
          },
        ],
        bodyParameters: [{ type: 'text', text: 'classic' }],
        extraComponents: [{}],
      },
      {
        cardIndex: withIndexes ? 1 : undefined,
        fileType: 'image',
        fileId: 'fake-file-id-2',
        buttons: [
          {
            buttonIndex: withIndexes ? 1 : undefined,
            type: 'quick_reply',
            payload: 'payload-2',
          },
          {
            buttonIndex: withIndexes ? 0 : undefined,
            type: 'url',
            urlVariable: 'b',
          },
        ],
        bodyParameters: [{ type: 'text', text: 'premium' }],
        extraComponents: [{}],
      },
    ],
    bodyParameters: [
      {
        type: 'text',
        text: 'Pepito Grillo',
      },
      {
        type: 'text',
        text: 'Test',
      },
    ],
  }
}

test('renders Whatsapp Media Carousel component without indexes', () => {
  const props = getProps(false)
  const tree = renderToJSON(<WhatsappMediaCarousel {...props} />)
  expect(tree).toMatchSnapshot()
})

test('renders Whatsapp Media Carousel component with indexes', () => {
  const props = getProps(true)
  const tree = renderToJSON(<WhatsappMediaCarousel {...props} />)
  expect(tree).toMatchSnapshot()
})
