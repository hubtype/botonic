import os from 'os'
import path from 'path'
import Database from 'sqlite-async'
import { DB, GLOBAL_CONFIG_PATH, WORD_EMBEDDINGS_PATH } from './constants'

export async function getEmbeddingMatrix({
  vocabulary,
  vocabularyLength,
  params
}) {
  let embeddingMatrix = await generateEmbeddingMatrix({
    dim1: vocabularyLength,
    dim2: params.EMBEDDING_DIM,
    vocabulary,
    wordEmbeddingsPath: path.join(
      os.homedir(),
      GLOBAL_CONFIG_PATH,
      WORD_EMBEDDINGS_PATH,
      `${params.ALGORITHM}-${params.EMBEDDING_DIM}d-${params.language}.db`
    )
  })
  return embeddingMatrix
}

export async function generateEmbeddingMatrix({
  dim1,
  dim2,
  vocabulary,
  wordEmbeddingsPath
}) {
  let embeddingMatrix = createEmbeddingMatrix(dim1, dim2)
  embeddingMatrix = await fillEmbeddingMatrix(
    vocabulary,
    embeddingMatrix,
    wordEmbeddingsPath
  )
  return embeddingMatrix
}

function createEmbeddingMatrix(dim1, dim2) {
  let min = -1
  let max = 1
  let matrix = []
  for (let i = 0; i < dim1; i++) {
    matrix[i] = new Array(dim2)
    for (let j = 0; j < dim2; j++) {
      matrix[i][j] = Math.random() * (max - min) + min
    }
  }
  return matrix
}

async function fillEmbeddingMatrix(
  vocabulary,
  embeddingMatrix,
  wordEmbeddingsPath
) {
  let out_of_embedding = 0
  let db = await Database.open(wordEmbeddingsPath)
  for (const [word, index] of Object.entries(vocabulary)) {
    if (index == 0) {
      continue // SKIP UNK TOKEN
    }
    let res = null
    let d = "'"
    if (word.includes("'")) {
      d = '"'
    }
    try {
      res = await db.get(
        `SELECT * FROM ${DB.TABLE} where ${DB.COLUMN}=${d}${word}${d}`
      )
      embeddingMatrix[index] = res.vector.split(' ')
    } catch (e) {
      console.log('Not found: [', word, '] Index: ', index)
      out_of_embedding++
    }
  }
  await db.close()
  console.log('Words not found in embedding: ', out_of_embedding)
  return embeddingMatrix
}
