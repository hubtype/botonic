import { expect, test } from '@jest/globals'
import React from 'react'
import TestRenderer from 'react-test-renderer'

import { WhatsappButtonList } from '../../src/components/whatsapp-button-list'

const renderToJSON = sut => TestRenderer.create(sut).toJSON()

test('renders WhatsappButtonList component', () => {
  const props = {
    body: 'This is the body',
    button: 'Select option',
    sections: [
      {
        title: 'Section 1',
        rows: [
          {
            id: '1',
            title: 'Row 1',
            description: 'Description 1',
          },
          {
            id: '2',
            title: 'Row 2',
          },
        ],
      },
      {
        rows: [
          {
            id: '3',
            title: 'Row 3',
          },
          {
            id: '4',
            title: 'Row 4',
            description: 'Description 4',
          },
        ],
      },
    ],
  }

  const tree = renderToJSON(<WhatsappButtonList {...props} />)
  expect(tree).toMatchSnapshot()
})

test('renders WhatsappButtonList component with truncated contents', () => {
  const props = {
    body: 'This is the body',
    button: 'Button with more than 24 characters',
    sections: [
      {
        title: 'Section 1',
        rows: [
          {
            id: '1',
            title: 'Row 1',
            description: 'Description 1',
          },
          {
            id: '2',
            title: 'Row 2',
            description: 'Description 2',
          },
        ],
      },
      {
        title: 'Section 2 with more than 24 characters in title',
        rows: [
          {
            id: '3',
            title: 'Row 3 with more than 24 characters in title',
            description:
              'Description 3 with a very long text with more than 72 characters in description',
          },
          {
            id: '4',
            title: 'Row 4',
            description: 'Description 4',
          },
        ],
      },
    ],
  }

  const tree = renderToJSON(<WhatsappButtonList {...props} />)
  expect(tree).toMatchSnapshot()
})

test('renders WhatsappButtonList component but shows console.error due to long IDs', () => {
  console.error = jest.fn()

  const props = {
    body: 'This is the body',
    button: 'Button with more than 24 characters',
    sections: [
      {
        rows: [
          {
            id: '1',
            title: 'Row 1',
          },
          {
            id: 'ID larger than 200 characters to make the console error appear. ID larger than 200 characters to make the console error appear. ID larger than 200 characters to make the console error appear. ID larger than 200 characters to make the console error appear.',
            title: 'Row 2',
          },
        ],
      },
    ],
  }

  const tree = renderToJSON(<WhatsappButtonList {...props} />)
  expect(tree).toMatchSnapshot()
  expect(console.error).toHaveBeenCalled()
})
