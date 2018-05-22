import * as React from "react"
import * as fs from 'fs'
import { join, resolve } from 'path'

export class Component extends React.Component {

  static async getInitialProps(args: any) {

    await this.botonicInit(args)
    return {
      input: args.input,
      context: args.req.context,
      params: args.params
    }
  }

  public lang: string = 'en_EN';

  setLanguage(l: string){
    this.lang = l
  }

  getLiteral(id: string) {

    var literals: any = {}
    var literals = require(process.cwd() + '/.next/dist/bundles/pages/literals/' + this.lang)
    return literals.literals[id]
  }

  static async botonicInit(args: any) {
  }

  static async humanHandOff(req: any) {
    req.context['_botonic_action'] = 'create_case'
  }
}