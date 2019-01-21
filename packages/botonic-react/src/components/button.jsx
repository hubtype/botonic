import React from 'react'

import { isBrowser, isNode, params2queryString } from '@botonic/core'
import { WebchatContext } from '../contexts'

export class Button extends React.Component {
    static contextType = WebchatContext

    handleClick(event) {
        event.preventDefault()
        if (this.props.webview) {
            this.context.openWebview(this.props.webview, this.props.params)
        } else if (this.props.path) {
            this.context.sendPayload(`__PATH_PAYLOAD__${this.props.path}`)
        } else if (this.props.payload) {
            this.context.sendPayload(this.props.payload)
        } else if (this.props.url) {
            window.open(this.props.url)
        }
    }

    render() {
        if (isBrowser()) return this.renderBrowser()
        else if (isNode()) return this.renderNode()
    }

    renderBrowser() {
        return (
            <button
                style={{
                    width: '100%',
                    height: 40,
                    border: '1px solid #F1F0F0',
                    borderRadius: 8,
                    cursor: 'pointer',
                    outline: 0
                }}
                onClick={e => this.handleClick(e)}
            >
                {this.props.children}
            </button>
        )
    }

    renderNode() {
        if (this.props.webview) {
            let Webview = this.props.webview
            let params = params2queryString(this.props.params)
            return (
                <button url={`/webviews/${Webview.name}?${params}`}>
                    {this.props.children}
                </button>
            )
        } else if (this.props.path) {
            let payload = `__PATH_PAYLOAD__${this.props.path}`
            return <button payload={payload}>{this.props.children}</button>
        } else if (this.props.payload) {
            return (
                <button payload={this.props.payload}>
                    {this.props.children}
                </button>
            )
        } else if (this.props.url) {
            return <button url={this.props.url}>{this.props.children}</button>
        }
    }
}
