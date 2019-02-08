import React from 'react'
import { Message} from './message'
import { isBrowser, isNode } from '@botonic/core'


export class Template extends React.Component {
    // name, namespace and parameters []
    render() {
        if (isBrowser()) return this.renderBrowser()
        else if (isNode()) return this.renderNode()
    }

    renderBrowser() {
        var params = ""
        for (var param in this.props.parameters) {
            params = params + " '" + this.props.parameters[param] + "', "
        }
        // Return a dummy message for browser
        return (
            <Message {...this.props} type="text">Template {this.props.name} would be send to the user with parameters:"{params} and namespace {this.props.namespace}</Message>
        )
    }

    renderNode(){
        var params = ""
        for (var param in this.props.parameters) {
            params = params + ", " + this.props.parameters[param]
        }
        return(
            <Message {...this.props} type="text">&[Fallback text]({this.props.namespace}, {this.props.name}{params})</Message>
        )
    }
}