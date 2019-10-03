import Icon from '../assets/trigger-button.png'
import React from 'react'

export const CustomTrigger = () => {
  return (
    <div
      style={{
        cursor: 'pointer',
        position: 'fixed',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 20,
        right: 10,
        background: 'transparent',
        width: '90px',
        height: '90px',
        flexDirection: 'column',
        textAlign: 'center'
      }}
    >
      <img
        style={{
          height: '50%',
          width: '50%'
        }}
        src={Icon}
      />
      <h3>I am customizable</h3>
    </div>
  )
}
