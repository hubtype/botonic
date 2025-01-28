import { Route } from '@botonic/core'

import { BotInfoBackdoorAction } from './actions/backdoors/bot-info'
import { ResetBackdoorAction } from './actions/backdoors/reset'
import { OpenWebviewBackdoorAction } from './actions/backdoors/webview'
import { ContentIdAction } from './actions/default/content-id'
import { ExtendedFlowBuilderAction } from './actions/default/extended-flow-builder'
import { RatingAction } from './actions/default/rating'
import { SetWebchatSettings } from './actions/default/set-webchat-settings'
import { StartConversationAction } from './actions/default/start-conversation'
import { UpdateSessionAction } from './actions/default/update-session'
import {
  BACKDOOR_COMMANDS,
  CONTENT_ID_PAYLOAD_REGEX,
  DO_NOTHING_PAYLOAD_REGEX,
  MODIFY_SESSION_PAYLOAD_REGEX,
  RATING_PAYLOAD_REGEX,
  SET_PAYLOAD_BACKDOOR_REGEX,
  SET_WEBCHAT_SETTINGS_PAYLOAD_REGEX,
  START_CONVERSATION_PAYLOAD_REGEX,
} from './constants'
import { BotRequest } from './types'
import { isProduction } from './utils/env-utils'

export function routes(request: BotRequest): Route[] {
  console.log('[User Input]', request.input)

  if (!isProduction()) {
    checkSetPayloadBackdoor(request)
  }

  const routes: Route[] = [
    {
      path: 'bot-info-backdoor',
      text: BACKDOOR_COMMANDS.botInfo,
      action: BotInfoBackdoorAction,
    },
    {
      path: 'open-webview-backdoor',
      text: BACKDOOR_COMMANDS.openWebview,
      action: OpenWebviewBackdoorAction,
    },
    {
      path: 'content-id',
      payload: CONTENT_ID_PAYLOAD_REGEX,
      action: ContentIdAction,
    },
    {
      path: 'update-session',
      payload: MODIFY_SESSION_PAYLOAD_REGEX,
      action: UpdateSessionAction,
    },
    {
      path: 'set-webchat-settings',
      payload: SET_WEBCHAT_SETTINGS_PAYLOAD_REGEX,
      action: SetWebchatSettings,
    },
    {
      path: 'start-conversation',
      payload: START_CONVERSATION_PAYLOAD_REGEX,
      action: StartConversationAction,
    },
    {
      path: 'rating',
      payload: RATING_PAYLOAD_REGEX,
      action: RatingAction,
    },
    {
      path: 'do-nothing',
      payload: DO_NOTHING_PAYLOAD_REGEX,
      action: () => null,
    },
    {
      path: 'flow-builder-action',
      text: /.*/,
      payload: /.*/,
      type: /.*/,
      action: ExtendedFlowBuilderAction,
    },
  ]

  if (!isProduction()) {
    routes.unshift({
      path: 'reset-backdoor',
      text: BACKDOOR_COMMANDS.reset,
      action: ResetBackdoorAction,
    })
  }

  return routes
}

function checkSetPayloadBackdoor(request: BotRequest): void {
  if (
    request.input.data &&
    SET_PAYLOAD_BACKDOOR_REGEX.test(request.input.data)
  ) {
    const payload = request.input.data.split('=')[1]
    request.input.payload = payload
  }
}
