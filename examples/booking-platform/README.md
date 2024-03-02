# Booking Platform

This example shows you how to make a reservation in a hotel by taking all the profit of webviews and custom messages.


**What's in this document?**

- [How to use this example](#how-to-use-this-example)
- [Webchat components](#webchat-components)
  - [1. Cover Component](#1-cover-component)
  - [2. Custom Messages](#2-custom-messages)
    - [2.1 Custom Message from bot](#21-custom-message-from-bot)
    - [2.2 Custom Message from user](#22-custom-message-from-user)
  - [3. Persistent Menu](#3-persistent-menu)
- [Carousel](#carousel)
- [Webviews](#webviews)


## How to use this example

1. From your command line, download the example by running:
   ```bash
   $ botonic new <botName> booking-platform
   ```
2. `cd` into `<botName>` directory that has been created.
3. Run `botonic serve` to test it in your local machine.

## Webchat components

In this section, we will see the most relevant webchat components that have been used to create this example.


#### 1. Cover Component

The [Cover Component](https://botonic.io/docs/webchat/webchat-covercomponent/) is the first component that will appear when a user opens the webchat.

We have used  `styled-components` that allows us to define new React component with our styles attached to it.

**src/webchat/cover-component.js**

```javascript
import styled from 'styled-components'

const Container = styled.div`
  position: absolute;
  height: 432px;
  width: calc(100%-60px);
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
  margin-top: 20px;
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
```

We have also used the **TextField** component from `material-ui` to let the users enter and edit text.

```javascript
import TextField from '@material-ui/core/TextField'

export function MyTextField(props) {
  let helperText = ''
  if (props.error)
    helperText =
      props.error && props.value === ''
        ? 'This field is required'
        : props.errorMessage || ''
  return (
    <TextField
      variant='filled'
      {...props.params}
      required={props.required}
      label={props.label}
      value={props.value}
      onChange={props.onChange}
      error={helperText !== ''}
      helperText={helperText}
      disabled={props.disabled}
      style={props.style || { width: '80%', margin: '5px' }}
    />
  )
}
```

After defining these components, we have created our **CustomCover** component as:

```javascript
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
      this.context.sendText('Start', 'PAYLOAD')
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
```
We have created some functions to check and handle the user data. Moreover, to store the relevant information in the session we have used the `updateUser()` function.

Finally, to close the component, we have called the `closeComponent()` function that can be found in the props. In this case, we also used `sendText` to add a message form the user after the component is closed. That then will be captured in the routes and will execute the next action.

**src/routes.js**
```javascript
 { path: 'start', text: /^start$/i, action: Start },
```

After creating our component we just need to assign it to the `coverComponent` property:

**src/webchat/index.js**

```javascript
import CustomCover from './cover-component'

export const webchat = {
  coverComponent: CustomCover,
}
```

#### 2. Custom Messages

[Custom Messages](https://botonic.io/docs/components/message/) allows us to create any kind of message that we want.


###### 2.1 Custom Message from bot

We have used a CustomMessage to create the **Hotel Form** that appears after the user chooses the hotel to book.

In this component, we have also used `styled-components` and `material-ui` to create the **TextField**, the **Autocomplete** and the **DatePicker** components.

The structure is very similar to the **CustomCover** component, but in this case we need to export the component as:

**src/webchat/hotel-form-message.js**

```javascript
export default customMessage({
  name: 'hotel-form',
  component: HotelForm,
  defaultProps: {
    style: {
      width: '100%',
      backgroundColor: '#ffffff',
      border: 'none',
      boxShadow: 'none',
      paddingLeft: '5px',
    },
    imageStyle: { display: 'none' },
    blob: false,
    enableTimestamps: false,
  },
})
```

The `name` and `component` props are mandatory, and in this case, we have also defined the `defaultProps` to change some properties of the message.

The last important step to do when we define a `CustomMessage`, is to add it in the custom types:

**src/webchat/index.js**

```javascript
import HotelForm from './hotel-form-message'

export const webchat = {
  theme: {
    message: {
      customTypes: [HotelForm, RateMessage, RateUserMessage],
    },
  },
}
```

Then we can call this component in the actions.

**src/actions/book-hotel.jsx**

```javascript
import React from 'react'
import { Text } from '@botonic/react'
import HotelForm from '../webchat/hotel-form-message'

export default class extends React.Component {
  static async botonicInit(request) {
    const hotel = request.input.payload.split('-')[1]
    const name = request.session.user.name
    return { hotel, name }
  }
  render() {
    return (
      <>
        <Text>
          {this.props.name} you have selected **{this.props.hotel}**. To confirm
          the reservation, we would need some more information.
        </Text>
        <HotelForm hotel={this.props.hotel} />
      </>
    )
  }
}
```

###### 2.2 Custom Message from user
It is also possible to add a custom message on the user side, as we have done with RateUserMessage.

In this case, we have used **react-stars** to display the rate of the user. To add this message on the user side the only extra thing we need to do is change the `from` property to 'user'.

**src/webchat/rate-user-message.js**
```javascript
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
        color2={'#ffffff'}
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
```

#### 3. Persistent Menu

The [Persistent Menu](https://botonic.io/docs/webchat/webchat-persistentmenu/) is a component that will be shown whenever the user clicks to the button placed in the bottom left corner.

**src/webchat/index.js**

```javascript
import CheckReservationsWebview from '../webviews/components/check-reservations'
import { CustomPersistentMenu } from './custom-persistentMenu'
export const webchat = {
  theme: {
    userInput: {
      persistentMenu: [
        { label: 'Check your reservation', webview: CheckReservationsWebview },
        { label: 'Book a hotel', payload: 'carousel' },
        { closeLabel: 'Close' },
      ],
      menu: {
        darkBackground: true,
        custom: CustomPersistentMenu,
      },
    },
  },
}
```
In this case, we have created a `persistentMenu` with three buttons: the first one will open a webview, the second one will send the payload 'carousel' and the last one will close the menu.

In this example, we have also customized our menu in **custom-persistentMenu.js** and we have enabled the `darkBackgroud` property to darken the background of the webchat and let the user focus on the persistent menu only.

## Carousel

The [Carousel](https://botonic.io/docs/components/carousel/) component allows you to show a collection of images in a cyclic view. In the example, we have used it to show the different hotel options.

**src/actions/carousel.js**

```javascript
import React from 'react'
import {
  Text,
  Carousel,
  Element,
  Pic,
  Button,
  Title,
  Subtitle,
} from '@botonic/react'

export default class extends React.Component {
  render() {
    const hotels = [
      {
        name: 'Hotel Alabama',
        desc: '* * * *',
        payload: 'hotel-Hotel Alabama',
        pic:
          'https://cdn.styleblueprint.com/wp-content/uploads/2017/06/4512594599_9edc8fee0a_b.jpg',
      },
      {
        name: 'Hotel Arizona',
        desc: '* * * * *',
        payload: 'hotel-Hotel Arizona',
        pic:
          'https://images.trvl-media.com/hotels/10000000/9760000/9754700/9754671/88c37982_z.jpg',
      },
      {
        name: 'Hotel California',
        desc: '* *',
        payload: 'hotel-Hotel California',
        pic:
          'https://estaticos.elperiodico.com/resources/jpg/4/0/hotel-california-todos-santos-baja-california-1493803840904.jpg',
      },
    ]
    return (
      <>
        <Text>Select an hotel among these options:</Text>
        <Carousel>
          {hotels.map((e, i) => (
            <Element key={e.name}>
              <Pic src={e.pic} />
              <Title>{e.name}</Title>
              <Subtitle>{e.desc}</Subtitle>
              <Button payload={e.payload}>Book</Button>
            </Element>
          ))}
        </Carousel>
      </>
    )
  }
}
```

## Webviews

[Webviews](https://botonic.io/docs/concepts/webviews/) allow us to open standard webpages during a chat conversation. In this example, we have used it to create a webpage where the user can check the hotel reservations. As we have mentioned before we can open it using the persistentMenu or with one of the button in the Start action.

**src/actions/start.jsx**

```javascript
import React, { useEffect } from 'react'
import { Text, Button } from '@botonic/react'
import CheckReservationsWebview from '../webviews/components/check-reservations'

export default class extends React.Component {
  static async botonicInit(request) {
    const name = request.session.user.name
    return { name }
  }

  render() {
    return (
      <>
        <Text>
          Hi {this.props.name}, Im your virtual assistant of Botonic Booking
          Platform. I will help you manage your hotel reservations and much
          more.
        </Text>
        <Text>
          Select an option:
          <Button payload='carousel'>Book a hotel</Button>
          <Button webview={CheckReservationsWebview}>
            Check your reservations
          </Button>
        </Text>
      </>
    )
  }
}
```

In this case, we have also used `styled-components` and the **TextFiled**.

**src/webviews/components/check-reservations.js**

```javascript
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
 ```

In order to continue with the conversation flow, we call the `closeWebview` function which closes the webview and sends a payload:

```javascript
close() {
  this.context.closeWebview({
    payload: 'close-webview',
  })
}
```
The last step, is to add the new webview in the index:

**src/webviews/index.js**

```javascript
import WebviewReserva from './components/check-reservations'

export const webviews = [WebviewReserva]
```

 ...and we are done 🎉
