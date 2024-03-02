import React from 'react'
import styled from 'styled-components'
import { WebchatContext, customMessage } from '@botonic/react'
import ReactStars from 'react-stars'

const Text = styled.p`
  color: black;
  text-align: flex-start;
  margin: 0px;
`

class RateMessage extends React.Component {
  static contextType = WebchatContext
  constructor(props) {
    super(props)
    this.state = {
      rate: 0,
      edit: true,
    }
  }

  ratingChanged = (newRating) => {
    console.log(newRating)
    if (this.state.edit) {
      this.setState({ rate: newRating })
      this.setState({ edit: false })
      const payload = `rating-${newRating}`
      this.context.sendPayload(payload)
    }
  }
  render() {
    return (
      <>
        <Text>Before we say goodbye, please rate our service</Text>
        {this.state.edit && (
          <ReactStars
            count={5}
            size={24}
            onChange={this.ratingChanged}
            value={this.state.rate}
            edit={this.state.edit}
            half={false}
            color2={'#000000'}
          />
        )}
      </>
    )
  }
}

export default customMessage({
  name: 'rate-message',
  component: RateMessage,
})
