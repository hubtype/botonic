import React from 'react'

import { Message } from './message'
import { isBrowser } from '@botonic/core'

export class Audio extends React.Component {
    render() {
        let content = ''
        if (isBrowser())
            content = (
                <audio style={{ maxWidth: '100%' }} id="myAudio" controls>
                    <source src={this.props.src} type="audio/mpeg" />
                    Your browser does not support this audio format.
                </audio>
            )
        return (<Message {...this.props} type="video">{content}</Message>)
    }
}
