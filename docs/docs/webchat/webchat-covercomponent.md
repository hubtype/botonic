---
id: webchat-covercomponent
title: Cover Component
---

## 

The Cover component enables the user to authenticate when starting a conversation. In that way, you can retrieve relevant information at the very beginning of the interaction, such as the user's name or e-mail address.

<img src="https://botonic-doc-static.netlify.com/images/webchat/covercomponent2.png" width="200" />

**Note:** In this example, we are using `@material-ui/core` so make sure to install it by running `npm i @material-ui/core`.

1. Create a `cover-component.js` in `src/webchat`.

2. Add the component details as in the example below.

```javascript
import React from 'react'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import { WebchatContext } from '@botonic/react'

const Container = styled.div`
  position: absolute;
  left: 17%;
  top: 20%;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`
function MyTextField(props) {
  return (
    <TextField
      label={props.label}
      variant='filled'
      onChange={props.onChange}
      error={props.value === '' && props.error === true}
      value={props.value}
      disabled={props.disabled}
      style={{ width: '80%', margin: '5px' }}
    />
  )
}
export default class CustomCover extends React.Component {
  static contextType = WebchatContext
  constructor(props) {
    super(props)
    this.state = {
      error: false,
      name: '',
      email: '',
    }
  }
  verifiedForm() {
    if (this.state.name === '' || this.state.email === '') return false
    return true
  }
  close() {
    if (this.verifiedForm()) {
      this.context.updateUser({
        name: this.state.name,
        email: this.state.email,
      })
      this.context.sendText('START', 'PAYLOAD')
      this.props.closeComponent()
    } else {
      this.setState({ error: true })
    }
  }
  handleName = event => {
    this.setState({ name: event.target.value })
  }
  handleEmail = event => {
    this.setState({ email: event.target.value })
  }
  render() {
    return (
      <Container>
        <h2>Contact Info</h2>
        <Form>
          <MyTextField
            label='Name'
            onChange={this.handleName}
            value={this.state.name}
            error={this.state.error}
          />
          <MyTextField
            label='Email'
            onChange={this.handleEmail}
            value={this.state.email}
            error={this.state.error}
          />
          <Button onClick={() => this.close()}>START</Button>
        </Form>
      </Container>
    )
  }
}
```

3. In the `index.js` file located in `src/webchat`, import the component as in the example below.

```javascript webchat = {
import CustomCover from './cover-component'
export const webchat = {
  coverComponent: CustomCover,
}
```


When the user authenticates:

- The information is stored in the user information (`session.user` and `user`).

- The component closes.

- The **START** user message is displayed and the action with a **PAYLOAD** is called.

**Note**: by default, the input zone is disabled before the user authentication.
