import React, { forwardRef, useEffect } from 'react'
import { useWebchat } from './hooks'
import { Webchat } from './webchat'
import { SessionView } from './sessionView'

export const WebchatDev = forwardRef((props, ref) => {
  const webchatHooks = useWebchat()
  const { webchatState, updateTheme } = webchatHooks

  /* TODO: webchatState.theme shoud be included in the dependencies array
  together with props.theme. The problem is that this effect modifies webchatState
  so we enter an infinite rerender loop. */
  useEffect(
    () =>
      updateTheme({
        ...webchatState.theme,
        ...props.theme
      }),
    [props.theme]
  )

  return (
    <div>
      <Webchat
        style={{ flex: 1, position: 'relative' }}
        {...props}
        ref={ref}
        webchatHooks={webchatHooks}
        initialSession={{
          is_first_interaction: true,
          last_session: {},
          user: {
            id: '000001',
            username: 'johndoe',
            name: 'John Doe',
            provider: 'dev',
            provider_id: '0000000',
            extra_data: {}
          },
          organization: '',
          bot: {
            id: '0000000',
            name: 'botName'
          }
        }}
        initialDevSettings={{
          keepSessionOnReload: webchatState.devSettings.keepSessionOnReload,
          showSessionView: webchatState.devSettings.showSessionView
        }}
      />
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 350,
          height: '100%'
        }}
      >
        <SessionView webchatHooks={webchatHooks} />
      </div>
    </div>
  )
})
