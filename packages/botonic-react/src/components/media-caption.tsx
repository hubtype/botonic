import type React from 'react'
import styled from 'styled-components'

export const MediaCaption = styled.div`
  white-space: pre-wrap;
  margin-top: 8px;
`

export type MediaSerializeField = 'image' | 'audio' | 'video' | 'document'

export function serializeMedia(
  field: MediaSerializeField,
  props: { src: string; caption?: string }
): Record<string, string> {
  const data: Record<string, string> = { [field]: props.src }
  if (props.caption) {
    data.caption = props.caption
  }
  return data
}

export function withMediaCaption(
  content: React.ReactNode,
  caption?: string
): React.ReactNode {
  if (!caption) {
    return content
  }
  return (
    <>
      {content}
      <MediaCaption>{caption}</MediaCaption>
    </>
  )
}
