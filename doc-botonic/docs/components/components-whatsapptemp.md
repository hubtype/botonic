---
id: whatsapp-template
title: WhatsApp Template
---

The `whatsapptemplate` component allows you to send WhatsApp templates in the bot actions.

## Properties

| Property  | Type   | Description                                                                                                                                                                                                                                      | Required | Default value |
|-----------|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|---------------|
| name      | string | Name of the template                                                                                                                                                                                                                             | Yes      | -             |
| namespace | string | Namespace of the template. Beginning with v2.27.8, this must be the namespace associated with the WhatsApp business account that owns the phone number associated with the current WhatsApp Business API client or the message will fail to send | Yes      | -             |
| language  | string | Language of the template                                                                                                                                                                                                                         | Yes      | -             |
| header    | object | Header of the template                                                                                                                                                                                                                           | No       | -             |
| body      | object | Body of the template                                                                                                                                                                                                                             | No       | -             |
| footer    | object | Footer of the template                                                                                                                                                                                                                           | No       | -             |

## Example

Example of `./actions/example-whatsapp-template.js` 

```javascript
import React from 'react'
import { WhatsappTemplate } from '@botonic/react'

export default class extends React.Component {
  render() {
    return (
      <WhatsappTemplate
        name={'out_of_office'}
        namespace={'d32863cc_3dd6_3e84_74c0_38d758fc60f6'}
        language={'en'}
        header={''}
        body={{
          type: 'body',
          parameters: [{ type: 'text', text: 'Anthony' }],
        }}
        footer={''}
      ></WhatsappTemplate>
    )
  }
}
```

