---
id: message
title: Custom Message
---

The `Custom Message` component is used to customize a message in Webchat: you can create a star rating message, a login text input message, etc.


## Properties

| Property | Type   | Description           | Required | Default value |
|----------|--------|-----------------------|----------|---------------|
| children | String | Show a custom message | Yes      | -             |
         
## Example 1: Map

If you want to add a "map message" where the user can see a location on a map, create a js file and add something like in our example: `example-nlu/src/webchat/map-message.js`:


```javascript
import { customMessage, WebchatContext } from '@botonic/react'
import React from 'react'

let MapContainer, TileLayer
if (typeof window !== 'undefined') {
  MapContainer = require('react-leaflet').MapContainer
  TileLayer = require('react-leaflet').TileLayer
}

class MapMessage extends React.Component {
  static contextType = WebchatContext
  constructor(props) {
    super(props)
  }

  render() {
    if (typeof window !== 'undefined')
      return (
        <MapContainer
          center={[this.props.lat, this.props.lon]}
          zoom={14}
          scrollWheelZoom={false}
          style={{ height: 200, width: 200 }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
        </MapContainer>
      )
    else return null
  }
}

export default customMessage({
  name: 'map-message',
  component: MapMessage,
  defaultProps: {
    style: {
      maxWidth: '90%',
      borderColor: 'black',
    },
  },
})
```


## Example 2: Hotel form

If you want to add a "booking form message" where the user can book a hotel, create a js file and add something like in our example: `example-hotel-reservation/src/webchat/hotel-form-message.js`:

```javascript
import React from 'react'
import styled from 'styled-components'
import { WebchatContext, customMessage } from '@botonic/react'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import deLocale from 'date-fns/locale/en-US'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { MyTextField } from '../utils'

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const Button = styled.button`
  height: 40px;
  background: #2f2f2f;
  border-radius: 8px;
  margin-top: 5px;
  text-align: center;
  color: white;
`

class HoltelForm extends React.Component {
  static contextType = WebchatContext
  constructor(props) {
    super(props)
    this.state = {
      phone: '',
      guests: '',
      date: null,
      error: false,
      edit: true,
    }
  }

  formatDate(date) {
    return date.toISOString().substring(0, 10).split('-').reverse().join('/')
  }

  close() {
    if (this.verifiedForm()) {
      const date = this.formatDate(this.state.date)
      const payload = `enviar_${this.state.phone}_${this.state.guests}_${date}`
      this.setState({ edit: false, error: false })
      const formInfo = {
        hotel: this.props.hotel,
        guests: this.state.guests,
        date: date,
        phone: this.state.phone,
      }
      const hotels = this.context.webchatState.session.user.extra_data.hotels
      hotels.unshift(formInfo)
      this.context.updateUser({
        extra_data: { hotels },
      })
      this.context.sendPayload(payload)
    } else {
      this.setState({ error: true })
    }
  }

  verifiedForm() {
    if (
      this.state.phone === '' ||
      this.state.guests === '' ||
      this.state.date === null
    )
      return false
    return true
  }

  handlePhone = (event) => {
    this.setState({ phone: event.target.value })
  }

  handleDate = (date) => {
    this.setState({ date: date })
  }

  handleGuests = (value) => {
    this.setState({ guests: value ? value.guests : '' })
  }

  render() {
    const guestsOptions = [
      { guests: '1' },
      { guests: '2' },
      { guests: '3' },
      { guests: '4' },
      { guests: '5' },
    ]
    return (
      <Form>
        <MyTextField
          required={true}
          label='Phone'
          onChange={this.handlePhone}
          value={this.state.phone}
          error={this.state.error}
          disabled={!this.state.edit}
        />
        <Autocomplete
          disabled={!this.state.edit}
          options={guestsOptions}
          getOptionLabel={(option) => option.guests}
          getOptionSelected={(option, value) => option.guests == value.guests}
          onChange={(event, newValue) => {
            this.handleGuests(newValue)
          }}
          style={{
            width: '100%',
            padding: '0px 0px 5px 63px',
          }}
          renderInput={(params) => (
            <MyTextField
              required={true}
              label='Guests'
              params={params}
              value={this.state.guests}
              error={this.state.error}
              disabled={!this.state.edit}
            />
          )}
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
          <KeyboardDatePicker
            required={true}
            label='Date'
            disabled={!this.state.edit}
            inputVariant='filled'
            onChange={this.handleDate}
            value={this.state.date}
            ampm={false}
            disablePast
            format='dd/MM/yyyy'
            error={this.state.date === null && this.state.error === true}
            helperText={
              this.state.date === null && this.state.error === true
                ? 'This field is required'
                : ' '
            }
            style={{
              width: '80%',
            }}
          />
        </MuiPickersUtilsProvider>
        {this.state.edit ? (
          <Button onClick={() => this.close()}>BOOK</Button>
        ) : (
          <Button
            style={{
              background: '#808080',
            }}
          >
            COMPLETED
          </Button>
        )}
      </Form>
    )
  }
}

export default customMessage({
  name: 'hotel-form',
  component: HoltelForm,
  defaultProps: {
    style: {
      width: '100%',
      backgroundColor: '#ffffff',
      border: 'none',
      boxShadow: 'none',
      paddingLeft: '5px',
    },
    imagestyle: { display: 'none' },
    blob: false,
    enabletimestamps: false,
  },
})
```

## Example 3: Calendar

If you want to add a "calendar custom message" where the user can select a date, create a js file and add something like:

```javascript
import React from 'react'
import { WebchatContext, customMessage } from '@botonic/react'
import Calendar from 'react-calendar'

class CalendarMessage extends React.Component {
  static contextType = WebchatContext

  render() {
    return (
      <>
        <Calendar
          onChange={date =>
            this.context.sendText(`Booked for ${date.toLocaleDateString()}`)
          }
        />
        <p>{this.props.children}</p>
      </>
    )
  }
}

export default customMessage({
  name: 'calendar',
  component: CalendarMessage
})
```
