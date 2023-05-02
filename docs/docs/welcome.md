---
id: welcome
title: Welcome to Botonic Documentation
sidebar_label: Welcome to Botonic Documentation
---

## What is Botonic?

Botonic is a full-stack Javascript framework to create chatbots and modern conversational apps that work on multiple platforms: web, mobile and messaging apps (Messenger, Whatsapp, Telegram, etc).

It's built on top of:

⚛️ [React](https://reactjs.org/)

⚡ [Serverless](https://www.serverless.com/)

💡 [Tensorflow.js](https://www.tensorflow.org/js)

## Features

### Conversational Apps

**Beyond traditional text-based chatbots**

With Botonic you can create conversational applications that incorporate the best out of **text interfaces** (simplicity, natural language interaction) and **graphical interfaces** (multimedia, visual context, rich interaction). This is a powerful combination that provides better user experience than traditional chatbots, which rely only on text and NLP.

You can learn more about [conversational apps here](https://www.hubtype.com/blog/what-are-conversational-apps/).

### Omnichannel React Components

Botonic adds an abstraction layer on top of messaging platforms so you don't have to worry about different API specifications. Whenever is possible, we unify similar concepts under a simple component that works across different channels. For example, [Messenger Quick Replies](https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies/) and [Telegram Custom Keyboards](https://irazasyed.github.io/telegram-bot-sdk/usage/keyboards/) work in a very similar way. In Botonic you would just use our [Reply](/docs/components/replies) component as follows:

```html
<Text>
  What's you favorite color?
  <Reply payload="purple">Purple</Reply>
  <Reply payload="orange">Orange</Reply>
  <Reply payload="other">Other</Reply>
</Text>
```

Sometimes messaging apps support elements that don't exist in other platforms so we can't make this straightforward standarization. For instance [Messenger's Carousel](https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic/#carousel) has no equivalent on Whatsapp. In this case, you can use our [Multichannel](/docs/components/multichannel) component, which offers a sane transformation using available elements in the destination platform.

In this sense, **Botonic is to messaging platforms what React Native is to mobile platforms**.

Checkout the supported [components](/docs/components).

### Fully Customizable Webchat SDK

Messaging apps offer a limited set of interactive elements, so there's only so much you can do in terms of UI as you're not in full control. However, if you're building for the web, you can use the full power of React. Our [Webchat SDK](/docs/webchat) allows you to easily customize the behaviour and styles using properties like `enableEmojiPicker: true` or `brandColor: 'blue'`. You can also tailor your bot in a more advanced way with **custom components** and [custom message types](/docs/webchat/webchat-style#custom-message). With the latter, you can **embed complex UI elements** right in the middle of the conversation, like forms or calendars.

### Webviews

[Webviews](/docs/concepts/webviews) allow you to work around the fact that you can't control messaging apps UI, so you can't embed your custom components in, say, a Whatsapp conversation. However, you can open a **browser window as an extension of the current conversation** (aware of the context), let the user perform some complex task there, and return to the messaging UI to continue the conversation. Some platforms like [Facebook Messenger support webviews](https://developers.facebook.com/docs/messenger-platform/webview/) in a native way, but for the rest, Botonic manages it with deep links.

Webviews are great when you need complex components or when data privacy/security is important, for instance:

- Login flows
- Checkout processes
- Browsing a catalog
- Selecting seats on a flight

### Full-stack Serverless

Botonic is not just a set of UI components or a frontend framework, it's a fullstack framework that covers **backend logic** (we call those "[actions](/docs/concepts/actions)"), keeping conversations in a **database** and managing a **scalable API**. Check out our [deployment guide](/docs/deployment/hubtype) to learn more about it.

### Natural Language Understanding

In the last years we've witnessed an amazing progress in machine learning and NLP techniques that allows us to understand our users better. Botonic offers a simple yet powerful solution that allows you to add NLU features to your project without being a deep learning expert. **Just define some intents and examples and you'll be good to go!**

Additionally, we allow you to fully customize the NLU pipeline by defining your own neural network or tokenizer. The [@botonic/plugin-nlu](/docs/plugins/plugin-nlu) package is based on [Tensorflow.js](https://www.tensorflow.org/js), so the only limit is your imagination!

### Seamless Human Handoff

Bots are cool, but let's be honest: they can't solve every problem and users can get frustrated if their expectations are not managed properly. That's why having a human backup is always a good idea. However, managing bot-human-bot transitions is challenging, especially if you want to keep the user in the same conversation.

**With Botonic, it is a matter of adding a few lines of code:**

```javascript
export default class extends React.Component {
  static async botonicInit({ input, session, params, lastRoutePath }) {
    await humanHandOff(session))
  }

  render() {
    return (
      <Text>
        Thanks for contacting us! One of our agents
        will attend you as soon as possible.
      </Text>
    )
  }
}
```

Check out our [human handoff guide](/docs/concepts/humanhandoff).

### Plugins

Botonic comes with a battery of plugins so you can easily integrate popular services into your project, for instance:

- **Analytics** ([Google Analytics](/docs/plugins/plugin-google-analytics), [Segment](/docs/plugins/plugin-segment), [Dashbot](/docs/plugins/plugin-dashbot))
- **CMS** ([Contentful](/docs/plugins/plugin-contentful), Sanity)
- **NLU** ([Dialogflow](/docs/plugins/plugin-dialogflow), [Watson](/docs/plugins/plugin-watson), [Luis](/docs/plugins/plugin-luis), [Inbenta](/docs/plugins/plugin-inbenta))

You can also create your own plugins, just follow [our guide](/docs/plugins/createname-plugin1).

### CLI

We offer a command line interface tool that allows you to:

- **Scaffold** new projects with `botonic new <botName> <example>`
- **Run** your project locally with `botonic serve`
- **Deploy** your project with `botonic deploy`

### Typescript Support

You can build your bot either with plain Javascript or with Typescript. **We provide TS typings!**

Typescript examples coming soon...

## Alternatives

Botonic is an open-source alternative to...

...Live-chat propietary tools:

- [Intercom](https://www.intercom.com/)
- [Liveperson](https://www.liveperson.com/)
- [Freshchat](https://www.freshworks.com/live-chat-software/)
- [Drift](https://www.drift.com/)
- [Landbot](http://landbot.io/)
- [Olark](https://www.olark.com/)

...Messaging channels aggregators like:

- [Zendesk Sunshine](https://www.zendesk.com/platform/conversations/outbound-messaging/) (formerly [Smooch](https://smooch.io/))

...NLU closed services like:

- [Dialogflow](https://cloud.google.com/dialogflow)
- [Watson](https://www.ibm.com/watson)
- [Luis](https://www.luis.ai/)
- [Inbenta](https://www.inbenta.com/en/)

Botonic's goal is not to fully replace all these amazing products feature by feature, but to provide a free and open-source option that covers most use cases. We also want to give you freedom to choose your own stack, by providing plugins to integrate many of these services in your project: you want to use Dialogflow NLU? That's easy, just add our [@botonic/plugin-dialogflow](/docs/plugins/plugin-dialogflow) and you're done.

## Who uses Botonic

<p  align="center">
<img  alt="who-use-it"  title="who-use-botonic"  src="https://i.ibb.co/tqymB78/SCR-20230428-mf8-removebg-preview.png"  width="550"/>
</p>

Want to see your name here? Please [submit a pull request](https://github.com/hubtype/botonic/pulls) with your use case!
