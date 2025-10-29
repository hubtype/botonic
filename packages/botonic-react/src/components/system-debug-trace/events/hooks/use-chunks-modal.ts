import { HubtypeChunk, HubtypeSource } from '../../api-service'
import { EVENT_NAMES } from '../constants'

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
