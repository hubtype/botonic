import React from 'react'
import { RequestContext, Text, Button } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext
  static async botonicInit(request) {
    const tv = request.session.user.extra_data.tv
    const internet = request.session.user.extra_data.internet
    const phone = request.session.user.extra_data.phone
    const priceTV = (tv && parseFloat(tv.price)) || 0.0
    const priceInternet = (internet && parseFloat(internet.price)) || 0.0
    let pricePhone = 0.0
    phone.forEach(m => {
      pricePhone = pricePhone + parseFloat(m.price)
    })
    const price = priceTV + priceInternet + pricePhone
    return { tv, internet, phone, price }
  }

  render() {
    let _ = this.context.getString

    const getInternet = () => {
      if (this.props.internet)
        return `**${_('internet')}**: 
        ${_('data')}: ${this.props.internet.data} 
        ${_('price')}: ${this.props.internet.price}$
        `
      return null
    }
    const getPhone = () => {
      if (this.props.phone)
        return this.props.phone.map(
          (m, i) =>
            `**${_('phone')} ${i + 1}**:
            ${_('minutes')}: ${m.minutes}
            ${_('data')}: ${m.data}
            ${_('price')}: ${m.price}$
        `
        )
      return null
    }
    const getTV = () => {
      if (this.props.tv)
        return `\n**${_('tv')}**:
        ${_('data')}: ${this.props.tv.name}
        ${_('price')}: ${this.props.tv.price}$
        `
      return null
    }
    return (
      <>
        <Text>
          {_('summary')} {'\n'}
          {getInternet()}
          {getPhone()}
          {getTV()}
          **Total: {this.props.price}$**
        </Text>
        <Text delay={2}>
          {_('continue')}
          <Button payload='confirm'>{_('confirm.yes')}</Button>
          <Button payload='bye-canceled'>{_('confirm.no')}</Button>
        </Text>
      </>
    )
  }
}
