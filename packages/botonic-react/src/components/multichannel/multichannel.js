import React from 'react'
import { RequestContext } from '../../contexts'

export class Multichannel extends React.Component {
  static contextType = RequestContext
  constructor(props) {
    super(props)
  }
  render() {
    if (this.context.session.user.provider == this.props.channel) {
      return this.props.children
    }
    return null
  }
}
