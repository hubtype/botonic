import React, { useContext } from 'react'

import { WEBCHAT } from '../../constants'
import { WebchatContext } from '../../webchat/context'
import { BotonicContainerId } from '../constants'
import { RepliesContainer, ReplyContainer, ScrollableReplies } from './styles'

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
