import React from 'react'
import styled from 'styled-components'
import { WebchatContext } from '@botonic/react'
import { emailRegex, MyTextField } from '../utils'

const Container = styled.div`
  position: absolute;
  height: calc(100% - 48px);
  left: 0;
  top: 48px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px 30px 20px 30px;
  z-index: 3;
`
const Button = styled.button`
  width: 80px;
  height: 40px;
  background: #2f2f2f;
  border-radius: 8px;
  margin: 20px;
  text-align: center;
  color: white;
`

const Text = styled.a`
  position: relative;
  fontfamily: Verdana;
  fontweight: normal;
  fontsize: 14px;
  text-align: center;
  width: 85%;
  line-height: 1.4;
  color: #000000;
  margin: 0px 30px 20px 30px;
`

export default class CustomCover extends React.Component {
  static contextType = WebchatContext
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      error: false,
    }
  }

  close() {
    if (this.verifiedForm()) {
      this.context.updateUser({
        name: this.state.name,
        extra_data: { email: this.state.email, hotels: [] },
      })
      this.context.sendText('Start')
      this.props.closeComponent()
    } else {
      this.setState({ error: true })
    }
  }

  verifiedForm() {
    if (!this.incorrectName() && !this.incorrectEmail()) {
      return true
    }
    return false
  }

  incorrectName() {
    return this.state.name == ''
  }

  incorrectEmail() {
    return !this.state.email.match(emailRegex) || this.state.email == ''
  }

  handleName = event => {
    this.setState({ name: event.target.value })
  }

  handleEmail = event => {
    this.setState({ email: event.target.value })
    this.setState({ error: false })
  }

  render() {
    return (
      <Container>
        <Text>
          Welcome to Botonic Booking Platform First of all, I would need your
          name and email.
        </Text>
        <MyTextField
          required={true}
          label='Name'
          onChange={this.handleName}
          value={this.state.name}
          error={this.state.error && this.incorrectName()}
        />
        <MyTextField
          required={true}
          label='Email'
          onChange={this.handleEmail}
          value={this.state.email}
          error={this.state.error && this.incorrectEmail()}
          errorMessage={'Please use a valid Email format'}
        />
        <Button onClick={() => this.close()}>START</Button>
        <p style={{ fontSize: 10 }}>
          <em>
            We will not store the fulfilled information. You can fake the data.
          </em>
        </p>
      </Container>
    )
  }
}
