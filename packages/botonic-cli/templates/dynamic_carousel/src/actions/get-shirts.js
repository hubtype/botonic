import React from 'react'
import fetch from 'isomorphic-fetch'
import {
  Text,
  Pic,
  Carousel,
  Element,
  Subtitle,
  Title,
  Button
} from '@botonic/react'

export default class extends React.Component {
  static async botonicInit({ input, session, params, lastRoutePath }) {
    /* This is how you fetch data from an API: */
    //const res = await fetch('https://api.example.com/user')
    //const user = await res.json()

    const api_key = 'uid8900-40385330-57'
    const url =
      'http://api.shopstyle.com/api/v2/products?pid=' +
      api_key +
      '&fts=' +
      input.data +
      '&offset=0&limit=5'
    const res = await fetch(url, {
      url: url,
      method: 'GET',
      params: {}
    })

    let resp = await res.json()
    return { resp }
  }

  render() {
    return (
      <Carousel>
        {this.props.resp.products.map((e, i) => (
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
