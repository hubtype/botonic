import React from 'react'
import { Button } from './button'

export const PersistentMenu = ({ onClick, options }) => {
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
      {Object.values(options).map((e, i) => {
        return (
          <Button
            onClick={onClick}
            url={e.url}
            webview={e.webview}
            payload={e.payload}
            key={i}
          >
            {Object.values(e.label)}
          </Button>
        )
      })}
      <Button onClick={onClick}>Cancel</Button>
    </div>
  )
}

export default PersistentMenu
