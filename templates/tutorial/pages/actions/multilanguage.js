import React from 'react'
import { Botonic, i18n as _ } from 'botonic'


export default class extends Botonic.React.Component {
    static async botonicInit({req}) {
        this.setLocale(req, 'es')
    }

  render() {
    return (
        <messages>
            <message type="text">
                {_('multilang.text1')} 😊 {_('multilang.text2')}
            </message>
            <message type="text">
                {_('multilang.text3')}
            </message>
        </messages>
    )
  }
}
