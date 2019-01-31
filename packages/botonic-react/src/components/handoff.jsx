import React from 'react'
import { WebchatContext } from '../contexts'

export class Handoff extends React.Component {
    static contextType = WebchatContext
    state = {
        showContinue: true
    }

    continueClick() {
        this.setState({showContinue: false})
        this.context.resolveCase()
    }

    render() {
        let bgColor = this.state.showContinue ? '#c6e7c0' : '#d1d8cf'
        let fontColor = this.state.showContinue ? '#3a9c35' : '#5f735e'
        return (
            <div style={{
                display: 'flex',
                color: fontColor,
                fontFamily: 'Arial, Helvetica, sans-serif',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 24,
                backgroundColor: bgColor
            }}>
                {this.state.showContinue ?
                    <div style={{textAlign: 'center'}}>
                        Conversation transferred to a human agent...
                    </div>
                :
                    <div style={{textAlign: 'center'}}>
                        Human handoff ended
                    </div>
                }
                {this.state.showContinue &&
                    <button style={{
                        padding: '12px 24px',
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: 4,
                        marginTop: 8,
                        cursor: 'pointer'
                    }}
                        onClick={() => this.continueClick()}
                    >
                        Continue
                    </button>
                }
            </div>
        )
    }
}
