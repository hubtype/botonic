/* eslint-disable @typescript-eslint/unbound-method */
import { CONSTANTS } from '../../src'
import { WordEmbeddingsManager } from '../../src/embeddings/word-embeddings-manager'
import { WordEmbeddingsConfig } from '../../src/types'

describe('new embeddings matrix', () => {
  it.skip('should generate tensor matrix', async () => {
    const config = {
      type: 'glove',
      dimension: 50,
      language: 'en',
      vocabulary: {
        [CONSTANTS.UNKNOWN_TOKEN]: 0,
        today: 1,
        hello: 2,
        am: 3,
        i: 4,
        '!': 5,
      },
    } as WordEmbeddingsConfig
    const matrix = (await WordEmbeddingsManager.withConfig(config)).matrix

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    expect(matrix.arraySync()[1]).toEqual(todayEmbedding)
    expect(matrix.shape[0]).toBe(Object.keys(config.vocabulary).length)
    expect(matrix.shape[1]).toBe(config.dimension)
  })
})

const todayEmbedding = [
  0.00027751000015996397,
  0.4267300069332123,
  -0.08293800055980682,
  0.27601000666618347,
  0.6472100019454956,
  -0.9172800183296204,
  -0.6347100138664246,
  -0.28022998571395874,
  -0.6665300130844116,
  -0.28435999155044556,
  -0.06424900144338608,
  -0.43626001477241516,
  -0.10830000042915344,
  -0.3581799864768982,
  0.723110020160675,
  0.6536800265312195,
  -0.29572999477386475,
  0.12007000297307968,
  -0.029959000647068024,
  -0.20593999326229095,
  0.20016999542713165,
  0.1642100065946579,
  0.15202000737190247,
  -0.024855000898241997,
  0.5288699865341187,
  -1.3624999523162842,
  -0.5603600144386292,
  0.1777700036764145,
  -0.09100300073623657,
  0.09754899889230728,
  3.510200023651123,
  0.10631000250577927,
  0.06560199707746506,
  -0.08077699691057205,
  -0.12553000450134277,
  -0.6993200182914734,
  -0.015068000182509422,
  0.393530011177063,
  -0.002819499932229519,
  0.20634999871253967,
  -0.4772599935531616,
  -0.1263899952173233,
  0.29398998618125916,
  0.10000000149011612,
  0.0003401499998290092,
  0.6276900172233582,
  -0.45344001054763794,
  0.39614999294281006,
  0.018857000395655632,
  0.17535999417304993,
]
