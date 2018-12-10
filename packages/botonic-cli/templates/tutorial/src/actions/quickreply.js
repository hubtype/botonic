import React from 'react'

export default class extends React.Component {
  render() {
    return (
      <messages>
        <message type='text'>
          Quick replies appear as temparal buttons that hint options to the
          users, so they can continue the conversation easily without having to
          type text. They also have a payload associated. Check out how they
          work here:
          https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies
          or here: https://core.telegram.org/bots#keyboards
        </message>
        <message type='text'>
          Aren't they cool?
          <reply payload='yes'>Absolutely</reply>
          <reply payload='no'>Meh..</reply>
        </message>
      </messages>
    )
  }
}
