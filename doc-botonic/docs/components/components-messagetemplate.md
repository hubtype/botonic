---
id: messagetemplate
title: Message Templates
---

The `Message Templates` component allows you to use Facebook Messenger templates and define them, as with the `Share Button` component.
As an example, you can generate a nice boarding pass as in the example below.

**Note:** Facebook supports many different [**templates**](https://developers.facebook.com/docs/messenger-platform/send-messages/templates).

## Properties

| Property | Type      | Description               | Required | Default value |
|----------|-----------|---------------------------|----------|---------------|
| payload  | Component | Show the message template | Yes      | -             |


## Example

![](https://botonic-doc-static.netlify.com/images/message_template.png)


**./actions/example.js**

```javascript
import React from 'react'
import { Text, MessageTemplate } from '@botonic/react'

export default class extends React.Component {
  render() {
    var my_message_template = {
      template_type: 'airline_boardingpass',
      intro_message: 'You are checked in.',
      locale: 'en_US',
      boarding_pass: [
        {
          passenger_name: 'SMITH/NICOLAS',
          pnr_number: 'CG4X7U',
          seat: '74J',
          logo_image_url: 'https://www.example.com/en/logo.png',
          header_image_url: 'https://www.example.com/en/fb/header.png',
          qr_code: 'M1SMITH/NICOLAS  CG4X7U nawouehgawgnapwi3jfa0wfh',
          above_bar_code_image_url: 'https://www.example.com/en/PLAT.png',
          auxiliary_fields: [
            {
              label: 'Terminal',
              value: 'T1',
            },
            {
              label: 'Departure',
              value: '30OCT 19:05',
            },
          ],
          secondary_fields: [
            {
              label: 'Boarding',
              value: '18:30',
            },
            {
              label: 'Gate',
              value: 'D57',
            },
            {
              label: 'Seat',
              value: '74J',
            },
            {
              label: 'Sec.Nr.',
              value: '003',
            },
          ],
          flight_info: {
            flight_number: 'KL0642',
            departure_airport: {
              airport_code: 'JFK',
              city: 'New York',
              terminal: 'T1',
              gate: 'D57',
            },
            arrival_airport: {
              airport_code: 'AMS',
              city: 'Amsterdam',
            },
            flight_schedule: {
              departure_time: '2016-01-02T19:05',
              arrival_time: '2016-01-05T17:30',
            },
          },
        },
      ],
    }
    return (
      <Text>
        I am a message template!
        <MessageTemplate payload={my_message_template} />
      </Text>
    )
  }
}
```
