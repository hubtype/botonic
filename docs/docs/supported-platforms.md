---
id: supported-platforms
title: Integrate a Bot with Webchat and Messaging Apps
---

Botonic supports several messaging platforms, such as:

---

**[Webchat](#webchat) | [WhatsApp](#whatsapp) | [Facebook Messenger](#facebook-messenger) | [Telegram](#telegram) | [Twitter](#twitter)**

---

The first steps to embed a bot are common to all platforms:

1. Once your bot is deployed, log in to **[app.hubtype.com](https://app.hubtype.com/)** and click on the Bot icon.
2. Select your bot and click on **Integrate a Messenger**.
3. Select the relevant messaging app as described below.

## Webchat

You can integrate your chatbot into your webpage. This integration is 100% editable, i.e. you can display your messaging application with your own styles.

1. Give a name to this integration (as you can have multiple webchat integrations with the same bot) and set Webchat's visibility settings (you can edit them again later).
2. Click `Enable Webchat`.
3. You will be provided with a HTML code snippet for your webchat. Inject this code in your webpage. Note that the script has to be injected in the `head` tag, and the bot initialization in the `body` tag.

**Note**: If you want to enable visibility settings, you must add the `visibility` parameter set to `'dynamic'` as shown: `{appId: 'YOUR_APP_ID', visibility: 'dynamic'}`

For more information, refer to the **[Webchat](/docs/webchat/webchat)** section.

<details>
<summary>Example</summary>

![](https://botonic-doc-static.netlify.com/images/webchat/webchat-new-channel1.png)
![](https://botonic-doc-static.netlify.com/images/webchat/webchat-new-channel2.png)

</details>

## WhatsApp

WhatsApp Playground allows you to test your bot with the official **[WhatsApp Business API](https://www.whatsapp.com/business/api)** without going through the approval process.

1. Click on the bot’s name and test the conversation in the Hubtype Desk chat box.
      <details>
      <summary>Example</summary>

   ![](https://botonic-doc-static.netlify.com/images/whatsplayground/whatsplayground2.png)
   </details>

1. Enter a WhatsApp number in the Whitelist to test the WhatsApp Playground integration. Remember that you can have one number integrated with one bot only.
1. Once the number is inserted, it is displayed in the list of available bots.
      <details>
      <summary>Example</summary>

   ![](https://botonic-doc-static.netlify.com/images/whatsplayground/whatsplayground1.png)
   </details>

1. Click on the phone number to test it directly on WhatsApp.
      <details>
      <summary>Example</summary>

   ![](https://botonic-doc-static.netlify.com/images/whatsplayground/whatsplayground3.png)
   </details>

Note: WhatsApp Playground integration is intended for **demos and testing purposes only**, avoid using it for production applications.

For more information about WhatsApp full integration, contact us via **[Slack](https://slack.botonic.io/)**.

## Facebook Messenger

Facebook Messenger is one of the best messenger platforms for deploying chatbots with its variety of **[components](/docs/components/components)** outputs.

1. Connect your Facebook account to Hubtype and accept the permissions.
2. Select which of your Facebook Pages you want to connect. If you don't have one, create one **[here](https://www.facebook.com/pages/create/)** and click on **refresh**.
3. Click on **Connect Page**.

A new integration appears on the left side. Click on the Facebook Messenger link and start talking to your bot!

<details>
<summary>Example</summary>

![](https://botonic-doc-static.netlify.com/images/fb_channel.png)

</details>

## Telegram

1. Create a Telegram bot. To do so, send the message `/newbot` to **[@BotFather](https://t.me/botfather)** and follow the steps.
2. Add the bot username and token and press the `Connect bot` button.

<details>
<summary>Example</summary>

![](https://botonic-doc-static.netlify.com/images/tg_channel.png)

</details>

## Twitter

- Follow the integration steps as displayed.

**Limitation**: You can only have a unique webhook per environment. So it's important to check this option when you want to integrate your bot in your Twitter App.

<details>
<summary>Example</summary>

![](https://botonic-doc-static.netlify.com/images/twitter_channel.png)

</details>
