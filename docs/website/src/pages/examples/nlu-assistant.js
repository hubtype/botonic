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
          src='https://example-nlu-assistant-dcab1a9c-dbe8-4a85-8bc2-50687fc22b8b.netlify.com/webchat.botonic.js'
          runtimeOptions={{
            appId: '89ce1496-ba5a-432e-89c7-4b853a8c7e29',
          }}
          markdownSrc={'nlu-assistant/README.md'}
        />
      )}
    </BrowserOnly>
  )
}

export default NluAssistant
