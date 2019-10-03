import React from 'react'
import Icon from '../assets/header-logo.png'

var link = document.createElement('link')
link.setAttribute('rel', 'stylesheet')
link.setAttribute('type', 'text/css')
link.setAttribute(
  'href',
  'https://fonts.googleapis.com/css?family=Noto+Sans+JP'
)
document.head.appendChild(link)

export const MyCustomHeader = () => {
  var scriptBaseUrl = document
    .querySelector('script[src$="webchat.botonic.js"]')
    .getAttribute('src')
  var scriptName = scriptBaseUrl.split('/').pop()
  scriptBaseUrl = scriptBaseUrl.replace('/' + scriptName, '/')
  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #184BA5 0%, #5E90C3 100%)',
        borderRadius: '6px 6px 0px 0px',
        height: 70,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <img
        style={{ margin: '0px 12px', width: 38, color: 'white' }}
        src={scriptBaseUrl + Icon}
      />
      <h1
        style={{
          fontFamily: 'Noto Sans JP',
          src: 'https://fonts.googleapis.com/css?family=Noto+Sans+JP',
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: 16,
          lineHeight: 10,
          color: '#ffffff',
          width: '80%'
        }}
      >
        My customized header
      </h1>
      <div
        style={{
          cursor: 'pointer',
          fontSize: 16,
          color: 'white',
          width: '30%',
          justifyContent: 'center',
          display: 'flex'
        }}
        onClick={() => {
          Botonic.close()
        }}
      >
        ✕
      </div>
    </div>
  )
}
