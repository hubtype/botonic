---

title: Plugin Dialogflow
id: plugin-dialogflow

---

---

For more information, refer to **[GitHub](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-dialogflow)**.

---

## What Does This Plugin Do?

This plugin uses [Dialogflow](https://dialogflow.com/) as NLU service. The variables `intent`, `confidence`, `entities`, `defaultFallback`, `dialogflowResponse` are automatically available inside the `input` object.

## Setup

### Install the Plugin

To integrate your bot with Dialogflow, you must use the `intent` example, which comes with `@botonic/plugin-dialogflow` by default.

> `$ botonic new test-bot intent`

### Get a Service Account key in DialogFlow

1. Click on the gear icon, to the right of the agent name.

2. Under the **GOOGLE PROJECT** section, click on the name of the **Service Account**.
3. This will take you to the Google Cloud Platform Service Accounts page, but you first need to update the Service Account's role.

4. Click on the menu button in the upper left-hand corner and click on **IAM & admin**.

5. Click on **Service Accounts** in the left-hand menu.

6. Click on the **Create Service Account** button at the top of the page.

7. In the pop up, enter a name for the service account.

8. Click on **Role**. Under the **Dialogflow** category, select the desired role.

### Generate a JSON key

1. Check the **Furnish a new private key** option and make sure **JSON** is selected for **Key type**.

2. Click the **Create** button.
3. The JSON file is downloading. Select a location to save it and confirm.

**Note:** You can only download this JSON file once, so make sure to save the file and keep it somewhere safe. If you lose this key or it becomes compromised, you can use the same process to create another one.

## Use

### Add the intent

Add the intent in the **route.js** file:

```javascript
export const routes = [
  { path: 'hi', intent: 'Default Welcome Intent', action: Hi },
]
```

### Add the JSON content file

Under `resolve: require("@botonic/plugin-dialogflow"),`, add the JSON content key.

**Note:** This is case-sensitive so make sure to paste exactly what you copied.

You should obtain something like this:

```javascript
export const plugins = [
  {
    id: 'dialogflow',
    resolve: require('@botonic/plugin-dialogflow'),
    options: {
      type: '',
      project_id: '',
      private_key_id: '',
      private_key: '',
      client_email: '',
      client_id: '',
      auth_uri: '',
      token_uri: '',
      auth_provider_x509_cert_url: '',
      client_x509_cert_url: '',
    },
  },
]
```

### Run and Deploy

Finally run `botonic serve` to test your intents locally, or `botonic deploy` to deploy the bot.

**Note:** Refer to Dialogflow to [migrate your agents to V2](<(https://dialogflow.com/docs/reference/v1-v2-migration-guide#switch_your_agent_from_v1_to_v2)>) and to get the [JSON key](https://dialogflow.com/docs/reference/v2-auth-setup).
