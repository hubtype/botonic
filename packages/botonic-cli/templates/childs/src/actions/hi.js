import React from 'react'
import { Text, Reply } from '@botonic/react'

export default class extends React.Component {
	render() {
		return (
			<Text>
				Hi! Choose what you want to eat:
				<Reply payload="pizza">Pizza</Reply>
				<Reply path="pasta">Pasta</Reply>
			</Text>
		)
	}
}
