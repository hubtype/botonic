import React from 'react'
import TestRenderer from 'react-test-renderer'

import { Button, customMessage, Reply, Text } from '../../src/components'
import { getElementName } from '../../src/components/components'
import { createErrorBoundary } from '../../src/util/error-boundary'

const renderToJSON = sut => TestRenderer.create(sut).toJSON()

test('TEST: CustomMessage defaultProps, props and children are injected into the component', () => {
  class CustomComponent extends React.Component {
    render() {
      return <Text>{this.props.wrappedProp + this.props.children}</Text>
    }
  }

  const Sut = customMessage({
    name: 'test1',
    component: CustomComponent,
    defaultProps: { wrapperProp: 'wrapperPropV' },
  })
  const tree = renderToJSON(<Sut wrappedProp='wrappedPropV'>body</Sut>)
  expect(tree).toMatchSnapshot()
})

describe('CustomMessage replies', () => {
  function names(children) {
    if (Array.isArray(children)) {
      return children.map(c => getElementName(c)).join(',')
    }
    return getElementName(children)
  }

  function reply(key) {
    return (
      <Reply key={key} payload={`payload${key}`}>
        reply{key}
      </Reply>
    )
  }

  function button(key) {
    return (
      <Button key={key} payload={`payload${key}`}>
        button{key}
      </Button>
    )
  }

  for (const children of [
    reply(), // single reply
    button(), // single no reply
    [reply(1), reply(2)], // multiple all reply
    [reply(1), button(2)], // mix reply & no reply
    [button(1), button(2)], // multiple no reply
  ]) {
    test(`TEST: replies are moved outside the custom component ${names(
      children
    )}`, () => {
      class CustomComponent extends React.Component {
        render() {
          return <Text>{this.props.children}</Text>
        }
      }

      const Sut = customMessage({
        name: 'test1',
        component: CustomComponent,
      })
      const tree = renderToJSON(<Sut>{children}</Sut>)
      expect(tree).toMatchSnapshot()
    })
  }
})

describe('CustomMessage failing', () => {
  class FailingComponent extends React.Component {
    // eslint-disable-next-line react/require-render-return
    render() {
      throw Error('Forced exception')
    }
  }

  test('TEST: ErrorBoundary on a failing component', () => {
    const Sut = customMessage({
      name: 'test1',
      component: FailingComponent,
      defaultProps: { wrapperProp: 'wrapperPropV' },
    })
    const tree = renderToJSON(<Sut />)
    expect(tree).toMatchSnapshot()
  })

  test('TEST: ErrorBoundary different errorComponent which gets the props', () => {
    const Sut = customMessage({
      name: 'test1',
      component: FailingComponent,
      errorBoundary: createErrorBoundary({
        // eslint-disable-next-line react/display-name
        errorComponent: props => (
          <Text>{`Boom!${props.bang}: ${props.errorMessage}`}</Text>
        ),
      }),
    })
    const tree = renderToJSON(<Sut bang='Bang!' />)
    expect(tree).toMatchSnapshot()
  })
})
