import React from 'react'

import { isBrowser, isNode } from '@botonic/core'
import { WebchatContext } from '../contexts'

export class Reply extends React.Component {
    static contextType = WebchatContext

    handleClick(event) {
        event.preventDefault()
        if (this.props.children) {
            let payload = this.props.payload
            if (this.props.path) payload = `__PATH_PAYLOAD__${this.props.path}`
            this.context.sendText(this.props.children, payload)
        }
    }

    render() {
        if (isBrowser()) return this.renderBrowser()
        else if (isNode()) return this.renderNode()
    }

    renderBrowser() {
        if (this.context.theme.customReply) {
            let CustomReply = this.context.theme.customReply
            return (
                <div onClick={e => this.handleClick(e)}>
                    <CustomReply>{this.props.children}</CustomReply>
                </div>
            )
        }
        return (
            <button
                style={{
                    width: '100%',
                    padding: '4px 8px',
                    border: `1px solid ${this.context.theme.brandColor}`,
                    color: this.context.theme.brandColor,
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
        if (this.props.path) {
            let payload = `__PATH_PAYLOAD__${this.props.path}`
            return <reply payload={payload}>{this.props.children}</reply>
        }
        return <reply payload={this.props.payload}>{this.props.children}</reply>
    }
}
