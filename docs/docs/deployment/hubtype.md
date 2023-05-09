---
id: hubtype
title: Deploy to Hubtype
---

[Hubtype](https://hubtype.com) is the conversational infrastructure for businesses and the recommended choice to deploy your botonic projects.

_Disclaimer: Hubtype is the company that created and maintains Botonic_

This is the best option if you:

- Want to **get started fast and for free** (Hubtype has a free plan that allows up to 500 monthly active users)
- Prefer **one-click integrations with messaging apps** and not to deal with their verification process, webhooks, etc
- Need to use **bot/human handoff** (using Hubtype Desk, Zendesk or Salesforce)
- Don't want to worry about **maintaining infrastructure** and its scalability
- Want a **secure and privacy compliant** app without managing it yourself

## Deploy to Hubtype step by step

_This tutorial assumes you've already created a bot with `botonic new`, if not please check out the [getting started tutorial](/docs/getting-started)._

1. From your command line terminal run `botonic deploy`.
2. If it's the first time you deploy a bot, Botonic asks you to enter your credentials:
   - Log in with your email/password if you already signed up at [hubtype.com](https://hubtype.com/).
   - Or create a new account on-the-fly.
3. Enter a name for your bot.
4. Go to [app.hubtype.com/bots](https://app.hubtype.com/bots/) > select your bot > "Integrations" tab and select one of the available messaging channels. Follow the screen instructions.  

🎉 That's it!

## How does it work?

The `botonic deploy` command first builds your project with `npm run build`, which creates several artifacts in the `/build` directory (javascript bundles for Node, for the browser, static assets, etc). It then zips these files and uploads them to Hubtype, which creates the necessary infrastructure to run your botonic app (CDN, Certificates, Database, Webhooks/API, Node runtime using AWS Lambda and more).
You don't have to worry about servers, scaling or any other infrastructure, **your bot will just work at any scale**.

Botonic stores your credentials in the `~/.botonic/credentials.json` file so you don't have to enter your email/password every time.

If you want to deploy with another account, run `botonic logout` or delete the `~/.botonic/` folder. The next time you deploy, you'll be prompted for new credentials.

Botonic also stores bot metadata in `.botonic.json` at the root of your project. It remembers which bot in the cloud corresponds to your local bot.
