import React from 'react'

import { Text } from '../../src/components'
import {
  getComponentTypeName,
  getElementName,
} from '../../src/components/components'

describe('getDisplayName', () => {
  test('React.Component', () => {
    class Comp extends React.Component {
      render() {
        return null
      }
    }
    expect(getElementName(<Comp />)).toEqual('Comp')
    expect(getComponentTypeName(Comp)).toEqual('Comp')
  })

  test('React.Function', () => {
    const Func = props => <Text />
    expect(getElementName(<Func />)).toEqual('Func')
    expect(getComponentTypeName(Func)).toEqual('Func')
  })
})
