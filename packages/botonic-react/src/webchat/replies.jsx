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
    ...getThemeProperty('scrollbar'),
  }
  let justify = 'center'
  if (props.align) justify = options[props.align]
  if (props.wrap == 'nowrap') justify = 'flex-start'

  return (
    <StyledScrollbar
      scrollbar={scrollbarOptions}
      autoHide={scrollbarOptions.autoHide}
    >
      <div
        style={{
          display: 'flex',
          textAlign: 'center',
          justifyContent: justify,
          flexWrap: props.wrap || 'wrap',
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
