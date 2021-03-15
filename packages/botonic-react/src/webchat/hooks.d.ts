import {
  ADD_MESSAGE,
  ADD_MESSAGE_COMPONENT, CLEAR_MESSAGES, SET_CURRENT_ATTACHMENT, SET_ERROR, TOGGLE_COVER_COMPONENT,
  TOGGLE_EMOJI_PICKER, TOGGLE_PERSISTENT_MENU,
  TOGGLE_WEBCHAT,
  UPDATE_DEV_SETTINGS,
  UPDATE_HANDOFF, UPDATE_LAST_MESSAGE_DATE,
  UPDATE_LAST_ROUTE_PATH,
  UPDATE_LATEST_INPUT,
  UPDATE_MESSAGE,
  UPDATE_REPLIES,
  UPDATE_SESSION,
  UPDATE_THEME,
  UPDATE_TYPING,
  UPDATE_WEBVIEW,
} from './actions'

export interface WebchatAction {
  type: string
  payload: any
}

export type WebchatDispatch = (WebchatAction) => void

export interface WebchatReducer {
  addMessage = message =>
  // webchatDispatch({ type: ADD_MESSAGE, payload: message })
  // const addMessageComponent = message =>
  // webchatDispatch({ type: ADD_MESSAGE_COMPONENT, payload: message })
  // const updateMessage = message =>
  // webchatDispatch({ type: UPDATE_MESSAGE, payload: message })
  // const updateReplies = replies =>
  // webchatDispatch({ type: UPDATE_REPLIES, payload: replies })
  // const updateLatestInput = input =>
  // webchatDispatch({ type: UPDATE_LATEST_INPUT, payload: input })
  // const updateTyping = typing =>
  // webchatDispatch({ type: UPDATE_TYPING, payload: typing })
  // const updateWebview = (webview, params) =>
  // webchatDispatch({
  //                   type: UPDATE_WEBVIEW,
  //                   payload: { webview, webviewParams: params },
  //                 })
  // const updateSession = session => {
  // webchatDispatch({
  //                   type: UPDATE_SESSION,
  //                   payload: session,
  //                 })
}

const updateLastRoutePath = path =>
  webchatDispatch({
    type: UPDATE_LAST_ROUTE_PATH,
    payload: path,
  })
const updateHandoff = handoff =>
  webchatDispatch({
    type: UPDATE_HANDOFF,
    payload: handoff,
  })
const updateTheme = (theme, themeUpdates = undefined) => {
  const payload =
    themeUpdates !== undefined ? { theme, themeUpdates } : { theme }
  webchatDispatch({
    type: UPDATE_THEME,
    payload,
  })
}
const updateDevSettings = settings =>
  webchatDispatch({
    type: UPDATE_DEV_SETTINGS,
    payload: settings,
  })
const toggleWebchat = toggle =>
  webchatDispatch({
    type: TOGGLE_WEBCHAT,
    payload: toggle,
  })
const toggleEmojiPicker = toggle =>
  webchatDispatch({
    type: TOGGLE_EMOJI_PICKER,
    payload: toggle,
  })
const togglePersistentMenu = toggle =>
  webchatDispatch({
    type: TOGGLE_PERSISTENT_MENU,
    payload: toggle,
  })
const toggleCoverComponent = toggle =>
  webchatDispatch({
    type: TOGGLE_COVER_COMPONENT,
    payload: toggle,
  })
const setError = error =>
  webchatDispatch({
    type: SET_ERROR,
    payload: error,
  })

const clearMessages = () => {
  webchatDispatch({
    type: CLEAR_MESSAGES,
  })
}
const updateLastMessageDate = date => {
  webchatDispatch({
    type: UPDATE_LAST_MESSAGE_DATE,
    payload: date,
  })
}
const setCurrentAttachment = attachment => {
  webchatDispatch({
    type: SET_CURRENT_ATTACHMENT,
    payload: attachment,
  })
}

}
