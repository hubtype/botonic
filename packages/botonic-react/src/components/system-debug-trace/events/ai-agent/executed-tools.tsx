import { ScrewdriverWrenchSvg } from '../../icons'
import {
  StyledDebugDetail,
  StyledDebugItemWithIcon,
  StyledDebugLabel,
  StyledSeeInfo,
} from '../../styles'
import { LABELS } from '../constants'
import type { ToolExecuted } from './types'
import styled from 'styled-components'

const StyledSeeToolDetailsButton = styled(StyledSeeInfo)`
  flex-shrink: 0;
  border: none;
`

interface Props {
  tools: ToolExecuted[]
  onSeeToolDetails: (tool: ToolExecuted) => void
}

export const ExecutedTools = ({ tools, onSeeToolDetails }: Props) => {
  if (!tools.length) {
    return null
  }

  return (
    <StyledDebugDetail>
      <StyledDebugLabel>{LABELS.EXECUTED_TOOLS}</StyledDebugLabel>

      {tools.map((tool, index) => (
        <StyledDebugItemWithIcon key={`${tool.tool_name}-${index}`}>
          <ScrewdriverWrenchSvg />
          {tool.tool_name}

          <StyledSeeToolDetailsButton onClick={() => onSeeToolDetails(tool)}>
            {LABELS.SEE_TOOL_DETAILS}
          </StyledSeeToolDetailsButton>
        </StyledDebugItemWithIcon>
      ))}
    </StyledDebugDetail>
  )
}
