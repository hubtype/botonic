import React from 'react'

export default class MessageTemplate extends React.Component {
	render() {
		return (
			<message type="template">
				<pre dangerouslySetInnerHTML={{__html: JSON.stringify(this.props.payload)}}></pre>
			</message>
		)
	}
}