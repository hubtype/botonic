/* eslint-disable import/no-unresolved */
// eslint-disable-next-line node/no-missing-import
import BrowserOnly from '@docusaurus/BrowserOnly'
import React from 'react'

import BotonicExample from './botonic-example'

const TelcoOffers = () => {
  return (
    <BrowserOnly>
      {() => (
        <BotonicExample
          title='Botonic Telco Offers'
          rootId='botonic-telco-offers'
          src='https://example-telco-offers-b3666954-41a5-430c-909f-3970ea9bdba5.netlify.com/webchat.botonic.js'
          runtimeOptions={{
            appId: '258b9edb-b632-41cc-a05d-f509eaa7202f',
          }}
          markdownSrc={'telco-offers/README.md'}
        />
      )}
    </BrowserOnly>
  )
}

export default TelcoOffers
