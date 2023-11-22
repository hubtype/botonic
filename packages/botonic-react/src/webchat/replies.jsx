import React, { useContext } from 'react'
import styled from 'styled-components'

import { WEBCHAT } from '../constants'
import { WebchatContext } from '../contexts'
import { StyledScrollbar } from '../webchat/components/styled-scrollbar'

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
    ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.scrollbar),
  }
  let justifyContent = 'center'
  const flexWrap = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.wrapReplies,
    'wrap'
  )
  if (flexWrap == 'nowrap') justifyContent = 'flex-start'
  else if (getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.alignReplies))
    justifyContent =
      options[getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.alignReplies)]

  return (
    <StyledScrollbar
      scrollbar={scrollbarOptions}
      autoHide={scrollbarOptions.autoHide}
    >
      <RepliesContainer
        className='replies-container'
        justify={justifyContent}
        wrap={flexWrap}
      >
        {webchatState.replies.map((r, i) => (
          <ReplyContainer key={i}>{r}</ReplyContainer>
        ))}
      </RepliesContainer>
    </StyledScrollbar>
  )
}
