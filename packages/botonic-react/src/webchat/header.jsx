import React, { useContext } from 'react'
import { WebchatContext } from '../contexts'
import Logo from './botonic_react_logo100x100.png'

export const WebchatHeader = props => {
  const { webchatState, staticAssetsUrl, triggerWebchat } = useContext(
    WebchatContext
  )

  if (webchatState.theme.customHeader) {
    let CustomHeader = webchatState.theme.customHeader
    return <CustomHeader />
  }
  return (
    <div
      style={{
        ...(props.style || {}),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#b0c4de',
        color: '#295179'
      }}
    >
      <img
        style={{
          height: 24,
          margin: '0px 12px'
        }}
        src={staticAssetsUrl + (webchatState.theme.brandIconUrl || Logo)}
      />
      <h4
        style={{
          margin: 0,
          fontFamily: 'Arial, Helvetica, sans-serif'
        }}
      >
        {webchatState.theme.title || 'Botonic'}
      </h4>
      <div
        style={{
          cursor: 'pointer',
          fontSize: '25px',
          color: 'black',
          position: 'absolute',
          right: '10px',
          top: '0px'
        }}
        onClick={event => {
          triggerWebchat(!webchatState.isWebchatOpen)
          event.preventDefault()
        }}
      >
        &times;
      </div>
    </div>
  )
}
