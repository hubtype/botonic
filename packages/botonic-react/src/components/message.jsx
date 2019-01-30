import React from 'react'

import { isBrowser, isNode } from '@botonic/core'
import { WebchatContext } from '../contexts'
import { Button } from './button'
import { Reply } from './reply'

export class Message extends React.Component {
    static contextType = WebchatContext
    static defaultProps = {
        type: '',
        from: 'bot'
    }

    state = {
        isDelaying: false,
        isTyping: false,
        delay: 0,
        typing: 0
    }

    setReplies() {
        let replies = React.Children.toArray(this.props.children).filter(
            e => e.type === Reply
        )
        this.context.setReplies(replies)
    }

    componentDidMount() {
        
        let delay = Number(this.props.delay) // TODO: this.context.defaultDelay
        let typing = Number(this.props.typing) // TODO: this.context.defaultTyping
        if(delay > 0)
            this.startDelay(delay, typing)
        else if(typing > 0)
            this.startTyping(typing)
        else
            this.setReplies()
    }

    startDelay(delay, typing) {
        this.setState({...this.state, isDelaying: true})
        setTimeout(() => {
            if(typing > 0) {
                this.startTyping(typing)
            } else {
                this.setReplies()
                this.setState({...this.state, isDelaying: false})
            }
        }, delay * 1000)
    }

    startTyping(typing) {
        this.setState({...this.state, isDelaying: false, isTyping: true})
        setTimeout(() => {
            this.setState({
                ...this.state, 
                isTyping: false
            })
            this.setReplies()
        }, typing * 1000)
    }

    isFromUser() {
        return this.props.from === 'user'
    }

    isFromBot() {
        return this.props.from === 'bot'
    }

    getBgColor() {
        return this.isFromUser() ? '#0384FF' : '#F1F0F0'
    }

    render() {
        if (isBrowser()) return this.renderBrowser()
        else if (isNode()) return this.renderNode()
    }

    renderBrowser() {
        //if(this.state.isDelaying)
        //    return <></>
        const buttons = React.Children.toArray(this.props.children).filter(
            e => e.type === Button
        )
        let textChildren = React.Children.toArray(this.props.children).filter(
            e => ![Button, Reply].includes(e.type)
        )
        //if(this.state.isTyping)
        //    textChildren = 'typing...'
        let pointerSize = 6
        let pointerStyles = {
            position: 'absolute',
            top: '50%',
            width: 0,
            height: 0,
            border: `${pointerSize}px solid transparent`,
            marginTop: -pointerSize
        }
        return (
            <div style={{
                position: 'relative',
                alignSelf: this.isFromUser() ? 'flex-end' : 'flex-start',
                margin: 8,
                maxWidth: '60%',
                backgroundColor: this.getBgColor(),
                color: this.isFromUser() ? '#fff' : '#000',
                fontFamily: 'Arial, Helvetica, sans-serif',
                borderRadius: 8
            }} {...this.props} >
                <div style={{
                    padding: '8px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    whiteSpace: "pre-line"
                }} >
                    {textChildren}
                </div>
                {buttons}
                {this.isFromUser() && (
                    <div style={{
                        ...pointerStyles,
                        right: 0,
                        borderRight: 0,
                        borderLeftColor: this.getBgColor(),
                        marginRight: -pointerSize
                    }} />
                )}
                {this.isFromBot() && (
                    <div style={{
                        ...pointerStyles,
                        left: 0,
                        borderLeft: 0,
                        borderRightColor: this.getBgColor(),
                        marginLeft: -pointerSize
                    }} />
                )}
            </div>
        )
    }

    renderNode() {
        return (
            <message {...this.props}>
                {this.props.children}
            </message>
        )
    }
}

/*
var styles = cssInJS({
    button: {
      padding: 5,
      backgroundColor: "blue"
    }
  });*/