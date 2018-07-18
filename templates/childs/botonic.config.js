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
                {text: /^pizza$/i, action: "pizza", 
                    childRoutes: [
                        {text: /^sausage$/i, action: "sausage"},
                        {text: /^bacon$/i, action: "bacon"}
                    ]
                },
                {text: /^pasta$/i, action: "pasta", 
                    childRoutes: [
                        {text: /^cheese$/i, action: "cheese"},
                        {text: /^tomato$/i, action: "tomato"}
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