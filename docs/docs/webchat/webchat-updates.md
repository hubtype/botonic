---
id: webchat-updates
title: Dynamic Updates
---

The `WebchatSettings` component offers a dynamic bot interaction, where webchat properties can be updated on the run depending on the conversation.

Let's say you want to prepare the following behavior when starting the conversation:

- The webchat window color is changed to black.
- The text input is hidden.
- Attachements are enabled.
- There is a `blockInputs`.

1. Add the following content in your **action** file.

```javascript
import React, { useContext } from 'react'
import { Text, Reply, WebchatSettings } from '@botonic/react'
import { RequestContext } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext
  render() {
    return (
      <>
        <Text>
          Please, type "start" to start the tutorial.
          <Reply payload='reply1'>Reply 1</Reply>
          <Reply payload='reply2'>Reply 2</Reply>
        </Text>
        <WebchatSettings
          theme={{
            brand: { color: 'black' },
          }}
          blockInputs={[
            { match: [/ugly/i, /bastard/i], message: "don't say that to me" },
          ]}
          enableAttachments={true}
          enableUserInput={false}
        />
      </>
    )
  }
}
```

<details>
<summary>Example</summary>

![](https://botonic-doc-static.netlify.com/images/webchat/dynamic_updates1.png)

</details>

Now you want to get the following behavior during the conversation:

- A response is given to the previous action.
- The text input is enabled again.
- The webchat window color turns to orange.
- The `emojiPicker` is enabled.
- A `persistentMenu` is dynamically added.

2. Add the following content in your **action** file.

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

<details>
<summary>Example</summary>

![](https://botonic-doc-static.netlify.com/images/webchat/dynamic_updates2.png)

![](https://botonic-doc-static.netlify.com/images/webchat/dynamic_updates3.png)

</details>

3. Finally, a simple action can be added just to change the color (as `WebchatSettings` only returns visual changes):

```javascript
export default class extends React.Component {
  render() {
    return <WebchatSettings theme={{ brand: { color: 'green' } }} />
  }
}
```

<details>
<summary>Example</summary>

![](https://botonic-doc-static.netlify.com/images/webchat/dynamic_updates4.png)

</details>
