import { existsSync, unlinkSync } from 'fs'
import { join } from 'path'

import {
  EMBEDDINGS_URL,
  GLOBAL_EMBEDDINGS_PATH,
} from '../../src/embeddings/database/constants'
import { Downloader } from '../../src/embeddings/downloader'

describe('Downloader', () => {
  test('Download embeddings file', async () => {
    const url = `${EMBEDDINGS_URL}/10k-fasttext-300d-en.db`
    const path = join(GLOBAL_EMBEDDINGS_PATH, '10k-fasttext-300d-en.db')
    if (existsSync(path)) {
      unlinkSync(path)
    }
    expect(existsSync(path)).toEqual(false)
    await Downloader.download(url, path)
    expect(existsSync(path)).toEqual(true)
  })
})
