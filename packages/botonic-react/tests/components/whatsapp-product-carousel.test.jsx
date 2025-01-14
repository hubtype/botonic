import { expect, test } from '@jest/globals'
import React from 'react'
import TestRenderer from 'react-test-renderer'

import { WhatsappProductCarousel } from '../../src/components'

const renderToJSON = sut => TestRenderer.create(sut).toJSON()

const getProps = withIndexes => {
  return {
    templateName: 'fake-template-name',
    templateLanguage: 'en_US',
    cards: [
      {
        card_index: withIndexes ? 1 : undefined,
        catalog_id: 'fake-catalog-id',
        product_retailer_id: 'fake-product-id-2',
      },
      {
        card_index: withIndexes ? 0 : undefined,
        catalog_id: 'fake-catalog-id',
        product_retailer_id: 'fake-product-id-1',
      },
    ],
    bodyParameters: [
      {
        type: 'text',
        text: 'Pepito',
      },
      {
        type: 'text',
        text: 'Test',
      },
    ],
  }
}

test('renders Whatsapp Product Carousel component without card indexes', () => {
  const props = getProps(false)
  const tree = renderToJSON(<WhatsappProductCarousel {...props} />)
  expect(tree).toMatchSnapshot()
})

test('renders Whatsapp Product Carousel component with card indexes', () => {
  const props = getProps(true)
  const tree = renderToJSON(<WhatsappProductCarousel {...props} />)
  expect(tree).toMatchSnapshot()
})
