import {
  ADD_MESSAGE,
  ADD_MESSAGE_COMPONENT,
  UPDATE_MESSAGE,
  UPDATE_REPLIES,
  UPDATE_LATEST_INPUT,
  UPDATE_TYPING,
  UPDATE_WEBVIEW,
  UPDATE_SESSION,
  UPDATE_USER,
  UPDATE_LAST_ROUTE_PATH,
  UPDATE_HANDOFF,
  UPDATE_THEME,
  UPDATE_DEV_SETTINGS,
  TOGGLE_WEBCHAT,
  SET_ERROR,
  CLEAR_MESSAGES,
  UPDATE_LAST_MESSAGE_DATE,
} from './actions'

export function webchatReducer(state, action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return addMessageReducer(state, action)
    case ADD_MESSAGE_COMPONENT:
      return {
        ...state,
        messagesComponents: [...state.messagesComponents, action.payload],
      }
    case UPDATE_MESSAGE:
      return updateMessageReducer(state, action)
    case UPDATE_REPLIES:
      return { ...state, replies: action.payload }
    case UPDATE_LATEST_INPUT:
      return { ...state, latestInput: action.payload }
    case UPDATE_TYPING:
      return { ...state, typing: action.payload }
    case UPDATE_WEBVIEW:
      return { ...state, ...action.payload }
    case UPDATE_SESSION:
      return { ...state, session: { ...action.payload } }
    case UPDATE_USER:
      return { ...state, user: { ...action.payload } }
    case UPDATE_LAST_ROUTE_PATH:
      return { ...state, lastRoutePath: action.payload }
    case UPDATE_HANDOFF:
      return { ...state, handoff: action.payload }
    case UPDATE_THEME:
      return { ...state, theme: { ...action.payload } }
    case UPDATE_DEV_SETTINGS:
      return { ...state, devSettings: { ...action.payload } }
    case TOGGLE_WEBCHAT:
      return { ...state, isWebchatOpen: action.payload }
    case SET_ERROR:
      return { ...state, error: action.payload || {} }
    case CLEAR_MESSAGES:
      return {
        ...state,
        messagesJSON: [],
        messagesComponents: [],
      }
    case UPDATE_LAST_MESSAGE_DATE:
      return {
        ...state,
        lastMessageUpdate: action.payload,
      }
    default:
      throw new Error()
  }
}

function updateMessageReducer(state, action) {
  const msgIndex = state.messagesJSON.map(m => m.id).indexOf(action.payload.id)
  if (msgIndex > -1)
    return {
      ...state,
      messagesJSON: [
        ...state.messagesJSON.slice(0, msgIndex),
        { ...action.payload },
        ...state.messagesJSON.slice(msgIndex + 1),
      ],
    }
  return state
}

function addMessageReducer(state, action) {
  if (
    state.messagesJSON &&
    state.messagesJSON.find(m => m.id === action.payload.id)
  )
    return state
  return {
    ...state,
    messagesJSON: [...(state.messagesJSON || []), { ...action.payload }],
  }
}
