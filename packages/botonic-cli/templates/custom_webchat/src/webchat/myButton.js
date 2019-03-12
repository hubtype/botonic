import React from 'react'

export const MyButton = props => (
	<div
		style={{
			color: '#3333cc',
			border: '1px solid red',
			backgroundColor: 'pink',
			borderRadius: 8,
			cursor: 'pointer',
			paddingLeft: 10
		}}
	>
		{props.children}
	</div>
)
