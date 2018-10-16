import React from 'react'

export default class extends React.Component {

  static async botonicInit({ req }) {
    /* This is how you fetch data from an API: */
    //const res = await fetch('https://api.example.com/user')
    //const user = await res.json()

  }

  render() {
    return (
      <messages>
        <message type="text">
            Hey, what clothes are you interested in?
            <reply payload="mens-shirts">Mens shirts</reply>
            <reply payload="womens-shirts">Womens shirts</reply>
        </message>
      </messages>
    )
  }
}