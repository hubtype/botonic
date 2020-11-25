---
id: getting-started
title: Installation and Quick Start
---

Let's install and create our first Botonic bot!

## Step 1 – Install the Botonic Command Line Interface

1. Install the LTS version of **[NodeJS](https://nodejs.org/)**.
2. Verify the installation version by running `npm --version` and `node --version`.  
   **Note:** You must have at least `node >= 10.0.0` version installed. You can also use **[Yarn](https://yarnpkg.com/)**.
3. Perform a global installation by running `sudo npm install -g @botonic/cli` (Mac/Linux) or `npm install -g @botonic/cli` (as admin on Windows).
4. Wait until the CLI is installed.

## Step 2 – Create a Bot

1. Run `botonic new <bot_name>`
2. Select one of the examples available.

Congratulations: Your bot is created!

**Note**: You can optionally pass the name of the example as a second argument such as `botonic new <bot_name> tutorial`

## Step 3 – Test Your Bot

1. Set yourself in the directory you created: `cd <bot_name>`.
2. Test your bot in your browser by running `botonic serve` (Mac/Linux) or `npm run start` (Windows).
3. Copy the development server URL (generally [http://localhost:8080/](http://localhost:8080/)) and paste it in your browser.
4. Try chatting with your bot!

**Note**: If you started with the "blank" example, the bot answers with "I don't understand you".

## Step 4 – Deploy Your Bot

1. From your command line, run `botonic deploy`.
2. Enter your credentials (email/password) if you already signed up at **[app.hubtype.com](https://app.hubtype.com/)** or create a new account as recommended.
3. Give a name to your bot and wait for your project to be deployed.

## Step 5 – Publish Your Bot

1. Once the deploy is finished, go to the Hubtype dashboard at **[app.hubtype.com](https://app.hubtype.com/)**.
2. Click on the bot icon and search for your bot in the list.
3. Click on **Integrate a messenger** and select a provider.
4. Follow the instructions to connect your bot to the chosen provider.
5. Enjoy the conversation.

Congratulations! You’ve installed and deployed your first bot!

> **Note**: If you experience any errors whilst testing or deploying your bot, try to run `npm run build` for a more detailed trace.
