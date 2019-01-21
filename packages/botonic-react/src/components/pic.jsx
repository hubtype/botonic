import React from 'react'

import { isBrowser, isNode } from '@botonic/core'

export class Pic extends React.Component {
    render() {
        if (isBrowser()) return this.renderBrowser()
        else if (isNode()) return this.renderNode()
    }

    renderBrowser() {
        return (
            <img
                style={{
                    borderRadius: '8px',
                    maxWidth: '150px',
                    maxHeight: '150px',
                    margin: '10px'
                }}
                src={this.props.src}
            />
        )
    }

    renderNode() {
        return <pic>{this.props.src}</pic>
    }
}
