import React from 'react'
import { RequestContext, Text, Button } from '@botonic/react'

export default class extends React.Component {
  static contextType = RequestContext
  render() {
    let _ = this.context.getString

    const renderTable = (data, price) => {
      return (
        `| ${_('speed')} | ${_('price')} |\n` +
        `| :-: | :-: |\n` +
        `|  ${data}  |  ${price}  |\n`
      )
    }
    return (
      <>
        <Text> {_('contract_internet')}</Text>
        <Text>
          {renderTable('100Mb', '29.50$')}
          <Button payload='buyInternet-100Mb-29.50'>{_('choose')}</Button>
        </Text>
        <Text>
          {renderTable('600Mb', '36.50$')}
          <Button payload='buyInternet-600Mb-36.50'>{_('choose')}</Button>
        </Text>
      </>
    )
  }
}
