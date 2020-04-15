import React from 'react'

export const MultichannelContext = React.createContext({
  currentIndex: 1,
  boldIndex: true,
  carousel: {
    indexMode: undefined,
  },
  text: {
    indexMode: 'letter',
  },
  indexSeparator: '.',
})
