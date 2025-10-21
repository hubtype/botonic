import { EventAction } from '@botonic/core'
import React from 'react'

import { QuoteRightSvg } from '../icons/quote-right'
import {
  StyledDebugDetail,
  StyledDebugLabel,
  StyledDebugMetadata,
  StyledDebugValue,
} from '../styles'

export interface KeywordDebugEvent {
  action: EventAction.Keyword
  flow_id: string
  flow_node_id: string
  nlu_keyword_is_regex: boolean
  nlu_keyword_name: string
}

export const Keyword = (props: KeywordDebugEvent) => {
  return (
    <>
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
      </StyledDebugMetadata>
    </>
  )
}

export const keywordEventConfig = {
  action: EventAction.Keyword,
  title: 'Keyword triggered',
  component: Keyword,
  icon: <QuoteRightSvg color={'#666A7A'} />,
}
