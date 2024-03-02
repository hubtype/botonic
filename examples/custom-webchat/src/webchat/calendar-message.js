import { customMessage, WebchatContext } from '@botonic/react'
import React from 'react'
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
  component: CalendarMessage,
})
