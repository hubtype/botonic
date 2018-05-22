import * as React from "react"
import * as fs from 'fs'
import { join, resolve } from 'path'


export class Component extends React.Component {

  static async getInitialProps(args: any) {

    await this.botonicInit(args)
    return { context: args.req.context, params: args.params }
  }

  static async getLiteral(id: string) {

    var literals: any = {}
    var lang: string = 'en_EN'

    let path = join(process.cwd(), '/pages/literals')

    var en_EN = JSON.parse(fs.readFileSync(join(path,'en_EN.json')).toString())
    var es_ES = JSON.parse(fs.readFileSync(join(path,'es_ES.json')).toString())
    var ca_CA = JSON.parse(fs.readFileSync(join(path,'ca_CA.json')).toString())

    literals = {en_EN, es_ES, ca_CA}

    try {
      return literals[lang][id]

    } catch(e) {
      return ''
    }
  }

  static async botonicInit(args: any) {

  }
}