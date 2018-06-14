module.exports = {
    integrations: {
        /* Uncomment this to enable NLP with Dialogflow
        dialogflow: {
            token: "YOUR_DIALOGFLOW_API_TOKEN"
        }*/
    },
    routes: [
        {text: /^hi$/i, action: "hi",
            childRoutes: [
                {text: /^child1$/i, action: "child1", 
                    childRoutes: [
                        {text: /^child1-1$/i, action: "child1-1"},
                        {text: /^child1-2$/i, action: "child1-2"}
                    ]
                },
                {text: /^child2$/i, action: "child2", 
                    childRoutes: [
                        {text: /^child2-1$/i, action: "child2-1"},
                        {text: /^child2-2$/i, action: "child2-2"}
                    ]
                }
            ]
        },

        /* There's an implicit rule that captures any other input and maps it to
        the 404 action, it would be equivalent to:
        {type: /^.*$/, action: "404"}
        */
    ]
}