---
id: sharebutton
title: Share Button
---

## Purpose

The `Share Button` component enables other users to share your content in Messenger. Messages shared this way show a preview and text elements that are clickable. 

<details>
<summary>Example</summary>

Here is an example of an output in Facebook Messenger:

![](https://botonic-doc-static.netlify.com/images/share_1.png)

After clicking on it, the defined elements are displayed as follows:

![](https://botonic-doc-static.netlify.com/images/share_2.png)

The recipient gets this type of visual link:

![](https://botonic-doc-static.netlify.com/images/share_3.png)

</details>


## Properties

| Property | Type           | Description    | Required | Default value |
|----------|----------------|----------------|----------|---------------|
| payload  | String, Number | Call to action |          |               |


## Example

On Facebook Messenger, you can share your desired content with your friends and acquaintances with the following piece of code:

```javascript
import React from 'react'
import { Text, ShareButton } from '@botonic/react'

export default class extends React.Component {
  render() {
    var my_share_button = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'I am a title',
              subtitle: 'I am a subtitle',
              image_url: 'http://pngimg.com/uploads/share/share_PNG24.png',
              default_action: {
                type: 'web_url',
                url: 'https://botonic.io/',
              },
              buttons: [
                {
                  type: 'web_url',
                  url: 'https://botonic.io/',
                  title: 'Welcome to Botonic!',
                },
              ],
            },
          ],
        },
      },
    }
    return (
      <Text>
        I am a share button!
        <ShareButton payload={my_share_button} />
      </Text>
    )
  }
}
```
