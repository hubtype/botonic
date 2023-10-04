import { WebchatAction } from './actions'
import { WebchatState } from './index-types'

export const messagesReducer = (
  state: WebchatState,
  action: { type: WebchatAction; payload?: any }
): WebchatState => {
  switch (action.type) {
    case WebchatAction.ADD_MESSAGE:
      return addMessageReducer(state, action)
    case WebchatAction.ADD_MESSAGE_COMPONENT:
      return addMessageComponent(state, action)
    case WebchatAction.UPDATE_MESSAGE:
      return updateMessageReducer(state, action)
    case WebchatAction.UPDATE_REPLIES:
      return { ...state, replies: action.payload }
    case WebchatAction.CLEAR_MESSAGES:
      return {
        ...state,
        messagesJSON: [],
        messagesComponents: [],
        unreadMessages: 0,
      }
    case WebchatAction.UPDATE_LAST_MESSAGE_DATE:
      return {
        ...state,
        lastMessageUpdate: action.payload,
      }
    case WebchatAction.RESET_UNREAD_MESSAGES:
      return resetUnreadMessages(state)
    case WebchatAction.SET_LAST_MESSAGE_VISIBLE:
      return {
        ...state,
        isLastMessageVisible: action.payload,
      }
    default:
      throw new Error()
  }
}

function addMessageComponent(
  state: WebchatState,
  action: { type: WebchatAction; payload?: any }
) {
  const messageComponent = action.payload
  const isUnreadMessage =
    messageComponent.props?.isUnread &&
    messageComponent.props?.sent_by !== 'user'

  const unreadMessages = isUnreadMessage
    ? state.unreadMessages + 1
    : state.unreadMessages

  return {
    ...state,
    messagesComponents: [...(state.messagesComponents || []), messageComponent],
    unreadMessages,
  }
}

function resetUnreadMessages(state: WebchatState) {
  const messagesComponents = state.messagesComponents.map(messageComponent => {
    if (messageComponent.props.isUnread) {
      messageComponent.props.isUnread = false
    }
    return messageComponent
  })
  const messagesJSON = state.messagesJSON.map(messageJSON => {
    if (messageJSON.isUnread) {
      messageJSON.isUnread = false
    }
    return messageJSON
  })
  return {
    ...state,
    messagesComponents,
    messagesJSON,
    unreadMessages: 0,
  }
}

function updateMessageReducer(
  state: WebchatState,
  action: { type: WebchatAction; payload?: any }
) {
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

    const unreadMessages = state.messagesComponents.filter(
      messageComponent => messageComponent.props.isUnread
    ).length

    return {
      ...state,
      messagesJSON: [
        ...state.messagesJSON.slice(0, msgIndex),
        { ...action.payload },
        ...state.messagesJSON.slice(msgIndex + 1),
      ],
      ...updatedMessageComponents,
      unreadMessages,
    }
  }

  return state
}

function addMessageReducer(
  state: WebchatState,
  action: { type: WebchatAction; payload?: any }
) {
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
