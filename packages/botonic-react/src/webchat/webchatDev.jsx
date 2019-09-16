import React, { forwardRef, useEffect } from 'react'
import { useWebchat, useComponentVisible } from './hooks'
import { Webchat } from './webchat'
import { SessionView } from './sessionView'

export const WebchatDev = forwardRef((props, ref) => {
  const webchatHooks = useWebchat()
  const { webchatState, updateTheme } = webchatHooks
  const {
    ref: isVisibleRef,
    isComponentVisible,
    setIsComponentVisible
  } = useComponentVisible(false)
  const toggleSessionView = () =>
    webchatHooks.updateDevSettings({
      ...webchatState.devSettings,
      showSessionView: !webchatState.devSettings.showSessionView
    })
  const toggleKeepSessionOnReload = () =>
    webchatHooks.updateDevSettings({
      ...webchatState.devSettings,
      keepSessionOnReload: !webchatState.devSettings.keepSessionOnReload
    })

  /* TODO: webchatState.theme shoud be included in the dependencies array
  together with props.theme. The problem is that this effect modifies webchatState
  so we enter an infinite rerender loop. */
  useEffect(
    () =>
      updateTheme({
        ...webchatState.theme,
        ...props.theme,
        style: {
          position: 'absolute',
          right: 0,
          bottom: 0
        },
        triggerButtonStyle: {
          position: 'absolute'
        }
      }),
    [props.theme]
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'Arial, Helvetica, sans-serif'
      }}
    >
      <div
        style={{
          position: 'relative',
          flex: 'none',
          width: webchatState.width,
          height: webchatState.height
        }}
      >
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
            keepSessionOnReload: true,
            showSessionView: false
          }}
        />
        {webchatState.isWebchatOpen && (
          <div
            style={{
              position: 'absolute',
              right: 32,
              top: 12,
              padding: 5,
              cursor: 'pointer',
              color: 'white'
            }}
            onClick={() => setIsComponentVisible(!isComponentVisible)}
          >
            ☰
          </div>
        )}
        <div ref={isVisibleRef}>
          {isComponentVisible && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                right: 5,
                top: 5,
                padding: 12,
                backgroundColor: '#fff',
                border: '1px solid rgba(0, 0, 0, 0.5)'
              }}
            >
              <label style={{ flex: 'none', marginBottom: 6 }}>
                <input
                  type='checkbox'
                  name='toggleSessionView'
                  checked={webchatState.devSettings.showSessionView}
                  onChange={toggleSessionView}
                  className='form-check-input'
                />
                Show session
              </label>
              <label style={{ flex: 'none' }}>
                <input
                  type='checkbox'
                  name='toggleKeepSessionOnReload'
                  checked={webchatState.devSettings.keepSessionOnReload}
                  onChange={toggleKeepSessionOnReload}
                  className='form-check-input'
                />
                Keep session on reload
              </label>
            </div>
          )}
        </div>
      </div>
      {webchatState.devSettings.showSessionView && (
        <div
          style={{
            flex: 'none',
            width: 350,
            height: webchatState.height,
            marginLeft: '20px'
          }}
        >
          <SessionView webchatHooks={webchatHooks} />
        </div>
      )}
    </div>
  )
})
