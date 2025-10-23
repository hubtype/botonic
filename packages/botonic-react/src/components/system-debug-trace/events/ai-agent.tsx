import { EventAction } from '@botonic/core'
import React from 'react'

import { WandSvg } from '../icons/wand'
import {
  StyledDebugDetail,
  StyledDebugLabel,
  StyledDebugValue,
} from '../styles'
import { DebugEventConfig } from '../types'

export interface AiAgentDebugEvent {
  action: EventAction.AiAgent
  flow_node_content_id: string
  tools_executed: string[]
  input_guardrails_triggered: string[]
  output_guardrails_triggered: string[]
  exit: boolean
  error: boolean
}

export const AiAgent = (props: AiAgentDebugEvent) => {
  return (
    <>
      <StyledDebugDetail>
        <StyledDebugLabel>Executed tools</StyledDebugLabel>
        {props.tools_executed.map(tool => (
          <StyledDebugValue key={tool}>{tool}</StyledDebugValue>
        ))}
      </StyledDebugDetail>
      {props.input_guardrails_triggered.length > 0 && (
        <StyledDebugDetail>
          <StyledDebugLabel>Input Guardrails Triggered</StyledDebugLabel>
          {props.input_guardrails_triggered.map(guardrail => (
            <StyledDebugValue key={guardrail}>{guardrail}</StyledDebugValue>
          ))}
        </StyledDebugDetail>
      )}
      {props.output_guardrails_triggered.length > 0 && (
        <StyledDebugDetail>
          <StyledDebugLabel>Output Guardrails Triggered</StyledDebugLabel>
          {props.output_guardrails_triggered.map(guardrail => (
            <StyledDebugValue key={guardrail}>{guardrail}</StyledDebugValue>
          ))}
        </StyledDebugDetail>
      )}
      {props.exit && (
        <StyledDebugDetail>
          <StyledDebugLabel>Exit</StyledDebugLabel>
        </StyledDebugDetail>
      )}
      {props.error && (
        <StyledDebugDetail>
          <StyledDebugLabel>Error</StyledDebugLabel>
        </StyledDebugDetail>
      )}
    </>
  )
}

export const getAiAgentEventConfig = (
  data: AiAgentDebugEvent
): DebugEventConfig => {
  const title = (
    <>
      AI agent triggered <span>- {data.flow_node_content_id}</span>
    </>
  )

  return {
    action: EventAction.AiAgent,
    title,
    component: AiAgent,
    icon: <WandSvg />,
    collapsible: true,
  }
}
