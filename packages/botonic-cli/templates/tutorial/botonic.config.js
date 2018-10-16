module.exports = {
    integrations: {
        /* Uncomment this to enable NLP with Dialogflow
        dialogflow: {
            token: "YOUR_DIALOGFLOW_API_TOKEN"
        }*/
    },
    routes: [
        /* Routes map user inputs to actions (React Components)
        A user input is an object like this:
        {
            type: "text", // Input type, it can be one of text, postback, image, video, audio, document, location
            data: "Hello!" // Raw text (or attachment URL if it's a media type)
            payload: "", // This is used when the user has clicked on a button or quick reply
            intent: "smalltalk.greeting" Intent ID according to the NLP backend
        }

        Every route (an entry in this array) is composed by a matching rule and an action.
        A matching rule looks like this: {attribute: test}, which basically means: "take that
        attribute from the user input and apply the test" if test passes, the action defined in
        that route will be triggered.

        There are 3 types of tests:
        - String --> Perfect match
        - Regexp --> Pass the regular expression
        - Function --> Passes if the function returns true

        The rules will be tested in order so if the 1st rule matches, Botonic won't test
        other routes and will execute the 1st action.
        If there are several matching rules in the same route, all of them have to pass
        to consider a match.
        */

        /* The first rule matches if and only if we get the text 'start' and will execute the 
        React component defined in pages/actions/start.js */
        {text: "start", action: "start"},

        /* Another text rule (perfect match) to trigger the 'end' action */
        {text: "end", action: "end"},

        /* These rules use a case insensitive regexp to match text messages that contain
        a certain text, for example the 1st one will capture 'BUTTONS', 'Buttons', etc */
        {text: /^buttons$/i, action: "buttons"},
        {text: /^quickreply$/i, action: "quickreply"},
        /* If you want to use regexp with grouped values, you need to upgrade Node to v.10
        or ahead. This regular expression match 'age-{NUMBER}' where NUMBER can be any digit.
        Then, in your component 'bye', you can access to this that in 'req.params'
        {text: /^age-(?<age>\d*)/, action: "age"},
        */

        /* These rules capture different payloads */
        {payload: "carrousel", action: "carrousel"},
        {payload: /^(yes|no)$/, action: "quickreply_response"},

        /* Here is an example of how you can integrate Facebook Webviews with your bot */
        {text:/^webviews$/i, action:"webviews"},
        /* After closing a webview, sometimes we want obtain its data, these are some examples */
        {payload: /^DATA_.*/, action:'webviews_response'},
        {payload: "closed_webview", action:"closed_webview"},

        /* This rule uses a function test to capture any text that starts with 'bye' */
        {text: (t) => t.startsWith('bye'), action: "bye"},

        /* Captures any image */
        {type: "image", action: "media"},

        /* Shows how i18n works in botonic */
        {text: "multilanguage", action: "multilanguage"},

        /* Captures different intents (enable the Dialogflow integration,
        see "integrations" section at the top of this file) */
        {intent: "smalltalk.agent.funny", action: "funny"},
        {intent: "smalltalk.agent.good", action: "funny"},
        {intent: "smalltalk.user.likes_agent", action: "funny"},

        /* There's an implicit rule that captures any other input and maps it to
        the 404 action, it would be equivalent to:
        {type: /^.*$/, action: "404"}
        */
    ]
}