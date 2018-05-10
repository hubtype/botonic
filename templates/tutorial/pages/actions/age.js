import React from 'react'

export default class extends React.Component {

	static async getInitialProps({ req }) {
		/*
		We can access to the user information that matched the regular expression
		and it's stored in the params field.
		*/
		const userInfo = req.params
		return { userInfo }
	}

  render() {
    return (
        <message type="text">
            I know your age, and it's {this.props.userInfo.age}
        </message>
    )
  }
}