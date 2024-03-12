import { conditionalBotVariable } from './conditional-bot-variable'
import { conditionalCountry } from './conditional-country'
import { conditionalProvider } from './conditional-provider'
import { conditionalQueueStatus } from './conditional-queue-status'

export const DEFAULT_FUNCTIONS = {
  // TODO: Rename api action name
  'check-queue-status': conditionalQueueStatus,
  'get-channel-type': conditionalProvider,
  'check-country': conditionalCountry,
  'check-bot-variable': conditionalBotVariable,
}
