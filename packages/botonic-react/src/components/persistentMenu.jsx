import React from 'react'
export const PersistentMenu = props => {
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 1,
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
