import React from 'react'
import { isBrowser } from '@botonic/core'
import { Message } from './message'
export const PersistentMenu = props => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '120px',
        top: '288px',
        backgroundColor: 'red',
        textAlign: 'center',
        left: '10px',
        borderRadius: '20px'
      }}
    >
      {props.children}
    </div>
  )
}

export default PersistentMenu
