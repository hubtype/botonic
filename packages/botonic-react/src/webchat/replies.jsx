import React, { useContext } from 'react'
import { WebchatContext } from '../contexts'
import { StyledScrollbar } from './styled-scrollbar'

const options = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
}

export const WebchatReplies = props => {
  const { webchatState, getThemeProperty } = useContext(WebchatContext)
  const scrollbarOptions = {
    ...{ enable: true, autoHide: true },
    ...getThemeProperty('scrollbar', {}),
  }
  let justifyContent = 'center'
  let flexWrap = getThemeProperty('replies.wrap', 'wrap')
  if (flexWrap == 'nowrap') justifyContent = 'flex-start'
  else justifyContent = options[getThemeProperty('replies.align')]

  return (
    <StyledScrollbar
      scrollbar={scrollbarOptions}
      data-simplebar-auto-hide={scrollbarOptions.autoHide}
    >
      <div
        style={{
          display: 'flex',
          textAlign: 'center',
          justifyContent: justifyContent,
          flexWrap: flexWrap,
          paddingBottom: 10,
          marginLeft: 5,
          marginRight: 5,
          ...(props.style || {}),
        }}
      >
        {webchatState.replies.map((r, i) => (
          <div
            key={i}
            style={{ flex: 'none', display: 'inline-block', margin: 3 }}
          >
            {r}
          </div>
        ))}
      </div>
    </StyledScrollbar>
  )
}
