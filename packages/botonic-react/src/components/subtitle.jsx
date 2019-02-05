import React from 'react'

import { isBrowser, isNode } from '@botonic/core'

export class Subtitle extends React.Component {

    render() {
        if (isBrowser()) return this.renderBrowser()
        else if (isNode()) return this.renderNode()
    }

    renderBrowser() {
        return (
            <div
                style={{ padding: '6px'}}
            >
                {this.props.children}
            </div>
        )
    }

    renderNode(){
        return <desc>{this.props.children}</desc>
    }
}
