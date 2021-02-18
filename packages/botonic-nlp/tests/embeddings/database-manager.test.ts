import { DatabaseManager } from '../../src/embeddings/database-manager'

describe('Database manager', () => {
  test('Check compatibility', () => {
    expect(() => {
      new DatabaseManager('es', 'glove', 50)
    }).toThrowError()
  })

  test('Get word embedding', async () => {
    const db = new DatabaseManager('en', 'glove', 50)
    await db.initialize()
    const embedding = await db.getEmbedding('red')
    expect(embedding).toEqual([
      -0.12878,
      0.8798,
      -0.60694,
      0.12934,
      0.5868,
      -0.038246,
      -1.0408,
      -0.52881,
      -0.29563,
      -0.72567,
      0.21189,
      0.17112,
      0.19173,
      0.36099,
      0.032672,
      -0.2743,
      -0.19291,
      -0.10909,
      -1.0057,
      -0.93901,
      -1.0207,
      -0.69995,
      0.57182,
      -0.45136,
      -1.2145,
      -1.1954,
      -0.32758,
      1.4921,
      0.54574,
      -1.0008,
      2.845,
      0.26479,
      -0.49938,
      0.34366,
      -0.12574,
      0.5905,
      -0.037696,
      -0.47175,
      0.050825,
      -0.20362,
      0.13695,
      0.26686,
      -0.19461,
      -0.75482,
      1.0303,
      -0.057467,
      -0.32327,
      -0.7712,
      -0.16764,
      -0.73835,
    ])
  })
})
