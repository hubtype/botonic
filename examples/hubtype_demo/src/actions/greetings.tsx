import * as cms from '@botonic/plugin-contentful'
import * as React from 'react'
import { INITIAL_TEXT_ID, INITIAL_OPTIONS_ID } from './constants'
import { ActionInitInput } from '@botonic/react'
import { renderText } from '../../cms'

export default class extends React.Component {
  static displayName = 'Text'

  static async botonicInit(init: ActionInitInput) {
    let botoplugin: cms.default = init.plugins.contentful
    let sayHi = init.session['sayHi']
    if (init.session['sayHi']) init.session['sayHi'] = false

    let firstText = await botoplugin.cms.text(INITIAL_TEXT_ID)
    let secondText = await botoplugin.cms.text(INITIAL_OPTIONS_ID)

    return { firstText, secondText, sayHi }
  }

  render(): React.ReactNode {
    let sayHi = (this.props as any)['sayHi'] as boolean
    let firstText = (this.props as any)['firstText'] as cms.Text
    let secondText = (this.props as any)['secondText'] as cms.Text
    if (sayHi) {
      return (
        <>
          {renderText(firstText)}
          {renderText(secondText)}
        </>
      )
    } else {
      return renderText(secondText)
    }
  }
}
