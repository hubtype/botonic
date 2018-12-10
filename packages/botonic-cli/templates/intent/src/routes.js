module.exports = {
  routes: [
    /* Captures different intents (enable the Dialogflow integration,
        see "integrations" section at the top of this file) */
    { intent: 'smalltalk.greetings.hello', action: 'hi' },
    { intent: 'smalltalk.greetings.bye', action: 'bye' }

    /* There's an implicit rule that captures any other input and maps it to
        the 404 action, it would be equivalent to:
        {type: /^.*$/, action: "404"}
        */
  ]
}
