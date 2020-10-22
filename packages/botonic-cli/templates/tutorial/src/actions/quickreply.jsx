import React from 'react'
import { Text, Reply } from '@botonic/react'

export default class extends React.Component {
  render() {
    return (
      <>
        <Text>
          Quick replies appear as temparal buttons that hint options to the
          users, so they can continue the conversation easily without having to
          type text. They also have a payload associated. Check out how they
          work here:
          https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies
          or here: https://core.telegram.org/bots#keyboards
        </Text>
        <Text>
          Aren't they cool?
          <Reply payload="yes">Absolutely</Reply>
          <Reply payload="no">Meh..</Reply>
        </Text>
      </>
    )
  }
}
