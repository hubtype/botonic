import {
  ADD_MESSAGE,
  ADD_MESSAGE_COMPONENT,
  UPDATE_MESSAGE,
  UPDATE_REPLIES,
  CLEAR_MESSAGES,
  UPDATE_LAST_MESSAGE_DATE,
} from './actions'

export const messagesReducer = (state, action) => {
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
