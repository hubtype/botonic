---
id: supported-platforms
title: Supported Platforms
---

Botonic supports several messaging platforms, such as:

---
**[Webchat](#webchat) | [WhatsApp](#whatsapp)  | [Facebook Messenger](#facebook-messenger) | [Telegram](#telegram) | [Twitter](#twitter)** 

---

The first steps to embed a bot are common to all platforms:

1. Once your bot is deployed, log in to [app.hubtype.com](https://app.hubtype.com/) and click on the Bot icon.
2. Select your bot and click on Integrate a Messenger.
3. Select the relevant messaging app as described below.

> ## Webchat

You can integrate your chatbot into your personal webpage. This integration is 100% editable, i.e. you can display all messages with your own style.

1. Give a name to this integration (as you can have multiple webchat integrations with the same bot) and click `Enable Webchat`.
2. Some HTML code will be displayed. Inject this code in your webpage. Note that the script has to be injected in the `header` tag, and the bot initialization in the `body` tag.

For more information, refer to the [Custom Webchat](templates/custom-webchat) template description.

<details>
<summary>Example</summary>
![](https://botonic-doc-static.netlify.com/images/webchat_channel.png)
/>  

</details>

> ## WhatsApp

Coming soon.

> ## Facebook Messenger

Facebook Messenger is one of the best messenger platforms for deploying chatbots with its variety of [components](/concepts/components) outputs.

1. Connect your Facebook account to Hubtype and accept the permissions.
2. Select which of your Facebook Pages you want to connect. If you don't have one, create one [here](https://www.facebook.com/pages/create/) and click on **refresh**.
3. Click on **Connect Page**.

A new integration appears on the left side. Click on the Facebook Messenger link and start talking to your bot!

<details>
<summary>Example</summary>
![](https://botonic-doc-static.netlify.com/images/fb_channel.png)
/>

</details>

> ## Telegram

1. Create a bot from the Telegram app.
2. Add the bot username and token and press the `Connect bot` button.

<details>
<summary>Example</summary>
	![](https://botonic-doc-static.netlify.com/images/tg_channel.png)
</details>

> ## Twitter

- Follow the integration steps as displayed.

Limitation: in your Twitter App, you can only have a unique webhook per environment. So it's important to check this option when you want to integrate your bot into your Twitter App.

<details>
<summary>Example</summary>
![](https://botonic-doc-static.netlify.com/images/twitter_channel.png)
</details>

