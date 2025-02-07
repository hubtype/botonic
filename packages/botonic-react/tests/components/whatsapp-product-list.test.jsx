import { expect, test } from '@jest/globals'
import React from 'react'
import TestRenderer from 'react-test-renderer'

import { WhatsappProductList } from '../../src/components'

const renderToJSON = sut => TestRenderer.create(sut).toJSON()

test('renders Whatsapp Product List component', () => {
  const props = {
    body: 'Product list sent from test',
    catalogId: 'fake-catalog-id',
    header: 'Take a look to our products',
    footer: "Don't miss our products",
    sections: [
      {
        title: 'section one',
        productItems: [
          { productRetailerId: 'fake-product-id-1' },
          { productRetailerId: 'fake-product-id-2' },
        ],
      },
      {
        title: 'section two',
        productItems: [{ productRetailerId: 'fake-product-id-3' }],
      },
    ],
  }

  const tree = renderToJSON(<WhatsappProductList {...props} />)
  expect(tree).toMatchSnapshot()
})
