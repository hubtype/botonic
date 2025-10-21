import { EventAction } from '@botonic/core'
import React from 'react'

import { WandSvg } from '../icons/wand'
import {
  StyledDebugDetail,
  StyledDebugLabel,
  StyledDebugValue,
} from '../styles'

export interface AiAgentDebugEvent {
  action: EventAction.AiAgent
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
        <StyledDebugLabel>Tools Executed</StyledDebugLabel>
        {props.tools_executed.map(tool => (
          <StyledDebugValue key={tool}>{tool}</StyledDebugValue>
        ))}
        {props.input_guardrails_triggered.length > 0 && (
          <>
            <StyledDebugLabel>Input Guardrails Triggered</StyledDebugLabel>
            {props.input_guardrails_triggered.map(guardrail => (
              <StyledDebugValue key={guardrail}>{guardrail}</StyledDebugValue>
            ))}
          </>
        )}
        {props.output_guardrails_triggered.length > 0 && (
          <>
            <StyledDebugLabel>Output Guardrails Triggered</StyledDebugLabel>
            {props.output_guardrails_triggered.map(guardrail => (
              <StyledDebugValue key={guardrail}>{guardrail}</StyledDebugValue>
            ))}
          </>
        )}
        {props.exit && <StyledDebugLabel>Exit</StyledDebugLabel>}
        {props.error && <StyledDebugLabel>Error</StyledDebugLabel>}
      </StyledDebugDetail>
    </>
  )
}

export const aiAgentEventConfig = {
  action: EventAction.AiAgent,
  title: 'AI agent triggered',
  component: AiAgent,
  icon: <WandSvg color={'#666A7A'} />,
}
