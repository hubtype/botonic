import { EventAction } from '@botonic/core'
import { AiRouterSvg, AiSpecialistSvg, HandSvg } from '../../icons'
import {
  StyledDebugDetail,
  StyledDebugItemWithIcon,
  StyledDebugLabel,
  StyledDebugValue,
  StyledGuardrailLabel,
  StyledGuardrailValue,
} from '../../styles'
import type { DebugEventConfig } from '../../types'
import { LABELS } from '../constants'
import type { AiAgentRouterDebugEvent } from './types'

export const AiAgentRouter = ({
  input_guardrails_triggered,
  available_specialists,
  is_transferred_to_specialist,
  last_agent_name,
}: AiAgentRouterDebugEvent) => {
  return (
    <>
      {available_specialists.length > 0 && (
        <StyledDebugDetail data-line-end>
          <StyledDebugLabel>{LABELS.SPECIALISTS_AVAILABLE}</StyledDebugLabel>
          {available_specialists.map(h => (
            <StyledDebugItemWithIcon key={h.name}>
              <AiSpecialistSvg />
              {h.name}
            </StyledDebugItemWithIcon>
          ))}
        </StyledDebugDetail>
      )}

      <StyledDebugDetail>
        {is_transferred_to_specialist ? (
          <StyledDebugValue>
            {LABELS.TRANSFERRED_TO}{' '}
            <span style={{ fontWeight: 400 }}>- {last_agent_name}</span>
          </StyledDebugValue>
        ) : input_guardrails_triggered.length > 0 ? (
          <>
            {input_guardrails_triggered.map(guardrail => (
              <StyledDebugItemWithIcon key={`input-guardrail-${guardrail}`}>
                <HandSvg />
                <StyledGuardrailLabel>
                  {LABELS.GUARDRAIL_TRIGGERED}
                </StyledGuardrailLabel>
                <StyledGuardrailValue>- {guardrail}</StyledGuardrailValue>
              </StyledDebugItemWithIcon>
            ))}
          </>
        ) : (
          <StyledDebugValue>{LABELS.NO_TRANSFER}</StyledDebugValue>
        )}
      </StyledDebugDetail>
    </>
  )
}

export const getAiAgentRouterEventConfig = (
  data: AiAgentRouterDebugEvent
): DebugEventConfig => {
  return {
    action: EventAction.AiAgentRouter,
    title: (
      <>
        Router triggered <span>- {data.flow_node_content_id}</span>
      </>
    ),
    component: AiAgentRouter,
    icon: <AiRouterSvg />,
    collapsible: true,
  }
}
