import { HtNodeLink } from './common'
import { HtNodeStartType } from './node-types'

export interface HtStartNode {
  id: string
  type: HtNodeStartType.STARTUP
  target: HtNodeLink
}
