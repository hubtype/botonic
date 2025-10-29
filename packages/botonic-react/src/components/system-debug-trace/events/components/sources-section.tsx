import React from 'react'

import { HubtypeChunk, HubtypeSource } from '../../api-service'
import {
  StyledDebugDetail,
  StyledDebugItemWithIcon,
  StyledDebugLabel,
  StyledSeeChunksButton,
  StyledSourceValue,
} from '../../styles'
import { LABELS } from '../constants'

interface SourcesSectionProps {
  sources: HubtypeSource[]
  chunks: HubtypeChunk[]
  getIconForSourceType: (source: HubtypeSource) => React.ReactNode
  onSeeChunks: () => void
  label?: string
}

export const SourcesSection: React.FC<SourcesSectionProps> = ({
  sources,
  chunks,
  getIconForSourceType,
  onSeeChunks,
  label = LABELS.SOURCES,
}) => {
  if (sources.length === 0) return null

  return (
    <StyledDebugDetail>
      <StyledDebugLabel>{label}</StyledDebugLabel>
      {sources.map(source => (
        <StyledDebugItemWithIcon key={source.id}>
          {getIconForSourceType(source)}
          <StyledSourceValue>
            {source.active_extraction_job.file_name}
          </StyledSourceValue>
        </StyledDebugItemWithIcon>
      ))}
      {chunks.length > 0 && (
        <StyledSeeChunksButton onClick={onSeeChunks}>
          {LABELS.SEE_CHUNKS_BUTTON}
        </StyledSeeChunksButton>
      )}
    </StyledDebugDetail>
  )
}
