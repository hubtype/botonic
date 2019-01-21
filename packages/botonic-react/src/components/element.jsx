import React from 'react'

import { isBrowser, isNode } from '@botonic/core'
import { WebchatContext } from '../contexts'

export class Element extends React.Component {
    static contextType = WebchatContext

    render() {
        if (isBrowser()) return this.renderBrowser()
        else if (isNode()) return this.renderNode()
    }

    renderBrowser() {
        return (
            <div
                style={{
                    marginRight: '6px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '6px'
                }}
            >
                {this.props.children}
            </div>
        )
    }

    renderNode() {
        return <element>{this.props.children}</element>
    }
}
