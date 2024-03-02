import React from 'react'
import { RequestContext, Text, Button } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext
  static async botonicInit(request) {
    const reservationInfo = request.input.payload.split('-')
    const internet = {
      data: reservationInfo[1],
      price: reservationInfo[2],
    }
    request.session.user.extra_data.internet = internet
    return {
      minutes: internet.minutes,
      data: internet.data,
      price: internet.price,
    }
  }

  render() {
    let _ = this.context.getString
    let payloadYes = `buyOffer-${_('offer.tv')}-6.50`
    return (
      <>
        <Text>
          {_('after_buy_internet')} {'\n'}
          **{_('data')}**: {this.props.data}
          {'\n'}
          **{_('price')}**: {this.props.price}${'\n'}
        </Text>
        <Text>
          {_('offer.text')}
          <Button payload={payloadYes}>{_('offer.yes')}</Button>
          <Button payload='buyOffer-no'>{_('offer.no')}</Button>
        </Text>
      </>
    )
  }
}
