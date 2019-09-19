import React from 'react'
import { customMessage, WebchatContext } from '@botonic/react'
import Calendar from 'react-calendar'

class MyCalendarMessage extends React.Component {
  static contextType = WebchatContext
  render() {
    return (
      <>
        <Calendar
          onChange={date => this.context.sendText(date.toISOString())}
        />
        {this.props.children}
      </>
    )
  }
}

export default customMessage({
  name: 'myCalendarMessage',
  component: MyCalendarMessage
})
