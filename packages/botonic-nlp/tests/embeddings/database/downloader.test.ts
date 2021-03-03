import { existsSync, unlinkSync } from 'fs'
import { join } from 'path'

import { GLOBAL_EMBEDDINGS_PATH } from '../../../src/embeddings/database/constants'
import { DatabaseDownloader } from '../../../src/embeddings/database/downloader'

describe('Database Downloader', () => {
  test('Download embeddings file', async () => {
    const path = join(GLOBAL_EMBEDDINGS_PATH, '10k-fasttext-300d-en.db')
    if (existsSync(path)) {
      unlinkSync(path)
    }
    expect(existsSync(path)).toEqual(false)
    await DatabaseDownloader.download('en', '10k-fasttext', 300)
    expect(existsSync(path)).toEqual(true)
  })
})
