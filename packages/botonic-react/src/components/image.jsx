import React from 'react'

import { Message } from './message'
import { isBrowser } from '@botonic/core'

export class Image extends React.Component {

    render() {
        let content = ''
        if (isBrowser())
            content = <img style={{
                borderRadius: '8px',
                maxWidth: '150px',
                maxHeight: '150px',
                margin: '10px'
            }}
            src={this.props.src} />
        return (<Message {...this.props} type="image">{content}</Message>)
    }
}
