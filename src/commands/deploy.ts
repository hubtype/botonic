import { join, resolve } from 'path'
import { Command, flags } from '@oclif/command'
import { prompt } from 'inquirer'
import axios from 'axios'
import fs = require('fs')
import path = require('path')
import os = require('os')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

import { Botonic } from '../botonic'
import { track, alias } from '../utils'


export default class Run extends Command {
  static description = 'Deploy Botonic project to botonic.io cloud'

  static args = [{name: 'bot_name'}]

  private botonic: any
  private credentials: any
  private me_credentials: any
  private bot_credentials: any

  async run() {
    const {args, flags} = this.parse(Run)

    const path = flags.path? resolve(flags.path) : process.cwd()

    this.botonic = new Botonic(path)
    this.checkCredentials()
    track('botonic_deploy')
  }

  async api_post(path:any, body:any = null): Promise<any> {
    let headers = `Bearer ${this.credentials.access_token}`
    let url = this.botonic.base_api_url + path
    if(this.credentials){
      return axios({
        method: 'post',
        url: url,
        headers: {Authorization: headers},
        data: body
      })
    }
  }

  async api_get(path:any, body:any = null): Promise<any> {
    let headers = `Bearer ${this.credentials.access_token}`
    let url = this.botonic.base_api_url + path
    if(this.credentials){
      return axios({
        method: 'get',
        url: url,
        headers: {Authorization: headers},
        data: body
      })
    }
  }

  async post_save_bot(bot_name:string) {
    let bot_info = await this.api_post('bots/', 
        {name: bot_name, framework: 'framework_botonic'})
    if(bot_info){
      this.save_bot_creds(bot_info.data)
    }
  }

  async api_get_bots(): Promise<any> {
    let headers = `Bearer ${this.credentials.access_token}`
    let organization_id = this.me_credentials.organization_id
    let url = this.botonic.base_url + 'bots/'
    if(this.credentials){
      return axios({
        method: 'get',
        url: url,
        headers: {Authorization: headers},
        data: {organization: organization_id}
      })
    }
  }

  checkCredentials() {
    try {
      this.credentials = JSON.parse(fs.readFileSync(this.botonic.home_cred_path, 'utf8'))['creds']
      this.me_credentials = JSON.parse(fs.readFileSync(this.botonic.home_cred_path, 'utf8'))['me']
    }catch (e) {}
    if(this.credentials){
      this.checkBot()
    }else{
      this.checkRegistered()
    }
  }

  checkBot() {
    try {
      this.bot_credentials = JSON.parse(fs.readFileSync(this.botonic.bot_path, 'utf-8'))
    }catch(e){}
    if(this.bot_credentials){
      this.publish()
    }else{
      this.checkNewBot()
    }
  }

  async publish() {
    let build_out = await exec('npm run build')
    //console.log(build_out.stdout, build_out.stderr)
    let zip_out = await exec('zip -r botonic_bundle.zip .next')
    let url = `${this.botonic.base_api_url}bots/${this.bot_credentials.id}/deploy_botonic/`
    let auth = `Bearer ${this.credentials['access_token']}`
    let curl = `curl -H "Authorization: ${auth}" -F "bundle=@./botonic_bundle.zip" ${url}`
    let curl_out = await exec(curl)
    //console.log(curl_out.stdout, curl_out.stderr)
    console.log('\x1b[32m' ,'Bot deployed! 🚀')
    let rm_zip = await exec('rm botonic_bundle.zip')
  }


  checkRegistered() {
    prompt([{
      type: 'confirm',
      name: 'registerConfirmation',
      message: 'Are you already registered into BOTONIC?'}
    ]).then( (inp: any) => {
      let email, password
      let resp = inp.registerConfirmation
      prompt([{
        type: 'input',
        name: 'email',
        message: 'email:'
        //TODO: validate: validateEmail()
      },
      {
        type: 'password',
        name: 'password',
        mask: '*',
        message: 'password:'
        //TODO: validate: validatePassword()
      }]).then( (inp:any ) => {
        email = inp.email
        password = inp.password
        if (resp){
          this.logInUser(email, password)
        }else {
          this.registerUser(email,password)
        }
      })
    });
  }

  async logInUser(email: string, password:string) {
    let login_data = await this.loginData(email, password)
    if (login_data){
      this.credentials = login_data.data
      alias(email)
      this.saveUserData()
    }
  }

  async registerUser(email: string, password:string) {
    let org_name = email.split('@')[0]
    let campaign = { product: 'botonic' }
    try{
      var register_data = await this.registerData(email, password, org_name, campaign)
      var login_data = await this.loginData(email, password)
    }catch(e){
      var err = e.response.data
      console.log(err)
    }
    if (login_data){
      this.credentials = login_data.data
      alias(email)
      this.saveUserData()
    }
  }

  async saveUserData() {
    let me_data = await this.api_get('users/me')
    if (me_data)
      this.me_credentials = me_data.data
    let creds_file = JSON.parse(fs.readFileSync(this.botonic.home_cred_path, 'utf8'))
    let new_json = {mixpanel: creds_file.mixpanel, creds: this.credentials, me: this.me_credentials}
    fs.writeFileSync(this.botonic.home_cred_path, JSON.stringify(new_json))
    this.checkBot()
  }


  loginData(email:any, password:any): Promise<any> {
    return axios({
      method: 'post',
      url: this.botonic.login_url,
      params: {
        'username': email,
        'password': password,
        'client_id': this.botonic.cliend_id,
        'client_secret': this.botonic.client_secret,
        'grant_type': 'password'
      }
    })
  }

  registerData(email:string, password:string, org_name:string, campaign:any) :Promise<any>{
    let url = this.botonic.base_api_url + 'users/'
    let register_data = {email, password, org_name, campaign}
    return axios({
      method: 'post',
      url: url,
      data: register_data
    })
  }

  async checkNewBot() {
    let bots = await this.checkExistentBots()
    bots = bots.data
    if(!bots.count){
      this.createNewBot()
    }else {
      prompt([
      {
        type: 'confirm',
        name: 'create_bot_confirm',
        message: 'Do yout want to create a new Bot?'
      }]).then((res:any) => {
        let confirm = res.create_bot_confirm
        if(confirm){
          this.createNewBot()
        }else{
          this.selectExistentBot(bots.results)
        }
      })
    }
  }

  checkExistentBots(): Promise<any> {
    let url = this.botonic.base_api_url + 'bots/'
    let headers = `Bearer ${this.credentials.access_token}`
    let organization_id = this.me_credentials.organization_id
    return axios({
      method: 'get',
      url: url,
      headers: {Authorization: headers},
      data: {organization: organization_id}
    })
  }

  createNewBot() {
    prompt([{
      type: 'input',
      name: 'bot_name',
      message: 'Bot name:'
    }]).then( (inp:any) => {
      this.post_save_bot(inp.bot_name)
    })
  }

  selectExistentBot(bots:any[]) {
    prompt([{
      type: 'list',
      name: 'bot_name',
      message: 'What bot do you want to use?',
      choices: bots.map(b => b['name'])
    }]).then( (inp:any) => {
      let bot = bots.filter(b => b['name']===inp['bot_name'])[0]
      this.save_bot_creds(bot)
    })
  }

  save_bot_creds(bot:any) {
    if(bot){
      fs.writeFileSync(this.botonic.bot_path, JSON.stringify(bot))
      this.bot_credentials = bot
      this.publish()
    }
  }
}
