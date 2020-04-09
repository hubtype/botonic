import React from 'react'

export const MultichannelContext = React.createContext({
  boldIndex: true,
  carousel: {
    indexMode: undefined,
  },
  text: {
    indexMode: 'letter',
  },
  indexSeparator: '.',
})
