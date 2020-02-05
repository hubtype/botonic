import React from 'react'
import SendButtonIcon from '../assets/send-button.svg'
import { staticAsset } from '../utils'
export const SendButton = ({ onClick }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      paddingRight: 15,
    }}
  >
    <img
      src={staticAsset(SendButtonIcon)}
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    />
  </div>
)
