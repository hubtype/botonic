import React from 'react'

export default class ShareButton extends React.Component {
	render() {
		return (
			<button type="element_share">
				<pre dangerouslySetInnerHTML={{__html: JSON.stringify(this.props.payload)}}></pre>
			</button>
		)
	}
}