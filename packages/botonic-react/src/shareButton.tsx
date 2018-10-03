import * as React from 'react'

export class ShareButton extends React.Component {
	props: {
      payload?: any;
    }
	render() {
		return (
			<button type="element_share">
				<pre dangerouslySetInnerHTML={{__html: JSON.stringify(this.props.payload)}}></pre>
			</button>
		)
	}
}