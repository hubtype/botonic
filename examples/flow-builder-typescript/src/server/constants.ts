export const FORCED_PAYLOAD = '_forced_payload_'

export const RESTART_CONVERSATION_PAYLOAD = 'restart-conversation'

export const SUBMITED_WEBVIEW_PAYLOAD = 'ADD_SUBMITED_WEBVIEW_PAYLOAD'

export const UPDATE_SESSION_PAYLOAD = 'update-session'

export const REMOVE_SESSION_PAYLOAD = 'remove-session'

export const MODIFY_SESSION_PAYLOAD_REGEX = new RegExp(
  `^${UPDATE_SESSION_PAYLOAD}.*|^${REMOVE_SESSION_PAYLOAD}.*`
)

export const REMOVE_SESSION_PAYLOAD_REGEX = new RegExp(
  `^${REMOVE_SESSION_PAYLOAD}.*`
)

export const CONTENT_ID_PAYLOAD = 'content-id'

export const CONTENT_ID_PAYLOAD_REGEX = new RegExp(`^${CONTENT_ID_PAYLOAD}.*`)

export const RATING_PAYLOAD = 'rating'

export const RATING_PAYLOAD_REGEX = new RegExp(`^${RATING_PAYLOAD}.*`)

export const START_CONVERSATION_PAYLOAD_REGEX = new RegExp(
  `^${FORCED_PAYLOAD}$|^${RESTART_CONVERSATION_PAYLOAD}$`
)

export const SET_WEBCHAT_SETTINGS_PAYLOAD = 'set-webchat-settings'

export const SET_WEBCHAT_SETTINGS_PAYLOAD_REGEX = new RegExp(
  `^${SET_WEBCHAT_SETTINGS_PAYLOAD}.*`
)

export const DO_NOTHING_PAYLOAD = 'do-nothing'
export const DO_NOTHING_PAYLOAD_REGEX = new RegExp(`^${DO_NOTHING_PAYLOAD}.*`)

export const BACKDOOR_COMMANDS = {
  botInfo: '###bot_info',
  reset: '###reset',
  setPayload: '###payload=',
}

export const SET_PAYLOAD_BACKDOOR_REGEX = new RegExp(
  `^${BACKDOOR_COMMANDS.setPayload}.*`
)
