import React from 'react'
import CalendarMessage from '../webchat/calendar'

export default class extends React.Component {
  render() {
    return (
      <CalendarMessage>
        ☝ Please, select the date for your reservation
      </CalendarMessage>
    )
  }
}
