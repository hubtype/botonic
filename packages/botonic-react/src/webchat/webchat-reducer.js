export function webchatReducer(state, action) {
  switch (action.type) {
    case 'addMessage':
      if (
        state.messagesJSON &&
        state.messagesJSON.find(m => m.id === action.payload.id)
      )
        return state
      return {
        ...state,
        messagesJSON: [...(state.messagesJSON || []), { ...action.payload }],
      }
    case 'addMessageComponent':
      return {
        ...state,
        messagesComponents: [...state.messagesComponents, action.payload],
      }
    case 'updateMessage':
      const msgIndex = state.messagesJSON
        .map(m => m.id)
        .indexOf(action.payload.id)
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
    case 'updateReplies':
      return { ...state, replies: action.payload }
    case 'updateLatestInput':
      return { ...state, latestInput: action.payload }
    case 'updateTyping':
      return { ...state, typing: action.payload }
    case 'updateWebview':
      return { ...state, ...action.payload }
    case 'updateSession':
      return { ...state, session: { ...action.payload } }
    case 'updateUser':
      return { ...state, user: { ...action.payload } }
    case 'updateLastRoutePath':
      return { ...state, lastRoutePath: action.payload }
    case 'updateHandoff':
      return { ...state, handoff: action.payload }
    case 'updateTheme':
      return { ...state, theme: { ...action.payload } }
    case 'updateDevSettings':
      return { ...state, devSettings: { ...action.payload } }
    case 'toggleWebchat':
      return { ...state, isWebchatOpen: action.payload }
    case 'setError':
      return { ...state, error: action.payload || {} }
    case 'clearMessages':
      return {
        ...state,
        messagesJSON: [],
        messagesComponents: [],
      }
    default:
      throw new Error()
  }
}
