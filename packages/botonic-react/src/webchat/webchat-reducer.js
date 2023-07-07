import {
  DO_RENDER_CUSTOM_COMPONENT,
  SET_CURRENT_ATTACHMENT,
  SET_ERROR,
  SET_ONLINE,
  TOGGLE_COVER_COMPONENT,
  TOGGLE_EMOJI_PICKER,
  TOGGLE_PERSISTENT_MENU,
  TOGGLE_WEBCHAT,
  UPDATE_DEV_SETTINGS,
  UPDATE_HANDOFF,
  UPDATE_JWT,
  UPDATE_LAST_ROUTE_PATH,
  UPDATE_LATEST_INPUT,
  UPDATE_SESSION,
  UPDATE_THEME,
  UPDATE_TYPING,
  UPDATE_WEBVIEW,
} from './actions'
import { messagesReducer } from './messages-reducer'

// eslint-disable-next-line complexity
export function webchatReducer(state, action) {
  switch (action.type) {
    case UPDATE_WEBVIEW:
      return { ...state, ...action.payload }
    case UPDATE_SESSION:
      return { ...state, session: { ...action.payload } }
    case UPDATE_TYPING:
      return { ...state, typing: action.payload }
    case UPDATE_THEME:
      return {
        ...state,
        ...action.payload,
      }
    case UPDATE_HANDOFF:
      return { ...state, handoff: action.payload }
    case TOGGLE_WEBCHAT: {
      const isWebchatOpen = action.payload
      return {
        ...state,
        isWebchatOpen,
        unreadMessages: isWebchatOpen ? 0 : state.unreadMessages,
      }
    }
    case TOGGLE_EMOJI_PICKER:
      return { ...state, isEmojiPickerOpen: action.payload }
    case TOGGLE_PERSISTENT_MENU:
      return { ...state, isPersistentMenuOpen: action.payload }
    case TOGGLE_COVER_COMPONENT:
      return { ...state, isCoverComponentOpen: action.payload }
    case DO_RENDER_CUSTOM_COMPONENT:
      return { ...state, isCustomComponentRendered: action.payload }
    case SET_ERROR:
      return { ...state, error: action.payload || {} }
    case SET_ONLINE:
      return { ...state, online: action.payload }
    case UPDATE_DEV_SETTINGS:
      return { ...state, devSettings: { ...action.payload } }
    case UPDATE_LATEST_INPUT:
      return { ...state, latestInput: action.payload }
    case UPDATE_LAST_ROUTE_PATH:
      return { ...state, lastRoutePath: action.payload }
    case SET_CURRENT_ATTACHMENT:
      return { ...state, currentAttachment: action.payload }
    case UPDATE_JWT:
      return { ...state, jwt: action.payload }
    default:
      return messagesReducer(state, action)
  }
}
