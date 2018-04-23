module.exports = {
    integrations: {
        dialogflow: {
            token: "0fba90dec8ee475dbf33e00fb1c51ef0"
        }
    },
    routes: [
        {text: /^(go)$/, action: "go"},
        {text: /^(buttons)$/, action: "buttons"},
        {text: /^(quickreply)$/, action: "quickreply"},
        {payload: "carrousel", action: "carrousel"},
        {payload: "AI", action: "ai"},
        {text: "bye", action: "bye"},
        {intent: "smalltalk.agent.funny", action: "funny"},
        {intent: "smalltalk.agent.good", action: "funny"},
        {intent: "smalltalk.user.likes_agent", action: "funny"},
    ]
}