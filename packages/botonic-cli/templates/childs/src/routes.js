module.exports = {
    routes: [
        {text: /^hi$/i, action: "hi",
            childRoutes: [
                {payload: /^pizza$/i, action: "pizza", 
                    childRoutes: [
                        {payload: /^sausage$/i, action: "sausage"},
                        {payload: /^bacon$/i, action: "bacon"}
                    ]
                },
                {payload: /^pasta$/i, action: "pasta", 
                    childRoutes: [
                        {payload: /^cheese$/i, action: "cheese"},
                        {payload: /^tomato$/i, action: "tomato"}
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