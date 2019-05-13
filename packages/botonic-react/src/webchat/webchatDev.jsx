import React from 'react'
import { useWebchat, useComponentVisible } from './hooks'
import { Webchat } from './webchat'
import { SessionView } from './sessionView'

export const WebchatDev = props => {
  const webchatHooks = useWebchat()
  const { webchatState } = webchatHooks
  const {
    ref,
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
          webchatHooks={webchatHooks}
        />
        {webchatState.isWebchatOpen && (
          <div
            style={{
              position: 'absolute',
              right: 48,
              top: '-23px',
              padding: 5,
              cursor: 'pointer'
            }}
            onClick={() => setIsComponentVisible(!isComponentVisible)}
          >
            ☰
          </div>
        )}
        <div ref={ref}>
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
}
