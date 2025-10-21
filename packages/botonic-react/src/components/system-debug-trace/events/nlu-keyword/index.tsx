import { EventAction } from '@botonic/core'
import React from 'react'

import { QuoteRightSvg } from '../../icons/quote-right'
import {
  StyledDebugDetail,
  StyledDebugLabel,
  StyledDebugMetadata,
  StyledDebugValue,
} from '../../styles'

export interface NluKeywordDebugEvent {
  action: EventAction.Keyword
  bot_version: string
  flow_id: string
  flow_node_id: string
  flow_thread_id: string
  format_version: number
  nlu_keyword_is_regex: boolean
  nlu_keyword_message_id: string
  nlu_keyword_name: string
  system_locale: string
  user_country: string
  user_input: string
  user_locale: string
}

export const NluKeywordEventComponent: React.FC<
  NluKeywordDebugEvent
> = props => {
  return (
    <>
      <div>
        <StyledDebugLabel>Query:</StyledDebugLabel>{' '}
        <StyledDebugValue>&quot;{props.user_input}&quot;</StyledDebugValue>
      </div>
      <StyledDebugDetail>
        <StyledDebugLabel>Keyword:</StyledDebugLabel>{' '}
        <StyledDebugValue>{props.nlu_keyword_name}</StyledDebugValue>
      </StyledDebugDetail>
      <StyledDebugDetail>
        <StyledDebugLabel>Is Regex:</StyledDebugLabel>{' '}
        <StyledDebugValue>
          {props.nlu_keyword_is_regex ? 'Yes' : 'No'}
        </StyledDebugValue>
      </StyledDebugDetail>
      <StyledDebugMetadata>
        <div>
          <StyledDebugLabel>Flow ID:</StyledDebugLabel> {props.flow_id}
        </div>
        <div>
          <StyledDebugLabel>Flow Node ID:</StyledDebugLabel>{' '}
          {props.flow_node_id}
        </div>
        <div>
          <StyledDebugLabel>User Locale:</StyledDebugLabel> {props.user_locale}
        </div>
        <div>
          <StyledDebugLabel>User Country:</StyledDebugLabel>{' '}
          {props.user_country}
        </div>
      </StyledDebugMetadata>
    </>
  )
}

export const nluKeywordEventConfig = {
  action: EventAction.Keyword,
  title: 'Keyword matched',
  component: NluKeywordEventComponent,
  icon: <QuoteRightSvg color={'#666A7A'} />,
}
