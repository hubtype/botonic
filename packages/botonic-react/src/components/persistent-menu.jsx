import React from 'react'
import { Button } from './button'

export const PersistentMenu = ({ onClick, options }) => {
  let closeLabel = 'Cancel'
  try {
    closeLabel = options.filter(opt => opt.closeLabel !== undefined)[0]
      .closeLabel
  } catch (e) {}
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        bottom: 0,
        textAlign: 'center',
      }}
    >
      {Object.values(options).map((e, i) => {
        return (
          e.label && (
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
        )
      })}
      <Button onClick={onClick}>{closeLabel}</Button>
    </div>
  )
}

export default PersistentMenu
