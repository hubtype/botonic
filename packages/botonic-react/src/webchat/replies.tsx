import React, { useContext } from 'react'
import styled from 'styled-components'

import { WEBCHAT } from '../constants'
import { WebchatContext } from '../contexts'
import { BotonicContainerId } from './constants'

const ScrollableReplies = styled.div`
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
`

interface RepliesContainerProps {
  justify: string
  wrap: string
}

const RepliesContainer = styled.div<RepliesContainerProps>`
  display: flex;
  text-align: center;
  justify-content: ${props => props.justify};
  flex-wrap: ${props => props.wrap};
  padding-bottom: 10px;
  margin-left: 5px;
  margin-right: 5px;
  overflow-x: auto;
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

export const WebchatReplies = () => {
  const { webchatState, getThemeProperty, repliesRef } =
    useContext(WebchatContext)

  let justifyContent = 'center'
  const flexWrap = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.wrapReplies,
    'wrap'
  )

  if (flexWrap === 'nowrap') {
    justifyContent = 'flex-start'
  } else if (getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.alignReplies)) {
    justifyContent =
      options[getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.alignReplies)]
  }

  return (
    <ScrollableReplies>
      <RepliesContainer
        id={BotonicContainerId.RepliesContainer}
        ref={repliesRef}
        className='replies-container'
        justify={justifyContent}
        wrap={flexWrap}
      >
        {webchatState.replies?.map((reply, i) => (
          // @ts-ignore TODO: In this point reply is the the component to render
          <ReplyContainer key={`reply-${i}`}>{reply}</ReplyContainer>
        ))}
      </RepliesContainer>
    </ScrollableReplies>
  )
}
