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
        card_index: withIndexes ? 1 : undefined,
        file_type: 'image',
        file_id: 'fake-file-id-1',
        buttons: [
          {
            button_index: withIndexes ? 1 : undefined,
            type: 'quick_reply',
            payload: 'payload-1',
          },
          {
            button_index: withIndexes ? 0 : undefined,
            type: 'url',
            url_variable: 'a',
          },
        ],
        body_parameters: [{ type: 'text', text: 'classic' }],
        extra_components: [{}],
      },
      {
        card_index: withIndexes ? 1 : undefined,
        file_type: 'image',
        file_id: 'fake-file-id-2',
        buttons: [
          {
            button_index: withIndexes ? 1 : undefined,
            type: 'quick_reply',
            payload: 'payload-2',
          },
          {
            button_index: withIndexes ? 0 : undefined,
            type: 'url',
            url_variable: 'b',
          },
        ],
        body_parameters: [{ type: 'text', text: 'premium' }],
        extra_components: [{}],
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
