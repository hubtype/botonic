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
        cardIndex: withIndexes ? 1 : undefined,
        catalogId: 'fake-catalog-id',
        productRetailerId: 'fake-product-id-2',
      },
      {
        cardIndex: withIndexes ? 0 : undefined,
        catalogId: 'fake-catalog-id',
        productRetailerId: 'fake-product-id-1',
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
