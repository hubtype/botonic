module.exports = {
    integrations: {
        /* Uncomment this to enable NLP with Dialogflow
        dialogflow: {
            token: "YOUR_DIALOGFLOW_API_TOKEN"
        }*/
    },
    routes: [

        /* The first rule matches if and only if we get the text 'hi' and will execute the 
        React component defined in pages/actions/hi.js */
        {text: "hi", action: "hi"},



        /* These rules capture different payloads */
        {payload: "mens-shirts", action: "mens-shirts"},
        {payload: "womens-shirts", action: "womens-shirts"},


        /* There's an implicit rule that captures any other input and maps it to
        the 404 action, it would be equivalent to:
        {type: /^.*$/, action: "404"}
        */
    ]
}