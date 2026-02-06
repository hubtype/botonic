import type { HtNodeWithoutContentType } from './node-types'

export interface HtUrlNode {
  id: string
  type: HtNodeWithoutContentType.URL
  content: {
    url: string
  }
}
