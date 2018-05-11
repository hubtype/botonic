import * as React from "react"

export class Component extends React.Component {

  static async getInitialProps(params:any) {
    this.botonicInit(params)
    return { context: params.req.context }
  }

  static async botonicInit(params: any) {

  }
}

