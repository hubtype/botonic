import React from 'react'
import { RequestContext } from '@botonic/react'
import styled from 'styled-components'
import { MyTextField } from '../../utils'

const Form = styled.div`
  position: absolute;
  width: calc(100% - 60px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px 20px 30px;
`

const Button = styled.button`
  width: 80px;
  height: 40px;
  background: #2f2f2f;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  color: white;
`

const Text = styled.p`
  margin: 5px;
  width: 85%;
  color: #000000;
  line-height: 1.2;
`

export default class CheckReservationsWebview extends React.Component {
  static contextType = RequestContext
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      hotels: undefined,
      correctName: '',
      correctEmail: '',
      errorName: false,
      errorEmail: false,
      identified: false,
    }
  }

  close() {
    this.context.closeWebview({
      payload: 'close-webview',
    })
  }

  singIn() {
    if (this.verifiedForm()) {
      this.setState({ identified: true })
    }
  }

  verifiedForm() {
    const correctName = !this.incorrectName()
    const correctEmail = !this.incorrectEmail()
    return correctName && correctEmail
  }

  incorrectName() {
    if (this.state.name !== this.state.correctName) {
      this.setState({ errorName: true })
      return true
    }
    return false
  }

  incorrectEmail() {
    if (this.state.email !== this.state.correctEmail) {
      this.setState({ errorEmail: true })
      return true
    }
    return false
  }

  handleName = (event) => {
    this.setState({ name: event.target.value, errorName: false })
  }
  handleEmail = (event) => {
    this.setState({ email: event.target.value, errorEmail: false })
  }

  getName(botContext) {
    return botContext.session.user.name
  }

  getEmail(botContext) {
    return botContext.session.user.extra_data.email
  }

  getHotels(botContext) {
    return botContext.session.user.extra_data.hotels
  }

  render() {
    this.state.hotels = this.getHotels(this.context)
    this.state.correctName = this.getName(this.context)
    this.state.correctEmail = this.getEmail(this.context)

    const InfoDatos = (props) => {
      return (
        <>
          <hr
            style={{
              width: '85%',
              height: '1px',
              border: 'none',
              color: '#D6D6D6',
              backgroundColor: '#D6D6D6',
            }}
          />
          <Text>{props.hotel}</Text>
          <Text
            style={{
              color: '#495e86',
              marginBottom: '0px',
            }}
          >
            <a>
              Name: {this.state.correctName}
              <br />
              Guests: {props.guests}
              <br />
              Date: {props.date}
            </a>
            <br />
            <a>Email: </a>
            <a href={`mailto:${this.context.correctEmail}`}>
              {this.state.correctEmail}
            </a>
            <br />
            <a>Phone: </a>
            <a href={`tel:${props.phone}`}>{props.phone}</a>
            <br />
            <br />
          </Text>
        </>
      )
    }
    return (
      <Form>
        {this.state.identified ? (
          <>
            <h2>Your reservation</h2>
            {this.state.hotels.map((h, i) => (
              <InfoDatos key={i} {...h} />
            ))}
            <Button onClick={() => this.close()}>CLOSE</Button>
          </>
        ) : (
          <>
            <Text
              style={{
                margin: '20px 0px 20px 22px',
              }}
            >
              To check your reservation, enter your name and email.
            </Text>
            <MyTextField
              required={true}
              label='Name'
              onChange={this.handleName}
              value={this.state.name}
              error={this.state.errorName}
              errorMessage={'The name does not match'}
            />
            <MyTextField
              required={true}
              label='Email'
              onChange={this.handleEmail}
              value={this.state.email}
              error={this.state.errorEmail}
              errorMessage={'The email does not match'}
            />
            <Button onClick={() => this.singIn()}>LOGIN</Button>
          </>
        )}
      </Form>
    )
  }
}
