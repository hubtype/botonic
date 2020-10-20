/* eslint-disable @typescript-eslint/unbound-method */
import { WordEmbeddingsDBHelper } from '../../src/embeddings/wembeddings-db-helper'

describe('Word Embeddings DB Helper', () => {
  const UNSUPPORTED_LANGUAGE = 'af'
  const SUPPORTED_LANGUAGE = 'en'

  it('Word embedding not supported', () => {
    const dbHelper = new WordEmbeddingsDBHelper(
      '10k-fasttext',
      50,
      UNSUPPORTED_LANGUAGE
    )
    expect(dbHelper.isValidWEmbedding).toBe(false)
  })

  it('Word embedding supported, connection to DB initialized', async () => {
    const dbHelper = new WordEmbeddingsDBHelper('glove', 50, SUPPORTED_LANGUAGE)
    await dbHelper.initialize({ logProcess: false })
    expect(dbHelper.instance.open).toBe(true)
    expect(dbHelper.instance.readonly).toBe(true)
  })

  it('Some queries to the DB file', async () => {
    const dbHelper = new WordEmbeddingsDBHelper('glove', 50, SUPPORTED_LANGUAGE)
    await dbHelper.initialize({ logProcess: false })
    const withSingleQuoteRes = await dbHelper.select("'")
    const withDoubleQuoteRes = await dbHelper.select('"')
    const commonWordRes = await dbHelper.select('bot')
    const unexistentWordRes = await dbHelper.select('alhcwgauiwgd')
    expect(withSingleQuoteRes.token).toEqual("'")
    expect(withDoubleQuoteRes.token).toEqual('"')
    expect(commonWordRes.token).toEqual('bot')
    expect(unexistentWordRes).toEqual(undefined)
  })

  it('Open and closes the DB connection as expected', async () => {
    const dbHelper = new WordEmbeddingsDBHelper('glove', 50, SUPPORTED_LANGUAGE)
    await dbHelper.initialize({ logProcess: false })
    dbHelper.close()
    expect(dbHelper.instance.open).toBe(false)
  })
})
