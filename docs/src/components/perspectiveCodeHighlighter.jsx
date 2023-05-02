import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

const PerspectiveCodeHighlighter = ({ children }) => (
  <div
    style={{
      transform: 'rotate3d(0, 1, 0, -10deg)',
      minWidth: 538,
      minHeight: 400,
      position: 'absolute',
      background:
        'linear-gradient(180deg, #4d546c 0%, rgba(77, 84, 108, 0) 100%)',
    }}
  >
    <SyntaxHighlighter
      language='jsx'
      style={tomorrow}
      customStyle={{
        background: 'transparent',
        fontFamily: 'Palinquin',
        fontSize: '13px',
      }}
    >
      {children}
    </SyntaxHighlighter>
  </div>
)

export default PerspectiveCodeHighlighter
