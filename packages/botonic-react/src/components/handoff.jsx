import React, { useState, useContext } from 'react'
import { WebchatContext } from '../contexts'

export const Handoff = props => {
  const { resolveCase } = useContext(WebchatContext)
  const [state, setState] = useState({ showContinue: true })

  const continueClick = () => {
    setState({ showContinue: false })
    resolveCase()
  }

  let bgColor = state.showContinue ? '#c6e7c0' : '#d1d8cf'
  let fontColor = state.showContinue ? '#3a9c35' : '#5f735e'
  return (
    <div
      style={{
        display: 'flex',
        color: fontColor,
        fontFamily: 'Arial, Helvetica, sans-serif',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: bgColor
      }}
    >
      {state.showContinue ? (
        <div style={{ textAlign: 'center', whiteSpace: 'normal' }}>
          Conversation transferred to a human agent...
        </div>
      ) : (
        <div style={{ textAlign: 'center', whiteSpace: 'normal' }}>
          Human handoff ended
        </div>
      )}
      {state.showContinue && (
        <button
          style={{
            maxWidth: '60%',
            padding: '12px 24px',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: 4,
            marginTop: 8,
            cursor: 'pointer'
          }}
          onClick={continueClick}
        >
          Continue
        </button>
      )}
    </div>
  )
}
