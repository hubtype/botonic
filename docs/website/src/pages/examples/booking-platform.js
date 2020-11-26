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
          src='https://hotel-reservation-7e73471a-80ee-40ec-a7e1-955d69cd94a4.netlify.com/webchat.botonic.js'
          runtimeOptions={{
            appId: 'fa9c6b42-5984-4b46-8bbb-954796641b9e',
          }}
          markdownSrc={'example-hotel-reservation/README.md'}
        />
      )}
    </BrowserOnly>
  )
}

export default BookingPlatform
