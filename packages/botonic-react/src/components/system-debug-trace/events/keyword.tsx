import { EventAction } from '@botonic/core'
import React from 'react'

import { QuoteRightSvg } from '../icons/quote-right'
import { DebugEventConfig } from '../types'

export interface KeywordDebugEvent {
  action: EventAction.Keyword
  flow_id: string
  flow_node_id: string
  nlu_keyword_is_regex: boolean
  nlu_keyword_name: string
}

export const getKeywordEventConfig = (
  data: KeywordDebugEvent
): DebugEventConfig => {
  const title = (
    <>
      Keyword matched <span>- &quot;{data.nlu_keyword_name}&quot;</span>
    </>
  )

  return {
    action: EventAction.Keyword,
    title,
    component: null,
    icon: <QuoteRightSvg />,
    collapsible: false,
  }
}
