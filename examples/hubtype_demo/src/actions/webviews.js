import React from 'react'
import { Text, Button } from '@botonic/react'
import DatePicker from '../webviews/components/datePicker'
import Location from '../webviews/components/location'
import SendEmail from '../webviews/components/send_email'
import Transfer from '../webviews/components/transfer'
import LoginPage from '../webviews/components/logIn'

export default class extends React.Component {
  render() {
    return (
      <>
        <Text>
          Here I lend you some options of how helpful the use of webviews could
          be.
          <Button webview={DatePicker}>Date Picker:</Button>
          <Button webview={Transfer}>Payment Online:</Button>
          <Button webview={Location}>Geographic map:</Button>
        </Text>
        <Text>
          You can also fill a form or pay online!
          <Button webview={LoginPage}>Log in page:</Button>
          <Button webview={SendEmail}>Form with data:</Button>
        </Text>
      </>
    )
  }
}
