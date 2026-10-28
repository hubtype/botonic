import { EventAction } from '@botonic/core'

import { PenToSquareSvg } from '../icons/pen-to-square'
import {
  StyledDebugDetail,
  StyledDebugLabel,
  StyledDebugValue,
} from '../styles'
import type { DebugEventConfig } from '../types'
import { LABELS } from './constants'

export interface UpdateVariablesDebugEvent {
  action: EventAction.UpdateVariables
  set_variables: Record<string, string | number | boolean>
  unset_variables: string[]
}

export const UpdateVariables = (props: UpdateVariablesDebugEvent) => {
  const setEntries = Object.entries(props.set_variables ?? {})
  const unsetPaths = props.unset_variables ?? []
  const hasSet = setEntries.length > 0
  const hasUnset = unsetPaths.length > 0

  if (!hasSet && !hasUnset) {
    return (
      <StyledDebugDetail>
        <StyledDebugValue>{LABELS.NO_VARIABLES}</StyledDebugValue>
      </StyledDebugDetail>
    )
  }

  return (
    <>
      {setEntries.map(([path, value]) => (
        <StyledDebugDetail key={path}>
          <StyledDebugLabel>{path}</StyledDebugLabel>
          <StyledDebugValue>{String(value)}</StyledDebugValue>
        </StyledDebugDetail>
      ))}
      {hasUnset ? (
        <StyledDebugDetail>
          <StyledDebugLabel>{LABELS.UNSET}</StyledDebugLabel>
          <StyledDebugValue>{unsetPaths.join('\n')}</StyledDebugValue>
        </StyledDebugDetail>
      ) : null}
    </>
  )
}

export const getUpdateVariablesEventConfig = (
  _data: UpdateVariablesDebugEvent
): DebugEventConfig => {
  return {
    action: EventAction.UpdateVariables,
    title: 'Update variables',
    component: UpdateVariables,
    icon: <PenToSquareSvg />,
    collapsible: true,
  }
}
