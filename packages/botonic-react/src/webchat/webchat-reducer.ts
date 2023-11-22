import { WebchatAction } from './actions'
import { WebchatState } from './index-types'
import { messagesReducer } from './messages-reducer'

// eslint-disable-next-line complexity
export function webchatReducer(
  state: WebchatState,
  action: { type: WebchatAction; payload?: any }
): WebchatState {
  switch (action.type) {
    case WebchatAction.UPDATE_WEBVIEW:
      return { ...state, ...action.payload }
    case WebchatAction.UPDATE_SESSION:
      return { ...state, session: { ...action.payload } }
    case WebchatAction.UPDATE_TYPING:
      return { ...state, typing: action.payload }
    case WebchatAction.UPDATE_THEME:
      return {
        ...state,
        ...action.payload,
      }
    case WebchatAction.UPDATE_HANDOFF:
      return { ...state, handoff: action.payload }
    case WebchatAction.TOGGLE_WEBCHAT: {
      const isWebchatOpen = action.payload
      return {
        ...state,
        isWebchatOpen,
      }
    }
    case WebchatAction.TOGGLE_EMOJI_PICKER:
      return { ...state, isEmojiPickerOpen: action.payload }
    case WebchatAction.TOGGLE_PERSISTENT_MENU:
      return { ...state, isPersistentMenuOpen: action.payload }
    case WebchatAction.TOGGLE_COVER_COMPONENT:
      return { ...state, isCoverComponentOpen: action.payload }
    case WebchatAction.DO_RENDER_CUSTOM_COMPONENT:
      return { ...state, isCustomComponentRendered: action.payload }
    case WebchatAction.SET_ERROR:
      return { ...state, error: action.payload || {} }
    case WebchatAction.SET_ONLINE:
      return { ...state, online: action.payload }
    case WebchatAction.UPDATE_DEV_SETTINGS:
      return { ...state, devSettings: { ...action.payload } }
    case WebchatAction.UPDATE_LATEST_INPUT:
      return { ...state, latestInput: action.payload }
    case WebchatAction.UPDATE_LAST_ROUTE_PATH:
      return { ...state, lastRoutePath: action.payload }
    case WebchatAction.SET_CURRENT_ATTACHMENT:
      return { ...state, currentAttachment: action.payload }
    case WebchatAction.UPDATE_JWT:
      return { ...state, jwt: action.payload }
    default:
      return messagesReducer(state, action)
  }
}
