import Hi from './actions/hi'
import Bye from './actions/bye'

export const routes = [
	/* Captures different intents (enable the Dialogflow integration,
        see "integrations" section at the top of this file) */
	{ path: 'hi', intent: 'smalltalk.greetings.hello', action: Hi },
	{ path: 'bye', intent: 'smalltalk.greetings.bye', action: Bye }

	/* There's an implicit rule that captures any other input and maps it to
        the 404 action, it would be equivalent to:
        {type: /^.*$/, action: "404"}
        */
]
