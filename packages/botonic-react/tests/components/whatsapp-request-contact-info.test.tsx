import { expect, test } from '@jest/globals'
import TestRenderer from 'react-test-renderer'

import { WhatsappRequestContactInfo } from '../../src/components/whatsapp-request-contact-info'

const renderToJSON = (sut: JSX.Element) => TestRenderer.create(sut).toJSON()

test('renders WhatsappRequestContactInfo component', () => {
  const tree = renderToJSON(
    <WhatsappRequestContactInfo body='Please share your phone number' />
  )
  expect(tree).toMatchSnapshot()
})

test('throws when body is empty', () => {
  expect(() => renderToJSON(<WhatsappRequestContactInfo body='' />)).toThrow(
    'WhatsappRequestContactInfo: body is required'
  )
})

test('throws when body exceeds 1024 characters', () => {
  expect(() =>
    renderToJSON(<WhatsappRequestContactInfo body={'a'.repeat(1025)} />)
  ).toThrow(
    'WhatsappRequestContactInfo: body exceeds maximum length of 1024 characters'
  )
})
