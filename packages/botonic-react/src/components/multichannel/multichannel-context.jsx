import React from 'react'

export const MultichannelContext = React.createContext({
  boldIndex: true,
  text: {
    indexMode: 'letter',
  },
  indexSeparator: '.',
})
