/* eslint-disable import/no-unresolved */
// eslint-disable-next-line node/no-missing-import
import BrowserOnly from '@docusaurus/BrowserOnly'
import React from 'react'

import BotonicExample from './botonic-example'

const NluAssistant = () => {
  return (
    <BrowserOnly>
      {() => (
        <BotonicExample
          title='Botonic NLU Assistant'
          rootId='botonic-nlu'
          src='https://example-botonic-nlu-02f1db7e-c398-4fa6-84de-a2387d1960c4.netlify.com/webchat.botonic.js'
          runtimeOptions={{
            appId: '500ec89c-63c1-4b29-89a4-2994d87002b0',
          }}
          markdownSrc={'example-nlu/README.md'}
        />
      )}
    </BrowserOnly>
  )
}

export default NluAssistant
