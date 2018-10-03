import * as React from 'react'

export class MessageTemplate extends React.Component {
	props: {
      payload?: any;
    }
	render() {
		return (
			<message type="template">
				<pre dangerouslySetInnerHTML={{__html: JSON.stringify(this.props.payload)}}></pre>
			</message>
		)
	}
}