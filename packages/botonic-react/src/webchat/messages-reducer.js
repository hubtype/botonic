import {
  ADD_MESSAGE,
  ADD_MESSAGE_COMPONENT,
  CLEAR_MESSAGES,
  UPDATE_LAST_MESSAGE_DATE,
  UPDATE_MESSAGE,
  UPDATE_REPLIES,
} from './actions'

const getMsgComponentId = m => {
  if (m.props.id) return m.props.id
  if (m.props.value) return m.props.value.input && m.props.value.input.id
  return undefined
}

export const messagesReducer = (state, action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return addMessageReducer(state, action)
    case ADD_MESSAGE_COMPONENT:
      if (
        state.messagesComponents &&
        state.messagesComponents.find(
          m => getMsgComponentId(m) === action.payload.id
        )
      )
        return state
      return {
        ...state,
        messagesComponents: [
          ...(state.messagesComponents || []),
          action.payload,
        ],
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
  if (msgIndex > -1) {
    const msgComponent = state.messagesComponents[msgIndex]
    let updatedMessageComponents = {}
    if (msgComponent) {
      const updatedMsgComponent = {
        ...msgComponent,
        ...{
          props: { ...msgComponent.props, ack: action.payload.ack },
        },
      }
      updatedMessageComponents = {
        messagesComponents: [
          ...state.messagesComponents.slice(0, msgIndex),
          { ...updatedMsgComponent },
          ...state.messagesComponents.slice(msgIndex + 1),
        ],
      }
    }
    return {
      ...state,
      messagesJSON: [
        ...state.messagesJSON.slice(0, msgIndex),
        { ...action.payload },
        ...state.messagesJSON.slice(msgIndex + 1),
      ],
      ...updatedMessageComponents,
    }
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
    messagesJSON: [...(state.messagesJSON || []), action.payload],
  }
}
