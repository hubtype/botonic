import React from 'react'

import { Message } from './message'
import { isBrowser } from '@botonic/core'

export class Video extends React.Component {
    render() {
        let content = ''
        if (isBrowser())
            content = (
                <video style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '8px',
                    maxHeight: '180px',
                    maxWidth: '300px',
                    margin: '10px'
                }}
                controls>
                    <source src={this.props.src} />
                </video>
            )
        return (<Message {...this.props} type="video">{content}</Message>)
    }
}
