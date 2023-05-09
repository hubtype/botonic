/* eslint-disable import/no-unresolved */
// eslint-disable-next-line node/no-missing-import
import BrowserOnly from '@docusaurus/BrowserOnly'
import React from 'react'

import BotonicExample from './botonic-example'

const BookingPlatform = () => {
  return (
    <BrowserOnly>
      {() => (
        <BotonicExample
          title='Botonic Booking Platform'
          rootId='botonic-booking-platform'
          src='https://example-booking-platform-5e3802b9-c5c8-4905-8035-a1839a751fe0.netlify.com/webchat.botonic.js'
          runtimeOptions={{
            appId: 'bdd53814-cfe1-4e94-8fbb-c408c1296416',
          }}
          markdownSrc={'booking-platform/README.md'}
        />
      )}
    </BrowserOnly>
  )
}

export default BookingPlatform
