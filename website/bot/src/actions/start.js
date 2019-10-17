import React from 'react'
import { Text } from '@botonic/react'

export default class extends React.Component {
  static async botonicInit({ input, session, params, lastRoutePath }) {
    /* This is how you fetch data from an API: */
    //const res = await fetch('https://api.example.com/user')
    //const user = await res.json()

    /* The "context" object allows you to keep data between
       requests from the same user */
    return { name: 'John Doe' }
  }

  render() {
    return (
      <>
        <Text>Welcome to Botonic! =)</Text>
        <Text>
          What do you want to know?
          <Reply payload='a'>A</Reply>
          <Reply payload='b'>B</Reply>
        </Text>
      </>
    )
  }
}
