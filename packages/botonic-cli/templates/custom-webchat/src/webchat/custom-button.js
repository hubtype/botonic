import React from 'react'

export const CustomButton = props => (
  <div
    style={{
      color: 'white',
      border: '1px solid black',
      backgroundColor: 'blue',
      borderRadius: 20,
      cursor: 'pointer',
      paddingLeft: 15,
    }}
  >
    {props.children}
  </div>
)
