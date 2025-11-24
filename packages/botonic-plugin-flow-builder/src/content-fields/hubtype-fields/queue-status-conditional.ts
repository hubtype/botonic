import { HtBaseNode, HtNodeLink } from './common'
import { HtFunctionArguments, HtFunctionResult } from './function'
import { HtNodeWithContentType, HtNodeWithoutContentType } from './node-types'

// interface HtQueueArgument {
//   locale: string
//   values: [
//     {
//       type: 'string'
//       name: 'queue_id'
//       value: string
//     },
//     {
//       type: 'string'
//       name: 'queue_name'
//       value: string
//     },
//   ]
// }

// interface HtCheckAvailableAgentsArgument {
//   type: 'boolean'
//   name: 'check_available_agents'
//   value: boolean
// }

// export interface HtQueueStatusConditionalArguments {
//   values: HtQueueArgument[] | HtCheckAvailableAgentsArgument[]
// }

export type HtQueueStatusConditionalResultMapping = [
  {
    result: 'open'
    target: HtNodeLink
  },
  {
    result: 'closed'
    target: HtNodeLink
  },
  {
    result: 'open-without-agents'
    target: HtNodeLink
  },
]

export interface HtQueueStatusConditionalNode extends HtBaseNode {
  type: HtNodeWithContentType.FUNCTION
  content: {
    action: string //'get-channel-type'
    arguments: HtFunctionArguments[]
    result_mapping: HtFunctionResult[]
  }
}
