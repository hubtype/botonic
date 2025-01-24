import React from 'react'
import { customMessage, WebchatContext } from '@botonic/react'
import ReactStars from 'react-stars'

class RateUserMessage extends React.Component {
  static contextType = WebchatContext
  render() {
    return (
      <ReactStars
        count={5}
        size={24}
        value={parseFloat(this.props.rate)}
        edit={false}
        color1={'#ffffff'}
      />
    )
  }
}

export default customMessage({
  name: 'rate-user-message',
  component: RateUserMessage,
  defaultProps: {
    from: 'user',
  },
})
