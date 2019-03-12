import React from 'react'

export const MyReply = props => (
	<div
		style={{
			color: '#3333cc',
			border: '2px solid red',
			backgroundColor: 'pink',
			borderRadius: 15,
			padding: 5,
			cursor: 'pointer'
		}}
	>
		{props.children}
	</div>
)
