import { EventAction } from '@botonic/core'
import React, { useContext, useEffect, useState } from 'react'

import { WebchatContext } from '../../../webchat/context'
import { HeadSetSvg } from '../icons'
import {
  StyledDebugDetail,
  StyledDebugLabel,
  StyledDebugValue,
} from '../styles'
import { DebugEventConfig } from '../types'
import { LABELS } from './constants'

export interface HandoffSuccessDebugEvent {
  action: EventAction.HandoffSuccess
  handoff_queue_name: string
  handoff_is_queue_open: boolean
  handoff_has_auto_assign: boolean
  handoff_note_id: string
}

export const HandoffSuccess = (props: HandoffSuccessDebugEvent) => {
  const { previewUtils } = useContext(WebchatContext)
  const [noteMessage, setNoteMessage] = useState<string>()

  useEffect(() => {
    const fetchNoteMessage = async () => {
      if (!previewUtils || !props.handoff_note_id) {
        return
      }
      const noteMessage = await previewUtils.getMessageById(
        props.handoff_note_id
      )
      if (!noteMessage) {
        return
      }
      setNoteMessage(noteMessage.text)
    }
    fetchNoteMessage()
  }, [previewUtils, props.handoff_note_id])

  return (
    <>
      <StyledDebugDetail>
        <StyledDebugLabel>{LABELS.QUEUE}</StyledDebugLabel>
        <StyledDebugValue>{props.handoff_queue_name}</StyledDebugValue>
      </StyledDebugDetail>
      <StyledDebugDetail>
        <StyledDebugLabel>{LABELS.AUTO_ASSIGN}</StyledDebugLabel>
        <StyledDebugValue>
          {props.handoff_has_auto_assign
            ? LABELS.AUTO_ASSIGN_ON
            : LABELS.AUTO_ASSIGN_OFF}
        </StyledDebugValue>
      </StyledDebugDetail>
      {Boolean(noteMessage) && (
        <StyledDebugDetail>
          <StyledDebugLabel>{LABELS.NOTE}</StyledDebugLabel>
          <StyledDebugValue>{noteMessage}</StyledDebugValue>
        </StyledDebugDetail>
      )}
    </>
  )
}

export const getHandoffSuccessEventConfig = (
  data: HandoffSuccessDebugEvent
): DebugEventConfig => {
  return {
    action: EventAction.HandoffSuccess,
    title: (
      <>
        Handoff to agent <span>- {data.handoff_queue_name}</span>
      </>
    ),
    icon: <HeadSetSvg />,
    component: HandoffSuccess,
    collapsible: true,
  }
}
