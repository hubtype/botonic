import React from 'react'
import fetch from 'isomorphic-fetch'

export default class extends React.Component {

  static async botonicInit({ req }) {
    /* This is how you fetch data from an API: */
    //const res = await fetch('https://api.example.com/user')
    //const user = await res.json()

    const api_key = "uid8900-40385330-57"
    const url = 'http://api.shopstyle.com/api/v2/products?pid='+api_key+'&fts='+req.input.data+'&offset=0&limit=5'
    const res = await fetch(url,{
      "url": url,
      "method": "GET",
      "params": {}
    })

    req.context.resp = await res.json()

  }

  render() {
    return (
      <messages>
        <message type="carrousel">
            {this.props.context.resp.products.map((e, i) => 
                <element key={e.name}>
                    <pic>{e.image.sizes.Best.url}</pic>
                    <title>{e.name}</title>
                    <desc>{e.priceLabel}</desc>
                    <button url={e.clickUrl}>Open Product</button>
                </element>
            )}
        </message>
      </messages>
    )
  }
}