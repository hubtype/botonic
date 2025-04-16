import { render } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import { RequestContext } from '../../src/contexts'
import { _getThemeProperty } from '../../src/util/webchat'
import { useWebchat, WebchatContext } from '../../src/webchat/context'

// Assuming these are the providers your components need
// You may need to import and add other providers based on your component requirements
export function renderWithBotonicProviders(children) {
  const Wrapper = ({ children }) => {
    const requestContext = {
      getString: () => '',
      setLocale: () => undefined,
      session: {},
      params: {},
      input: {},
      defaultDelay: 0,
      defaultTyping: 0,
    }
    const webchatContext = useWebchat()
    const theme = webchatContext.webchatState.theme
    webchatContext.getThemeProperty = _getThemeProperty(theme)

    return (
      // We need to wrap the children with the RequestContext because Message need it
      <RequestContext.Provider value={requestContext}>
        <WebchatContext.Provider value={webchatContext}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </WebchatContext.Provider>
      </RequestContext.Provider>
    )
  }
  return render(<Wrapper>{children}</Wrapper>)
}
