import type { HtNodeWithoutContentType } from './node-types'

export interface HtPayloadNode {
  id: string
  type: HtNodeWithoutContentType.PAYLOAD
  content: {
    payload: string
  }
}
