import { HtNodeWithoutContentType } from './node-types'

export interface HtGoToFlow {
  id: string
  type: HtNodeWithoutContentType.GO_TO_FLOW
  content: {
    flow_id: string
  }
}
