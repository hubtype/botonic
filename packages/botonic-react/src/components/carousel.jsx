import React from 'react'

import { isBrowser, isNode } from '@botonic/core'
import { WebchatContext } from '../contexts'

export class Carousel extends React.Component {
    static contextType = WebchatContext

    render() {
        if (isBrowser()) return this.renderBrowser()
        else if (isNode()) return this.renderNode()
    }

    renderBrowser() {
        return (
            <div
                style={{
                    paddingTop: '10px',
                    display: 'flex',
                    flexDirection: 'row',
                    overflowX: 'auto',
                    maxWidth: '400px',
                    fontFamily: 'Arial, Helvetica, sans-serif',
                }}
            >
                {this.props.children}
            </div>
        )
    }

    renderNode() {
        return <message type="carousel">{this.props.children}</message>
    }
}
