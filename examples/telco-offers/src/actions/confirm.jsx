import React from 'react'
import { RequestContext, Text, WebchatSettings } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext

  render() {
    let _ = this.context.getString
    return (
      <>
        <Text> {_('confirm.text')}</Text>
        <WebchatSettings
          theme={{
            userInput: {
              enable: true,
              box: {
                style: {
                  background: '#F5F5F5',
                },
              },
            },
          }}
        />
      </>
    )
  }
}
