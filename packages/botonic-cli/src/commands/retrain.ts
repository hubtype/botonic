import { Command, flags } from '@oclif/command'
import { BotonicAPIService } from '../botonicapiservice'

const path = require('path')
const fs = require('fs')

export default class Run extends Command {
  static description = 'Retrain your model'
  static examples = [
    `$ botonic retrain
    RETRAINING MODEL ...
    `,
  ]
  static flags = {
    lang: flags.string(),
  }
  static args = []
  private botonicApiService: BotonicAPIService = new BotonicAPIService()
  async run() {
    console.log('Retraining...\n')
    const resp = await this.botonicApiService.getRetrainData()
    const utterancesPath: string = path.join(
      process.cwd(),
      'src',
      'nlu',
      'utterances',
      'en'
    )
    const botonicNLUPath: string = path.join(
      process.cwd(),
      'node_modules',
      '@botonic',
      'nlu'
    )
    try {
      const { BotonicNLU, CONSTANTS } = await import(botonicNLUPath)
      if (resp.data.length > 0) {
        this.showDataInfo(resp.data)
        this.writeIntents(resp.data, utterancesPath)
        const today = new Date()
        const date = today.toUTCString()
        const botonicNLU = new BotonicNLU()
        const nluPath = path.join(process.cwd(), 'src', CONSTANTS.NLU_DIRNAME)
        await botonicNLU.train({ nluPath })
        this.botonicApiService.lastRetrainingDate = date
        this.botonicApiService.beforeExit()
        this.showDataInfo()
      } else {
        console.log('THERE IS NO NEW DATA TO RETRAIN!')
      }
    } catch (e) {
      console.log(e)
    }
  }
  writeIntents(retrainData, filePath) {
    retrainData.forEach(element => {
      element.intent = element.intent + '.txt'
      fs.open(filePath + '/' + element.intent, 'a', function (err) {
        if (err) throw err
        fs.appendFileSync(
          filePath + '/' + element.intent,
          element.sentence + '\n',
          'UTF-8',
          { flags: 'a+' },
          function (err) {
            if (err) throw err
          }
        )
      })
    })
  }

  showDataInfo(resp?: any) {
    if (resp) {
      console.log('******** RETRAIN DATA *********\n ')
      console.log(resp)
    } else {
      console.log('YOUR BOT HAS BEEN RETRAINED SUCCESSFULY!!!! \n')
    }
  }
}
