import React from 'react'
import { RequestContext, Text, Button } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext
  static async botonicInit(request) {
    const reservationInfo = request.input.payload.split('-')
    const hasPhone = request.session.user.extra_data.phone.length > 0
    if (reservationInfo[1] !== 'no') {
      const tv = {
        name: reservationInfo[1],
        price: reservationInfo[2],
      }
      request.session.user.extra_data.tv = tv
      return { tv: tv, hasPhone }
    }
    return { hasPhone }
  }

  render() {
    let _ = this.context.getString
    return (
      <>
        {this.props.tv && (
          <Text>
            {_('after_buy_offer')} {'\n'}
            **TV**: {this.props.tv.name}
            {'\n'}
            **{_('price')}**: {this.props.tv.price}$
          </Text>
        )}
        <Text>
          {_('ask_more')}
          <Button payload='phone'>
            {this.props.hasPhone ? _('extra_phone') : _('phone')}
          </Button>
          <Button payload='summary'>{_('done')}</Button>
        </Text>
      </>
    )
  }
}
