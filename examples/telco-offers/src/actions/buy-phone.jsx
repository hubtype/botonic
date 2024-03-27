import React from 'react'
import { RequestContext, Text, Button } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext
  static async botonicInit(request) {
    const reservationInfo = request.input.payload.split('-')
    const phone = {
      minutes: reservationInfo[1],
      data: reservationInfo[2],
      price: reservationInfo[3],
    }
    request.session.user.extra_data.phone.push(phone)
    return {
      minutes: phone.minutes,
      data: phone.data,
      price: phone.price,
    }
  }

  render() {
    let _ = this.context.getString
    return (
      <>
        <Text>
          {_('after_buy_phone')} {'\n'}
          **{_('minutes')}**: {this.props.minutes}
          {'\n'}
          **{_('data')}**: {this.props.data}
          {'\n'}
          **{_('price')}**: {this.props.price}${'\n'}
        </Text>
        <Text>
          {_('ask_more')}
          <Button payload='internet'>{_('internet')}</Button>
          <Button payload='phone'>{_('extra_phone')}</Button>
          <Button payload='summary'>{_('done')}</Button>
        </Text>
      </>
    )
  }
}
