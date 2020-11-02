---
id: message
title: Custom Message
---

The `Custom Message` component is used to customize a message in Webchat: you can create a star rating message, a login text input message, etc.


## Properties

| Property | Type   | Description           | Required | Default value |
|----------|--------|-----------------------|----------|---------------|
| children | String | Show a custom message | Yes      | -             |
         
## Example

```javascript
import React from 'react'
import { WebchatContext, customMessage } from '@botonic/react'
import Calendar from 'react-calendar'

class CalendarMessage extends React.Component {
  static contextType = WebchatContext

  render() {
    return (
      <>
        <Calendar
          onChange={date =>
            this.context.sendText(`Booked for ${date.toLocaleDateString()}`)
          }
        />
        <p>{this.props.children}</p>
      </>
    )
  }
}

export default customMessage({
  name: 'calendar',
  component: CalendarMessage
})
```