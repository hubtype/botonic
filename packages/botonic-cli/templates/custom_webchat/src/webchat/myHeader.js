import Logo from '../assets/bot_vader.jpg'
import React from 'react'

export const MyHeader = props => {
	var scriptBaseUrl = document
		.querySelector('script[src$="webchat.botonic.js"]')
		.getAttribute('src')
	var scriptName = scriptBaseUrl.split('/').pop()
	scriptBaseUrl = scriptBaseUrl.replace('/' + scriptName, '/')
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'flex-end',
				backgroundColor: 'pink',
				color: 'saddlebrown'
			}}
		>
			<img
				style={{
					height: 24,
					margin: '0px 12px'
				}}
				src={scriptBaseUrl + Logo}
			/>
			<h2
				style={{
					margin: 0,
					fontFamily: 'Arial, Helvetica, sans-serif'
				}}
			>
				Custom Webchat Title
			</h2>
		</div>
	)
}
