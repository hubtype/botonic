import type React from 'react'

import {
  StyledDebugDetail,
  StyledDebugItemWithIcon,
  StyledDebugLabel,
  StyledFileSourceValue,
  StyledSeeInfo,
  StyledUrlSourceValue,
} from '../../styles'
import { LABELS } from '../constants'
import type { HubtypeChunk, HubtypeSource } from '../knowledge-bases-types'
import styled from 'styled-components'

const StyledSeeChunksButton = styled(StyledSeeInfo)`
  margin-left: 0;
  margin-top: 4px;
`

interface SourcesSectionProps {
  sources: HubtypeSource[]
  chunks: HubtypeChunk[]
  getIconForSourceType: (source: HubtypeSource) => React.ReactNode
  onSeeChunks: () => void
  label?: string
}

export const SourcesSection = ({
  sources,
  // @ts-expect-error TODO: fix this
  chunks,
  getIconForSourceType,
  onSeeChunks,
  label = LABELS.SOURCES,
}: SourcesSectionProps) => {
  // if (sources.length === 0) {
  //   return null
  // }

  return (
    <StyledDebugDetail>
      <StyledDebugLabel>{label}</StyledDebugLabel>
      {sources.map(source => {
        const icon = getIconForSourceType(source)
        const isUrl = source.type === 'url'
        const value = isUrl
          ? source.activeExtractionJob?.url
          : source.activeExtractionJob?.fileName

        return (
          <StyledDebugItemWithIcon key={source.id}>
            {icon}
            {isUrl ? (
              <StyledUrlSourceValue
                href={value ?? ''}
                target='_blank'
                rel='noopener noreferrer'
                title={value ?? 'Not detected'}
              >
                {value}
              </StyledUrlSourceValue>
            ) : (
              <StyledFileSourceValue>{value}</StyledFileSourceValue>
            )}
          </StyledDebugItemWithIcon>
        )
      })}
      {/* {chunks.length > 0 && ( */}
      <StyledSeeChunksButton onClick={onSeeChunks}>
        {LABELS.SEE_CHUNKS_BUTTON}
      </StyledSeeChunksButton>
      {/* )} */}
    </StyledDebugDetail>
  )
}
