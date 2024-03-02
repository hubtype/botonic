import {
  Button,
  Carousel,
  Element,
  Pic,
  RequestContext,
  Subtitle,
  Title,
} from '@botonic/react'
import fetch from 'isomorphic-fetch'
import React from 'react'

export default class extends React.Component {
  static contextType = RequestContext
  static async botonicInit({ input, session, params, lastRoutePath }) {
    /* This is how you fetch data from an API: */
    //const res = await fetch('https://api.example.com/user')
    //const user = await res.json()

    const api_key = 'YOUR_API_KEY' // pragma: allowlist secret
    const url =
      'http://api.shopstyle.com/api/v2/products?pid=' +
      api_key +
      '&fts=' +
      input.data +
      '&offset=0&limit=5'
    const res = await fetch(url, {
      url: url,
      method: 'GET',
      params: {},
    })
    session.resp = await res.json()
  }

  render() {
    return (
      <Carousel>
        {this.context.session.resp.products.map((e, i) => (
          <Element key={e.name}>
            <Pic src={e.image.sizes.Best.url} />
            <Title>{e.name}</Title>
            <Subtitle>{e.priceLabel}</Subtitle>
            <Button url={e.clickUrl}>Open Product</Button>
          </Element>
        ))}
      </Carousel>
    )
  }
}
