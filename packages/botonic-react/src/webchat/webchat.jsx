import React, { useRef, useEffect } from 'react'
import Textarea from 'react-textarea-autosize'
import Pusher from 'pusher-js'
import axios from 'axios'
import { params2queryString } from '@botonic/core'

import { WebchatContext, RequestContext } from '../contexts'
import { Text } from '../components/text'
import { TypingIndicator } from '../components/typingIndicator'
import { Handoff } from '../components/handoff'
import { useWebchat, useTyping, usePrevious } from './hooks'
import { WebchatHeader } from './header'
import { WebchatMessageList } from './messageList'
import { WebchatReplies } from './replies'
import { WebviewContainer } from './webview'
import { isDev, msgToBotonic } from '../utils'

const uuidv1 = require('uuid/v1')

const getScriptBaseURL = () => {
  let scriptBaseURL = document
    .querySelector('script[src$="webchat.botonic.js"]')
    .getAttribute('src')
  let scriptName = scriptBaseURL.split('/').pop()
  return scriptBaseURL.replace('/' + scriptName, '/')
}

const getUserUUID = () => {
  let userId = window.localStorage.getItem('userId')
  if (!userId) {
    userId = uuidv1()
    window.localStorage.setItem('userId', userId)
  }
  return userId
}

export const Webchat = props => {
  const {
    webchatState,
    addMessage,
    addMessageComponent,
    updateMessage,
    updateReplies,
    updateTyping,
    updateWebview,
    updateSession,
    updateLastRoutePath,
    updateHandoff,
    updateTheme,
    updateDevSettings
  } = props.webchatHooks || useWebchat()

  const appId = props.botonicApp.appId
  let pusher
  const pusherUserId = getUserUUID()

  useTyping({ webchatState, updateTyping, updateMessage })

  useEffect(() => {
    try {
      let { messages, session, lastRoutePath, devSettings } = JSON.parse(
        window.localStorage.getItem('botonicState')
      )
      if (!devSettings || devSettings.keepSessionOnReload) {
        if (messages) {
          messages.map(m => {
            let newComponent = msgToBotonic(m)
            if (newComponent) addMessageComponent(newComponent)
          })
        }
        if (session) updateSession(session)
        if (lastRoutePath) updateLastRoutePath(lastRoutePath)
      }
      if (devSettings) updateDevSettings(devSettings)
    } catch (e) {}
    if (appId) {
      pusher = new Pusher('da85029877df0c827e44')
      if (!Object.keys(pusher.channels.channels).length) {
        //TODO: remove my endpoint, generic one with socket
        pusher.subscribe(`public-${appId}-${pusherUserId}`)
        pusher.bind('botonic_response', processNewInput)
      }
    }
  }, [])

  useEffect(() => {
    let reset =
      webchatState.devSettings || webchatState.devSettings.keepSessionOnReload
    window.localStorage.setItem(
      'botonicState',
      JSON.stringify({
        messages: webchatState.messagesJSON,
        session: webchatState.session,
        lastRoutePath: webchatState.lastRoutePath,
        devSettings: webchatState.devSettings
      })
    )
  }, [
    webchatState.messagesJSON,
    webchatState.session,
    webchatState.lastRoutePath,
    webchatState.devSettings
  ])

  useEffect(() => {
    updateTheme({ ...webchatState.theme, ...props.theme })
  }, [props.theme])

  const openWebview = (webviewComponent, params) =>
    updateWebview(webviewComponent, params)

  const processNewInput = data => {
    let newComponent = msgToBotonic(data.message)
    if (newComponent) addMessageComponent(newComponent)
  }

  const postCloudInput = async input => {
    let api_url = 'https://api.hubtype.com/v1'
    return axios.post(
      `${api_url}/provider_accounts/webhooks/webchat/${appId}/`,
      {
        sender: pusherUserId,
        message: input
      }
    )
  }

  const closeWebview = options => {
    updateWebview()
    textArea.current.focus()
    if (options && options.payload) {
      sendPayload(options.payload)
    } else if (options && options.path) {
      let params = ''
      if (options.params) params = params2queryString(options.params)
      sendPayload(`__PATH_PAYLOAD__${options.path}?${params}`)
    }
  }

  const sendInput = async input => {
    let inputMessage = null
    if (input.type === 'text')
      inputMessage = (
        <Text from='user' payload={input.payload}>
          {input.data}
        </Text>
      )
    if (inputMessage) {
      addMessageComponent(inputMessage)
      updateReplies(false)
    }
    if (appId) return postCloudInput(input)
    let output = await props.botonicApp.input({
      input,
      session: webchatState.session,
      lastRoutePath: webchatState.lastRoutePath
    })

    addMessageComponent(output.response)
    updateSession(output.session)
    updateLastRoutePath(output.lastRoutePath)
    let action = output.session._botonic_action || ''
    let handoff = action.startsWith('create_case')
    if (handoff && isDev()) addMessageComponent(<Handoff />)
    updateHandoff(handoff)
  }

  const resolveCase = () => {
    updateHandoff(false)
    updateSession({ ...webchatState.session, _botonic_action: null })
  }

  const prevSession = usePrevious(webchatState.session)
  useEffect(() => {
    // Resume conversation after handoff
    if (
      prevSession &&
      prevSession._botonic_action &&
      !webchatState.session._botonic_action
    ) {
      let action = prevSession._botonic_action.split(':')
      sendPayload(action[action.length - 1])
    }
  }, [webchatState.session._botonic_action])

  const sendText = async (text, payload) => {
    if (!text) return
    let input = { type: 'text', data: text, payload }
    await sendInput(input)
  }

  const sendPayload = async payload => {
    if (!payload) return
    let input = { type: 'postback', payload }
    await sendInput(input)
  }

  const onKeyDown = event => {
    if (event.keyCode == 13 && event.shiftKey == false) {
      event.preventDefault()
      sendText(textArea.current.value)
      textArea.current.value = ''
    }
  }

  let webviewRequestContext = {
    getString: stringId =>
      props.botonicApp.getString(stringId, webchatState.session),
    setLocale: locale =>
      props.botonicApp.setLocale(locale, webchatState.session),
    session: webchatState.session || {},
    params: webchatState.webviewParams || {},
    closeWebview: closeWebview
  }

  const textArea = useRef()
  const staticAssetsUrl = getScriptBaseURL()

  return (
    <WebchatContext.Provider
      value={{
        sendText,
        sendPayload,
        openWebview,
        resolveCase,
        webchatState,
        addMessage,
        updateMessage,
        updateReplies,
        staticAssetsUrl
      }}
    >
      <div
        style={{
          position: 'relative',
          width: webchatState.width,
          height: webchatState.height,
          margin: 'auto',
          backgroundColor: 'white',
          border: '1px solid rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <WebchatHeader style={{ height: 36, flex: 'none' }} />
        <WebchatMessageList
          style={{ flex: 1 }}
          messages={webchatState.messagesComponents}
        >
          {webchatState.typing && <TypingIndicator />}
          <div id='messages-end' />
        </WebchatMessageList>
        {webchatState.replies && (
          <WebchatReplies replies={webchatState.replies} />
        )}
        {!webchatState.handoff && (
          <Textarea
            name='text'
            minRows={2}
            maxRows={4}
            wrap='soft'
            maxLength='1000'
            placeholder={webchatState.theme.textPlaceholder}
            autoFocus={location.hostname === 'localhost'}
            inputRef={textArea}
            onKeyDown={e => onKeyDown(e)}
            style={{
              display: 'flex',
              padding: '8px 10px',
              fontSize: 14,
              border: 'none',
              borderTop: '1px solid rgba(0, 0, 0, 0.4)',
              resize: 'none',
              overflow: 'auto',
              outline: 'none'
            }}
          />
        )}
        {webchatState.webview && (
          <RequestContext.Provider value={webviewRequestContext}>
            <WebviewContainer
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
              }}
              webview={webchatState.webview}
            />
          </RequestContext.Provider>
        )}
      </div>
    </WebchatContext.Provider>
  )
}
