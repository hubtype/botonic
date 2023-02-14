import { conditionalProvider } from './conditional-provider'
import { conditionalQueueStatus } from './conditional-queue-status'

export const DEFAULT_FUNCTIONS = {
  'conditional-queue-status': conditionalQueueStatus,
  'conditional-provider': conditionalProvider,
}
