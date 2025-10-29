import React from 'react'

import { HandSvg } from '../../icons'
import {
  StyledGuardrailItem,
  StyledGuardrailLabel,
  StyledGuardrailValue,
} from '../../styles'
import { LABELS } from '../constants'

interface GuardrailItemProps {
  guardrail: string
  keyPrefix: string
}

export const GuardrailItem: React.FC<GuardrailItemProps> = ({
  guardrail,
  keyPrefix,
}) => (
  <StyledGuardrailItem key={`${keyPrefix}-${guardrail}`}>
    <HandSvg />
    <StyledGuardrailLabel>{LABELS.GUARDRAIL_TRIGGERED}</StyledGuardrailLabel>
    <StyledGuardrailValue>- {guardrail}</StyledGuardrailValue>
  </StyledGuardrailItem>
)

interface GuardrailListProps {
  guardrails: string[]
  keyPrefix: string
}

export const GuardrailList: React.FC<GuardrailListProps> = ({
  guardrails,
  keyPrefix,
}) => (
  <>
    {guardrails.map(guardrail => (
      <GuardrailItem
        key={`${keyPrefix}-${guardrail}`}
        guardrail={guardrail}
        keyPrefix={keyPrefix}
      />
    ))}
  </>
)
