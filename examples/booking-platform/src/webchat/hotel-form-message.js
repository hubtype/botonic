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

class HotelForm extends React.Component {
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

  handlePhone = event => {
    this.setState({ phone: event.target.value })
  }

  handleDate = date => {
    this.setState({ date: date })
  }

  handleGuests = value => {
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
        <p style={{ fontSize: 10, marginBottom: '5px' }}>
          <em>
            We will not store the fulfilled information. You can fake the data.
          </em>
        </p>
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
          getOptionLabel={option => option.guests}
          getOptionSelected={(option, value) => option.guests == value.guests}
          onChange={(event, newValue) => {
            this.handleGuests(newValue)
          }}
          style={{
            width: '100%',
            margin: '0px -63px 5px 0px',
          }}
          renderInput={params => (
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
