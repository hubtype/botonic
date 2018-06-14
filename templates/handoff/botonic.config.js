module.exports = {
    integrations: {
        /* Uncomment this to enable NLP with Dialogflow
        dialogflow: {
            token: "YOUR_DIALOGFLOW_API_TOKEN"
        }*/
    },
    routes: [
    
        {text: /^handoff$/i, action: "transfer_agent"}
        /* There's an implicit rule that captures any other input and maps it to
        the 404 action, it would be equivalent to:
        {type: /^.*$/, action: "404"}
        */
    ]
}