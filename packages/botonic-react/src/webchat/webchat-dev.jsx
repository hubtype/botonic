import { PROVIDER } from '@botonic/core'
import merge from 'lodash.merge'
import React, { forwardRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

import { useWebchat } from './context/use-webchat'
import { SessionView } from './session-view'
import { Webchat } from './webchat'

export const DebugTab = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: ${props => (props.show ? '350px' : '32px')};
  height: ${props => (props.show ? '100%' : '42px')};
`

// We want the debug tab to be rendered in the <body> even if the
// webchat is being rendered in a shadowDOM, that's why we need a portal
export const DebugTabPortal = ({ webchatHooks, ...props }) =>
  createPortal(
    <DebugTab {...props}>
      <SessionView webchatHooks={webchatHooks} />
    </DebugTab>,
    document.body
  )

const initialSession = {
  is_first_interaction: true,
  last_session: {},
  user: {
    id: '000001',
    username: 'johndoe',
    name: 'John Doe',
    provider: PROVIDER.DEV,
    provider_id: '0000000',
    extra_data: {},
  },
  organization: '',
  bot: {
    id: '0000000',
    name: 'botName',
  },
}

// eslint-disable-next-line react/display-name
export const WebchatDev = forwardRef((props, ref) => {
  const webchatHooks = useWebchat()
  const { webchatState, updateTheme } = webchatHooks

  /* TODO: webchatState.theme should be included in the dependencies array
  together with props.theme. The problem is that this effect modifies webchatState
  so we enter an infinite rerender loop. */
  useEffect(() => {
    updateTheme(merge(webchatState.theme, props.theme))
  }, [props.theme])

  return (
    <>
      <Webchat
        style={{ flex: 1, position: 'relative' }}
        {...props}
        ref={ref}
        webchatHooks={webchatHooks}
        initialSession={initialSession}
        initialDevSettings={{
          keepSessionOnReload: webchatState.devSettings.keepSessionOnReload,
          showSessionView: webchatState.devSettings.showSessionView,
        }}
      />
      <DebugTabPortal
        show={webchatState.devSettings.showSessionView}
        webchatHooks={webchatHooks}
      />
    </>
  )
})
