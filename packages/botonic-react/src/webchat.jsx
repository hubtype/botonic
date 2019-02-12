import React from 'react'
import Textarea from 'react-textarea-autosize'
import { params2queryString } from '@botonic/core'

import Logo from './assets/botonic_react_logo100x100.png'
import { WebchatContext, RequestContext } from './contexts'
import { Text } from './components/text'
import { Handoff } from './components/handoff'

class WebchatHeader extends React.Component {
    static contextType = WebchatContext

    render() {
        if (this.props.theme.customHeader) {
            let CustomHeader = this.props.theme.customHeader
            return <CustomHeader />
        }
        let image = (
            <img
                style={{
                    height: 24,
                    margin: '0px 12px'
                }}
                src={this.context.getStaticAssetsUrl + Logo}
            />
        )
        if (this.props.theme && this.props.theme.brandIconUrl) {
            image = (
                <img
                    style={{
                        height: 24,
                        margin: '0px 12px'
                    }}
                    src={
                        this.context.getStaticAssetsUrl +
                        this.props.theme.brandIconUrl
                    }
                />
            )
        }
        let title = this.props.theme ? this.props.theme.title : 'Botonic'
        return (
            <div
                style={{
                    ...(this.props.style || {}),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    backgroundColor: '#b0c4de',
                    color: '#295179'
                }}
            >
                {image}
                <h4
                    style={{
                        margin: 0,
                        fontFamily: 'Arial, Helvetica, sans-serif'
                    }}
                >
                    {title}
                </h4>
            </div>
        )
    }
}

class WebchatMessageList extends React.Component {
    constructor() {
        super()
        this.scrollToBottom = this.scrollToBottom.bind(this)
    }

    messagesEnd = React.createRef()

    componentDidUpdate() {
        this.scrollToBottom()
    }

    scrollToBottom = () => {
        this.messagesEnd.current.scrollIntoView({ behavior: 'smooth' })
    }

    render() {
        return (
            <div
                id="message-list"
                style={{
                    ...(this.props.style || {}),
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto'
                }}
            >
                {this.props.messages.map((e, i) => (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 'none',
                            whiteSpace: 'pre',
                            wordWrap: 'break-word'
                        }}
                        key={i}
                    >
                        {e}
                    </div>
                ))}
                <div ref={this.messagesEnd} />
            </div>
        )
    }
}

class WebchatReplies extends React.Component {
    render() {
        return (
            <div
                style={{
                    ...(this.props.style || {}),
                    overflowX: 'auto',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    paddingBottom: 10,
                    marginLeft: 5,
                    marginRight: 5
                }}
            >
                {this.props.replies.map((r, i) => (
                    <div key={i} style={{ display: 'inline-block', margin: 3 }}>
                        {r}
                    </div>
                ))}
            </div>
        )
    }
}

class WebviewContainer extends React.Component {
    static contextType = WebchatContext

    render() {
        let Webview = this.props.webview
        let WebviewHeader = props => (
            <div
                style={{
                    textAlign: 'right',
                    backgroundColor: '#f4f4f4',
                    borderTop: '1px solid rgba(0, 0, 0, 0.2)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.2)'
                }}
            >
                <div
                    style={{
                        display: 'inline-block',
                        padding: '8px 12px',
                        cursor: 'pointer'
                    }}
                    onClick={() => this.context.closeWebview()}
                >
                    ✕
                </div>
            </div>
        )
        return (
            <div style={{ ...this.props.style }}>
                <div
                    style={{
                        ...(this.props.style || {}),
                        position: 'absolute',
                        display: 'flex',
                        flexDirection: 'column',
                        bottom: 0,
                        width: '100%',
                        height: '80%',
                        backgroundColor: '#fff'
                    }}
                >
                    <WebviewHeader style={{ flex: 'none' }} />
                    <div
                        style={{
                            flex: 1,
                            overflow: 'auto'
                        }}
                    >
                        <Webview />
                    </div>
                </div>
            </div>
        )
    }
}

export class Webchat extends React.Component {
    state = {
        width: 300,
        height: 450,
        messages: [],
        replies: [],
        webview: null,
        webviewParams: null,
        session: {
            last_session: {},
            user: {
                id: '000001',
                username: 'John',
                name: 'Doe',
                provider: 'terminal',
                provider_id: '0000000',
                extra_data: {}
            },
            organization: '',
            bot: {
                id: '0000000',
                name: 'botName'
            }
        },
        lastRoutePath: null,
        handoff: false
    }

    defaultWebchat = {
        brandColor: '#0099ff',
        textPlaceholder: 'Ask me something...',
        title: 'Botonic'
    }

    setReplies(replies) {
        this.setState({ ...this.state, replies })
    }

    openWebview(webviewComponent, params) {
        this.setState({
            ...this.state,
            webview: webviewComponent,
            webviewParams: params || {}
        })
    }

    closeWebview(options) {
        this.setState({ ...this.state, webview: null })
        this.textarea.focus()
        if (options && options.payload) {
            this.sendPayload(options.payload)
        } else if (options && options.path) {
            let params = ''
            if (options.params) params = params2queryString(options.params)
            this.sendPayload(`__PATH_PAYLOAD__${options.path}?${params}`)
        }
    }

    async sendInput(input) {
        let messages = this.state.messages
        let inputMessage = null
        if (input.type === 'text')
            inputMessage = (
                <Text from="user" payload={input.payload}>
                    {input.data}
                </Text>
            )
        if (inputMessage) {
            messages = [...messages, inputMessage]
            this.setState({ ...this.state, messages, replies: [] })
        }
        let output = await this.props.botonicApp.input({
            input,
            session: this.state.session,
            lastRoutePath: this.state.lastRoutePath
        })

        let action = output.session._botonic_action || ''
        let handoff = action.startsWith('create_case')
        messages = [...messages, output.response]
        if (handoff) messages = [...messages, <Handoff />]
        this.setState({
            ...this.state,
            messages,
            handoff: handoff,
            replies: [],
            session: output.session,
            lastRoutePath: output.lastRoutePath
        })
    }

    resolveCase() {
        let action = this.state.session._botonic_action.split(':')
        this.setState(
            {
                ...this.state,
                session: {
                    ...this.state.session,
                    _botonic_action: null
                },
                handoff: false
            },
            () => this.sendPayload(action[action.length - 1])
        )
    }

    async sendText(text, payload) {
        if (!text) return
        let input = { type: 'text', data: text, payload }
        await this.sendInput(input)
    }

    async sendPayload(payload) {
        if (!payload) return
        let input = { type: 'postback', payload }
        await this.sendInput(input)
    }

    onKeyDown(event) {
        if (event.keyCode == 13 && event.shiftKey == false) {
            event.preventDefault()
            this.sendText(this.textarea.value)
            this.textarea.value = ''
        }
    }

    render() {
        var scriptBaseUrl = document
            .querySelector('script[src$="webchat.botonic.js"]')
            .getAttribute('src')
        var scriptName = scriptBaseUrl.split('/').pop()
        scriptBaseUrl = scriptBaseUrl.replace('/' + scriptName, '/')
        let webchatContext = {
            sendText: this.sendText.bind(this),
            sendPayload: this.sendPayload.bind(this),
            setReplies: this.setReplies.bind(this),
            openWebview: this.openWebview.bind(this),
            closeWebview: this.closeWebview.bind(this),
            resolveCase: this.resolveCase.bind(this),
            getStaticAssetsUrl: scriptBaseUrl,
            theme: { ...this.defaultWebchat, ...this.props.theme }
        }

        let webviewRequestContext = {
            getString: stringId =>
                this.props.botonicApp.getString(stringId, this.state.session),
            setLocale: locale =>
                this.props.botonicApp.setLocale(locale, this.state.session),
            session: this.state.session || {},
            params: this.state.webviewParams || {},
            closeWebview: this.closeWebview.bind(this)
        }
        return (
            <WebchatContext.Provider value={webchatContext}>
                <div
                    style={{
                        position: 'relative',
                        width: this.state.width,
                        height: this.state.height,
                        margin: 'auto',
                        backgroundColor: 'white',
                        border: '1px solid rgba(0, 0, 0, 0.4)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <WebchatHeader
                        theme={webchatContext.theme}
                        style={{ height: 36, flex: 'none' }}
                    />
                    <WebchatMessageList
                        style={{ flex: 1 }}
                        messages={this.state.messages}
                    />
                    {this.state.replies && (
                        <WebchatReplies replies={this.state.replies} />
                    )}
                    {!this.state.handoff && (
                        <Textarea
                            name="text"
                            minRows={2}
                            maxRows={4}
                            wrap="soft"
                            maxLength="1000"
                            placeholder={webchatContext.theme.textPlaceholder}
                            autoFocus={location.hostname === 'localhost'}
                            inputRef={tag => (this.textarea = tag)}
                            onKeyDown={e => this.onKeyDown(e)}
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
                    {this.state.webview && (
                        <RequestContext.Provider value={webviewRequestContext}>
                            <WebviewContainer
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                                }}
                                webview={this.state.webview}
                            />
                        </RequestContext.Provider>
                    )}
                </div>
            </WebchatContext.Provider>
        )
    }
}
