import React from 'react'
import { RequestContext } from '@botonic/react'
import { Button } from 'evergreen-ui'
class LoginPage extends React.Component {
  static contextType = RequestContext
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      submitted: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit() {
    this.setState({ submitted: true })
    const { username, password } = this.state
    if (username && password) {
      let payload_email = '___LogIn:' + this.state.username
      this.context.closeWebview({
        params: this.props.context,
        payload: payload_email
      })
    }
  }

  render() {
    const { username, password } = this.state
    return (
      <div
        style={{
          padding: '0px 12px 0px 12px',
          textAlign: 'center'
        }}
      >
        <h2 style={{ color: 'blue' }}>Hubtype Login</h2>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor='username'>Username</label>
          <input
            type='text'
            name='username'
            value={username}
            onChange={this.handleChange}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={this.handleChange}
          />
        </div>
        <div style={{ textAlign: 'center', paddingTop: '10px' }}>
          <Button
            appearance='primary'
            height={48}
            onClick={() => this.handleSubmit()}
          >
            Confirm
          </Button>
        </div>
      </div>
    )
  }
}

export default LoginPage
