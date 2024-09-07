import React, { useContext } from 'react'
import styled from 'styled-components'

import { WEBCHAT } from '../constants'
import { WebchatContext } from '../contexts'
import { ScrollableContent } from './components/scrollable-content'

const RepliesContainer = styled.div`
  display: flex;
  text-align: center;
  justify-content: ${props => props.justify};
  flex-wrap: ${props => props.wrap};
  padding-bottom: 10px;
  margin-left: 5px;
  margin-right: 5px;
  overflow-x: scroll;
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
    <ScrollableContent>
      <RepliesContainer
        className='replies-container'
        justify={justifyContent}
        wrap={flexWrap}
      >
        {webchatState.replies.map((r, i) => (
          <ReplyContainer key={i}>{r}</ReplyContainer>
        ))}
      </RepliesContainer>
    </ScrollableContent>
  )
}
