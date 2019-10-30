import React from 'react'
import { Button } from 'evergreen-ui'

import { RequestContext } from '@botonic/react'

class SendEmail extends React.Component {
  static contextType = RequestContext
  constructor(props) {
    super(props)
    this.state = { email: '', name: '', lastName: '', profession: '' }
  }

  handleChangeEmail(event) {
    this.setState({
      email: event.target.value
    })
  }
  handleChangeName(event) {
    this.setState({
      name: event.target.value
    })
  }
  handleChangeLastName(event) {
    this.setState({
      lastName: event.target.value
    })
  }
  handleChangeProfession(event) {
    this.setState({
      profession: event.target.value
    })
  }

  async close() {
    let payload_email = '___Email:' + this.state.email
    try {
      this.context.closeWebview({
        params: this.props.context,
        payload: payload_email
      })
    } catch (e) {}
  }

  render() {
    return (
      <div
        style={{
          padding: '0px 12px 0px 12px',
          textAlign: 'center'
        }}
      >
        <h2 style={{ color: 'blue' }}>Hubtype Form</h2>
        <div style={{ fontSize: '12px' }}>
          Please, fill all the following fields with your personal information.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ textAlign: 'left' }}>Name</label>
          <input
            type='text'
            name='username'
            value={this.state.name}
            onChange={this.handleChangeName.bind(this)}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ textAlign: 'left' }}>LastName</label>
          <input
            type='text'
            name='lastName'
            value={this.state.lastName}
            onChange={this.handleChangeLastName.bind(this)}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ textAlign: 'left' }}>Email</label>
          <input
            type='email'
            name='email'
            value={this.state.email}
            onChange={this.handleChangeEmail.bind(this)}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ textAlign: 'left' }}>Profession</label>
          <input
            type='text'
            name='profession'
            value={this.state.profession}
            onChange={this.handleChangeProfession.bind(this)}
          />
        </div>
        <div style={{ textAlign: 'center', paddingTop: '10px' }}>
          <Button appearance='primary' height={48} onClick={() => this.close()}>
            Submit
          </Button>
        </div>
      </div>
    )
  }
}
export default SendEmail
