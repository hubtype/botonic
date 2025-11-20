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
  const [noteMessageContent, setNoteMessageContent] =
    useState<string>('Without note')

  useEffect(() => {
    const fetchNoteMessageContent = async () => {
      if (!previewUtils || !props.handoff_note_id) {
        return
      }
      const noteMessage = await previewUtils.getMessageById(
        props.handoff_note_id
      )
      setNoteMessageContent(noteMessage.text)
    }
    fetchNoteMessageContent()
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
          {props.handoff_has_auto_assign ? 'ON' : 'OFF'}
        </StyledDebugValue>
      </StyledDebugDetail>
      <StyledDebugDetail>
        <StyledDebugLabel>{LABELS.NOTE}</StyledDebugLabel>
        <StyledDebugValue>{noteMessageContent}</StyledDebugValue>
      </StyledDebugDetail>
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
