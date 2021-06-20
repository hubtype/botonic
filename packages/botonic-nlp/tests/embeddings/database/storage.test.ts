import { DatabaseStorage } from '../../../src/embeddings/database/storage'

describe('Database storage', () => {
  test('Check compatibility', async () => {
    expect((await DatabaseStorage.with('es', 'glove', 50)).compatible).toEqual(
      false
    )
    expect(
      (await DatabaseStorage.with('es', '10k-fasttext', 300)).compatible
    ).toEqual(true)
  })

  test('Get word embedding', async () => {
    const manager = await DatabaseStorage.with('es', '10k-fasttext', 300)
    expect((await manager.getWordEmbedding('rojo')).length).toEqual(300)
  })
})
