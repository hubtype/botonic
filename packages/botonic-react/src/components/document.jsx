import React from 'react'

import { Message } from './message'
import { isBrowser } from '@botonic/core'

export class Document extends React.Component {
    render() {
        let content = ''
        if (isBrowser())
            content = <embed style={{
                borderRadius: '8px',
                height: '300px',
                margin: '10px'
            }}
            src={this.props.src} />
        return (<Message {...this.props} type="document">{content}</Message>)
    }
}
