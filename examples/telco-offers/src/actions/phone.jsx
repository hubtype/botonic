import React from 'react'
import { RequestContext, Text, Button } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext
  render() {
    let _ = this.context.getString

    const renderTable = (minutes, data, price) => {
      return (
        `| ${_('minutes')} | ${_('data')} | ${_('price')} |\n` +
        `| :-: | :-: | :-: |\n` +
        `|  ${minutes}  |  ${data}  |  ${price}  |\n`
      )
    }
    const payloadUnlimited = `buyPhone-${_('unlimited')}-${_(
      'unlimited'
    )}-23.50`
    return (
      <>
        <Text> {_('contract_phone')}</Text>
        <Text>
          {renderTable(`${_('unlimited')}`, `${_('unlimited')}`, '23.50$')}
          <Button payload={payloadUnlimited}>{_('choose')}</Button>
        </Text>
        <Text>
          {renderTable('200', '20GB', '15.50$')}
          <Button payload='buyPhone-200-20GB-15.50'>{_('choose')}</Button>
        </Text>
        <Text>
          {renderTable('50', '5GB', '7.50$')}
          <Button payload='buyPhone-50-5GB-7.50'>{_('choose')}</Button>
        </Text>
      </>
    )
  }
}
