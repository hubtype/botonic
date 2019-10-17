import React from 'react'
import { Text } from '@botonic/react'

export default class extends React.Component {
	render() {
		return <Text>I know your age, and it's {this.context.params.age}</Text>
	}
}
