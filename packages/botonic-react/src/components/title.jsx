import React from 'react'

import { isBrowser, isNode } from '@botonic/core'

export class Title extends React.Component {

    render() {
        if (isBrowser()) return this.renderBrowser()
        else if (isNode()) return this.renderNode()
    }

    renderBrowser() {
        return (
            <div
                style={{ padding: '6px', fontWeight: 'bold' }}
            >
                {this.props.children}
            </div>
        )
    }

    renderNode(){
        return <title>{this.props.children}</title>
    }
}
