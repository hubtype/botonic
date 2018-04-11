import { join } from 'path'
import { Command, flags } from '@oclif/command'
import { prompt } from 'inquirer'
import axios from 'axios'
import fs = require('fs')
import path = require('path')
import os = require('os')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

import { Botonic } from '../botonic'
import { track } from '../utils'


export default class Run extends Command {
  static description = 'Deploy Botonic project to botonic.io cloud'

  static examples = [
    `$ botonic deploy
Deploying...
  🚀 test_bot was successfully deployed!
`,
  ]

  static args = [{name: 'bot_name'}]

  private credentials: any
  private me_credentials: any
  private bot_credentials: any

  private base_url: string = 'http://localhost:8000'
  private base_api_url = this.base_url+'/v1/'
  private login_url: string = this.base_url + '/o/token/'
  private current_path: string = process.cwd()
  private bot_path: string = path.join(this.current_path, '/.botonic.json')
  private home_path: string = path.join(os.homedir(), '/.botonic')
  private home_cred_path: string = path.join(this.home_path, '/credentials.json')
  private cliend_id: string = 'jOIYDdvcfwqwSs7ZJ1CpmTKcE7UDapZDOSobFmEp'
  private client_secret: string = 'YY34FaaNMnIVKztd6LbLIKn3wFqtiLhDgl6ZVyICwsLVWkZN9UzXw0GXFMmWinP3noNGU9Obtb6Nrr1BwMc4IlCTcRDOKJ96JME5N02IGnIY62ZUezMgfeiUZUmMSu68'



  async run() {
    track('botonic_deploy')
    this.checkCredentials()
    //this.publish()
  }

  async api_post(path:any, body:any = null): Promise<any> {
    if(this.credentials){
      return axios({
        method: 'post',
        url: this.base_api_url + path,
        headers: {
          'Authorization': 'Bearer ' + this.credentials['access_token']
        },
        data: body
      })
    }
  }

  async api_get(path:any, body:any = null): Promise<any> {
    if(this.credentials){
      return axios({
        method: 'get',
        url: this.base_api_url + path,
        headers: {
          Authorization: 'Bearer ' + this.credentials['access_token']
        },
        data: body
      })
    }
  }

  async post_save_bot(bot_name:string) {
    let bot_info = await this.api_post('bots/', 
        {'name': bot_name, 'framework': 'framework_botonic'})
    if(bot_info){
      this.save_bot_creds(bot_info['data'])
    }
  }

  async api_get_bots(): Promise<any> {
    if(this.credentials){
      return axios({
        method: 'get',
        url: this.base_url + 'bots/',
        headers: {
          'Authorization': 'Bearer ' + this.credentials['access_token']
        },
        data: {'organization': this.me_credentials['organization_id']}
      })
    }
  }

  checkCredentials() {
    try {
      this.credentials = JSON.parse(fs.readFileSync(this.home_cred_path, 'utf8'))['creds']
      this.me_credentials = JSON.parse(fs.readFileSync(this.home_cred_path, 'utf8'))['me']
    }catch (e) {}
    if(this.credentials){
      this.checkBot()
    }else{
      this.checkRegistered()
    }
  }

  checkBot() {
    try {
      this.bot_credentials = JSON.parse(fs.readFileSync(this.bot_path, 'utf-8'))
    }catch(e){}
    if(this.bot_credentials){
      this.publish()
    }else{
      this.checkNewBot()
    }
  }

  async publish() {
    console.log('publish!')
    let build_out = await exec('npm run build')
    console.log(build_out.stdout, build_out.stderr)
    //check if exists
    let rm_out = await exec('rm botonic_bundle.zip')
    let zip_out = await exec('zip -r botonic_bundle.zip .next')
    console.log(zip_out.stdout, zip_out.stderr)
    let url = `${this.base_api_url}bots/${this.bot_credentials.id}/deploy_botonic/`
    let auth = `Bearer ${this.credentials['access_token']}`
    let curl = `curl -H "Authorization: ${auth}" -F "bundle=@./botonic_bundle.zip" ${url}`
    let curl_out = await exec(curl)
    console.log(curl_out.stdout, curl_out.stderr)

    /*axios({method: 'post', url,
        headers: {'Authorization': auth},
        data: {'organization': this.me_credentials['organization_id']}
      })*/
  }


  checkRegistered() {
    prompt([{
      type: 'confirm',
      name: 'registerConfirmation',
      message: 'Are you already registered into BOTONIC?'}
    ]).then( (inp: any) => {
      let email, password
      let resp = inp['registerConfirmation']
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
        email = inp['email']
        password = inp['password']
        if (resp){
          this.logInUser(email, password)
        }else {
          console.log('TODO: REGISTER')
          //return this.registerUser()
        }
      })
    });
  }

  async logInUser(email: any, password:any) {
    let login_data = await this.loginData(email, password)
    if (login_data){
      this.credentials = login_data['data']
    }
    let me_data = await this.api_get('users/me')
    let me_data_json = null
    if (me_data)
      this.me_credentials = me_data['data']
    let creds_file = JSON.parse(fs.readFileSync(this.home_cred_path, 'utf8'))
    let new_json = {'mixpanel': creds_file['mixpanel'], 'creds': this.credentials, 'me': this.me_credentials}
    fs.writeFileSync(this.home_cred_path, JSON.stringify(new_json))
    this.checkBot()
  }

  loginData(email:any, password:any): Promise<any> {
    return axios({
      method: 'post',
      url: this.login_url,
      params: {
        'username': email,
        'password': password,
        'client_id': this.cliend_id,
        'client_secret': this.client_secret,
        'grant_type': 'password'
      }
    })
  }

  async checkNewBot() {
    let bots = await this.checkExistentBots()
    bots = bots['data']
    if(!bots['count']){
      this.createNewBot()
    }else {
      prompt([
      {
        type: 'confirm',
        name: 'create_bot_confirm',
        message: 'Do yout want to create a new Bot?'
      }]).then((res:any) => {
        let confirm = res['create_bot_confirm']
        if(confirm){
          this.createNewBot()
        }else{
          this.selectExistentBot(bots['results'])
        }
      })
    }
  }

  checkExistentBots(): Promise<any> {
    let organization_id = this.me_credentials['organization_id']
    return axios({
      method: 'get',
      url: this.base_api_url + 'bots/',
      headers: {
        'Authorization': 'Bearer ' + this.credentials['access_token']
      },
      data: {'organization': organization_id}
    })
  }

  createNewBot() {
    prompt([{
      type: 'input',
      name: 'bot_name',
      message: 'Bot name:'
    }]).then( (inp:any) => {
      this.post_save_bot(inp['bot_name'])
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
      fs.writeFileSync(this.bot_path, JSON.stringify(bot))
      this.bot_credentials = bot['data']
      this.publish()
    }
  }
}
