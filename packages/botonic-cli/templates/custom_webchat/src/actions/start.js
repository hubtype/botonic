import React from 'react'
import { Text, Button, Reply } from '@botonic/react'

export default class extends React.Component {
	render() {
		return (
			<>
				<Text>
					This is an example bot of how to customize your webchat.
					<Button url="https://botonic.io">Visit botonic.io</Button>
				</Text>
				<Text>
					Am I pretty?
					<Reply payload="yes">Absolutely</Reply>
					<Reply payload="no">Meh..</Reply>
				</Text>
			</>
		)
	}
}
