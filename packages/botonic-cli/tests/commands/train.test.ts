import { Config } from '@oclif/config'

import { default as TrainCommand, Tasks } from '../../src/commands/train'

describe('Tasks', () => {
  test('Invalid task name', () => {
    expect(() => {
      Tasks.getByName('test')
    }).toThrowError()
  })

  test('Get task by name', () => {
    const sut = Tasks.getByName('ner')
    expect(sut.name).toEqual('ner')
  })
})

//TODO: find a way of run the command in the test
describe('Train Command', () => {
  const trainCommand = new TrainCommand(process.argv, new Config({ root: '' }))
})
