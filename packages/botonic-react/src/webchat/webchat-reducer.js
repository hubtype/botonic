import {
  UPDATE_LATEST_INPUT,
  UPDATE_WEBVIEW,
  UPDATE_SESSION,
  UPDATE_LAST_ROUTE_PATH,
  UPDATE_THEME,
  UPDATE_DEV_SETTINGS,
  TOGGLE_WEBCHAT,
  TOGGLE_EMOJI_PICKER,
  TOGGLE_PERSISTENT_MENU,
  TOGGLE_COVER_COMPONENT,
  SET_ERROR,
  UPDATE_TYPING,
  UPDATE_HANDOFF,
  SET_CURRENT_ATTACHMENT,
} from './actions'

import { messagesReducer } from './messages-reducer'

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
    case TOGGLE_WEBCHAT:
      return { ...state, isWebchatOpen: action.payload }
    case TOGGLE_EMOJI_PICKER:
      return { ...state, isEmojiPickerOpen: action.payload }
    case TOGGLE_PERSISTENT_MENU:
      return { ...state, isPersistentMenuOpen: action.payload }
    case TOGGLE_COVER_COMPONENT:
      return { ...state, isCoverComponentOpen: action.payload }
    case SET_ERROR:
      return { ...state, error: action.payload || {} }
    case UPDATE_DEV_SETTINGS:
      return { ...state, devSettings: { ...action.payload } }
    case UPDATE_LATEST_INPUT:
      return { ...state, latestInput: action.payload }
    case UPDATE_LAST_ROUTE_PATH:
      return { ...state, lastRoutePath: action.payload }
    case SET_CURRENT_ATTACHMENT:
      return { ...state, currentAttachment: action.payload }
    default:
      return messagesReducer(state, action)
  }
}
