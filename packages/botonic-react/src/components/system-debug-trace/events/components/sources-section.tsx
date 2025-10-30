import React from 'react'

import { HubtypeChunk, HubtypeSource } from '../../api-service'
import {
  StyledDebugDetail,
  StyledDebugItemWithIcon,
  StyledDebugLabel,
  StyledFileSourceValue,
  StyledSeeChunksButton,
  StyledUrlSourceValue,
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
      {sources.map(source => {
        const icon = getIconForSourceType(source)
        const isUrl = source.type === 'url'
        const value = isUrl
          ? source.active_extraction_job.url || ''
          : source.active_extraction_job.file_name

        return (
          <StyledDebugItemWithIcon key={source.id}>
            {icon}
            {isUrl ? (
              <StyledUrlSourceValue
                href={value}
                target='_blank'
                rel='noopener noreferrer'
                title={value}
              >
                {value}
              </StyledUrlSourceValue>
            ) : (
              <StyledFileSourceValue>{value}</StyledFileSourceValue>
            )}
          </StyledDebugItemWithIcon>
        )
      })}
      {chunks.length > 0 && (
        <StyledSeeChunksButton onClick={onSeeChunks}>
          {LABELS.SEE_CHUNKS_BUTTON}
        </StyledSeeChunksButton>
      )}
    </StyledDebugDetail>
  )
}
