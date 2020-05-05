import {
  UPDATE_LATEST_INPUT,
  UPDATE_WEBVIEW,
  UPDATE_SESSION,
  UPDATE_USER,
  UPDATE_LAST_ROUTE_PATH,
  UPDATE_THEME,
  UPDATE_DEV_SETTINGS,
  TOGGLE_WEBCHAT,
  SET_ERROR,
  UPDATE_TYPING,
  UPDATE_HANDOFF,
} from './actions'

import { messagesReducer } from './messages-reducer'

export function webchatReducer(state, action) {
  switch (action.type) {
    case UPDATE_WEBVIEW:
      return { ...state, ...action.payload }
    case UPDATE_SESSION:
      return { ...state, session: { ...action.payload } }
    case UPDATE_USER:
      return { ...state, user: { ...action.payload } }
    case UPDATE_TYPING:
      return { ...state, typing: action.payload }
    case UPDATE_THEME:
      return { ...state, theme: { ...action.payload } }
    case UPDATE_HANDOFF:
      return { ...state, handoff: action.payload }
    case TOGGLE_WEBCHAT:
      return { ...state, isWebchatOpen: action.payload }
    case SET_ERROR:
      return { ...state, error: action.payload || {} }
    case UPDATE_DEV_SETTINGS:
      return { ...state, devSettings: { ...action.payload } }
    case UPDATE_LATEST_INPUT:
      return { ...state, latestInput: action.payload }
    case UPDATE_LAST_ROUTE_PATH:
      return { ...state, lastRoutePath: action.payload }
    default:
      return messagesReducer(state, action)
  }
}
