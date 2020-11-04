# Botonic

### Build Chatbots and Conversational Apps Using React

[![botonic](https://img.shields.io/badge/cli-botonic-brightgreen.svg)](https://botonic.io)
[![Version](https://img.shields.io/npm/v/@botonic/cli.svg)](https://npmjs.org/package/@botonic/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@botonic/cli.svg)](https://npmjs.org/package/@botonic/cli)
[![License](https://img.shields.io/npm/l/@botonic/cli.svg)](https://github.com/hubtype/botonic/blob/master/package.json)

<p align="center">
  <a  href="https://botonic.io/">
    <img alt="Node.js" src="https://botonic.io/img/botonic-logo.png" width="150"/>
  </a>
</p>

<!-- toc -->

# What's in this document

- [Introduction](#-introduction)
- [Getting Started](#-getting-started)
- [Supporting and contributing](#-supporting-and-contributing)
- [Related Links](#-related-links)

<!-- tocstop -->

# 🐣 Introduction

[Botonic](https://botonic.io) is a full-stack framework to create chatbots and modern [conversational apps](https://www.hubtype.com/blog/what-are-conversational-apps/).

It's built on top of:

⚛️ [React](https://reactjs.org/)

⚡ [Serverless](https://www.serverless.com/)

💡 [Tensorflow.js](https://www.tensorflow.org/js)

And it works on:

💬 Messaging apps: **Whatsapp**, **Facebook Messenger**, **Telegram**, **Twitter DMs**

🌐 Your website

📱 Your mobile app

With Botonic you can focus on creating the best conversational experience for your users instead of dealing with different messaging APIs, AI/NLP complexity or managing and scaling infrastructure.
It also comes with a battery of plugins so you can easily integrate popular services into your project, for instance:

- Analytics ([Google Analytics](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-google-analytics), [Segment](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-segment), [Dashbot](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-dashbot))
- CMS ([Contentful](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-contentful), Sanity)
- NLU ([Dialogflow](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-dialogflow), [Watson](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-watson), [Luis](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-luis), [Inbenta](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-inbenta))

_If you'd like to see more plugins/integrations, please submit an issue or a pull request_

# 🚀 Getting Started

### Requirements

Node (v10 or above) and NPM are required. LTS version of [NodeJS Installer](https://nodejs.org/) is recommended.

You can verify the installation running `npm --version` and `node --version` on a terminal.

### Install

```
$> npm install -g @botonic/cli
```

### Create a bot

```
$> botonic new myBot tutorial
```

### Run your bot

Run your bot locally while developing:

```
$> cd myBot
$> botonic serve
```

`botonic serve` is just an alias for `npm run start` which will start a local server at http://localhost:8080. While you develop, the server will auto reload every time you make changes to your code.

### Deploy

```
$> botonic deploy
```

Check out the [Getting Started Tutorial](https://botonic.io/docs/getting-started): a step-by-step guide to start building high quality conversational apps.

[See the docs for more information](https://botonic.io/docs).

# 🤝 Supporting and contributing

- **⭐⭐ Give us a Star on GitHub ⭐⭐**
- Submit an [issue](https://github.com/hubtype/botonic/issues) if you find a bug or want to request a feature.
- Join our [Slack](https://slack.botonic.io/) community, let us know what you're building and give us feedback.
- PRs are welcome! Just follow our [Code of Conduct](https://github.com/hubtype/botonic/blob/master/CODE_OF_CONDUCT.md) and [Contributing Guide](https://github.com/hubtype/botonic/blob/master/CONTRIBUTING.md)

# 📚 Related Links

- [Botonic](https://botonic.io) - Botonic Website

- [Hubtype](https://hubtype.com) - Botonic was created with ❤️ by Hubtype

- [Slack](https://slack.botonic.io/) - Slack channel

- [Twitter](https://twitter.com/botonic_) - Twitter
