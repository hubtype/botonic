import { expect, test } from '@jest/globals'
import React from 'react'
import TestRenderer from 'react-test-renderer'

import { WhatsappProduct } from '../../src/components'

const renderToJSON = sut => TestRenderer.create(sut).toJSON()

test('renders Whatsapp Product component', () => {
  const props = {
    body: 'Product sent from test',
    catalogId: 'fake-catalog-id',
    productId: 'fake-product-id',
    footer: 'Product footer',
  }

  const tree = renderToJSON(<WhatsappProduct {...props} />)
  expect(tree).toMatchSnapshot()
})
