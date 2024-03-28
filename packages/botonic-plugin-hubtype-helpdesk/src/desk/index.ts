import { ActionRequest } from '@botonic/react'

import { Desk } from './desk'
import { BotonicDeskOptions, DeskInterface } from './types'

export * from './desk'
export * from './types'

export default class BotonicDesk {
  static getDesk(
    request: ActionRequest,
    options: BotonicDeskOptions | { desk: DeskInterface } = {}
  ): DeskInterface {
    const desk = 'desk' in options ? options.desk : new Desk({ ...options })
    desk.init(request)
    return desk
  }
}

// let desk
// if ('desk' in options) {
//   desk = options.desk
// } else {
//   desk = new Desk({ ...options })
// }
