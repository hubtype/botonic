import { conditionalProvider } from './conditional-provider'
import { conditionalQueueStatus } from './conditional-queue-status'

export const DEFAULT_FUNCTIONS = {
  // TODO: Rename api action name
  // 'conditional-queue-status': conditionalQueueStatus,
  'check-queue-status': conditionalQueueStatus,
  'get-channel-type': conditionalProvider,
}
