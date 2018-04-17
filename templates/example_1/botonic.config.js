module.exports = {
    integrations: {
        dialogflow: {
            token: "0fba90dec8ee475dbf33e00fb1c51ef0"
        }
    },
    routes: [
        {text: /^hi/, action: "hi"},
        {text: (t) => t.startsWith('bye'), action: "bye"},
        {payload: "yes", action: "yes"},
        {payload: "no", action: "no"},
        {text: "bye", action: "bye"},
        {intent: "smalltalk.agent.funny", action: "funny"},
        {intent: "smalltalk.agent.good", action: "funny"},
        {intent: "smalltalk.user.likes_agent", action: "funny"},
    ]
}