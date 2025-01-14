import { expect, test } from '@jest/globals'
import React from 'react'
import TestRenderer from 'react-test-renderer'

import { WhatsappCatalog } from '../../src/components'

const renderToJSON = sut => TestRenderer.create(sut).toJSON()

test('renders Whatsapp Catalog component', () => {
  const props = {
    body: 'Catalog sent from test',
    thumbnailProductId: 'fake-id',
    footer: 'Catalog footer',
  }

  const tree = renderToJSON(<WhatsappCatalog {...props} />)
  expect(tree).toMatchSnapshot()
})
