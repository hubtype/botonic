import { DatabaseManager } from '../../../src/embeddings/database/manager'

describe('Database manager', () => {
  test('Check compatibility', async () => {
    expect((await DatabaseManager.with('es', 'glove', 50)).compatible).toEqual(
      false
    )
    expect(
      (await DatabaseManager.with('es', '10k-fasttext', 300)).compatible
    ).toEqual(true)
  })

  test('Get word embedding', async () => {
    const manager = await DatabaseManager.with('es', '10k-fasttext', 300)
    expect(await (await manager.getWordEmbedding('rojo')).length).toEqual(300)
  })
})
