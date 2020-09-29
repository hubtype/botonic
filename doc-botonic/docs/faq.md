---
id: faq
title: FAQ
---

><details><summary><b>How do I integrate a chat in a website?</b></summary>
Once you deploy a bot,  you get a link to integrate different channels, including the "webchat" channel, which is a JavaScript snippet that you can embed in your website.
</details>

><details><summary><b>Can I edit my chat styles?</b></summary>
>Yes, you can edit your chat styles. Hubtype provides support for web chat (JS SDK) and in-app chat (iOS/Android SDK). 
>You can't change the style of messaging apps like WhatsApp or Facebook Messenger though, as they embed html pages within their chat window. In this particular case, only webviews can be customized.
></details>

><details><summary><b>How can I create a full chat window with Botonic Webchat?</b></summary>
>You can create a chat interface where a whole chat window is displayed (not just an embedded webchat in a website). Although this option is not pre-configured, you can do it by using webpack. To do so, you must create a "self-hosted" project in "src/self-hosted" in your botonic project. Then, replace "webchat.template.html" by your own HTML file. Configure the style of the webchat to fit the entire screen with 100% values for height and length. Finally, define "onInit:app=>app.ope" to load and open it by default.
></details>

><details><summary><b>How do I delete a bot?</b></summary>
Go to https://app.hubtype.com/bots/all and select your bot. Then click on the "Settings" tab and on "Delete this bot".
</details>

><details><summary><b>How to deal with NLP/NLU?</b></summary>
>To deal with NLP/NLU, you can use the Botonic NLU plugin. It allows you to create different intents and assign keywords or phrases. These will match with the intent and direct to the corresponding route. You can also integrate Dialogflow, Watson, Luis or Inbenta.
></details>

><details><summary><b>Where can I deploy my Botonic bots?</b></summary>
The easiest way is to deploy it to hubtype.com cloud. Hubtype sets up all the infrastructure you need, scales automatically and manages third-party integrations.
You can also to run it and deploy anywhere. You just need some developement to make the integration with messaging channels work.
></details>

><details><summary><b>How do I connect Botonic with Zendesk?</b></summary>
>Although Zendesk integration is not a Botonic open-source plugin like DialogFlow, you can do it by deploying your bot and contact the Botonic team on Slack. They will help you with the next steps.
></details>

><details><summary><b>External API calls are not being executed on the deployed bot, although it works locally. Why?</b></summary>
You have to call it from botonicInit and make sure to await the response.
></details>

><details><summary><b>Where does the content live?</b></summary> 
Botonic project is just like a web project. So it can live in the react components that make up the website only, or they can be pulled from an external system like a CMS.
></details> 

><details><summary><b>Can content come from elsewhere?</b></summary>
We have a contentful plugin because we use contentful a lot and we do more stuff than "just loading content". But you don't need a plugin to fetch content from other CMS, you can fetch their APIs directly or use a Javascript library directly in your Botonic actions, if they have one.
></details>

><details><summary><b>How much does it cost to host the project on Hubtype?</b></summary>
There is no defined pricing yet. You can run your bots for free up to 500 monthly active users, after that we would set up a call to find a pricing that suits you.
></details>

><details><summary><b>How can I open a webchat triggered by a button?</b></summary> 
You can open the webchat anytime from the Javascript API. To do so, just call Botonic.open() . You can try it from the chrome console.
></details>

><details><summary><b>How to get responses from google Dialogflow knowledge base?</b></summary>
The current dialogflow plugin doesn't support knowledge base. However, botonic plugins are very easy to build and extend, if you can submit a pull request we'll be glad to merge it!
></details>

><details><summary><b>Does Botonic handle all the conversational logic? Or does it require another system, like Dialogflow?</b></summary>Botonic has its own NLU plugin called "botonic-plugin-nlu". There are also available plugins to integrate with well-known systems like Dialogflow, LUIS, etc. 
></details>
