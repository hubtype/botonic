import '@tensorflow/tfjs-node'
import path from 'path'
import inquirer from 'inquirer'
import { NLU } from '../nlu'
import {
  NLU_DIRNAME,
  NLU_CONFIG_FILENAME,
  INTENTS_DIRNAME,
  INTENTS_EXTENSION
} from '../constants'
import {
  readDir,
  readJSON,
  createDir,
  pathExists,
  appendNewLine
} from '../fileUtils'

const developerPath = path.join(process.env.INIT_CWD, 'src')
const nluPath = path.join(developerPath, NLU_DIRNAME)
const intentsPath = path.join(nluPath, INTENTS_DIRNAME)

async function askForUserInput() {
  const questions = [
    {
      name: 'res',
      type: 'input',
      message: 'INPUT --> '
    }
  ]
  return inquirer.prompt(questions)
}

async function askIfCorrect(intentsResp) {
  const questions = [
    {
      type: 'confirm',
      name: 'res',
      message: `PREDICTED: [${intentsResp.intent}], CONFIDENCE: [${
        intentsResp.confidence
      }]. Is it correct?`
    }
  ]
  return inquirer.prompt(questions)
}

async function askIfNewFile() {
  const questions = [
    {
      type: 'confirm',
      name: 'res',
      message: `Do you want to create a new file for this intent?`
    }
  ]
  return inquirer.prompt(questions)
}

async function askIfWantsToAdd() {
  const questions = [
    {
      type: 'confirm',
      name: 'res',
      message: `Append to current intents?`
    }
  ]
  return inquirer.prompt(questions)
}

async function askForCorrectIntent(intentsResp) {
  let sortedIntents = intentsResp.intents.sort(
    (a, b) => b.confidence - a.confidence
  )
  let choices = sortedIntents.map(e => `${e.intent}, ${e.confidence}`)
  const questions = [
    {
      type: 'list',
      name: 'res',
      message: 'Which is the correct intent?',
      choices: [...choices, 'NONE']
    }
  ]
  return inquirer.prompt(questions)
}

async function askForFileName() {
  const questions = [
    {
      name: 'name',
      type: 'input',
      message: 'What will be the name of the new intent?'
    }
  ]
  return inquirer.prompt(questions)
}

async function askForLang(langs) {
  let choices = langs.map(e => `${e}`)
  const questions = [
    {
      type: 'list',
      name: 'res',
      message: 'Which is the language of this intent?',
      choices: [...choices, 'New Language']
    }
  ]
  return inquirer.prompt(questions)
}

async function askForNewLang() {
  const questions = [
    {
      name: 'res',
      type: 'input',
      message:
        'Enter the code of the new language (must be in ISO 639-3).\n\tFor details: https://iso639-3.sil.org/code_tables/639/data\n'
    }
  ]
  return inquirer.prompt(questions)
}

async function addressWrongIntents(intents, input) {
  let correctIntent = await askForCorrectIntent(intents)
  if (correctIntent.res == 'NONE') {
    let createNewFile = await askIfNewFile()
    if (createNewFile.res) {
      let newIntentPath = undefined
      let langSelected = (await askForLang(readDir(intentsPath))).res
      if (langSelected === 'New Language') {
        langSelected = (await askForNewLang()).res
      }
      let newIntent = await askForFileName()
      newIntentPath = path.join(intentsPath, langSelected)
      if (!pathExists(newIntentPath)) {
        createDir(newIntentPath)
      }
      newIntentPath = path.join(
        newIntentPath,
        `${newIntent.name}${INTENTS_EXTENSION}`
      )
      appendNewLine(newIntentPath, input.res)
      console.log('Created: ', newIntentPath.split('src/')[1])
    }
  } else {
    let resp = correctIntent.res.match(/(.*), (.*)/)
    let intentSelected = resp[1]
    let intentFilePath = path.join(
      intentsPath,
      intents.language,
      `${intentSelected}${INTENTS_EXTENSION}`
    )
    appendNewLine(intentFilePath, input.res)
  }
}

async function retrain() {
  let flagLang = process.argv.slice(3)[0]
  let options = readJSON(path.join(nluPath, NLU_CONFIG_FILENAME))
  if (flagLang) {
    options = options.filter(config => config.LANG === flagLang)
  }

  let nlu = await new NLU(options)
  while (true) {
    let input = await askForUserInput()
    if (input.res == 'exit()') {
      break
    } else {
      let intents = await nlu.getIntents(input.res)[0]
      let isCorrect = await askIfCorrect(intents)
      if (!isCorrect.res) {
        await addressWrongIntents(intents, input)
      } else {
        let wantsToAdd = await askIfWantsToAdd()
        if (wantsToAdd.res) {
          let intentPredicted = intents
          let intentFilePath = path.join(
            intentsPath,
            intents.language,
            `${intentPredicted.intent}${INTENTS_EXTENSION}`
          )
          appendNewLine(intentFilePath, input.res)
          console.log('Appended at: ', intentFilePath.split('src/')[1])
        }
      }
    }
    console.log('\n')
  }
}

retrain()
