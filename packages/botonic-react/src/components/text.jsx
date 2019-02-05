import React from 'react'
import { Message } from './message'


export class Text extends React.Component {
    render() {
        return (
            <Message {...this.props} type="text">{this.props.children}</Message>
        )
    }
}