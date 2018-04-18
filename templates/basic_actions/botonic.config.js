module.exports = {
    routes: [
        {text: /^hi/, action: "hi"},
        {text: /^(welcome)(\\?|!|¡|,|.|¿)*$/, action: "hi"},
        {text: (t) => t.startsWith('z'), action: "z_words"},
        {payload: "yes", action: "yes"},
        {payload: "no", action: "no"},
        {text: "bye", action: "bye"},
    ]
}