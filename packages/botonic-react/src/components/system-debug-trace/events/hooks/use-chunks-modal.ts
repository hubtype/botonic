import { EVENT_NAMES } from '../constants'
import { HubtypeChunk, HubtypeSource } from '../knowledge-bases-types'

export interface ChunksModalDetail {
  messageId?: string
  chunks: HubtypeChunk[]
  sources: HubtypeSource[]
}

export const useChunksModal = () => {
  const openChunksModal = (detail: ChunksModalDetail) => {
    window.dispatchEvent(
      new CustomEvent(EVENT_NAMES.SEE_CHUNKS_CLICKED, { detail })
    )
  }

  return { openChunksModal }
}
