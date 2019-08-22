import React from 'react'
export const PersistentMenu = props => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        bottom: 0,
        textAlign: 'center'
      }}
    >
      {props.children}
    </div>
  )
}

export default PersistentMenu
