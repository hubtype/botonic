---
id: webchatsettings
title: Webchat Settings
---

The `Webchat settings` component can be appended at the end of a message to change Webchat properties dynamically.

## Properties

| Property          | Type    | Description                           | Required | Default value |
| ----------------- | ------- | ------------------------------------- | -------- | ------------- |
| theme             | Object  | Refer theme options                   | No       | -             |
| blockInputs       | Object  | Refer to block inputs                 | No       | -             |
| persistentMenu    | Object  | Refer to persistent menu              | No       | -             |
| enableEmojiPicker | boolean | Enable the selection of an emoji      | No       | -             |
| enableAttachments | boolean | Enable the selection of an attachment | No       | -             |
| enableUserInput   | boolean | Enable user input                     | No       | -             |
| enableAnimations  | boolean | Enable animated elements              | No       | -             |

## Example

```javascript
import React from 'react'
import { Text, WebchatSettings } from '@botonic/react'

export default class extends React.Component {
  render() {
    return (
      <>
        <Text>Ok dude 😉</Text>
        <WebchatSettings
          theme={{
            brand: { color: 'orange' },
          }}
          enableEmojiPicker={true}
          persistentMenu={[
            { label: 'option1', payload: 'opt1' },
            { label: 'option2', payload: 'opt2' },
          ]}
          enableUserInput={true}
        />
      </>
    )
  }
}
```

> Note: you can get a more detailed example in the **[Webchat](/docs/webchat/webchat)** section.
