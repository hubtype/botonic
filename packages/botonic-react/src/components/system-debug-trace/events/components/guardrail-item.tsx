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
  $isLastItem?: boolean
}

export const GuardrailItem: React.FC<GuardrailItemProps> = ({
  guardrail,
  keyPrefix,
  $isLastItem,
}) => (
  <StyledGuardrailItem
    key={`${keyPrefix}-${guardrail}`}
    $isLastItem={$isLastItem}
  >
    <HandSvg />
    <StyledGuardrailLabel>{LABELS.GUARDRAIL_TRIGGERED}</StyledGuardrailLabel>
    <StyledGuardrailValue>- {guardrail}</StyledGuardrailValue>
  </StyledGuardrailItem>
)

interface GuardrailListProps {
  guardrails: string[]
  keyPrefix: string
  $isLastItem?: boolean
}

export const GuardrailList: React.FC<GuardrailListProps> = ({
  guardrails,
  keyPrefix,
  $isLastItem,
}) => (
  <>
    {guardrails.map(guardrail => (
      <GuardrailItem
        key={`${keyPrefix}-${guardrail}`}
        guardrail={guardrail}
        keyPrefix={keyPrefix}
        $isLastItem={$isLastItem}
      />
    ))}
  </>
)
