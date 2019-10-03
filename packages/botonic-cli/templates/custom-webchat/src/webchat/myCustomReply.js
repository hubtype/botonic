import React from 'react'

export const MyCustomReply = props => (
  <div
    style={{
      color: '#0000ff',
      border: '2px solid #0000ff',
      backgroundColor: 'white',
      borderRadius: 30,
      padding: 8,
      cursor: 'pointer'
    }}
  >
    {props.children}
  </div>
)
