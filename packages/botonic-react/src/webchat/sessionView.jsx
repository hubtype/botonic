import React from 'react'
import JSONTree from 'react-json-tree'

import { useWebchat } from './hooks'

const SessionViewAttribute = props => (
  <div
    style={{
      display: 'flex',
      flex: 'none',
      padding: 12,
      paddingBottom: 0,
      fontSize: 12,
      fontWeight: 600,
      color: 'white',
      alignItems: 'center'
    }}
  >
    <div
      style={{
        flex: 'none'
      }}
    >
      {props.label}
    </div>
    <div
      style={{
        flex: '1 1 auto',
        maxHeight: 20,
        fontSize: 16,
        fontWeight: 400,
        marginLeft: 6,
        color: 'rgb(38, 139, 210)',
        overflowX: 'hidden'
      }}
    >
      {props.value}
    </div>
  </div>
)

export const SessionView = props => {
  const { webchatState, updateDevSettings } = props.webchatHooks || useWebchat()
  const { latestInput: input, session, lastRoutePath } = webchatState
  const toggleSessionView = () =>
    updateDevSettings({
      ...webchatState.devSettings,
      showSessionView: !webchatState.devSettings.showSessionView
    })
  const toggleKeepSessionOnReload = () =>
    updateDevSettings({
      ...webchatState.devSettings,
      keepSessionOnReload: !webchatState.devSettings.keepSessionOnReload
    })
  return (
    <div
      style={{
        position: 'relative',
        width: webchatState.devSettings.showSessionView ? '100%' : '0%',
        height: '100%',
        display: 'flex',
        backgroundColor: '#002B35',
        fontFamily: 'Arial, Helvetica, sans-serif',
        flexDirection: 'column',
        zIndex: 100000,
        transition: 'all .2s ease-in-out'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: -32,
          width: 32,
          height: 32,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: 14,
          fontWeight: 600,
          backgroundColor: '#002B35',
          flexDirection: 'column',
          zIndex: 100000,
          borderTopRightRadius: 6,
          borderBottomRightRadius: 6
        }}
        onClick={toggleSessionView}
      >
        {webchatState.devSettings.showSessionView ? '⇤' : '⇥'}
      </div>
      <div
        style={{
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            padding: 12,
            textAlign: 'center',
            color: 'white',
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          Botonic Dev Console
        </div>
        <SessionViewAttribute
          label='INPUT:'
          value={
            input && Object.keys(input).length
              ? `[${input.type}] ${input.data}`
              : ''
          }
        />
        <SessionViewAttribute label='PAYLOAD:' value={input.payload} />
        <SessionViewAttribute
          label='INTENT:'
          value={
            input.intent
              ? `${input.intent} (${(input.confidence * 100).toFixed(1)}%)`
              : ''
          }
        />
        <SessionViewAttribute
          label='PATH:'
          value={lastRoutePath ? `/${lastRoutePath}` : '/'}
        />
        <SessionViewAttribute label='SESSION:' />
        <div style={{ flex: '1 1 auto', height: '100%', overflowY: 'auto' }}>
          <JSONTree data={session} hideRoot={true} />
        </div>
        <div
          style={{
            flex: 'none',
            padding: 12,
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 12
          }}
        >
          <label>
            <input
              type='checkbox'
              name='toggleKeepSessionOnReload'
              checked={Boolean(webchatState.devSettings.keepSessionOnReload)}
              onChange={toggleKeepSessionOnReload}
              style={{ marginRight: 5 }}
            />
            Keep session on reload
          </label>
        </div>
      </div>
    </div>
  )
}
