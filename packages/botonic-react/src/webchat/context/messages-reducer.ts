import merge from 'lodash.merge'

import { SENDERS } from '../../index-types'
import { isCustom } from '../../message-utils'
import { WebchatAction } from './actions'
import { WebchatState } from './types'

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
    case WebchatAction.UPDATE_CUSTOM_MESSAGE_PROPS:
      return updateCustomMessagePropsReducer(state, action)
    case WebchatAction.UPDATE_REPLIES:
      return { ...state, replies: action.payload }
    case WebchatAction.REMOVE_REPLIES:
      return { ...state, replies: undefined }
    case WebchatAction.CLEAR_MESSAGES:
      return {
        ...state,
        messagesJSON: [],
        messagesComponents: [],
        numUnreadMessages: 0,
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
    messageComponent.props?.sentBy !== SENDERS.user

  const numUnreadMessages = isUnreadMessage
    ? state.numUnreadMessages + 1
    : state.numUnreadMessages

  return {
    ...state,
    messagesComponents: [...(state.messagesComponents || []), messageComponent],
    numUnreadMessages,
  }
}

function resetUnreadMessages(state: WebchatState) {
  const messagesComponents = state.messagesComponents.map(messageComponent => {
    if (messageComponent.props.isUnread) {
      messageComponent = {
        ...messageComponent,
        props: { ...messageComponent.props, isUnread: false },
      }
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
    numUnreadMessages: 0,
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

      if (isCustom(action.payload)) {
        // If the message is a custom message, update the json property to update props.
        // If user close and open the chat the message will render again with the new props.
        updatedMsgComponent.props.json = action.payload.data.json
      }

      updatedMessageComponents = {
        messagesComponents: [
          ...state.messagesComponents.slice(0, msgIndex),
          { ...updatedMsgComponent },
          ...state.messagesComponents.slice(msgIndex + 1),
        ],
      }
    }

    const numUnreadMessages = state.messagesComponents.filter(
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
      numUnreadMessages,
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

function updateCustomMessagePropsReducer(
  state: WebchatState,
  action: { type: WebchatAction; payload?: any }
) {
  const { messageId, props } = action.payload

  // Similar to updateMessageReducer but only for custom messages
  const msgIndex = state.messagesJSON.map(m => m.id).indexOf(messageId)
  if (msgIndex > -1) {
    const msgComponent = state.messagesComponents[msgIndex]
    let updatedMessageComponents = {}
    let updatedMessagesJSON = {}
    if (msgComponent) {
      const updatedMsgComponent = {
        ...msgComponent,
        ...{
          props: { ...msgComponent.props, ack: action.payload.ack, ...props },
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

    const messageJSON = state.messagesJSON.find(m => m.id === messageId)
    if (messageJSON) {
      messageJSON.data = {
        ...messageJSON.data,
        ...props,
      }

      updatedMessagesJSON = {
        messagesJSON: [
          ...state.messagesJSON.slice(0, msgIndex),
          { ...messageJSON },
          ...state.messagesJSON.slice(msgIndex + 1),
        ],
      }
    }

    return {
      ...state,
      ...updatedMessagesJSON,
      ...updatedMessageComponents,
    }
  }

  return state
}
