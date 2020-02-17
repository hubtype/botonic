import React, { useContext } from 'react'
import { WebchatContext } from '../contexts'
import { StyledScrollbar } from '../webchat/components/styled-scrollbar'
import styled from 'styled-components'

const RepliesContainer = styled.div`
  display: flex;
  text-align: center;
  justify-content: ${props => props.justify};
  flex-wrap: ${props => props.wrap};
  padding-bottom: 10px;
  margin-left: 5px;
  margin-right: 5px;
`

const ReplyContainer = styled.div`
  flex: none;
  display: inline-block;
  margin: 3px;
`

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
  let justifyContent = 'center'
  const flexWrap = getThemeProperty('replies.wrap', 'nowrap')
  if (flexWrap == 'nowrap') justifyContent = 'flex-start'
  else justifyContent = options[getThemeProperty('replies.align')]

  return (
    <StyledScrollbar
      scrollbar={scrollbarOptions}
      autoHide={scrollbarOptions.autoHide}
    >
      <RepliesContainer
        justify={justifyContent}
        wrap={flexWrap}
        style={{
          ...props.style,
        }}
      >
        {webchatState.replies.map((r, i) => (
          <ReplyContainer key={i}>{r}</ReplyContainer>
        ))}
      </RepliesContainer>
    </StyledScrollbar>
  )
}
